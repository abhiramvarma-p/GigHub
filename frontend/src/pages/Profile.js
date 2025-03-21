import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import Tree from 'react-d3-tree';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [profileData, setProfileData] = useState({
    name: '',
    college: '',
    major: '',
    graduationYear: '',
    bio: '',
    contactInfo: {
      phone: '',
      linkedin: '',
      github: '',
      website: '',
    },
  });
  const [skills, setSkills] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [previousGigs, setPreviousGigs] = useState([]);
  const [openSkillDialog, setOpenSkillDialog] = useState(false);
  const [openPortfolioDialog, setOpenPortfolioDialog] = useState(false);
  const [newSkill, setNewSkill] = useState({ name: '', level: 'Beginner', subSkills: [] });
  const [newPortfolioItem, setNewPortfolioItem] = useState({
    title: '',
    description: '',
    imageUrl: '',
    projectUrl: '',
    technologies: [],
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        college: user.college || '',
        major: user.major || '',
        graduationYear: user.graduationYear || '',
        bio: user.bio || '',
        contactInfo: user.contactInfo || {
          phone: '',
          linkedin: '',
          github: '',
          website: '',
        },
      });
      setSkills(user.skills || []);
      setPortfolio(user.portfolio || []);
      setPreviousGigs(user.previousGigs || []);
    }
  }, [user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(profileData);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleAddSkill = async () => {
    try {
      const updatedSkills = [...skills, newSkill];
      await axios.patch(
        'http://localhost:5000/api/users/skills',
        { skills: updatedSkills },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );
      setSkills(updatedSkills);
      setOpenSkillDialog(false);
      setNewSkill({ name: '', level: 'Beginner', subSkills: [] });
    } catch (error) {
      console.error('Failed to add skill:', error);
    }
  };

  const handleAddPortfolioItem = async () => {
    try {
      const updatedPortfolio = [...portfolio, newPortfolioItem];
      await axios.post(
        'http://localhost:5000/api/users/portfolio',
        newPortfolioItem,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );
      setPortfolio(updatedPortfolio);
      setOpenPortfolioDialog(false);
      setNewPortfolioItem({
        title: '',
        description: '',
        imageUrl: '',
        projectUrl: '',
        technologies: [],
      });
    } catch (error) {
      console.error('Failed to add portfolio item:', error);
    }
  };

  // Convert skills to tree data format
  const treeData = {
    name: 'Skills',
    children: skills.map(skill => ({
      name: skill.name,
      attributes: { level: skill.level },
      children: skill.subSkills.map(subSkill => ({
        name: subSkill,
      })),
    })),
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Profile Information */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Profile Information
            </Typography>
            <form onSubmit={handleProfileUpdate}>
              <TextField
                fullWidth
                label="Name"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                margin="normal"
              />
              <TextField
                fullWidth
                label="College"
                value={profileData.college}
                onChange={(e) => setProfileData({ ...profileData, college: e.target.value })}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Major"
                value={profileData.major}
                onChange={(e) => setProfileData({ ...profileData, major: e.target.value })}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Graduation Year"
                type="number"
                value={profileData.graduationYear}
                onChange={(e) => setProfileData({ ...profileData, graduationYear: e.target.value })}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Bio"
                multiline
                rows={4}
                value={profileData.bio}
                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                margin="normal"
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
              >
                Update Profile
              </Button>
            </form>
          </Paper>
        </Grid>

        {/* Skills Tree */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5">Skills Tree</Typography>
              <IconButton color="primary" onClick={() => setOpenSkillDialog(true)}>
                <AddIcon />
              </IconButton>
            </Box>
            <Box sx={{ height: 400 }}>
              <Tree
                data={treeData}
                orientation="vertical"
                pathFunc="step"
                translate={{ x: 300, y: 50 }}
                renderCustomNodeElement={({ nodeDatum }) => (
                  <g>
                    <circle r="10" fill="#1976d2" />
                    <text
                      x="20"
                      y="5"
                      textAnchor="start"
                      style={{ fontSize: '14px', fill: '#333' }}
                    >
                      {nodeDatum.name}
                    </text>
                    {nodeDatum.attributes && (
                      <text
                        x="20"
                        y="25"
                        textAnchor="start"
                        style={{ fontSize: '12px', fill: '#666' }}
                      >
                        Level: {nodeDatum.attributes.level}
                      </text>
                    )}
                  </g>
                )}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Portfolio */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5">Portfolio</Typography>
              <IconButton color="primary" onClick={() => setOpenPortfolioDialog(true)}>
                <AddIcon />
              </IconButton>
            </Box>
            <Grid container spacing={2}>
              {portfolio.map((item, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Paper elevation={2} sx={{ p: 2 }}>
                    <Typography variant="h6">{item.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.description}
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      {item.technologies.map((tech, i) => (
                        <Chip
                          key={i}
                          label={tech}
                          size="small"
                          sx={{ mr: 1, mb: 1 }}
                        />
                      ))}
                    </Box>
                    <Button
                      variant="outlined"
                      size="small"
                      href={item.projectUrl}
                      target="_blank"
                      sx={{ mt: 1 }}
                    >
                      View Project
                    </Button>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        {/* Previous Gigs */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Previous Gigs
            </Typography>
            <List>
              {previousGigs.map((gig, index) => (
                <React.Fragment key={index}>
                  <ListItem>
                    <ListItemText
                      primary={gig.title}
                      secondary={
                        <>
                          <Typography component="span" variant="body2">
                            {gig.description}
                          </Typography>
                          <br />
                          <Typography component="span" variant="caption">
                            Completed: {new Date(gig.completedDate).toLocaleDateString()}
                          </Typography>
                        </>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Typography variant="body2" color="primary">
                        Rating: {gig.rating}/5
                      </Typography>
                    </ListItemSecondaryAction>
                  </ListItem>
                  {index < previousGigs.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>

      {/* Add Skill Dialog */}
      <Dialog open={openSkillDialog} onClose={() => setOpenSkillDialog(false)}>
        <DialogTitle>Add New Skill</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Skill Name"
            value={newSkill.name}
            onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            select
            label="Skill Level"
            value={newSkill.level}
            onChange={(e) => setNewSkill({ ...newSkill, level: e.target.value })}
            margin="normal"
            SelectProps={{
              native: true,
            }}
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
            <option value="Expert">Expert</option>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSkillDialog(false)}>Cancel</Button>
          <Button onClick={handleAddSkill} variant="contained" color="primary">
            Add Skill
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Portfolio Item Dialog */}
      <Dialog open={openPortfolioDialog} onClose={() => setOpenPortfolioDialog(false)}>
        <DialogTitle>Add Portfolio Item</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Project Title"
            value={newPortfolioItem.title}
            onChange={(e) => setNewPortfolioItem({ ...newPortfolioItem, title: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Description"
            multiline
            rows={4}
            value={newPortfolioItem.description}
            onChange={(e) => setNewPortfolioItem({ ...newPortfolioItem, description: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Project URL"
            value={newPortfolioItem.projectUrl}
            onChange={(e) => setNewPortfolioItem({ ...newPortfolioItem, projectUrl: e.target.value })}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPortfolioDialog(false)}>Cancel</Button>
          <Button onClick={handleAddPortfolioItem} variant="contained" color="primary">
            Add Project
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Profile; 