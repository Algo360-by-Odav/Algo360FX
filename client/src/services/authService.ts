import { Amplify } from 'aws-amplify';
import { signUp, signIn, confirmSignUp, signOut, getCurrentUser } from 'aws-amplify/auth';
import { calculateSecretHash } from '../utils/auth';

const API_NAME = 'Algo360FX-API';
const CLIENT_ID = import.meta.env.VITE_COGNITO_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_COGNITO_CLIENT_SECRET;

export interface SignUpData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export const authService = {
  signUp: async (data: SignUpData) => {
    try {
      const secretHash = calculateSecretHash(data.email, CLIENT_ID, CLIENT_SECRET);
      const { user } = await signUp({
        username: data.email,
        password: data.password,
        options: {
          userAttributes: {
            email: data.email,
            given_name: data.firstName,
            family_name: data.lastName
          },
          secretHash
        }
      });
      return user;
    } catch (error) {
      console.error('SignUp Error:', error);
      throw error;
    }
  },

  login: async (data: LoginData) => {
    try {
      const secretHash = calculateSecretHash(data.email, CLIENT_ID, CLIENT_SECRET);
      const { isSignedIn, nextStep } = await signIn({
        username: data.email,
        password: data.password,
        options: {
          secretHash
        }
      });
      return { isSignedIn, nextStep };
    } catch (error) {
      console.error('Login Error:', error);
      throw error;
    }
  },

  verifyEmail: async (email: string, code: string) => {
    try {
      return await confirmSignUp({
        username: email,
        confirmationCode: code
      });
    } catch (error) {
      console.error('Verification Error:', error);
      throw error;
    }
  },

  logout: async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout Error:', error);
      throw error;
    }
  },

  getCurrentUser: async () => {
    try {
      return await getCurrentUser();
    } catch (error) {
      console.error('Get Current User Error:', error);
      throw error;
    }
  }
};
