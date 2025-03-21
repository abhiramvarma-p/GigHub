import React from 'react';
import { Box, Container, Typography, Button, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Work, Search, TrendingUp, Person } from '@mui/icons-material';

const HeroSection = styled(Box)(({ theme }) => ({
  minHeight: '90vh',
  display: 'flex',
  alignItems: 'center',
  background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '200%',
    height: '200%',
    transform: 'translate(-50%, -50%)',
    background: 'radial-gradient(circle at center, rgba(255,255,255,0.03) 0%, transparent 70%)',
    animation: 'pulse 15s infinite',
  },
}));

const FeatureCard = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  background: 'rgba(255, 255, 255, 0.02)',
  backdropFilter: 'blur(20px)',
  borderRadius: theme.shape.borderRadius * 2,
  border: '1px solid rgba(255, 255, 255, 0.05)',
  transition: 'transform 0.3s ease-in-out, border-color 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-8px)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
}));

const features = [
  {
    icon: <Work sx={{ fontSize: 40, color: 'rgba(255, 255, 255, 0.9)' }} />,
    title: 'Find Jobs',
    description: 'Discover opportunities that match your skills and experience',
  },
  {
    icon: <Search sx={{ fontSize: 40, color: 'rgba(255, 255, 255, 0.9)' }} />,
    title: 'Smart Search',
    description: 'Advanced filters and AI-powered job recommendations',
  },
  {
    icon: <TrendingUp sx={{ fontSize: 40, color: 'rgba(255, 255, 255, 0.9)' }} />,
    title: 'Skill Analysis',
    description: 'Visual skill tree to track and showcase your expertise',
  },
  {
    icon: <Person sx={{ fontSize: 40, color: 'rgba(255, 255, 255, 0.9)' }} />,
    title: 'Profile Builder',
    description: 'Create a compelling profile to stand out to employers',
  },
];

const Home = () => {
  const navigate = useNavigate();

  return (
    <Box>
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
                    fontWeight: 700,
                    mb: 2,
                    background: 'linear-gradient(45deg, #FFF, rgba(255,255,255,0.7))',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    letterSpacing: '-0.02em',
                  }}
                >
                  Find Your Next
                  <br />
                  Perfect Opportunity
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    mb: 4,
                    color: 'rgba(255,255,255,0.7)',
                    fontWeight: 400,
                    maxWidth: 600,
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
                  }}
                >
                  Explore Jobs
                </Button>
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
              background: 'linear-gradient(45deg, #FFF, rgba(255,255,255,0.7))',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.02em',
            }}
          >
            Why Choose Us
          </Typography>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                >
                  <FeatureCard>
                    {feature.icon}
                    <Typography variant="h5" sx={{ mt: 2, mb: 1, color: 'rgba(255,255,255,0.9)' }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      {feature.description}
                    </Typography>
                  </FeatureCard>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Home; 