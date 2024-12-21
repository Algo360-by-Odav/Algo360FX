import { IDocumentation } from '../models/Documentation';
import { Document, Types, model, Schema } from 'mongoose';
import { SearchResult } from '../types/search';

export interface DocumentationDocument extends Document, IDocumentation {
  _id: Types.ObjectId;
  __textScore?: number;
  title: string;
  description: string;
}

const documentationSchema = new Schema<DocumentationDocument>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  // Add other fields as needed
});

const Documentation = model<DocumentationDocument>('Documentation', documentationSchema);

export async function searchDocumentation(query: string): Promise<SearchResult[]> {
  try {
    const docs = await Documentation.find(
      { $text: { $search: query } },
      { score: { $meta: 'textScore' } }
    ).sort({ score: { $meta: 'textScore' } });

    return docs.map(doc => ({
      id: doc._id.toString(),
      type: 'documentation',
      title: doc.title,
      description: doc.description,
      score: doc.__textScore || 0
    }));
  } catch (error) {
    console.error('Search documentation error:', error);
    return [];
  }
}
