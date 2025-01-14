import { Amplify } from 'aws-amplify';
import { ResourcesConfig } from '@aws-amplify/core';

/// <reference types="vite/client" />

declare module 'vite' {
  interface ImportMetaEnv {
    readonly VITE_AWS_REGION: string;
    readonly VITE_COGNITO_USER_POOL_ID: string;
    readonly VITE_COGNITO_CLIENT_ID: string;
    readonly VITE_COGNITO_CLIENT_SECRET: string;
    readonly VITE_API_GATEWAY_URL: string;
    readonly VITE_ENV: 'development' | 'production';
  }
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

const region = import.meta.env.VITE_AWS_REGION;
const userPoolId = import.meta.env.VITE_COGNITO_USER_POOL_ID;
const userPoolClientId = import.meta.env.VITE_COGNITO_CLIENT_ID;
const userPoolClientSecret = import.meta.env.VITE_COGNITO_CLIENT_SECRET;

const awsConfig: ResourcesConfig = {
  Auth: {
    Cognito: {
      userPoolId,
      userPoolClientId,
      signUpVerificationMethod: 'code',
      loginWith: {
        email: true,
        phone: false,
        username: true
      }
    }
  } as const,
  API: {
    REST: {
      'Algo360FX-API': {
        endpoint: import.meta.env.VITE_API_GATEWAY_URL,
        region,
        defaultAuthMode: 'userPool'
      }
    }
  } as const
} as const;

console.log('Environment Variables:');
console.log('VITE_AWS_REGION:', import.meta.env.VITE_AWS_REGION);
console.log('VITE_COGNITO_USER_POOL_ID:', import.meta.env.VITE_COGNITO_USER_POOL_ID);
console.log('VITE_COGNITO_CLIENT_ID:', import.meta.env.VITE_COGNITO_CLIENT_ID);
console.log('VITE_API_GATEWAY_URL:', import.meta.env.VITE_API_GATEWAY_URL);

export const configureAWS = () => {
  // Validate required environment variables
  const requiredEnvVars = [
    'VITE_AWS_REGION',
    'VITE_COGNITO_USER_POOL_ID',
    'VITE_COGNITO_CLIENT_ID',
    'VITE_COGNITO_CLIENT_SECRET',
    'VITE_API_GATEWAY_URL'
  ] as const;

  for (const envVar of requiredEnvVars) {
    if (!import.meta.env[envVar]) {
      throw new Error(`Missing required environment variable: ${envVar}`);
    }
  }

  console.log('Configuring AWS Amplify with:', {
    region: awsConfig.Auth.Cognito.userPoolId,
    userPoolId: awsConfig.Auth.Cognito.userPoolId,
    endpoint: awsConfig.API.REST['Algo360FX-API'].endpoint
  });

  Amplify.configure(awsConfig);
};

export { awsConfig };
