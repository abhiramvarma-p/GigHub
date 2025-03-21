import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Chip,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Grid,
  Divider,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const MyApplications = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.role === 'student') {
      fetchApplications();
    }
  }, [user]);

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/jobs/student/my-applications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApplications(response.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
      setError(error.response?.data?.message || 'Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Accepted':
        return 'success';
      case 'Rejected':
        return 'error';
      case 'Pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  if (!user || user.role !== 'student') {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">This page is only accessible to students.</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Applications
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : applications.length > 0 ? (
        <Grid container spacing={3}>
          {applications.map((job) => (
            <Grid item xs={12} key={job._id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        {job.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Posted by {job.recruiter.name}
                      </Typography>
                    </Box>
                    <Chip
                      label={job.applicants?.find(a => a.student === user._id)?.status || 'Unknown'}
                      color={getStatusColor(job.applicants?.find(a => a.student === user._id)?.status)}
                      size="small"
                    />
                  </Box>

                  <Chip
                    label={job.category}
                    color="primary"
                    variant="outlined"
                    size="small"
                    sx={{ mb: 2 }}
                  />

                  <Typography variant="body2" paragraph>
                    {job.description}
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <Typography variant="body2">
                      <strong>Pay:</strong> ₹{job.pay?.amount?.toLocaleString() || 'Not specified'}
                      {job.pay?.type === 'hourly' ? '/hour' : ''}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Duration:</strong> {job.duration} weeks
                    </Typography>
                    <Typography variant="body2">
                      <strong>Applied:</strong> {new Date(job.applicants?.find(a => a.student === user._id)?.appliedAt || Date.now()).toLocaleDateString()}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {job.requiredSkills.map((skill, index) => (
                      <Chip
                        key={index}
                        label={`${skill.name} (${skill.level})`}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="text.secondary">
            You haven't applied for any gigs yet.
          </Typography>
        </Paper>
      )}
    </Container>
  );
};

export default MyApplications; 