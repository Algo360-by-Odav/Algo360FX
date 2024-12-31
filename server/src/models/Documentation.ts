import mongoose, { Schema, Document } from 'mongoose';

export interface IDocumentation extends Document {
  title: string;
  content: string;
  category: string;
  tags: string[];
  relatedDocs: mongoose.Types.ObjectId[];
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const DocumentationSchema = new Schema({
  title: {
    type: String,
    required: true,
    index: true,
  },
  content: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    index: true,
  },
  tags: [{
    type: String,
    index: true,
  }],
  relatedDocs: [{
    type: Schema.Types.ObjectId,
    ref: 'Documentation',
  }],
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

// Create text indexes for search
DocumentationSchema.index({
  title: 'text',
  content: 'text',
  tags: 'text',
  category: 'text',
});

export const Documentation = mongoose.model<IDocumentation>('Documentation', DocumentationSchema);
