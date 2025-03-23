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
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { styled } from '@mui/material/styles';
import NotificationBell from './NotificationBell';
import { AccountCircle, Mail as MailIcon } from '@mui/icons-material';
import axios from 'axios';
import Logo from './Logo';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: '#212121',
  borderBottom: '1px solid #A35C7A',
  zIndex: theme.zIndex.drawer + 1,
  height: '64px',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  color: '#FEF6EB',
  padding: '6px 16px',
  fontFamily: 'Futura',
  fontSize: '0.9rem',
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
  fontWeight: 500,
  '&:hover': {
    backgroundColor: '#A35C7A',
  },
}));

const NavText = styled(Typography)({
  fontFamily: 'Futura',
  fontSize: '0.9rem',
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
  fontWeight: 500,
});

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
          <Box
            component={RouterLink}
            to="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            <img
              src="/gighub-logo.png"
              alt="GigHub"
              style={{
                width: '40px',
                height: '40px',
                marginRight: '16px',
                cursor: 'pointer',
                borderRadius: '50%',
                border: '2px solid #A35C7A',
                padding: '2px',
                background: '#FEF6EB',
              }}
            />
          </Box>

          <Stack direction="row" spacing={2} sx={{ ml: 2 }}>
            <StyledButton
              onClick={() => navigate('/jobs')}
              sx={{ display: { xs: 'none', sm: 'block' } }}
            >
              Jobs
            </StyledButton>
            {user && (
              <>
                <StyledButton
                  onClick={() => navigate('/my-applications')}
                  sx={{ display: { xs: 'none', sm: 'block' } }}
                >
                  My Applications
                </StyledButton>
                {user.role === 'recruiter' && (
                  <StyledButton
                    onClick={() => navigate('/create-job')}
                    sx={{ display: { xs: 'none', sm: 'block' } }}
                  >
                    Post a Job
                  </StyledButton>
                )}
                {user.role === 'student' && (
                  <StyledButton
                    onClick={() => navigate('/dashboard')}
                    sx={{ display: { xs: 'none', sm: 'block' } }}
                  >
                    Dashboard
                  </StyledButton>
                )}
              </>
            )}
          </Stack>

          <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 2 }}>
            {user ? (
              <>
                <NotificationBell />
                <IconButton
                  onClick={() => navigate('/messages')}
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
                      backgroundColor: '#A35C7A',
                    }
                  }}
                >
                  <Avatar
                    src={user.profilePicture}
                    alt={user.name}
                    sx={{
                      border: '2px solid #A35C7A',
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
                      background: '#212121',
                      color: '#FEF6EB',
                      border: '1px solid #A35C7A',
                      '& .MuiMenuItem-root': {
                        color: '#FEF6EB',
                        fontFamily: 'Futura',
                        fontSize: '0.9rem',
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase',
                        '&:hover': {
                          backgroundColor: '#A35C7A',
                        },
                      },
                    }
                  }}
                >
                  <MenuItem onClick={() => {
                    handleClose();
                    navigate(`/profile/${user._id}`);
                  }}>
                    <NavText>Profile</NavText>
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <NavText>Logout</NavText>
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <StyledButton
                  onClick={() => navigate('/login')}
                  sx={{ display: { xs: 'none', sm: 'block' } }}
                >
                  Login
                </StyledButton>
                <StyledButton
                  onClick={() => navigate('/register')}
                  sx={{ display: { xs: 'none', sm: 'block' } }}
                >
                  Register
                </StyledButton>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </StyledAppBar>
  );
};

export default Navbar; 