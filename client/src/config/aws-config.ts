import { Amplify } from 'aws-amplify';
import { fetchAuthSession } from 'aws-amplify/auth';
import { type ResourcesConfig } from 'aws-amplify/lib/types';

declare module 'vite' {
  interface ImportMetaEnv {
    VITE_AWS_REGION: string;
    VITE_COGNITO_USER_POOL_ID: string;
    VITE_COGNITO_CLIENT_ID: string;
    VITE_COGNITO_CLIENT_SECRET: string;
    VITE_API_GATEWAY_URL: string;
    VITE_ENV: string;
  }
}

const awsConfig: ResourcesConfig = {
  Auth: {
    Cognito: {
      userPoolClientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
      userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
      region: import.meta.env.VITE_AWS_REGION,
      identityPoolId: undefined,
      loginWith: {
        oauth: {
          domain: `${import.meta.env.VITE_COGNITO_USER_POOL_ID}.auth.${import.meta.env.VITE_AWS_REGION}.amazoncognito.com`,
          scopes: ['email', 'openid', 'phone'],
          redirectSignIn: import.meta.env.VITE_ENV === 'production' 
            ? 'https://algo360fx.cloudfront.net/callback'
            : 'http://localhost:5173/callback',
          redirectSignOut: import.meta.env.VITE_ENV === 'production'
            ? 'https://algo360fx.cloudfront.net'
            : 'http://localhost:5173',
          responseType: 'code'
        },
        username: true,
        email: true
      }
    }
  },
  API: {
    REST: {
      'Algo360FX-API': {
        endpoint: import.meta.env.VITE_API_GATEWAY_URL,
        region: import.meta.env.VITE_AWS_REGION,
        custom_header: async () => {
          try {
            const session = await fetchAuthSession();
            const token = session.tokens?.idToken?.toString();
            return token ? { Authorization: `Bearer ${token}` } : {};
          } catch (error) {
            console.error('Error getting auth session:', error);
            return {};
          }
        }
      }
    }
  }
};

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
    region: awsConfig.Auth.Cognito.region,
    userPoolId: awsConfig.Auth.Cognito.userPoolId,
    endpoint: awsConfig.API.REST['Algo360FX-API'].endpoint
  });

  Amplify.configure(awsConfig);
};
