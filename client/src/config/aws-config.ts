import { Amplify } from 'aws-amplify';

interface AmplifyConfig {
  Auth: {
    Cognito: {
      userPoolId: string;
      userPoolClientId: string;
      signUpVerificationMethod: 'code';
      loginWith: {
        email: boolean;
        username: boolean;
        phone: boolean;
      };
      region?: string;
    };
  };
  API: {
    REST: {
      [key: string]: {
        endpoint: string;
        region: string;
        headers?: () => Promise<Record<string, string>>;
      };
    };
  };
}

const region = import.meta.env.VITE_AWS_REGION || 'us-east-1';

export const awsConfig: AmplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID || '',
      userPoolClientId: import.meta.env.VITE_COGNITO_CLIENT_ID || '',
      signUpVerificationMethod: 'code',
      loginWith: {
        email: true,
        username: true,
        phone: false
      },
      region
    }
  },
  API: {
    REST: {
      'Algo360FX-API': {
        endpoint: import.meta.env.VITE_API_GATEWAY_URL || '',
        region,
        headers: async () => ({
          'Content-Type': 'application/json'
        })
      }
    }
  }
};

console.log('Configuring AWS Amplify with:', {
  region: awsConfig.Auth.Cognito.region,
  userPoolId: awsConfig.Auth.Cognito.userPoolId,
  endpoint: awsConfig.API?.REST?.['Algo360FX-API']?.endpoint
});

Amplify.configure(awsConfig);
