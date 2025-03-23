import React, { useState, useEffect } from 'react';
import {
  Badge,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Box,
  Divider,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import WorkIcon from '@mui/icons-material/Work';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      console.log('Fetching notifications with token:', token);
      const response = await axios.get('http://localhost:5000/api/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Notifications response:', response.data);
      setNotifications(response.data);
      setUnreadCount(response.data.filter(n => !n.read).length);
    } catch (error) {
      console.error('Error fetching notifications:', error.response?.data || error);
      if (error.response?.status === 401) {
        // Handle unauthorized error
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Poll for new notifications every 30 seconds instead of 60
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = async (notification) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      // Mark notification as read
      await axios.patch(
        `http://localhost:5000/api/notifications/${notification._id}/read`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // Update notifications list
      setNotifications(prevNotifications =>
        prevNotifications.map(n =>
          n._id === notification._id ? { ...n, read: true } : n
        )
      );

      // Handle navigation based on notification type
      if (notification.type === 'message') {
        // For message notifications, navigate to the messages page with the conversation ID
        const link = notification.link || `/messages/${notification.sender}/${notification.job || 'general'}`;
        navigate(link);
      } else {
        // For other notification types, navigate to the appropriate page
        navigate(notification.link);
      }

      // Close the notification menu
      setAnchorEl(null);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        'http://localhost:5000/api/notifications/read-all',
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchNotifications();
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'application':
        return <WorkIcon color="primary" />;
      case 'application_accepted':
        return <CheckCircleIcon color="success" />;
      case 'application_rejected':
        return <CancelIcon color="error" />;
      case 'application_deleted':
        return <EditIcon color="warning" />;
      default:
        return <NotificationsIcon />;
    }
  };

  return (
    <>
      <IconButton 
        color="inherit" 
        onClick={handleClick}
        sx={{ 
          width: 40,
          height: 40,
          color: '#FEF6EB',
          '&:hover': {
            backgroundColor: '#A35C7A',
          }
        }}
      >
        <Badge badgeContent={unreadCount} color="primary">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: {
            mt: 1.5,
            maxHeight: 400,
            width: 360,
            background: '#212121',
            color: '#FEF6EB',
            border: '1px solid #A35C7A',
            '& .MuiMenuItem-root': {
              color: '#FEF6EB',
              fontFamily: 'Futura',
              fontSize: '0.9rem',
              letterSpacing: '0.05em',
              '&:hover': {
                backgroundColor: '#A35C7A',
              },
            },
          }
        }}
      >
        <Box sx={{ 
          p: 2, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          borderBottom: '1px solid #A35C7A',
        }}>
          <Typography 
            variant="h6"
            sx={{ 
              fontFamily: 'Futura',
              fontSize: '1rem',
              letterSpacing: '0.05em',
            }}
          >
            Notifications
          </Typography>
          {unreadCount > 0 && (
            <Button 
              size="small" 
              onClick={handleMarkAllRead}
              sx={{
                color: '#FEF6EB',
                '&:hover': {
                  backgroundColor: '#A35C7A',
                },
              }}
            >
              Mark all as read
            </Button>
          )}
        </Box>
        <List sx={{ p: 0 }}>
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <ListItem
                key={notification._id}
                onClick={() => handleNotificationClick(notification)}
                sx={{
                  cursor: 'pointer',
                  backgroundColor: notification.read ? 'transparent' : 'rgba(163, 92, 122, 0.1)',
                  borderBottom: '1px solid rgba(163, 92, 122, 0.1)',
                  '&:hover': {
                    backgroundColor: '#A35C7A',
                  },
                }}
              >
                <ListItemIcon sx={{ color: '#FEF6EB', minWidth: 40 }}>
                  {getNotificationIcon(notification.type)}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography 
                      variant="body2"
                      sx={{ 
                        fontFamily: 'Futura',
                        color: '#FEF6EB',
                      }}
                    >
                      {notification.message}
                    </Typography>
                  }
                  secondary={
                    <Typography 
                      variant="caption"
                      sx={{ 
                        color: '#C890A7',
                        fontFamily: 'Futura',
                      }}
                    >
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </Typography>
                  }
                />
              </ListItem>
            ))
          ) : (
            <ListItem>
              <ListItemText
                primary={
                  <Typography 
                    variant="body2"
                    sx={{ 
                      textAlign: 'center',
                      color: '#C890A7',
                      fontFamily: 'Futura',
                    }}
                  >
                    No notifications
                  </Typography>
                }
              />
            </ListItem>
          )}
        </List>
      </Menu>
    </>
  );
};

export default NotificationBell; 