import { API } from 'aws-amplify';

const API_NAME = 'Algo360FX-API';

const getHeaders = async () => {
  return {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };
};

export const apiService = {
  get: async (path: string) => {
    try {
      const headers = await getHeaders();
      return await API.get(API_NAME, path, { headers });
    } catch (error) {
      console.error('API GET Error:', error);
      throw error;
    }
  },

  post: async (path: string, data: any) => {
    try {
      const headers = await getHeaders();
      return await API.post(API_NAME, path, {
        body: data,
        headers
      });
    } catch (error) {
      console.error('API POST Error:', error);
      throw error;
    }
  },

  put: async (path: string, data: any) => {
    try {
      const headers = await getHeaders();
      return await API.put(API_NAME, path, {
        body: data,
        headers
      });
    } catch (error) {
      console.error('API PUT Error:', error);
      throw error;
    }
  },

  delete: async (path: string) => {
    try {
      const headers = await getHeaders();
      return await API.del(API_NAME, path, { headers });
    } catch (error) {
      console.error('API DELETE Error:', error);
      throw error;
    }
  }
};
