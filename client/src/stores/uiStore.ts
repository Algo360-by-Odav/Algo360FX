import { makeAutoObservable } from 'mobx';

class UIStore {
  theme: 'light' | 'dark' = 'light';
  sidebarOpen: boolean = false;
  loading: boolean = false;
  loadingMessage: string | null = null;

  constructor() {
    makeAutoObservable(this);
    // Load theme from localStorage if available
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    if (savedTheme) {
      this.theme = savedTheme;
    } else {
      // Use system preference as default
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.theme = prefersDark ? 'dark' : 'light';
    }
  }

  setTheme = (theme: 'light' | 'dark') => {
    this.theme = theme;
    localStorage.setItem('theme', theme);
  };

  toggleSidebar = () => {
    this.sidebarOpen = !this.sidebarOpen;
  };

  setSidebarOpen = (open: boolean) => {
    this.sidebarOpen = open;
  };

  setLoading = (loading: boolean, message: string | null = null) => {
    this.loading = loading;
    this.loadingMessage = message;
  };
}

export const uiStore = new UIStore();
