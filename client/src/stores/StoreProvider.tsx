// StoreProvider.tsx - Re-export from JavaScript file
// This file avoids using JSX or TypeScript features that might cause Vite React plugin errors

// @ts-ignore - Ignore TypeScript errors for the JavaScript file
import { useStores, StoreProvider, StoreContext } from './storeProviderJs';

// Re-export everything from the JavaScript file
export { useStores, StoreProvider, StoreContext };
