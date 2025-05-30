import { Amplify } from 'aws-amplify';

export const configureAmplify = () => {
  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
        userPoolClientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
        signUpVerificationMethod: 'code',
        loginWith: {
          email: true,
          phone: false,
          username: true
        },
        region: 'ap-southeast-1'
      }
    }
  });
};
