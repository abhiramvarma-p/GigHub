import React, { useState } from 'react';
import {
  Box,
  IconButton,
  Paper,
  TextField,
  Typography,
  Fade,
  Slide,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';

const ChatButtonContainer = styled(Box)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(3),
  right: theme.spacing(3),
  zIndex: 1000,
}));

const ChatInterface = styled(Paper)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(12),
  right: theme.spacing(3),
  width: 350,
  height: 500,
  display: 'flex',
  flexDirection: 'column',
  zIndex: 1000,
  background: '#212121',
  border: '1px solid #A35C7A',
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 8px 32px rgba(163, 92, 122, 0.1)',
}));

const ChatHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderBottom: '1px solid #A35C7A',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  background: '#A35C7A',
  borderRadius: `${theme.shape.borderRadius * 2}px ${theme.shape.borderRadius * 2}px 0 0`,
}));

const ChatMessages = styled(Box)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(2),
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

const ChatInput = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(255, 255, 255, 0.1)',
  display: 'flex',
  gap: theme.spacing(1),
}));

const Message = styled(Box)(({ theme, isUser }) => ({
  padding: theme.spacing(1.5),
  borderRadius: theme.shape.borderRadius,
  maxWidth: '80%',
  alignSelf: isUser ? 'flex-end' : 'flex-start',
  background: isUser ? '#A35C7A' : '#212121',
  border: `1px solid ${isUser ? '#C890A7' : '#A35C7A'}`,
  color: isUser ? '#FBF5E5' : '#FBF5E5',
}));

const ChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      text: 'Hello! How can I help you today?',
      isUser: false,
    },
  ]);

  const handleSend = () => {
    if (!message.trim()) return;

    // Add user message
    setMessages((prev) => [...prev, { text: message, isUser: true }]);
    setMessage('');

    // TODO: Add chatbot response logic here
    // For now, just echo back a response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { text: 'I received your message. Chatbot functionality coming soon!', isUser: false },
      ]);
    }, 1000);
  };

  return (
    <ChatButtonContainer>
      <Fade in={!isOpen}>
        <IconButton
          onClick={() => setIsOpen(true)}
          sx={{
            width: 56,
            height: 56,
            bgcolor: '#A35C7A',
            color: '#FBF5E5',
            '&:hover': {
              bgcolor: '#C890A7',
            },
          }}
        >
          <ChatIcon />
        </IconButton>
      </Fade>

      <Slide direction="up" in={isOpen} mountOnEnter unmountOnExit>
        <ChatInterface>
          <ChatHeader>
            <Typography variant="h6" sx={{ color: '#FBF5E5' }}>GigAI</Typography>
            <IconButton size="small" onClick={() => setIsOpen(false)} sx={{ color: '#FBF5E5' }}>
              <CloseIcon />
            </IconButton>
          </ChatHeader>

          <ChatMessages>
            {messages.map((msg, index) => (
              <Message key={index} isUser={msg.isUser}>
                <Typography variant="body2" sx={{ color: '#FBF5E5' }}>{msg.text}</Typography>
              </Message>
            ))}
          </ChatMessages>

          <ChatInput>
            <TextField
              fullWidth
              size="small"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: '#212121',
                  color: '#FBF5E5',
                  borderColor: '#A35C7A',
                  '&:hover': {
                    borderColor: '#C890A7',
                  },
                  '& fieldset': {
                    borderColor: '#A35C7A',
                  },
                  '&:hover fieldset': {
                    borderColor: '#C890A7',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#C890A7',
                  },
                },
                '& .MuiInputBase-input::placeholder': {
                  color: '#C890A7',
                  opacity: 0.7,
                },
              }}
            />
            <IconButton
              onClick={handleSend}
              disabled={!message.trim()}
              sx={{
                color: '#FBF5E5',
                bgcolor: '#A35C7A',
                '&:hover': {
                  bgcolor: '#C890A7',
                },
                '&.Mui-disabled': {
                  bgcolor: '#212121',
                  color: '#A35C7A',
                },
              }}
            >
              <SendIcon />
            </IconButton>
          </ChatInput>
        </ChatInterface>
      </Slide>
    </ChatButtonContainer>
  );
};

export default ChatButton; 