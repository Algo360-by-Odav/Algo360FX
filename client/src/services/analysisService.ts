import { post, get } from 'aws-amplify/api';

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
      const response = await post({
        apiName: API_NAME,
        path: '/analysis/technical',
        options: {
          body: data
        }
      });
      return response.data;
    } catch (error) {
      console.error('Technical Analysis Error:', error);
      throw error;
    }
  },

  getAvailableIndicators: async () => {
    try {
      const response = await get({
        apiName: API_NAME,
        path: '/analysis/indicators'
      });
      return response.data;
    } catch (error) {
      console.error('Get Indicators Error:', error);
      throw error;
    }
  }
};
