import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Box,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Stack,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/jobs/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setJob(response.data);
    } catch (error) {
      console.error('Error fetching job details:', error);
      setError(error.response?.data?.message || 'Failed to fetch job details');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (user.role !== 'student') {
      setError('Only students can apply for jobs');
      return;
    }

    if (!job) {
      setError('Job details not loaded');
      return;
    }

    if (job.status !== 'Open') {
      setError('This job is no longer accepting applications');
      return;
    }

    const hasApplied = job.applicants?.some(a => a.student === user._id);
    if (hasApplied) {
      setError('You have already applied for this job');
      return;
    }

    setError(''); // Clear any previous errors
    setApplying(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5000/api/jobs/${id}/apply`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      // Refresh job details to update application status
      await fetchJobDetails();
    } catch (error) {
      console.error('Error applying for job:', error);
      const errorMessage = error.response?.data?.message || 'Failed to apply for the job';
      setError(errorMessage);
    } finally {
      setApplying(false);
    }
  };

  const handleUpdateApplicationStatus = async (applicationId, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:5000/api/jobs/${id}/applications/${applicationId}`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      // Refresh job details to show updated status
      fetchJobDetails();
    } catch (error) {
      console.error('Error updating application status:', error);
      setError(error.response?.data?.message || 'Failed to update application status');
    }
  };

  const handleDeleteJob = async () => {
    if (!window.confirm('Are you sure you want to delete this gig?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/jobs/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/jobs');
    } catch (error) {
      console.error('Error deleting job:', error);
      setError(error.response?.data?.message || 'Failed to delete the job');
    }
  };

  const hasApplied = job?.applicants?.some(a => a.student === user?._id);
  const applicationStatus = hasApplied 
    ? job?.applicants?.find(a => a.student === user?._id)?.status 
    : null;

  const renderApplications = () => {
    if (!job.applicants || job.applicants.length === 0) {
      return (
        <Typography color="text.secondary">
          No applications yet.
        </Typography>
      );
    }

    return (
      <Stack spacing={2}>
        {job.applicants.map((application) => (
          <Paper key={application._id} sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant="subtitle1">
                  {application.student.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {application.student.college}
                </Typography>
                <Chip
                  label={application.status}
                  color={
                    application.status === 'Pending'
                      ? 'warning'
                      : application.status === 'Accepted'
                      ? 'success'
                      : 'error'
                  }
                  size="small"
                  sx={{ mt: 1 }}
                />
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => navigate(`/profile/${application.student._id}`)}
                >
                  View Profile
                </Button>
                {isRecruiter && application.status === 'Pending' && (
                  <>
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      onClick={() => handleUpdateApplicationStatus(application._id, 'Accepted')}
                    >
                      Accept
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      onClick={() => handleUpdateApplicationStatus(application._id, 'Rejected')}
                    >
                      Reject
                    </Button>
                  </>
                )}
              </Box>
            </Box>
          </Paper>
        ))}
      </Stack>
    );
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!job) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">Job not found</Alert>
      </Container>
    );
  }

  const isRecruiter = user && job.recruiter._id === user._id;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <Box>
            <Typography variant="h4" gutterBottom>
              {job.title}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Posted by{' '}
              <Button
                color="primary"
                onClick={() => navigate(`/profile/${job.recruiter._id}`)}
                sx={{ textTransform: 'none', p: 0, minWidth: 'auto' }}
              >
                {job.recruiter?.name}
              </Button>
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Chip
              label={job.status}
              color={job.status === 'Open' ? 'success' : 'default'}
              size="small"
            />
            {isRecruiter && (
              <>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => navigate(`/jobs/${id}/edit`)}
                >
                  Edit
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={handleDeleteJob}
                >
                  Delete
                </Button>
              </>
            )}
          </Box>
        </Box>

        <Chip
          label={job.category}
          color="primary"
          variant="outlined"
          size="small"
          sx={{ mb: 2 }}
        />

        <Typography variant="body1" paragraph>
          {job.description}
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Required Skills
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {job.requiredSkills.map((skill, index) => (
              <Chip
                key={index}
                label={`${skill.name} (${skill.level})`}
                variant="outlined"
              />
            ))}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Typography variant="body1">
            <strong>Pay:</strong> ₹{job.pay ? job.pay.amount.toLocaleString() : 'Not specified'}
            {job.pay?.type === 'hourly' ? '/hour' : ' (fixed)'}
          </Typography>
          <Typography variant="body1">
            <strong>Duration:</strong> {job.duration} weeks
          </Typography>
          <Typography variant="body1">
            <strong>Applications:</strong> {job.applicants?.length || 0}
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Applications
          </Typography>
          {renderApplications()}
        </Box>

        {user?.role === 'student' && (
          <Box sx={{ mt: 3 }}>
            {hasApplied ? (
              <Alert severity="info">
                You have already applied for this position. Status: {applicationStatus}
              </Alert>
            ) : (
              <Button
                variant="contained"
                onClick={handleApply}
                disabled={applying || job.status !== 'Open'}
              >
                {applying ? 'Applying...' : 'Apply Now'}
              </Button>
            )}
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default JobDetail; 