import { IPortfolio } from '../models/Portfolio';
import { Document, Types, model, Schema } from 'mongoose';
import { SearchResult } from '../types/search';

export interface PortfolioDocument extends Document, IPortfolio {
  _id: Types.ObjectId;
  __textScore?: number;
  name: string;
  description: string;
}

const portfolioSchema = new Schema<PortfolioDocument>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

portfolioSchema.index({ name: 'text', description: 'text' });

const Portfolio = model<PortfolioDocument>('Portfolio', portfolioSchema);

export async function searchPortfolios(query: string): Promise<SearchResult[]> {
  try {
    const portfolios = await Portfolio.find(
      { $text: { $search: query } },
      { score: { $meta: 'textScore' } }
    ).sort({ score: { $meta: 'textScore' } });

    return portfolios.map(portfolio => ({
      id: portfolio._id.toString(),
      type: 'portfolio',
      title: portfolio.name,
      description: portfolio.description,
      score: portfolio.__textScore || 0
    }));
  } catch (error) {
    console.error('Search portfolios error:', error);
    return [];
  }
}

export async function createPortfolio(data: Partial<IPortfolio>): Promise<PortfolioDocument> {
  const portfolio = new Portfolio(data);
  return await portfolio.save();
}

export async function updatePortfolio(id: string, data: Partial<IPortfolio>): Promise<PortfolioDocument | null> {
  return await Portfolio.findByIdAndUpdate(id, data, { new: true });
}

export async function deletePortfolio(id: string): Promise<boolean> {
  const result = await Portfolio.findByIdAndDelete(id);
  return result !== null;
}
