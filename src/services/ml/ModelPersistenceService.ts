import { makeAutoObservable } from 'mobx';
import * as tf from '@tensorflow/tfjs';
import { Strategy } from '../../types/trading';

export interface ModelMetadata {
  id: string;
  name: string;
  version: string;
  createdAt: Date;
  updatedAt: Date;
  architecture: any;
  hyperparameters: any;
  metrics: {
    trainLoss: number;
    validationLoss: number;
    trainAccuracy: number;
    validationAccuracy: number;
  };
  features: string[];
  labels: string[];
}

export interface SavedModel {
  metadata: ModelMetadata;
  model: tf.LayersModel;
  weights: tf.Tensor[];
}

class ModelPersistenceService {
  private models: Map<string, SavedModel> = new Map();
  private isLoading: boolean = false;
  private modelRegistry: ModelMetadata[] = [];

  constructor() {
    makeAutoObservable(this);
    this.loadModelRegistry();
  }

  async saveModel(
    strategy: Strategy,
    model: tf.LayersModel,
    metadata: Partial<ModelMetadata>
  ): Promise<string> {
    try {
      const modelId = `model-${Date.now()}`;
      const fullMetadata: ModelMetadata = {
        id: modelId,
        name: strategy.name,
        version: '1.0.0',
        createdAt: new Date(),
        updatedAt: new Date(),
        architecture: model.toJSON(),
        hyperparameters: {},
        metrics: {
          trainLoss: 0,
          validationLoss: 0,
          trainAccuracy: 0,
          validationAccuracy: 0,
        },
        features: [],
        labels: [],
        ...metadata,
      };

      // Save model architecture and weights
      const modelArtifacts = await model.save(tf.io.withSaveHandler(async (artifacts) => {
        const weightsData = await tf.io.encodeWeights(artifacts.weightData, artifacts.weightSpecs);
        return {
          modelTopology: artifacts.modelTopology,
          weightSpecs: artifacts.weightSpecs,
          weightData: weightsData,
        };
      }));

      // Store in memory
      this.models.set(modelId, {
        metadata: fullMetadata,
        model,
        weights: model.getWeights(),
      });

      // Update registry
      this.modelRegistry.push(fullMetadata);
      await this.saveModelRegistry();

      // Save to IndexedDB
      await this.saveToIndexedDB(modelId, {
        metadata: fullMetadata,
        artifacts: modelArtifacts,
      });

      return modelId;
    } catch (error) {
      console.error('Error saving model:', error);
      throw error;
    }
  }

  async loadModel(modelId: string): Promise<SavedModel | null> {
    try {
      // Check memory cache first
      if (this.models.has(modelId)) {
        return this.models.get(modelId)!;
      }

      // Load from IndexedDB
      const savedData = await this.loadFromIndexedDB(modelId);
      if (!savedData) return null;

      // Reconstruct model
      const model = await tf.loadLayersModel(tf.io.fromMemory(savedData.artifacts));
      const savedModel: SavedModel = {
        metadata: savedData.metadata,
        model,
        weights: model.getWeights(),
      };

      // Cache in memory
      this.models.set(modelId, savedModel);

      return savedModel;
    } catch (error) {
      console.error('Error loading model:', error);
      return null;
    }
  }

  async updateModel(
    modelId: string,
    updates: {
      model?: tf.LayersModel;
      metadata?: Partial<ModelMetadata>;
    }
  ): Promise<boolean> {
    try {
      const existingModel = await this.loadModel(modelId);
      if (!existingModel) return false;

      const updatedModel: SavedModel = {
        ...existingModel,
        ...(updates.model && { model: updates.model, weights: updates.model.getWeights() }),
        metadata: {
          ...existingModel.metadata,
          ...updates.metadata,
          updatedAt: new Date(),
        },
      };

      // Update in memory
      this.models.set(modelId, updatedModel);

      // Update registry
      const registryIndex = this.modelRegistry.findIndex(m => m.id === modelId);
      if (registryIndex !== -1) {
        this.modelRegistry[registryIndex] = updatedModel.metadata;
        await this.saveModelRegistry();
      }

      // Update in IndexedDB
      if (updates.model) {
        const modelArtifacts = await updates.model.save(tf.io.withSaveHandler(async (artifacts) => {
          const weightsData = await tf.io.encodeWeights(artifacts.weightData, artifacts.weightSpecs);
          return {
            modelTopology: artifacts.modelTopology,
            weightSpecs: artifacts.weightSpecs,
            weightData: weightsData,
          };
        }));

        await this.saveToIndexedDB(modelId, {
          metadata: updatedModel.metadata,
          artifacts: modelArtifacts,
        });
      }

      return true;
    } catch (error) {
      console.error('Error updating model:', error);
      return false;
    }
  }

  async deleteModel(modelId: string): Promise<boolean> {
    try {
      // Remove from memory
      this.models.delete(modelId);

      // Remove from registry
      this.modelRegistry = this.modelRegistry.filter(m => m.id !== modelId);
      await this.saveModelRegistry();

      // Remove from IndexedDB
      await this.deleteFromIndexedDB(modelId);

      return true;
    } catch (error) {
      console.error('Error deleting model:', error);
      return false;
    }
  }

  async listModels(): Promise<ModelMetadata[]> {
    return this.modelRegistry;
  }

  async exportModel(modelId: string): Promise<Blob> {
    const savedModel = await this.loadModel(modelId);
    if (!savedModel) throw new Error('Model not found');

    const exportData = {
      metadata: savedModel.metadata,
      architecture: savedModel.model.toJSON(),
      weights: savedModel.weights.map(w => ({
        shape: w.shape,
        dtype: w.dtype,
        data: Array.from(w.dataSync()),
      })),
    };

    return new Blob([JSON.stringify(exportData)], {
      type: 'application/json',
    });
  }

  async importModel(file: File): Promise<string> {
    try {
      const content = await file.text();
      const importData = JSON.parse(content);

      // Reconstruct model
      const model = await tf.loadLayersModel(tf.io.fromMemory({
        modelTopology: importData.architecture.modelTopology,
        weightSpecs: importData.architecture.weightSpecs,
        weightData: importData.weights,
      }));

      // Save imported model
      return await this.saveModel(
        { name: importData.metadata.name } as Strategy,
        model,
        importData.metadata
      );
    } catch (error) {
      console.error('Error importing model:', error);
      throw error;
    }
  }

  // IndexedDB operations
  private async saveToIndexedDB(modelId: string, data: any): Promise<void> {
    const db = await this.openDB();
    const tx = db.transaction('models', 'readwrite');
    const store = tx.objectStore('models');
    await store.put(data, modelId);
  }

  private async loadFromIndexedDB(modelId: string): Promise<any> {
    const db = await this.openDB();
    const tx = db.transaction('models', 'readonly');
    const store = tx.objectStore('models');
    return await store.get(modelId);
  }

  private async deleteFromIndexedDB(modelId: string): Promise<void> {
    const db = await this.openDB();
    const tx = db.transaction('models', 'readwrite');
    const store = tx.objectStore('models');
    await store.delete(modelId);
  }

  private async openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('MLModels', 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('models')) {
          db.createObjectStore('models');
        }
      };
    });
  }

  private async loadModelRegistry(): Promise<void> {
    try {
      const db = await this.openDB();
      const tx = db.transaction('models', 'readonly');
      const store = tx.objectStore('models');
      const request = store.getAll();

      return new Promise((resolve, reject) => {
        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
          this.modelRegistry = request.result.map((item: any) => item.metadata);
          resolve();
        };
      });
    } catch (error) {
      console.error('Error loading model registry:', error);
      this.modelRegistry = [];
    }
  }

  private async saveModelRegistry(): Promise<void> {
    try {
      const db = await this.openDB();
      const tx = db.transaction('models', 'readwrite');
      const store = tx.objectStore('models');
      await store.put(this.modelRegistry, 'registry');
    } catch (error) {
      console.error('Error saving model registry:', error);
    }
  }

  isModelLoading(): boolean {
    return this.isLoading;
  }
}

export const modelPersistenceService = new ModelPersistenceService();
