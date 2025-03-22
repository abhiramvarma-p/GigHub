import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Container,
  Badge,
  Stack,
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { styled } from '@mui/material/styles';
import NotificationBell from './NotificationBell';
import { AccountCircle, Mail as MailIcon } from '@mui/icons-material';
import axios from 'axios';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'rgba(18, 18, 18, 0.8)',
  backdropFilter: 'blur(10px)',
  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  zIndex: theme.zIndex.drawer + 1,
  height: '64px',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  color: 'white',
  padding: '6px 16px',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
}));

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
  };

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await axios.get('http://localhost:5000/api/messages/unread/count', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUnreadCount(response.data.count);
      } catch (error) {
        console.error('Error fetching unread count:', error);
      }
    };

    if (user) {
      fetchUnreadCount();
    }
  }, [user]);

  return (
    <StyledAppBar position="fixed">
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ height: '100%' }}>
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/"
            sx={{
              mr: 4,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            GIGHUB
          </Typography>

          <Stack direction="row" spacing={2} sx={{ flexGrow: 1 }}>
            <StyledButton onClick={() => navigate('/jobs')}>Jobs</StyledButton>
            {user?.role === 'student' && (
              <StyledButton onClick={() => navigate('/my-applications')}>My Applications</StyledButton>
            )}
          </Stack>

          <Stack direction="row" spacing={2} alignItems="center">
            {!user ? (
              <>
                <StyledButton onClick={() => navigate('/login')}>Login</StyledButton>
                <StyledButton onClick={() => navigate('/register')}>Register</StyledButton>
              </>
            ) : (
              <>
                {user && <NotificationBell />}
                <IconButton
                  color="inherit"
                  onClick={() => navigate('/messages')}
                  sx={{ 
                    width: 40,
                    height: 40,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    }
                  }}
                >
                  <Badge badgeContent={unreadCount} color="error">
                    <MailIcon />
                  </Badge>
                </IconButton>
                <IconButton 
                  onClick={handleMenu} 
                  sx={{ 
                    p: 0,
                    width: 40,
                    height: 40,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    }
                  }}
                >
                  <Avatar
                    src={user.profilePicture}
                    alt={user.name}
                    sx={{
                      border: '2px solid rgba(255, 255, 255, 0.2)',
                      width: 35,
                      height: 35,
                    }}
                  />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  PaperProps={{
                    sx: {
                      mt: 1.5,
                      minWidth: 180,
                      borderRadius: 1,
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    }
                  }}
                >
                  <MenuItem 
                    onClick={() => { navigate('/profile'); handleClose(); }}
                    sx={{ py: 1.5 }}
                  >
                    Profile
                  </MenuItem>
                  <MenuItem 
                    onClick={handleLogout}
                    sx={{ py: 1.5 }}
                  >
                    Logout
                  </MenuItem>
                </Menu>
              </>
            )}
          </Stack>
        </Toolbar>
      </Container>
    </StyledAppBar>
  );
};

export default Navbar; 