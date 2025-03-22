import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Box,
  Chip,
  Stack,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment,
  IconButton,
  Card,
  CardContent,
  CardActions,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { predefinedCategories } from '../data/predefinedCategories';

const CATEGORIES = predefinedCategories.map(category => category.name);

const Jobs = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [applyingJobId, setApplyingJobId] = useState(null);

  useEffect(() => {
    if (user) {
      fetchJobs();
    }
  }, [user]);

  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem('token');
      let url = 'http://localhost:5000/api/jobs';
      
      // If user is a recruiter, only fetch their jobs
      if (user?.role === 'recruiter' && user?._id) {
        url = `http://localhost:5000/api/jobs/recruiter/${user._id}`;
      }

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Jobs:', response.data);
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setError(error.response?.data?.message || 'Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this gig?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/jobs/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Update the jobs state by filtering out the deleted job
      setJobs(prevJobs => prevJobs.filter(job => job._id !== jobId));
    } catch (error) {
      console.error('Error deleting job:', error);
      setError(error.response?.data?.message || 'Failed to delete job');
    }
  };

  const handleApply = async (jobId) => {
    if (!user) {
      navigate('/login');
      return;
    }

    setApplyingJobId(jobId);
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5000/api/jobs/${jobId}/apply`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      // Refresh jobs to update application status
      fetchJobs();
    } catch (error) {
      console.error('Error applying for job:', error);
      setError(error.response?.data?.message || 'Failed to apply for the job');
    } finally {
      setApplyingJobId(null);
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || job.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const renderJobCard = (job) => (
    <Card key={job._id} sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h6" gutterBottom>
              {job.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Posted by{' '}
              <Button
                color="primary"
                onClick={() => navigate(`/profile/${job.recruiter._id}`)}
                sx={{ textTransform: 'none', p: 0, minWidth: 'auto' }}
              >
                {job.recruiter.name}
              </Button>
            </Typography>
          </Box>
          <Chip
            label={job.category}
            color="primary"
            size="small"
            sx={{ ml: 1 }}
          />
        </Box>

        <Typography variant="body2" color="text.secondary" paragraph>
          {job.description}
        </Typography>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Typography variant="body2">
            <strong>Pay:</strong> ₹{job.pay ? job.pay.amount.toLocaleString() : 'Not specified'}
            {job.pay?.type === 'hourly' ? '/hour' : ''}
          </Typography>
          <Typography variant="body2">
            <strong>Duration:</strong> {job.duration} weeks
          </Typography>
          {job.applicants && (
            <Typography variant="body2">
              <strong>Applications:</strong> {job.applicants.length}
            </Typography>
          )}
        </Box>

        {user?.role === 'student' && job.applicants?.some(a => a.student === user._id) && (
          <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
            Status: {job.applicants.find(a => a.student === user._id).status}
          </Typography>
        )}
      </CardContent>
      
      <Divider />
      
      <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
        {user?.role === 'recruiter' ? (
          <>
            <Button
              size="small"
              startIcon={<EditIcon />}
              onClick={() => navigate(`/jobs/${job._id}/edit`)}
            >
              Edit
            </Button>
            <Button
              size="small"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => handleDeleteJob(job._id)}
            >
              Delete
            </Button>
            <Button
              size="small"
              variant="contained"
              onClick={() => navigate(`/jobs/${job._id}`)}
            >
              View Applications ({job.applicants?.length || 0})
            </Button>
          </>
        ) : (
          <Button
            size="small"
            variant="contained"
            onClick={() => navigate(`/jobs/${job._id}`)}
            disabled={job.applicants?.some(a => a.student === user?._id)}
          >
            {job.applicants?.some(a => a.student === user?._id)
              ? job.updatedAt > job.applicants.find(a => a.student === user?._id).appliedAt
                ? 'Apply Again'
                : 'Already Applied'
              : 'Apply Now'}
          </Button>
        )}
      </CardActions>
    </Card>
  );

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">
          {user?.role === 'recruiter' ? 'My Gigs' : 'Available Gigs'}
        </Typography>
        {user?.role === 'recruiter' && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/create-job')}
          >
            Create New Gig
          </Button>
        )}
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Filters
            </Typography>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                label="Category"
              >
                <MenuItem value="">All Categories</MenuItem>
                {CATEGORIES.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Paper>
        </Grid>

        <Grid item xs={12} md={9}>
          <Paper sx={{ p: 2, mb: 3 }}>
            <TextField
              fullWidth
              placeholder="Search gigs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Paper>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
            </Box>
          ) : filteredJobs.length > 0 ? (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                {filteredJobs.map(renderJobCard)}
              </Grid>
            </Grid>
          ) : (
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography color="text.secondary">
                {searchTerm || selectedCategory
                  ? 'No gigs match your search criteria'
                  : user?.role === 'recruiter'
                  ? "You haven't created any gigs yet"
                  : 'No gigs available at the moment'}
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default Jobs; 