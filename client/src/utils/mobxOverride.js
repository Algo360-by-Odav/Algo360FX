// mobxOverride.js - Override mobx and mobx-react-lite imports
// This file will be imported early in the application to override MobX imports

// Create mock implementations
const mockObserver = (component) => component;
const mockMakeAutoObservable = (target) => target;
const mockRunInAction = (fn) => fn();

// Mock mobx
const mobx = {
  makeAutoObservable: mockMakeAutoObservable,
  runInAction: mockRunInAction,
  observable: (target) => target,
  action: (fn) => fn,
  computed: (fn) => fn,
};

// Mock mobx-react-lite
const mobxReactLite = {
  observer: mockObserver,
};

// Override the imports using window
if (typeof window !== 'undefined') {
  // Create a proxy to intercept module imports
  const originalImport = window.import;
  if (originalImport) {
    window.import = function(specifier) {
      if (specifier === 'mobx') {
        return Promise.resolve(mobx);
      }
      if (specifier === 'mobx-react-lite') {
        return Promise.resolve(mobxReactLite);
      }
      return originalImport.apply(this, arguments);
    };
  }
  
  // Add the mocks to window for direct access
  window.mobxMock = mobx;
  window.mobxReactLiteMock = mobxReactLite;
  
  console.log('MobX overrides applied successfully');
}

// Export the mocks for direct imports
export const observer = mockObserver;
export const makeAutoObservable = mockMakeAutoObservable;
export const runInAction = mockRunInAction;

export default {
  observer,
  makeAutoObservable,
  runInAction,
};
