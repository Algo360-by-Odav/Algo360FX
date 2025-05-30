// mobxMock.js - A mock implementation of mobx-react-lite
// This avoids errors with MobX integration

// Simple observer function that just returns the component
export function observer(component) {
  return component;
}

// Simple makeAutoObservable function that does nothing
export function makeAutoObservable(target) {
  return target;
}

// Simple runInAction function that just executes the callback
export function runInAction(fn) {
  return fn();
}

export default {
  observer,
  makeAutoObservable,
  runInAction
};
