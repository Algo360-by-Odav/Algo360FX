import { makeAutoObservable } from 'mobx';
import { createTheme, type Theme } from '@mui/material/styles';

class ThemeStore {
  isDarkMode = false;
  isMenuOpen = true;

  constructor() {
    makeAutoObservable(this);
    // Load saved theme preference from localStorage
    const savedTheme = localStorage.getItem('theme');
    const savedMenuState = localStorage.getItem('menuState');
    
    if (savedTheme) {
      this.isDarkMode = savedTheme === 'dark';
    } else {
      // Use system preference as default
      this.isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    if (savedMenuState) {
      this.isMenuOpen = savedMenuState === 'open';
    }
  }

  get theme(): Theme {
    return createTheme({
      palette: {
        mode: this.isDarkMode ? 'dark' : 'light',
        primary: {
          main: '#1976d2',
        },
        background: {
          default: this.isDarkMode ? '#0A192F' : '#f5f5f5',
          paper: this.isDarkMode ? '#1A2B45' : '#ffffff',
        },
      },
    });
  }

  toggleTheme = () => {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
  };

  toggleMenu = () => {
    this.isMenuOpen = !this.isMenuOpen;
    localStorage.setItem('menuState', this.isMenuOpen ? 'open' : 'closed');
  };
}

export const themeStore = new ThemeStore();
