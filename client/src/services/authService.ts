import { Amplify } from 'aws-amplify';
import { signIn, signUp, type SignUpInput } from 'aws-amplify/auth';
import { calculateSecretHash } from '../utils/auth';

const API_NAME = 'Algo360FX-API';
const CLIENT_ID = process.env.VITE_COGNITO_CLIENT_ID || '';
const CLIENT_SECRET = process.env.VITE_COGNITO_CLIENT_SECRET || '';

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

export const authService = {
  signUp: async ({ username, password, email, firstName, lastName }: SignUpData) => {
    try {
      const secretHash = calculateSecretHash(username, CLIENT_ID, CLIENT_SECRET);
      
      const signUpInput: SignUpInput = {
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

      const { user } = await signUp(signUpInput);
      return user;
    } catch (error) {
      console.error('SignUp Error:', error);
      throw error;
    }
  },

  login: async ({ username, password }: SignInData) => {
    try {
      const secretHash = calculateSecretHash(username, CLIENT_ID, CLIENT_SECRET);
      
      const result = await signIn({ 
        username, 
        password,
        options: {
          clientMetadata: {
            secretHash
          }
        }
      });
      
      return result;
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
