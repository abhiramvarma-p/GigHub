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
  Divider,
  Avatar,
} from '@mui/material';
import { Send as SendIcon, AttachFile as AttachFileIcon } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';

const ChatBox = ({ recipientId, recipientName }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [attachments, setAttachments] = useState([]);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    fetchMessages();
    scrollToBottom();
  }, [recipientId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/messages/${recipientId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() && attachments.length === 0) return;

    const formData = new FormData();
    formData.append('content', newMessage);
    attachments.forEach((file) => {
      formData.append('attachments', file);
    });

    try {
      const response = await axios.post(
        `http://localhost:5000/api/messages/${recipientId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setMessages([...messages, response.data]);
      setNewMessage('');
      setAttachments([]);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleFileAttach = (e) => {
    const files = Array.from(e.target.files);
    setAttachments([...attachments, ...files]);
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Chat Header */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6">{recipientName}</Typography>
      </Box>

      {/* Messages List */}
      <List
        sx={{
          flex: 1,
          overflow: 'auto',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {messages.map((message) => (
          <ListItem
            key={message._id}
            sx={{
              flexDirection: 'column',
              alignItems:
                message.sender._id === user.id ? 'flex-end' : 'flex-start',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                mb: 0.5,
              }}
            >
              <Avatar
                src={message.sender.avatar}
                alt={message.sender.name}
                sx={{ width: 32, height: 32 }}
              />
              <Typography variant="caption" color="text.secondary">
                {formatTime(message.createdAt)}
              </Typography>
            </Box>
            <Paper
              sx={{
                p: 1.5,
                backgroundColor:
                  message.sender._id === user.id
                    ? 'primary.light'
                    : 'grey.100',
                maxWidth: '70%',
                borderRadius: 2,
              }}
            >
              <Typography variant="body1">{message.content}</Typography>
              {message.attachments?.length > 0 && (
                <Box sx={{ mt: 1 }}>
                  {message.attachments.map((attachment, index) => (
                    <Box
                      key={index}
                      component="a"
                      href={attachment.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        display: 'block',
                        color: 'primary.main',
                        textDecoration: 'none',
                        '&:hover': { textDecoration: 'underline' },
                      }}
                    >
                      {attachment.name}
                    </Box>
                  ))}
                </Box>
              )}
            </Paper>
          </ListItem>
        ))}
        <div ref={messagesEndRef} />
      </List>

      {/* Message Input */}
      <Box
        component="form"
        onSubmit={handleSendMessage}
        sx={{
          p: 2,
          borderTop: 1,
          borderColor: 'divider',
          display: 'flex',
          gap: 1,
        }}
      >
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileAttach}
          multiple
        />
        <IconButton
          color="primary"
          onClick={() => fileInputRef.current?.click()}
        >
          <AttachFileIcon />
        </IconButton>
        <TextField
          fullWidth
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          size="small"
        />
        <IconButton
          color="primary"
          type="submit"
          disabled={!newMessage.trim() && attachments.length === 0}
        >
          <SendIcon />
        </IconButton>
      </Box>
    </Paper>
  );
};

export default ChatBox; 