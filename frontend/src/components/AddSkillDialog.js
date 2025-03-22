import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box
} from '@mui/material';
import { skillCategories, skillsByCategory } from '../constants/skills';

const AddSkillDialog = ({ open, onClose, onAdd }) => {
  const [category, setCategory] = useState('');
  const [skill, setSkill] = useState('');
  const [level, setLevel] = useState('beginner');

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({
      name: skill,
      category,
      level
    });
    setCategory('');
    setSkill('');
    setLevel('beginner');
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Skill</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              select
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              fullWidth
              required
            >
              {skillCategories.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Skill"
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
              fullWidth
              required
              disabled={!category}
            >
              {category && skillsByCategory[category]?.map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Level"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              fullWidth
              required
            >
              <MenuItem value="beginner">Beginner</MenuItem>
              <MenuItem value="intermediate">Intermediate</MenuItem>
              <MenuItem value="advanced">Advanced</MenuItem>
              <MenuItem value="expert">Expert</MenuItem>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            Add Skill
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddSkillDialog; 