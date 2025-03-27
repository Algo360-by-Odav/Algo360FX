import { makeAutoObservable } from 'mobx';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

class AIAssistantStore {
  isOpen: boolean = false;
  isMinimized: boolean = false;
  isConfigured: boolean = false;
  messages: ChatMessage[] = [];
  apiKey: string = '';

  constructor() {
    makeAutoObservable(this);
    this.loadState();
  }

  private loadState() {
    const savedApiKey = localStorage.getItem('openai_api_key');
    if (savedApiKey) {
      this.apiKey = savedApiKey;
      this.isConfigured = true;
    }

    const savedMessages = localStorage.getItem('ai_chat_messages');
    if (savedMessages) {
      this.messages = JSON.parse(savedMessages);
    }

    const isHidden = localStorage.getItem('ai_assistant_hidden');
    this.isOpen = isHidden !== 'true';
  }

  toggleOpen = () => {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.isMinimized = false;
    }
    localStorage.setItem('ai_assistant_hidden', (!this.isOpen).toString());
  };

  toggleMinimize = () => {
    this.isMinimized = !this.isMinimized;
  };

  setApiKey = (key: string) => {
    this.apiKey = key;
    this.isConfigured = true;
    localStorage.setItem('openai_api_key', key);
  };

  addMessage = (message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMessage = {
      ...message,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
    };
    this.messages.push(newMessage);
    localStorage.setItem('ai_chat_messages', JSON.stringify(this.messages));
  };

  clearMessages = () => {
    this.messages = [];
    localStorage.removeItem('ai_chat_messages');
  };
}

export const aiAssistantStore = new AIAssistantStore();
