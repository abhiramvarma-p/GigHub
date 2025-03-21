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
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openApplicationDialog, setOpenApplicationDialog] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState('Pending');

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/jobs/${id}`);
      setJob(response.data);
    } catch (error) {
      setError('Failed to fetch job details');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    try {
      await axios.post(
        `http://localhost:5000/api/jobs/${id}/apply`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );
      setOpenApplicationDialog(false);
      fetchJobDetails(); // Refresh job details to show updated applicants
    } catch (error) {
      setError('Failed to apply for the job');
      console.error('Error:', error);
    }
  };

  const handleUpdateApplicationStatus = async (applicationId, status) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/jobs/${id}/applications/${applicationId}`,
        { status },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );
      fetchJobDetails(); // Refresh job details
    } catch (error) {
      setError('Failed to update application status');
      console.error('Error:', error);
    }
  };

  if (loading) {
    return (
      <Container>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  if (!job) {
    return (
      <Container>
        <Typography>Job not found</Typography>
      </Container>
    );
  }

  const isEmployer = user && job.employer._id === user.id;
  const hasApplied = job.applicants.some(
    (applicant) => applicant.student._id === user?.id
  );
  const application = job.applicants.find(
    (applicant) => applicant.student._id === user?.id
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Job Details */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h4" component="h1">
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

            <Typography variant="subtitle1" color="text.secondary" paragraph>
              Posted by {job.employer.name} on{' '}
              {new Date(job.createdAt).toLocaleDateString()}
            </Typography>

            <Typography variant="h6" gutterBottom>
              Description
            </Typography>
            <Typography paragraph>{job.description}</Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" gutterBottom>
              Required Skills
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              {job.requiredSkills.map((skill, index) => (
                <Chip
                  key={index}
                  label={`${skill.name} (${skill.level})`}
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <Typography variant="subtitle1">
                Budget: <strong>${job.budget}</strong>
              </Typography>
              <Typography variant="subtitle1">
                Duration: <strong>{job.duration}</strong>
              </Typography>
              <Typography variant="subtitle1">
                Deadline:{' '}
                <strong>
                  {new Date(job.deadline).toLocaleDateString()}
                </strong>
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Application Section */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            {isEmployer ? (
              <>
                <Typography variant="h6" gutterBottom>
                  Applicants
                </Typography>
                <List>
                  {job.applicants.map((applicant) => (
                    <ListItem key={applicant.student._id}>
                      <ListItemText
                        primary={applicant.student.name}
                        secondary={
                          <>
                            <Typography component="span" variant="body2">
                              Applied: {new Date(applicant.appliedAt).toLocaleDateString()}
                            </Typography>
                            <br />
                            <Typography component="span" variant="body2">
                              Status: {applicant.status}
                            </Typography>
                          </>
                        }
                      />
                      <ListItemSecondaryAction>
                        <FormControl size="small">
                          <Select
                            value={applicant.status}
                            onChange={(e) =>
                              handleUpdateApplicationStatus(
                                applicant._id,
                                e.target.value
                              )
                            }
                          >
                            <MenuItem value="Pending">Pending</MenuItem>
                            <MenuItem value="Accepted">Accept</MenuItem>
                            <MenuItem value="Rejected">Reject</MenuItem>
                          </Select>
                        </FormControl>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              </>
            ) : (
              <>
                {hasApplied ? (
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Application Status
                    </Typography>
                    <Typography
                      color={
                        application.status === 'Accepted'
                          ? 'success.main'
                          : application.status === 'Rejected'
                          ? 'error.main'
                          : 'primary.main'
                      }
                    >
                      {application.status}
                    </Typography>
                  </Box>
                ) : (
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Apply for this Job
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={() => setOpenApplicationDialog(true)}
                      disabled={!user || job.status !== 'Open'}
                    >
                      {!user
                        ? 'Login to Apply'
                        : job.status !== 'Open'
                        ? 'Job Closed'
                        : 'Apply Now'}
                    </Button>
                  </Box>
                )}
              </>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Application Dialog */}
      <Dialog
        open={openApplicationDialog}
        onClose={() => setOpenApplicationDialog(false)}
      >
        <DialogTitle>Apply for {job.title}</DialogTitle>
        <DialogContent>
          <Typography variant="body1" paragraph>
            Are you sure you want to apply for this job? Your profile will be
            shared with the employer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenApplicationDialog(false)}>Cancel</Button>
          <Button onClick={handleApply} variant="contained" color="primary">
            Apply
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default JobDetail; 