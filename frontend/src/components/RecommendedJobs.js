import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  CircularProgress,
  Alert,
  CardActionArea,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RecommendedJobs = () => {
  const navigate = useNavigate();
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRecommendedJobs();
  }, []);

  const fetchRecommendedJobs = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/users/recommended-jobs', {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Take only the top 3 jobs
      setRecommendedJobs(response.data.slice(0, 3));
    } catch (error) {
      console.error('Error fetching recommended jobs:', error);
      setError(error.response?.data?.message || 'Failed to fetch recommended jobs');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Recommended Jobs
      </Typography>
      <Grid container spacing={3}>
        {recommendedJobs.map((job) => (
          <Grid item xs={12} md={4} key={job._id}>
            <Card>
              <CardActionArea onClick={() => navigate(`/jobs/${job._id}`)}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {job.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {job.company}
                  </Typography>
                  <Chip
                    label={job.category}
                    color="primary"
                    size="small"
                    sx={{ mb: 2 }}
                  />
                  <Typography variant="body2" paragraph>
                    {job.description.substring(0, 150)}...
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Typography variant="body2">
                      <strong>Pay:</strong> ₹{job.pay?.amount?.toLocaleString() || 'Not specified'}
                      {job.pay?.type === 'hourly' ? '/hour' : ''}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Duration:</strong> {job.duration} weeks
                    </Typography>
                  </Box>
                  <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {job.requiredSkills.slice(0, 3).map((skill, index) => (
                      <Chip
                        key={index}
                        label={`${skill.name} (${skill.level})`}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default RecommendedJobs; 