import { post, get } from 'aws-amplify/api';

const API_NAME = 'Algo360FX-API';

interface TechnicalAnalysisRequest {
  symbol: string;
  timeframe: string;
  indicators: string[];
  startDate?: string;
  endDate?: string;
}

interface TechnicalAnalysisResponse {
  data: {
    results: any[];
    metadata: Record<string, any>;
  };
  success: boolean;
  message?: string;
}

interface IndicatorsResponse {
  data: string[];
  success: boolean;
  message?: string;
}

export const analysisService = {
  getTechnicalAnalysis: async (data: TechnicalAnalysisRequest): Promise<TechnicalAnalysisResponse['data']> => {
    try {
      const apiResponse = await post({
        apiName: API_NAME,
        path: '/analysis/technical',
        options: {
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json'
          }
        }
      });

      const response = await apiResponse.response;
      const jsonData = await response.body.json();
      const result = jsonData as TechnicalAnalysisResponse;
      return result.data;
    } catch (error) {
      console.error('Technical Analysis Error:', error);
      throw error;
    }
  },

  getAvailableIndicators: async (): Promise<string[]> => {
    try {
      const apiResponse = await get({
        apiName: API_NAME,
        path: '/analysis/indicators'
      });

      const response = await apiResponse.response;
      const jsonData = await response.body.json();
      const result = jsonData as IndicatorsResponse;
      return result.data;
    } catch (error) {
      console.error('Get Indicators Error:', error);
      throw error;
    }
  }
};
