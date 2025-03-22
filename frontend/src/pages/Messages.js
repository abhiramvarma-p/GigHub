import React, { useState, useEffect, useRef } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  TextField,
  IconButton,
  Box,
  Badge,
  Divider,
  CircularProgress,
  Button,
} from '@mui/material';
import { Send as SendIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useLocation, useNavigate, useSearchParams, useParams } from 'react-router-dom';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';

const Messages = () => {
  const { user: currentUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const { userId, jobId } = useParams();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!currentUser) {
      navigate('/login');
      return;
    }

    // Check for conversation ID in URL
    const conversationId = searchParams.get('conversation');
    if (conversationId) {
      const conversation = conversations.find(c => c.user._id === conversationId);
      if (conversation) {
        setSelectedConversation(conversation);
      }
    }

    if (location.state?.startConversation) {
      const { recipientId, recipientName, recipientPicture, jobId } = location.state;
      setSelectedConversation({
        _id: recipientId,
        user: {
          _id: recipientId,
          name: recipientName,
          profilePicture: recipientPicture
        },
        lastMessage: { jobId }
      });
      // Clear the location state
      navigate(location.pathname, { replace: true });
    }
    fetchConversations();
  }, [location, currentUser, navigate, searchParams, conversations]);

  useEffect(() => {
    if (selectedConversation && currentUser) {
      fetchMessages();
      markMessageNotificationsAsRead();
    }
  }, [selectedConversation, currentUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle notification link
  useEffect(() => {
    const handleNotificationLink = () => {
      const path = location.pathname;
      if (path.startsWith('/messages/')) {
        const [, , userId, jobId] = path.split('/');
        if (userId && jobId) {
          // Find or create conversation
          let conversation = conversations.find(c => c.user._id === userId);
          if (!conversation) {
            // If conversation doesn't exist, create a temporary one
            conversation = {
              _id: userId,
              user: {
                _id: userId,
                name: 'Loading...', // This will be updated when conversations are fetched
                profilePicture: null
              },
              lastMessage: { jobId }
            };
          }
          setSelectedConversation(conversation);
          fetchMessages(userId, jobId);
        }
      }
    };

    handleNotificationLink();
  }, [location.pathname, conversations]);

  // Update the URL parameters handling
  useEffect(() => {
    const handleUrlParams = async () => {
      if (!currentUser || !userId) return;

      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        let targetUser;
        const existingConversation = conversations.find(c => c.user._id === userId);
        
        if (existingConversation) {
          targetUser = existingConversation.user;
        } else {
          // Fetch user details
          const response = await axios.get(`http://localhost:5000/api/users/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          targetUser = response.data;
        }

        // Create or update selected conversation
        const conversation = {
          _id: userId,
          user: {
            _id: userId,
            name: targetUser.name,
            profilePicture: targetUser.profilePicture,
            role: targetUser.role
          },
          lastMessage: { jobId: jobId || 'general' }
        };

        setSelectedConversation(conversation);
        fetchMessages(userId, jobId || 'general');
      } catch (error) {
        console.error('Error handling URL parameters:', error);
      }
    };

    handleUrlParams();
  }, [userId, jobId, currentUser, conversations]);

  const fetchConversations = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await axios.get('http://localhost:5000/api/messages/conversations', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // If we have a selected conversation, preserve its role when updating
      if (selectedConversation) {
        const updatedConversation = response.data.find(c => c.user._id === selectedConversation._id);
        if (updatedConversation) {
          setSelectedConversation({
            ...updatedConversation,
            user: {
              ...updatedConversation.user,
              role: selectedConversation.user.role
            }
          });
        }
      }
      
      setConversations(response.data);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (userId, jobId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const targetUserId = userId || selectedConversation?.user._id;
      const targetJobId = jobId || selectedConversation?.lastMessage?.jobId || 'general';

      if (!targetUserId) return;

      const response = await axios.get(
        `http://localhost:5000/api/messages/${targetUserId}/${targetJobId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const messageData = {
        recipientId: selectedConversation.user._id,
        content: newMessage.trim(),
        jobId: selectedConversation.lastMessage?.jobId || 'general'
      };

      console.log('Message data being sent:', messageData);

      const response = await axios.post(
        'http://localhost:5000/api/messages',
        messageData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setMessages(prev => [...prev, response.data]);
      setNewMessage('');
      fetchConversations(); // Refresh conversations to update last message
    } catch (error) {
      console.error('Error sending message:', error);
      console.error('Error response:', error.response);
      console.error('Error status:', error.response?.status);
      console.error('Error headers:', error.response?.headers);
    }
  };

  const markMessageNotificationsAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      await axios.patch(
        'http://localhost:5000/api/notifications/read-all',
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };

  // Add this function to handle conversation selection
  const handleConversationSelect = (conversation) => {
    // Cache the existing user data when selecting a conversation
    setSelectedConversation({
      ...conversation,
      user: {
        ...conversation.user,
        role: conversation.user.role
      }
    });
  };

  if (!currentUser) {
    return null; // Don't render anything while redirecting
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ height: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column' }}>
        {selectedConversation ? (
          <>
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center' }}>
              <IconButton onClick={() => setSelectedConversation(null)} sx={{ mr: 2 }}>
                <ArrowBackIcon />
              </IconButton>
              <Avatar
                src={selectedConversation.user.profilePicture}
                alt={selectedConversation.user.name}
                sx={{ mr: 2 }}
              />
              <Box>
                <Typography variant="h6">{selectedConversation.user.name}</Typography>
                {selectedConversation.user.role && (
                  <Typography variant="body2" color="text.secondary">
                    {selectedConversation.user.role.charAt(0).toUpperCase() + selectedConversation.user.role.slice(1)}
                  </Typography>
                )}
              </Box>
            </Box>
            <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
              {messages.map((message, index) => (
                <Box
                  key={message._id}
                  sx={{
                    display: 'flex',
                    justifyContent: message.sender._id === currentUser._id ? 'flex-end' : 'flex-start',
                    mb: 2
                  }}
                >
                  <Box
                    sx={{
                      maxWidth: '70%',
                      backgroundColor: message.sender._id === currentUser._id ? 'primary.main' : 'grey.200',
                      color: message.sender._id === currentUser._id ? 'white' : 'text.primary',
                      borderRadius: 2,
                      p: 2
                    }}
                  >
                    <Typography variant="body1">{message.content}</Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        display: 'block',
                        textAlign: 'right',
                        mt: 0.5,
                        color: message.sender._id === currentUser._id ? 'rgba(255,255,255,0.7)' : 'text.secondary'
                      }}
                    >
                      {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                    </Typography>
                  </Box>
                </Box>
              ))}
              <div ref={messagesEndRef} />
            </Box>
            <Box
              component="form"
              onSubmit={handleSendMessage}
              sx={{
                p: 2,
                borderTop: 1,
                borderColor: 'divider',
                display: 'flex',
                gap: 1
              }}
            >
              <TextField
                fullWidth
                size="small"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <IconButton type="submit" color="primary" disabled={!newMessage.trim()}>
                <SendIcon />
              </IconButton>
            </Box>
          </>
        ) : (
          <>
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
              <Typography variant="h6">Conversations</Typography>
            </Box>
            <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
              {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                  <CircularProgress />
                </Box>
              ) : conversations.length === 0 ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                  <Typography color="text.secondary">No conversations yet</Typography>
                </Box>
              ) : (
                <List>
                  {conversations.map((conversation) => (
                    <ListItem
                      key={conversation._id}
                      button
                      onClick={() => handleConversationSelect(conversation)}
                    >
                      <ListItemAvatar>
                        <Badge
                          color="primary"
                          variant="dot"
                          invisible={!conversation.lastMessage || conversation.lastMessage.read}
                        >
                          <Avatar
                            src={conversation.user.profilePicture}
                            alt={conversation.user.name}
                          />
                        </Badge>
                      </ListItemAvatar>
                      <ListItemText
                        primary={conversation.user.name}
                        secondary={
                          conversation.lastMessage
                            ? `${conversation.lastMessage.content.substring(0, 30)}${
                                conversation.lastMessage.content.length > 30 ? '...' : ''
                              }`
                            : 'No messages yet'
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </Box>
          </>
        )}
      </Paper>
    </Container>
  );
};

export default Messages; 