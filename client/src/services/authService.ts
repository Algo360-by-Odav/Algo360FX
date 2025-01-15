import { Amplify } from 'aws-amplify';
import { signIn, signUp, signOut, confirmSignUp, getCurrentUser } from 'aws-amplify/auth';
import { AUTH_CONFIG } from '@/config/constants.js';

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

interface SignUpData {
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface SignInData {
  username: string;
  password: string;
}

interface AuthResponse {
  success: boolean;
  message?: string;
  user?: any;
  nextStep?: string;
}

const API_NAME = 'Algo360FX-API';
const CLIENT_ID = import.meta.env.VITE_COGNITO_CLIENT_ID || '';
const CLIENT_SECRET = import.meta.env.VITE_COGNITO_CLIENT_SECRET || '';

export const authService = {
  signUp: async ({ username, password, email, firstName, lastName }: SignUpData): Promise<AuthResponse> => {
    try {
      const secretHash = calculateSecretHash(username, CLIENT_ID, CLIENT_SECRET);
      
      const signUpInput = {
        username,
        password,
        options: {
          userAttributes: {
            email,
            given_name: firstName,
            family_name: lastName
          },
          clientMetadata: {
            secretHash
          }
        }
      };

      const { isSignUpComplete, nextStep } = await signUp(signUpInput);
      return {
        success: isSignUpComplete,
        nextStep: nextStep.signUpStep
      };
    } catch (error: any) {
      console.error('Sign up error:', error);
      return {
        success: false,
        message: error.message || 'Failed to sign up'
      };
    }
  },

  login: async ({ username, password }: SignInData): Promise<AuthResponse> => {
    try {
      const secretHash = calculateSecretHash(username, CLIENT_ID, CLIENT_SECRET);
      
      const { isSignedIn, nextStep } = await signIn({ 
        username, 
        password,
        options: {
          clientMetadata: {
            secretHash
          }
        }
      });
      
      return {
        success: isSignedIn,
        nextStep: nextStep.signInStep
      };
    } catch (error: any) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error.message || 'Failed to sign in'
      };
    }
  },

  verifyEmail: async (email: string, code: string): Promise<AuthResponse> => {
    try {
      const { isSignUpComplete } = await confirmSignUp({
        username: email,
        confirmationCode: code
      });

      return {
        success: isSignUpComplete,
        message: isSignUpComplete ? 'Email verified successfully' : 'Failed to verify email'
      };
    } catch (error: any) {
      console.error('Confirm sign up error:', error);
      return {
        success: false,
        message: error.message || 'Failed to confirm sign up'
      };
    }
  },

  logout: async (): Promise<AuthResponse> => {
    try {
      await signOut();
      return {
        success: true,
        message: 'Signed out successfully'
      };
    } catch (error: any) {
      console.error('Sign out error:', error);
      return {
        success: false,
        message: error.message || 'Failed to sign out'
      };
    }
  },

  getCurrentUser: async (): Promise<AuthResponse> => {
    try {
      const user = await getCurrentUser();
      return {
        success: true,
        user
      };
    } catch (error: any) {
      console.error('Get current user error:', error);
      return {
        success: false,
        message: error.message || 'Failed to get current user'
      };
    }
  }
};
