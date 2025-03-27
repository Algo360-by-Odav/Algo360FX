import { signIn, signUp, signOut, confirmSignUp, getCurrentUser } from '@aws-amplify/auth';
import { type SignUpInput } from '@aws-amplify/auth';

export interface SignUpData {
  username: string;
  password: string;
  email: string;
}

export interface SignInData {
  username: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: any;
  nextStep?: string;
}

export const authService = {
  signIn: async (username: string, password: string): Promise<AuthResponse> => {
    try {
      // First try to sign out any existing user
      try {
        await signOut();
      } catch (error) {
        // Ignore signOut errors
      }

      const { isSignedIn, nextStep } = await signIn({ username, password });
      return {
        success: isSignedIn,
        nextStep: nextStep.signInStep
      };
    } catch (error: any) {
      console.error('Sign in error:', error);
      return {
        success: false,
        message: error.message || 'Failed to sign in'
      };
    }
  },

  signUp: async (username: string, password: string, email: string): Promise<AuthResponse> => {
    try {
      // First try to sign out any existing user
      try {
        await signOut();
      } catch (error) {
        // Ignore signOut errors
      }

      const signUpInput: SignUpInput = {
        username,
        password,
        options: {
          userAttributes: {
            email
          }
        }
      };

      const { nextStep } = await signUp(signUpInput);

      return {
        success: true,
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

  confirmSignUp: async (username: string, code: string): Promise<AuthResponse> => {
    try {
      const { isSignUpComplete } = await confirmSignUp({
        username,
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

  signOut: async (): Promise<AuthResponse> => {
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

  getCurrentUser: async (): Promise<any> => {
    try {
      return await getCurrentUser();
    } catch (error) {
      return null;
    }
  }
};
