import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Badge,
  CircularProgress,
} from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const Chat = ({ recipientId, recipientName, recipientPicture }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    fetchMessages();
    // Set up polling for new messages
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [recipientId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/messages/${recipientId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/messages',
        {
          recipientId,
          content: newMessage
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setMessages([...messages, response.data]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6">
          Chat with {recipientName}
        </Typography>
      </Box>

      <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
        <List>
          {messages.map((message) => (
            <ListItem
              key={message._id}
              sx={{
                flexDirection: message.sender._id === user._id ? 'row-reverse' : 'row',
                alignItems: 'flex-start',
              }}
            >
              <ListItemAvatar>
                <Avatar
                  src={message.sender._id === user._id ? user.profilePicture : recipientPicture}
                  alt={message.sender.name}
                />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography
                    sx={{
                      bgcolor: message.sender._id === user._id ? 'primary.main' : 'grey.200',
                      color: message.sender._id === user._id ? 'white' : 'text.primary',
                      borderRadius: 2,
                      p: 1,
                      maxWidth: '70%',
                      wordBreak: 'break-word',
                    }}
                  >
                    {message.content}
                  </Typography>
                }
                secondary={
                  <Typography
                    variant="caption"
                    sx={{
                      display: 'block',
                      textAlign: message.sender._id === user._id ? 'right' : 'left',
                      mt: 0.5,
                    }}
                  >
                    {new Date(message.createdAt).toLocaleTimeString()}
                  </Typography>
                }
              />
            </ListItem>
          ))}
          <div ref={messagesEndRef} />
        </List>
      </Box>

      <Divider />

      <Box component="form" onSubmit={handleSendMessage} sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <IconButton
            type="submit"
            color="primary"
            disabled={!newMessage.trim()}
            sx={{ bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' } }}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Box>
    </Paper>
  );
};

export default Chat; 