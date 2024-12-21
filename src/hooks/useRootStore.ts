import { useRootStoreContext } from '../stores/RootStoreContext';

export const useRootStore = () => {
  return useRootStoreContext();
};

export default useRootStore;
