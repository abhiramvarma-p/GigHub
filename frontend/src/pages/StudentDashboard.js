import React from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  Stack,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import RecommendedJobs from '../components/RecommendedJobs';
import { Work as WorkIcon, School as SchoolIcon, Person as PersonIcon } from '@mui/icons-material';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!user || user.role !== 'student') {
    navigate('/');
    return null;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Welcome, {user.name}!
      </Typography>

      <Grid container spacing={3}>
        {/* Quick Actions */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                startIcon={<WorkIcon />}
                onClick={() => navigate('/jobs')}
              >
                Browse Jobs
              </Button>
              <Button
                variant="outlined"
                startIcon={<SchoolIcon />}
                onClick={() => navigate('/my-applications')}
              >
                My Applications
              </Button>
              <Button
                variant="outlined"
                startIcon={<PersonIcon />}
                onClick={() => navigate('/profile')}
              >
                Edit Profile
              </Button>
            </Stack>
          </Paper>
        </Grid>

        {/* Recommended Jobs */}
        <Grid item xs={12}>
          <RecommendedJobs />
        </Grid>

        {/* Recent Applications */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Recent Applications
              </Typography>
              <Button
                variant="text"
                onClick={() => navigate('/my-applications')}
              >
                View All
              </Button>
            </Box>
            {/* Add a component to show recent applications here */}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default StudentDashboard; 