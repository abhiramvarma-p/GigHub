import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Slider,
  Paper,
} from '@mui/material';
import axios from 'axios';

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'Open',
    skills: '',
    budget: 1000,
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, [filters]);

  const fetchJobs = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/jobs', {
        params: filters,
      });
      setJobs(response.data);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBudgetChange = (event, newValue) => {
    setFilters((prev) => ({
      ...prev,
      budget: newValue,
    }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <Container>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Filters */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Filters
            </Typography>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                label="Status"
              >
                <MenuItem value="Open">Open</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
                <MenuItem value="Cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Skills (comma-separated)"
              name="skills"
              value={filters.skills}
              onChange={handleFilterChange}
              sx={{ mb: 2 }}
            />

            <Typography gutterBottom>Budget Range</Typography>
            <Slider
              value={filters.budget}
              onChange={handleBudgetChange}
              min={0}
              max={5000}
              step={100}
              valueLabelDisplay="auto"
              sx={{ mb: 2 }}
            />
            <Typography variant="body2" color="text.secondary">
              Max: ${filters.budget}
            </Typography>
          </Paper>
        </Grid>

        {/* Job Listings */}
        <Grid item xs={12} md={9}>
          <Grid container spacing={2}>
            {jobs.map((job) => (
              <Grid item xs={12} key={job._id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="h5" component="h2">
                        {job.title}
                      </Typography>
                      <Chip
                        label={job.status}
                        color={
                          job.status === 'Open'
                            ? 'success'
                            : job.status === 'In Progress'
                            ? 'primary'
                            : job.status === 'Completed'
                            ? 'info'
                            : 'error'
                        }
                      />
                    </Box>

                    <Typography variant="body2" color="text.secondary" paragraph>
                      Posted by {job.employer.name} on {formatDate(job.createdAt)}
                    </Typography>

                    <Typography variant="body1" paragraph>
                      {job.description}
                    </Typography>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Required Skills:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {job.requiredSkills.map((skill, index) => (
                          <Chip
                            key={index}
                            label={`${skill.name} (${skill.level})`}
                            size="small"
                          />
                        ))}
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="subtitle1" color="primary">
                          Budget: ${job.budget}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Duration: {job.duration}
                        </Typography>
                      </Box>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate(`/jobs/${job._id}`)}
                      >
                        View Details
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default JobList; 