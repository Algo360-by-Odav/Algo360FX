import { observer } from 'mobx-react-lite';
import ChatAssistant from './ChatAssistant';

const FloatingChatButton = observer(() => {
  // Simply render the ChatAssistant component which handles its own state
  return <ChatAssistant />;
});

export default FloatingChatButton;
