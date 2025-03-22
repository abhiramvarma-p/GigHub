import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Stack,
  Alert,
  InputAdornment,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { predefinedCategories } from '../data/predefinedCategories';

const CATEGORIES = predefinedCategories.map(category => category.name);

const EditJob = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    category: '',
    pay: {
      amount: '',
      type: 'fixed'
    },
    duration: '',
    requiredSkills: [],
    location: '',
    type: 'remote',
    experience: 'Beginner',
    deadline: '',
    status: 'Open'
  });
  const [newSkill, setNewSkill] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/jobs/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const jobData = response.data;
      
      // Set form data with proper defaults
      setFormData({
        title: jobData.title || '',
        description: jobData.description || '',
        requirements: jobData.requirements || '',
        pay: {
          amount: jobData.pay?.amount || '',
          type: jobData.pay?.type || 'fixed'
        },
        duration: jobData.duration || '',
        category: jobData.category || '',
        deadline: jobData.deadline ? new Date(jobData.deadline).toISOString().split('T')[0] : '',
        status: jobData.status || 'Open',
        requiredSkills: jobData.requiredSkills?.map(skill => skill.name) || [],
        experience: jobData.requiredSkills?.[0]?.level || 'Beginner'
      });
    } catch (error) {
      console.error('Error fetching job details:', error);
      setError(error.response?.data?.message || 'Failed to fetch job details');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (newSkill.trim() && !formData.requiredSkills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        requiredSkills: [...prev.requiredSkills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      requiredSkills: prev.requiredSkills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      setLoading(true);

      if (!formData.title || !formData.description || !formData.requirements || 
          !formData.pay.amount || !formData.duration || !formData.category || !formData.deadline) {
        setError('Please fill in all required fields');
        return;
      }

      const jobData = {
        ...formData,
        pay: {
          amount: Number(formData.pay.amount),
          type: formData.pay.type
        },
        duration: Number(formData.duration),
        deadline: new Date(formData.deadline).toISOString(),
        requiredSkills: formData.requiredSkills.map(skill => ({
          name: skill,
          level: formData.experience
        }))
      };

      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:5000/api/jobs/${id}`,
        jobData,
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setSuccess('Job updated successfully!');
      setTimeout(() => {
        navigate('/jobs');
      }, 2000);
    } catch (error) {
      console.error('Error updating job:', error);
      setError(error.response?.data?.message || 'Failed to update job');
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'recruiter') {
    return null;
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Edit Job
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Job Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  label="Category"
                >
                  {CATEGORIES.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                multiline
                rows={4}
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                multiline
                rows={4}
                label="Requirements"
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Pay Type</InputLabel>
                <Select
                  name="pay.type"
                  value={formData.pay.type}
                  onChange={handleChange}
                  label="Pay Type"
                >
                  <MenuItem value="fixed">Fixed Pay</MenuItem>
                  <MenuItem value="hourly">Hourly Rate</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={`${formData.pay.type === 'hourly' ? 'Hourly Rate' : 'Fixed Pay'} (₹)`}
                name="pay.amount"
                type="number"
                value={formData.pay.amount}
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                }}
                inputProps={{ min: 0 }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Duration (weeks)"
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                required
                inputProps={{ min: 1 }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Experience Level</InputLabel>
                <Select
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  label="Experience Level"
                >
                  <MenuItem value="Beginner">Beginner</MenuItem>
                  <MenuItem value="Intermediate">Intermediate</MenuItem>
                  <MenuItem value="Advanced">Advanced</MenuItem>
                  <MenuItem value="Expert">Expert</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Work Type</InputLabel>
                <Select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  label="Work Type"
                >
                  <MenuItem value="remote">Remote</MenuItem>
                  <MenuItem value="hybrid">Hybrid</MenuItem>
                  <MenuItem value="onsite">On-site</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ mb: 1 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Required Skills
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    fullWidth
                    label="Add Skill"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSkill(e);
                      }
                    }}
                  />
                  <Button
                    onClick={handleAddSkill}
                    variant="contained"
                    disabled={!newSkill.trim()}
                  >
                    Add
                  </Button>
                </Box>
              </Box>
              <Stack direction="row" spacing={1} flexWrap="wrap" gap={1} sx={{ mt: 1 }}>
                {formData.requiredSkills.map((skill) => (
                  <Chip
                    key={skill}
                    label={skill}
                    onDelete={() => handleRemoveSkill(skill)}
                  />
                ))}
              </Stack>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/jobs')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                >
                  Update Job
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default EditJob; 