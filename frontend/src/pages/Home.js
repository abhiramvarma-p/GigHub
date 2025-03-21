import React from 'react';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const features = [
    {
      title: 'Find Your Next Gig',
      description: 'Browse through hundreds of opportunities posted by employers looking for your skills.',
      image: 'https://source.unsplash.com/random/400x300?job',
    },
    {
      title: 'Showcase Your Skills',
      description: 'Create a professional profile and display your skills in an interactive skill tree.',
      image: 'https://source.unsplash.com/random/400x300?skills',
    },
    {
      title: 'Get Paid for Your Work',
      description: 'Earn money while building your portfolio and gaining valuable experience.',
      image: 'https://source.unsplash.com/random/400x300?money',
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          mb: 6,
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" gutterBottom>
            Welcome to Skill Marketplace
          </Typography>
          <Typography variant="h5" gutterBottom>
            Connect with opportunities that match your skills
          </Typography>
          <Box sx={{ mt: 4 }}>
            {!user ? (
              <Button
                variant="contained"
                color="secondary"
                size="large"
                onClick={() => navigate('/register')}
              >
                Get Started
              </Button>
            ) : (
              <Button
                variant="contained"
                color="secondary"
                size="large"
                onClick={() => navigate('/jobs')}
              >
                Browse Jobs
              </Button>
            )}
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Typography variant="h4" component="h2" gutterBottom align="center">
          Why Choose Skill Marketplace?
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card sx={{ height: '100%' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={feature.image}
                  alt={feature.title}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h3">
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box sx={{ bgcolor: 'grey.100', py: 8 }}>
        <Container maxWidth="md">
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h4" component="h2" gutterBottom>
              Ready to Get Started?
            </Typography>
            <Typography variant="body1" paragraph>
              Join our community of students and employers today.
            </Typography>
            <Box sx={{ mt: 2 }}>
              {!user ? (
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={() => navigate('/register')}
                >
                  Create Account
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={() => navigate('/profile')}
                >
                  View Profile
                </Button>
              )}
            </Box>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default Home; 