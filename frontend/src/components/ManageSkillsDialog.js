import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
} from '@mui/material';
import { Close, Add } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    background: theme.palette.background.default,
    borderRadius: 24,
    border: '1px solid rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(20px)',
    maxWidth: 500,
    width: '100%',
  },
}));

const SkillChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
}));

const ManageSkillsDialog = ({ open, onClose, onSave, currentSkills = [] }) => {
  const [skills, setSkills] = useState(currentSkills);
  const [newSkill, setNewSkill] = useState('');
  const [skillLevel, setSkillLevel] = useState('beginner');
  const [parentSkill, setParentSkill] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    console.log('Current skills received in dialog:', currentSkills);
    // Ensure skills have proper structure when receiving from parent
    const processedSkills = (currentSkills || []).map(skill => ({
      id: skill.id || Date.now(),
      name: skill.name,
      level: skill.level?.toLowerCase() || 'beginner',
      children: skill.children?.map(child => ({
        id: child.id || Date.now() + 1,
        name: child.name,
        level: child.level?.toLowerCase() || 'beginner'
      })) || []
    }));
    console.log('Setting processed skills in dialog:', processedSkills);
    setSkills(processedSkills);
  }, [currentSkills]);

  const handleAddSkill = () => {
    if (!newSkill.trim()) {
      setError('Skill name cannot be empty');
      return;
    }

    // Check for duplicate skills
    const isDuplicate = skills.some(skill => 
      skill.name.toLowerCase() === newSkill.toLowerCase() ||
      skill.children?.some(child => 
        child.name.toLowerCase() === newSkill.toLowerCase() ||
        child.children?.some(grandchild => 
          grandchild.name.toLowerCase() === newSkill.toLowerCase()
        )
      )
    );

    if (isDuplicate) {
      setError('This skill already exists');
      return;
    }

    const newSkillObj = {
      id: Date.now(),
      name: newSkill,
      level: skillLevel,
      children: []
    };

    if (parentSkill) {
      // Find the parent skill and add the new skill as its child
      const addToParent = (skillsList) => {
        for (let skill of skillsList) {
          if (skill.name === parentSkill) {
            skill.children = skill.children || [];
            skill.children.push(newSkillObj);
            return true;
          }
          if (skill.children?.length) {
            if (addToParent(skill.children)) {
              return true;
            }
          }
        }
        return false;
      };

      if (!addToParent(skills)) {
        setError('Parent skill not found');
        return;
      }
    } else {
      setSkills([...skills, newSkillObj]);
    }

    setNewSkill('');
    setSkillLevel('beginner');
    setParentSkill('');
    setError('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    const removeSkill = (skillsList) => {
      for (let i = 0; i < skillsList.length; i++) {
        if (skillsList[i].name === skillToRemove) {
          skillsList.splice(i, 1);
          return true;
        }
        if (skillsList[i].children?.length) {
          if (removeSkill(skillsList[i].children)) {
            return true;
          }
        }
      }
      return false;
    };

    const updatedSkills = [...skills];
    removeSkill(updatedSkills);
    setSkills(updatedSkills);
  };

  const handleSave = () => {
    // Ensure all skills have proper structure before saving
    const processedSkills = skills.map(skill => ({
      id: skill.id,
      name: skill.name,
      level: skill.level.toLowerCase(),
      children: skill.children?.map(child => ({
        id: child.id,
        name: child.name,
        level: child.level.toLowerCase()
      })) || []
    }));
    console.log('Processed skills before save:', processedSkills);
    onSave(processedSkills);
    onClose();
  };

  const renderSkillTree = (skillsList, level = 0) => {
    return skillsList.map((skill) => (
      <Box key={skill.id} sx={{ ml: level * 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Chip
            label={skill.name}
            onDelete={() => handleRemoveSkill(skill.name)}
            sx={{ mr: 1 }}
          />
          <Typography variant="caption" color="text.secondary">
            ({skill.level})
          </Typography>
        </Box>
        {skill.children?.length > 0 && renderSkillTree(skill.children, level + 1)}
      </Box>
    ));
  };

  return (
    <StyledDialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Manage Skills</Typography>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Add New Skill
          </Typography>
          <Box display="flex" gap={2} flexWrap="wrap">
            <TextField
              size="small"
              placeholder="Skill name"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              sx={{ flexGrow: 1 }}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSkill();
                }
              }}
            />
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Level</InputLabel>
              <Select
                value={skillLevel}
                onChange={(e) => setSkillLevel(e.target.value)}
                label="Level"
              >
                <MenuItem value="beginner">Beginner</MenuItem>
                <MenuItem value="intermediate">Intermediate</MenuItem>
                <MenuItem value="advanced">Advanced</MenuItem>
                <MenuItem value="expert">Expert</MenuItem>
              </Select>
            </FormControl>
            {skills.length > 0 && (
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Parent Skill</InputLabel>
                <Select
                  value={parentSkill}
                  onChange={(e) => setParentSkill(e.target.value)}
                  label="Parent Skill"
                >
                  <MenuItem value="">None</MenuItem>
                  {skills.map(skill => (
                    <MenuItem key={skill.id} value={skill.name}>
                      {skill.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            <Button
              variant="contained"
              onClick={handleAddSkill}
              startIcon={<Add />}
            >
              Add
            </Button>
          </Box>
        </Box>

        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Your Skills
        </Typography>
        <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
          {skills.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No skills added yet
            </Typography>
          ) : (
            renderSkillTree(skills)
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={skills.length === 0}
        >
          Save Changes
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};

export default ManageSkillsDialog; 