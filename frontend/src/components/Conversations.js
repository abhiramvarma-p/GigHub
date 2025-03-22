import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Badge,
  Divider,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';

const Conversations = ({ onSelectConversation }) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConversations();
    // Set up polling for new conversations
    const interval = setInterval(fetchConversations, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchConversations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/messages/conversations', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setConversations(response.data);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
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
    <Paper sx={{ height: '100%', overflow: 'auto' }}>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6">Messages</Typography>
      </Box>
      <List>
        {conversations.map((conversation) => (
          <React.Fragment key={conversation.user._id}>
            <ListItem
              button
              onClick={() => onSelectConversation(conversation.user)}
              sx={{
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
            >
              <ListItemAvatar>
                <Badge
                  color="primary"
                  variant="dot"
                  invisible={conversation.unreadCount === 0}
                >
                  <Avatar src={conversation.user.profilePicture} />
                </Badge>
              </ListItemAvatar>
              <ListItemText
                primary={conversation.user.name}
                secondary={
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {conversation.lastMessage.content}
                  </Typography>
                }
              />
              {conversation.unreadCount > 0 && (
                <Badge
                  badgeContent={conversation.unreadCount}
                  color="primary"
                  sx={{ ml: 2 }}
                />
              )}
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
};

export default Conversations; 