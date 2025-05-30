import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Container, 
  Grid, 
  Paper, 
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Divider,
  TextField,
  Button,
  IconButton,
  CircularProgress
} from '@mui/material';
import { 
  Send as SendIcon,
  AttachFile as AttachFileIcon,
  MoreVert as MoreVertIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Styled components
const MessageContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  height: '70vh',
  display: 'flex',
  flexDirection: 'column'
}));

const MessagesList = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  padding: theme.spacing(2)
}));

const MessageInputContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  padding: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`
}));

const MessageBubble = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isCurrentUser'
})<{ isCurrentUser: boolean }>(({ theme, isCurrentUser }) => ({
  background: isCurrentUser ? theme.palette.primary.main : theme.palette.grey[100],
  color: isCurrentUser ? theme.palette.primary.contrastText : theme.palette.text.primary,
  borderRadius: '1rem',
  padding: theme.spacing(1, 2),
  marginBottom: theme.spacing(1),
  maxWidth: '80%',
  alignSelf: isCurrentUser ? 'flex-end' : 'flex-start',
  wordBreak: 'break-word'
}));

const MessagesList2 = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1)
}));

// Mock data for demonstration
const mockConversations = [
  { id: '1', name: 'Trading Support', avatar: '/avatars/support.jpg', lastMessage: 'How can I help you with your trading?', timestamp: '10:30 AM', unread: 2 },
  { id: '2', name: 'Technical Support', avatar: '/avatars/tech.jpg', lastMessage: 'Your issue has been resolved.', timestamp: 'Yesterday', unread: 0 },
  { id: '3', name: 'Account Manager', avatar: '/avatars/manager.jpg', lastMessage: 'Let\'s discuss your portfolio strategy', timestamp: 'May 25', unread: 1 },
  { id: '4', name: 'Payment Support', avatar: '/avatars/payment.jpg', lastMessage: 'Your deposit has been confirmed', timestamp: 'May 23', unread: 0 },
];

const mockMessages = [
  { id: '1', sender: 'support', text: 'Hello, how can I help you today?', timestamp: '10:15 AM' },
  { id: '2', sender: 'user', text: 'I have a question about my recent trade', timestamp: '10:17 AM' },
  { id: '3', sender: 'support', text: 'Sure, I\'d be happy to help. Could you provide more details about the trade?', timestamp: '10:18 AM' },
  { id: '4', sender: 'user', text: 'I placed a buy order for BTC/USD yesterday but I don\'t see it in my portfolio', timestamp: '10:20 AM' },
  { id: '5', sender: 'support', text: 'Let me check that for you. Can you confirm the time of the trade and the amount?', timestamp: '10:22 AM' },
  { id: '6', sender: 'user', text: 'It was around 2:30 PM for 0.05 BTC', timestamp: '10:25 AM' },
  { id: '7', sender: 'support', text: 'Thank you for that information. I\'m looking into this now and will get back to you shortly.', timestamp: '10:28 AM' },
  { id: '8', sender: 'support', text: 'I\'ve checked your account and I can see the pending order. It seems there was a delay in processing. It should appear in your portfolio within the next hour. Is there anything else I can help you with?', timestamp: '10:30 AM' },
];

// Main Messages Component
const MessagesPage: React.FC = () => {
  const { messageId } = useParams<{ messageId: string }>();
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  // Load conversation and messages based on the ID
  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      if (messageId) {
        const conversation = mockConversations.find(c => c.id === messageId);
        setSelectedConversation(conversation || null);
        setMessages(mockMessages);
      } else {
        setSelectedConversation(null);
        setMessages([]);
      }
      setLoading(false);
    }, 500);
  }, [messageId]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const newMsg = {
        id: `${messages.length + 1}`,
        sender: 'user',
        text: newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...messages, newMsg]);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Messages
      </Typography>
      
      <Grid container spacing={3}>
        {/* Conversations List */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ height: '70vh', overflow: 'auto' }}>
            <List>
              {mockConversations.map((conversation) => (
                <React.Fragment key={conversation.id}>
                  <ListItem 
                    button
                    selected={selectedConversation?.id === conversation.id}
                    component="a" 
                    href={`/dashboard/messages/${conversation.id}`}
                    sx={{ 
                      position: 'relative',
                      fontWeight: conversation.unread > 0 ? 'bold' : 'normal'
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar alt={conversation.name} src={conversation.avatar} />
                    </ListItemAvatar>
                    <ListItemText 
                      primary={conversation.name} 
                      secondary={conversation.lastMessage}
                      primaryTypographyProps={{
                        fontWeight: conversation.unread > 0 ? 'bold' : 'normal'
                      }}
                    />
                    <Typography variant="caption" color="textSecondary" sx={{ position: 'absolute', top: 8, right: 8 }}>
                      {conversation.timestamp}
                    </Typography>
                    {conversation.unread > 0 && (
                      <Box 
                        sx={{ 
                          position: 'absolute', 
                          bottom: 8, 
                          right: 8,
                          bgcolor: 'primary.main',
                          color: 'white',
                          borderRadius: '50%',
                          width: 20,
                          height: 20,
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          fontSize: '0.75rem'
                        }}
                      >
                        {conversation.unread}
                      </Box>
                    )}
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
        
        {/* Message Area */}
        <Grid item xs={12} md={8}>
          <MessageContainer>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <CircularProgress />
              </Box>
            ) : selectedConversation ? (
              <>
                {/* Conversation Header */}
                <Box sx={{ display: 'flex', alignItems: 'center', p: 2, borderBottom: 1, borderColor: 'divider' }}>
                  <IconButton sx={{ mr: 1, display: { md: 'none' } }} component="a" href="/dashboard/messages">
                    <ArrowBackIcon />
                  </IconButton>
                  <Avatar alt={selectedConversation.name} src={selectedConversation.avatar} sx={{ mr: 2 }} />
                  <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    {selectedConversation.name}
                  </Typography>
                  <IconButton>
                    <MoreVertIcon />
                  </IconButton>
                </Box>
                
                {/* Messages List */}
                <MessagesList>
                  <MessagesList2>
                    {messages.map((message) => (
                      <MessageBubble 
                        key={message.id} 
                        isCurrentUser={message.sender === 'user'}
                      >
                        <Typography variant="body1">{message.text}</Typography>
                        <Typography variant="caption" color="textSecondary" sx={{ display: 'block', textAlign: 'right', mt: 0.5 }}>
                          {message.timestamp}
                        </Typography>
                      </MessageBubble>
                    ))}
                  </MessagesList2>
                </MessagesList>
                
                {/* Message Input */}
                <MessageInputContainer>
                  <IconButton>
                    <AttachFileIcon />
                  </IconButton>
                  <TextField
                    fullWidth
                    placeholder="Type a message..."
                    variant="outlined"
                    size="small"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    sx={{ mx: 1 }}
                  />
                  <IconButton color="primary" onClick={handleSendMessage} disabled={!newMessage.trim()}>
                    <SendIcon />
                  </IconButton>
                </MessageInputContainer>
              </>
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <Typography variant="h6" color="textSecondary">
                  Select a conversation to start messaging
                </Typography>
              </Box>
            )}
          </MessageContainer>
        </Grid>
      </Grid>
    </Container>
  );
};

export default MessagesPage;
