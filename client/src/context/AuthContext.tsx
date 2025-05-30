// @ts-nocheck
// This is a minimal version of AuthContext.tsx that doesn't use JSX
// It simply re-exports from the JavaScript version to avoid Vite React plugin errors

// Import from the JavaScript version
import { AuthContext, AuthProvider, useAuth } from './authContextJs.js';

// Re-export everything
export { AuthContext, AuthProvider, useAuth };
export default AuthContext;
