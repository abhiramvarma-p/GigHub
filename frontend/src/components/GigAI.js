import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  Button,
  CircularProgress,
  Stack,
  Divider,
} from '@mui/material';
import {
  Send as SendIcon,
  Close as CloseIcon,
  Chat as ChatIcon,
} from '@mui/icons-material';
import axios from 'axios';

const ChatMessage = ({ message, isUser }) => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: isUser ? 'flex-end' : 'flex-start',
      mb: 2,
    }}
  >
    <Paper
      elevation={1}
      sx={{
        p: 2,
        maxWidth: '80%',
        backgroundColor: isUser ? 'primary.main' : 'background.paper',
        color: isUser ? 'primary.contrastText' : 'text.primary',
        borderRadius: 2,
      }}
    >
      <Typography variant="body1">{message}</Typography>
    </Paper>
  </Box>
);

const GigAI = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedJob, setSelectedJob] = useState('');
  const [userSkills, setUserSkills] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Get the current job from URL or state management
    const job = localStorage.getItem('selectedJob') || '';
    setSelectedJob(job);
  }, []);

  const handleInitialize = async () => {
    if (!selectedJob || !userSkills) return;
    
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5000/api/chat/initialize', {
        job: selectedJob,
        skills: userSkills
      });
      
      setMessages([{
        text: `GigAI: Hello! I'm GigAI, your career assistant. You've selected **${selectedJob}**.\nYour current skills include **${userSkills}**. Ask me anything!`,
        isUser: false
      }]);
      setIsInitialized(true);
    } catch (error) {
      console.error('Error initializing chat:', error);
      setMessages([{
        text: 'Error initializing chat. Please try again.',
        isUser: false
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || !isInitialized) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { text: userMessage, isUser: true }]);

    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5000/api/chat/message', {
        message: userMessage,
        job: selectedJob,
        skills: userSkills
      });

      setMessages(prev => [...prev, { text: response.data.message, isUser: false }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, {
        text: 'Sorry, I encountered an error. Please try again.',
        isUser: false
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) {
    return (
      <IconButton
        onClick={() => setIsOpen(true)}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          backgroundColor: 'primary.main',
          color: 'white',
          '&:hover': {
            backgroundColor: 'primary.dark',
          },
        }}
      >
        <ChatIcon />
      </IconButton>
    );
  }

  return (
    <Paper
      elevation={3}
      sx={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        width: 400,
        height: 600,
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1000,
      }}
    >
      <Box
        sx={{
          p: 2,
          backgroundColor: 'primary.main',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h6">GigAI Assistant</Typography>
        <IconButton
          onClick={() => setIsOpen(false)}
          sx={{ color: 'white' }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {!isInitialized ? (
          <Stack spacing={2}>
            <Typography variant="body1">
              Please enter your skills to start chatting with GigAI.
            </Typography>
            <TextField
              label="Your Skills (comma-separated)"
              value={userSkills}
              onChange={(e) => setUserSkills(e.target.value)}
              fullWidth
            />
            <Button
              variant="contained"
              onClick={handleInitialize}
              disabled={!userSkills.trim()}
            >
              Start Chat
            </Button>
          </Stack>
        ) : (
          <>
            {messages.map((message, index) => (
              <ChatMessage
                key={index}
                message={message.text}
                isUser={message.isUser}
              />
            ))}
            {loading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <CircularProgress size={24} />
              </Box>
            )}
          </>
        )}
      </Box>

      <Divider />

      <Box sx={{ p: 2 }}>
        <TextField
          fullWidth
          multiline
          maxRows={4}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          disabled={!isInitialized || loading}
          InputProps={{
            endAdornment: (
              <IconButton
                onClick={handleSend}
                disabled={!input.trim() || !isInitialized || loading}
              >
                <SendIcon />
              </IconButton>
            ),
          }}
        />
      </Box>
    </Paper>
  );
};

export default GigAI; 