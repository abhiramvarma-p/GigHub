import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Link,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { styled } from '@mui/material/styles';

const StyledContainer = styled(Container)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 'calc(100vh - 64px)', // Subtract navbar height
  padding: theme.spacing(3),
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  background: '#212121',
  backdropFilter: 'blur(20px)',
  border: '1px solid #A35C7A',
  borderRadius: 16,
  maxWidth: 400,
  width: '100%',
}));

const StyledForm = styled('form')(({ theme }) => ({
  width: '100%',
  marginTop: theme.spacing(1),
}));

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledContainer component="main" maxWidth="xs">
      <StyledPaper>
        <Typography component="h1" variant="h4" gutterBottom sx={{ fontWeight: 700, color: '#FEF6EB' }}>
          Welcome Back
        </Typography>
        <Typography variant="body2" sx={{ mb: 4, color: '#FEF6EB' }}>
          Sign in to continue to GigHub
        </Typography>

        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {error}
          </Alert>
        )}

        <StyledForm onSubmit={handleSubmit}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={formData.email}
            onChange={handleChange}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                },
              },
              '& .MuiInputLabel-root': {
                color: '#FEF6EB',
                '&.Mui-required': {
                  '& .MuiInputLabel-asterisk': {
                    color: '#A35C7A',
                  },
                },
              },
              '& .MuiOutlinedInput-input': {
                color: '#FEF6EB',
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255, 255, 255, 0.2)',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#A35C7A',
              },
              '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#A35C7A',
              },
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                },
              },
              '& .MuiInputLabel-root': {
                color: '#FEF6EB',
                '&.Mui-required': {
                  '& .MuiInputLabel-asterisk': {
                    color: '#A35C7A',
                  },
                },
              },
              '& .MuiOutlinedInput-input': {
                color: '#FEF6EB',
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255, 255, 255, 0.2)',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#A35C7A',
              },
              '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#A35C7A',
              },
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ 
              mt: 3, 
              mb: 2, 
              py: 1.5,
              bgcolor: '#A35C7A',
              color: '#FEF6EB',
              '&:hover': {
                bgcolor: '#C890A7',
              },
            }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Sign In'}
          </Button>
          <Box sx={{ textAlign: 'center' }}>
            <Link
              component="button"
              variant="body2"
              onClick={() => navigate('/register')}
              sx={{
                color: '#FEF6EB',
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              Don't have an account? Sign Up
            </Link>
          </Box>
        </StyledForm>
      </StyledPaper>
    </StyledContainer>
  );
};

export default Login; 