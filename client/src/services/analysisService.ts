import { API } from 'aws-amplify';

const API_NAME = 'Algo360FX-API';

export interface TechnicalAnalysisRequest {
  symbol: string;
  timeframe: string;
  indicators: string[];
  startDate?: string;
  endDate?: string;
}

export const analysisService = {
  getTechnicalAnalysis: async (data: TechnicalAnalysisRequest) => {
    try {
      return await API.post(API_NAME, '/analysis/technical', {
        body: data
      });
    } catch (error) {
      console.error('Technical Analysis Error:', error);
      throw error;
    }
  },

  getAvailableIndicators: async () => {
    try {
      return await API.get(API_NAME, '/analysis/indicators', {});
    } catch (error) {
      console.error('Get Indicators Error:', error);
      throw error;
    }
  }
};
