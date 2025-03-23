import React, { useState } from 'react';
import {
  Box,
  IconButton,
  Paper,
  TextField,
  Typography,
  Fade,
  Slide,
  Fab,
  Button,
  Divider,
} from '@mui/material';
import {
  Chat as ChatIcon,
  Close as CloseIcon,
  Send as SendIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const ChatContainer = styled(Paper)(({ theme }) => ({
  position: 'fixed',
  bottom: 80,
  right: 20,
  width: 350,
  height: 500,
  display: 'flex',
  flexDirection: 'column',
  zIndex: 1000,
  background: '#212121',
  border: '1px solid #A35C7A',
  borderRadius: '12px',
  overflow: 'hidden',
}));

const ChatHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  background: '#A35C7A',
  color: '#FEF6EB',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

const ChatMessages = styled(Box)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(2),
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
}));

const MessageBubble = styled(Box)(({ theme, isUser }) => ({
  maxWidth: '80%',
  padding: theme.spacing(1, 2),
  borderRadius: '12px',
  background: isUser ? '#A35C7A' : '#2C2C2C',
  color: '#FEF6EB',
  alignSelf: isUser ? 'flex-end' : 'flex-start',
}));

const ChatInput = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid #A35C7A',
  display: 'flex',
  gap: theme.spacing(1),
}));

const ContactForm = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

const GigAI = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [messages, setMessages] = useState([
    {
      text: 'Hello! I\'m GigAI, your GigHub assistant. How can I help you today?',
      isUser: false,
    },
  ]);
  const [input, setInput] = useState('');
  const [contactInfo, setContactInfo] = useState({
    email: '',
    phone: '',
  });

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage = {
      text: input,
      isUser: true,
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput('');

    // Simulate bot response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          text: 'I understand your message. How else can I assist you?',
          isUser: false,
        },
      ]);
    }, 1000);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const handleContactSubmit = () => {
    // Here you would typically send the contact information to your backend
    console.log('Contact information:', contactInfo);
    setShowContactForm(false);
    setMessages(prev => [
      ...prev,
      {
        text: 'Thank you for providing your contact information. We\'ll get back to you soon!',
        isUser: false,
      }
    ]);
  };

  return (
    <>
      <Fab
        color="primary"
        aria-label="chat"
        onClick={() => setIsOpen(!isOpen)}
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          background: '#A35C7A',
          '&:hover': {
            background: '#8B4B66',
          },
        }}
      >
        {isOpen ? <CloseIcon /> : <ChatIcon />}
      </Fab>

      <Fade in={isOpen}>
        <Slide direction="up" in={isOpen} mountOnEnter unmountOnExit>
          <ChatContainer elevation={3}>
            <ChatHeader>
              <Typography variant="h6">GigAI</Typography>
              <IconButton
                size="small"
                onClick={() => setIsOpen(false)}
                sx={{ color: '#FEF6EB' }}
              >
                <CloseIcon />
              </IconButton>
            </ChatHeader>

            <ChatMessages>
              {messages.map((message, index) => (
                <MessageBubble key={index} isUser={message.isUser}>
                  <Typography variant="body2">{message.text}</Typography>
                </MessageBubble>
              ))}
              {showContactForm && (
                <ContactForm>
                  <Typography variant="body2" color="#FEF6EB">
                    Please provide your contact information:
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Email address"
                    value={contactInfo.email}
                    onChange={(e) => setContactInfo(prev => ({ ...prev, email: e.target.value }))}
                    InputProps={{
                      startAdornment: <EmailIcon sx={{ mr: 1, color: '#A35C7A' }} />,
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: '#FEF6EB',
                        '& fieldset': {
                          borderColor: '#A35C7A',
                        },
                        '&:hover fieldset': {
                          borderColor: '#8B4B66',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#A35C7A',
                        },
                      },
                    }}
                  />
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Phone number"
                    value={contactInfo.phone}
                    onChange={(e) => setContactInfo(prev => ({ ...prev, phone: e.target.value }))}
                    InputProps={{
                      startAdornment: <PhoneIcon sx={{ mr: 1, color: '#A35C7A' }} />,
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: '#FEF6EB',
                        '& fieldset': {
                          borderColor: '#A35C7A',
                        },
                        '&:hover fieldset': {
                          borderColor: '#8B4B66',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#A35C7A',
                        },
                      },
                    }}
                  />
                  <Button
                    variant="contained"
                    onClick={handleContactSubmit}
                    sx={{
                      background: '#A35C7A',
                      '&:hover': {
                        background: '#8B4B66',
                      },
                    }}
                  >
                    Submit Contact Info
                  </Button>
                </ContactForm>
              )}
            </ChatMessages>

            <Divider sx={{ borderColor: '#A35C7A' }} />

            <ChatInput>
              <TextField
                fullWidth
                size="small"
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#FEF6EB',
                    '& fieldset': {
                      borderColor: '#A35C7A',
                    },
                    '&:hover fieldset': {
                      borderColor: '#8B4B66',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#A35C7A',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#FEF6EB',
                  },
                }}
              />
              <IconButton
                color="primary"
                onClick={handleSend}
                sx={{
                  color: '#A35C7A',
                  '&:hover': {
                    background: 'rgba(163, 92, 122, 0.1)',
                  },
                }}
              >
                <SendIcon />
              </IconButton>
            </ChatInput>
          </ChatContainer>
        </Slide>
      </Fade>
    </>
  );
};

export default GigAI;