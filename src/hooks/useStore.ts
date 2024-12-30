import { useRootStore } from './useRootStore';
import { RootStore } from '@/stores/RootStore';

export const useStore = (): RootStore => {
  return useRootStore();
};

export default useStore;
