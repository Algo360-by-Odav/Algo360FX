import { injectChatAssistant } from './StandaloneChat';

// Inject the chat assistant when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Wait a short time to ensure all other components are loaded
  setTimeout(() => {
    injectChatAssistant();
    console.log('Chat assistant injected successfully');
  }, 1000);
});

export default injectChatAssistant;
