import { makeAutoObservable } from 'mobx';
import { searchFAQs, getMostRelevantFAQ, platformInfo, courseData } from '../data/faqData';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

class ChatStore {
  messages: ChatMessage[] = [
    { role: 'assistant', content: 'Hello! How can I help you with Algo360FX today?' }
  ];
  isOpen: boolean = false;
  isSpeechEnabled: boolean = false;
  isListening: boolean = false;
  
  constructor() {
    makeAutoObservable(this);
    this.loadMessages();
  }
  
  toggleChat = () => {
    this.isOpen = !this.isOpen;
  }
  
  toggleSpeech = () => {
    this.isSpeechEnabled = !this.isSpeechEnabled;
  }
  
  toggleListening = () => {
    this.isListening = !this.isListening;
  }
  
  addMessage = (message: ChatMessage) => {
    this.messages.push(message);
    this.saveMessages();
  }
  
  clearMessages = () => {
    this.messages = [
      { role: 'assistant', content: 'Hello! How can I help you with Algo360FX today?' }
    ];
    this.saveMessages();
  }
  
  saveMessages = () => {
    try {
      // Only save the last 50 messages to prevent storage issues
      const messagesToSave = this.messages.slice(-50);
      localStorage.setItem('algo360fx_chat_history', JSON.stringify(messagesToSave));
    } catch (error) {
      console.error('Error saving chat messages:', error);
    }
  }
  
  loadMessages = () => {
    try {
      const savedMessages = localStorage.getItem('algo360fx_chat_history');
      if (savedMessages) {
        this.messages = JSON.parse(savedMessages);
      }
    } catch (error) {
      console.error('Error loading chat messages:', error);
    }
  }
  
  async generateResponse(message: string): Promise<string> {
    // In a real implementation, this would call an API
    // For now, we'll simulate a response with our FAQ data
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const lowerMessage = message.toLowerCase();
    
    // Check for greetings
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return "Hello! How can I help you with Algo360FX today?";
    }
    
    // Check for help command
    if (lowerMessage.includes('/help')) {
      return "I can answer questions about Algo360FX including trading instruments, features, fees, and more. Try asking about 'Malaysian stocks', 'trading hours', or 'Islamic trading'.";
    }
    
    // Check for platform info request
    if (lowerMessage.includes('about algo360') || lowerMessage.includes('what is algo360')) {
      return `${platformInfo.name} is an ${platformInfo.description}. Our key features include ${platformInfo.features.join(', ')}.`;
    }
    
    // Check for courses info request
    if (lowerMessage.includes('courses') || lowerMessage.includes('training') || lowerMessage.includes('learn')) {
      const coursesList = courseData.slice(0, 3).map(course => `- ${course.name} (${course.duration})`).join('\n');
      return `We offer various trading courses including:\n${coursesList}\n\nWould you like more information about a specific course?`;
    }
    
    // Check for FAQ matches
    const relevantFAQ = getMostRelevantFAQ(message);
    if (relevantFAQ) {
      return relevantFAQ.answer;
    }
    
    // Search for keywords in FAQs
    const keywordMatches = searchFAQs(message);
    if (keywordMatches.length > 0) {
      return keywordMatches[0].answer;
    }
    
    // Default response if no matches
    return "I understand you're interested in that. Our platform offers comprehensive tools and features to help with all your trading needs. For specific information about trading instruments, fees, or features, please ask a more detailed question.";
  }
  
  async sendMessageToAPI(userMessage: string): Promise<string> {
    try {
      // In a real implementation, this would call your backend API
      // For now, we'll simulate a response based on the user's message
      return this.generateResponse(userMessage);
      
      // In a real implementation, you would call your API like this:
      /*
      const response = await fetch('http://your-backend-api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: this.messages.concat({ role: 'user', content: userMessage })
        }),
      });
      
      if (!response.ok) {
        throw new Error('API request failed');
      }
      
      const data = await response.json();
      return data.message;
      */
    } catch (error) {
      console.error('Error sending message to API:', error);
      return "Sorry, I encountered an error while processing your request. Please try again later.";
    }
  }
  
  async sendMessage(userMessage: string) {
    // Add user message
    this.addMessage({ role: 'user', content: userMessage });
    
    // Get response from API
    const response = await this.sendMessageToAPI(userMessage);
    
    // Add assistant response
    this.addMessage({ role: 'assistant', content: response });
    
    return response;
  }
  
  // Handle command prompts
  async handleCommand(command: string): Promise<boolean> {
    const lowerCommand = command.toLowerCase().trim();
    
    // Check if it's a command (starts with / or !)
    if (lowerCommand.startsWith('/') || lowerCommand.startsWith('!')) {
      const cmd = lowerCommand.substring(1);
      
      switch (cmd) {
        case 'help':
          this.addMessage({ 
            role: 'assistant', 
            content: "Available commands:\n- /signals - Show active signals\n- /performance - Open performance analytics\n- /connect - MT5 connection wizard\n- /news - Latest market news\n- /clear - Clear chat history" 
          });
          return true;
          
        case 'clear':
          this.clearMessages();
          return true;
          
        case 'signals':
          this.addMessage({ 
            role: 'assistant', 
            content: "Opening signal dashboard..." 
          });
          // In a real implementation, you would navigate to the signals page
          // or dispatch an event to open the signals panel
          return true;
          
        case 'performance':
          this.addMessage({ 
            role: 'assistant', 
            content: "Opening performance analytics..." 
          });
          // In a real implementation, you would navigate to the performance page
          return true;
          
        case 'connect':
          this.addMessage({ 
            role: 'assistant', 
            content: "Opening MT5 connection wizard..." 
          });
          // In a real implementation, you would open the connection wizard
          return true;
          
        case 'news':
          this.addMessage({ 
            role: 'assistant', 
            content: "Fetching latest market news..." 
          });
          // In a real implementation, you would fetch and display news
          return true;
          
        default:
          this.addMessage({ 
            role: 'assistant', 
            content: `Unknown command: ${cmd}. Type /help for available commands.` 
          });
          return true;
      }
    }
    
    return false; // Not a command
  }
}

export default ChatStore;
