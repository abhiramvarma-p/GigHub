import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Chip,
  Button,
  Stack,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const ActiveGigs = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchGigs = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/jobs/recruiter', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setGigs(response.data);
      } catch (error) {
        setError('Failed to fetch gigs. Please try again later.');
        console.error('Error fetching gigs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGigs();
  }, []);

  if (!user || user.role !== 'recruiter') {
    navigate('/');
    return null;
  }

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">Active Gigs</Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/create-job')}
        >
          Create New Gig
        </Button>
      </Box>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {gigs.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="text.secondary">
            You haven't created any gigs yet. Create your first gig to start hiring!
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {gigs.map((gig) => (
            <Grid item xs={12} key={gig._id}>
              <Paper sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      {gig.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {gig.description}
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                      <Chip
                        label={gig.status}
                        color={gig.status === 'Open' ? 'success' : 'default'}
                        size="small"
                      />
                      <Chip
                        label={`${gig.applicants?.length || 0} applications`}
                        size="small"
                      />
                    </Stack>
                    <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                      {gig.requiredSkills.map((skill, index) => (
                        <Chip
                          key={index}
                          label={`${skill.name} (${skill.level})`}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                    </Stack>
                  </Box>
                  <Button
                    variant="outlined"
                    onClick={() => navigate(`/jobs/${gig._id}`)}
                  >
                    View Details
                  </Button>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default ActiveGigs; 