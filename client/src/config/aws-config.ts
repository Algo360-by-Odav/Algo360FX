import { Amplify } from 'aws-amplify';
import { type ResourcesConfig } from '@aws-amplify/core';

/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AWS_REGION: string;
  readonly VITE_COGNITO_USER_POOL_ID: string;
  readonly VITE_COGNITO_CLIENT_ID: string;
  readonly VITE_API_GATEWAY_URL: string;
  readonly VITE_ENV: 'development' | 'production';
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

const region = import.meta.env.VITE_AWS_REGION;
const userPoolId = import.meta.env.VITE_COGNITO_USER_POOL_ID;
const userPoolClientId = import.meta.env.VITE_COGNITO_CLIENT_ID;

const awsConfig = {
  Auth: {
    Cognito: {
      userPoolId,
      userPoolClientId,
      region,
      signUpVerificationMethod: 'code',
      loginWith: {
        email: true,
        phone: false,
        username: true
      }
    }
  },
  API: {
    REST: {
      'Algo360FX-API': {
        endpoint: import.meta.env.VITE_API_GATEWAY_URL,
        region,
        headers: async () => {
          try {
            return {
              'Content-Type': 'application/json'
            };
          } catch (error) {
            console.error('Error getting auth session:', error);
            return {};
          }
        }
      }
    }
  }
} as const;

console.log('Configuring AWS Amplify with:', {
  region,
  userPoolId,
  endpoint: awsConfig.API?.REST?.['Algo360FX-API']?.endpoint
});

Amplify.configure(awsConfig);

export { awsConfig };
