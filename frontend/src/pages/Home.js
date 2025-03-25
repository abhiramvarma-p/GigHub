import React from 'react';
import { Box, Container, Typography, Button, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Work, Search, TrendingUp, Person } from '@mui/icons-material';
import GigAI from '../components/Chatbot';

const HeroSection = styled(Box)(({ theme }) => ({
  width: '100%',
  minHeight: '90vh',
  display: 'flex',
  alignItems: 'center',
  background: '#FEF6EB',
  position: 'relative',
  padding: theme.spacing(4),
}));

const HomeImage = styled('img')({
  width: '100%',
  maxWidth: '600px',
  height: 'auto',
  objectFit: 'contain',
  marginBottom: '2rem',
});

const FeatureCard = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  background: '#212121',
  borderRadius: theme.shape.borderRadius * 2,
  border: '1px solid #A35C7A',
  transition: 'transform 0.3s ease-in-out, border-color 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-8px)',
    borderColor: '#C890A7',
    background: '#A35C7A',
    '& .MuiTypography-root': {
      color: '#FEF6EB',
    },
    '& .MuiSvgIcon-root': {
      color: '#FEF6EB',
    }
  },
}));

const features = [
  {
    icon: <Work sx={{ fontSize: 40, color: '#A35C7A' }} />,
    title: 'Find Jobs',
    description: 'Discover opportunities that match your skills and experience',
  },
  {
    icon: <Search sx={{ fontSize: 40, color: '#A35C7A' }} />,
    title: 'Smart Search',
    description: 'Advanced filters and AI-powered job recommendations',
  },
  {
    icon: <TrendingUp sx={{ fontSize: 40, color: '#A35C7A' }} />,
    title: 'Skill Analysis',
    description: 'Visual skill tree to track and showcase your expertise',
  },
  {
    icon: <Person sx={{ fontSize: 40, color: '#A35C7A' }} />,
    title: 'Profile Builder',
    description: 'Create a compelling profile to stand out to employers',
  },
];

const Home = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ background: '#FEF6EB', minHeight: '100vh' }}>
      <HeroSection>
        <Container>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                    fontWeight: 600,
                    color: '#212121',
                    letterSpacing: '0.02em',
                    marginBottom: '1.5rem',
                    textTransform: 'uppercase',
                  }}
                >
                  Branch Out.
                  <br />
                  Stand Out.
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    color: '#A35C7A',
                    fontWeight: 400,
                    maxWidth: '600px',
                    marginBottom: '2rem',
                    letterSpacing: '0.02em',
                  }}
                >
                  Connect with top companies and showcase your skills
                  with our innovative skill tree visualization
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/jobs')}
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 500,
                    bgcolor: '#A35C7A',
                    color: '#FEF6EB',
                    letterSpacing: '0.05em',
                    '&:hover': {
                      bgcolor: '#C890A7',
                    },
                  }}
                >
                  Explore Jobs
                </Button>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                style={{ textAlign: 'center' }}
              >
                <HomeImage src="/home-image.png" alt="GigHub Platform" />
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </HeroSection>

      <Container sx={{ py: 12 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Typography
            variant="h2"
            align="center"
            sx={{
              mb: 8,
              color: '#212121',
              letterSpacing: '0.02em',
              textTransform: 'uppercase',
              fontWeight: 600,
            }}
          >
            Why Choose Us
          </Typography>

          <Grid container spacing={4} justifyContent="center">
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  style={{ height: '100%' }}
                >
                  <FeatureCard>
                    {feature.icon}
                    <Typography variant="h5" sx={{ 
                      mt: 2, 
                      mb: 1, 
                      color: '#FEF6EB',
                      letterSpacing: '0.02em',
                      fontWeight: 500,
                    }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body1" sx={{ 
                      color: '#C890A7',
                      letterSpacing: '0.02em',
                    }}>
                      {feature.description}
                    </Typography>
                  </FeatureCard>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>
      <GigAI />
    </Box>
  );
};

export default Home; 