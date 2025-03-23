import React, { useState, useEffect, useCallback } from 'react';
import { ForceGraph2D } from 'react-force-graph';
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Typography, IconButton, Tooltip, Paper, Chip } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Star as StarIcon } from '@mui/icons-material';
import { skillCategories, skillsByCategory } from '../constants/skills';

const SkillTree = ({ skills, onUpdateSkills }) => {
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [openDialog, setOpenDialog] = useState(false);
  const [newSkill, setNewSkill] = useState({
    name: '',
    category: '',
    level: 'beginner'
  });
  const [selectedNode, setSelectedNode] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [hoveredNode, setHoveredNode] = useState(null);

  useEffect(() => {
    // Create nodes for categories and skills
    const nodes = [];
    const links = [];

    // Add category nodes with increased size
    skillCategories.forEach(category => {
      nodes.push({
        id: `category-${category}`,
        name: category,
        type: 'category',
        val: 3, // Increased size for category nodes
        color: '#2c3e50'
      });
    });

    // Add skill nodes and connect them to categories
    skills.forEach(skill => {
      nodes.push({
        id: `skill-${skill._id}`,
        name: skill.name,
        type: 'skill',
        level: skill.level,
        category: skill.category,
        val: 1,
        color: getSkillColor(skill.level)
      });

      links.push({
        source: `category-${skill.category}`,
        target: `skill-${skill._id}`,
        color: getSkillColor(skill.level)
      });
    });

    setGraphData({ nodes, links });
  }, [skills]);

  const getSkillColor = (level) => {
    switch (level) {
      case 'beginner': return '#3498db';
      case 'intermediate': return '#2ecc71';
      case 'advanced': return '#f1c40f';
      case 'expert': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  const getSkillLevelLabel = (level) => {
    switch (level) {
      case 'beginner': return 'Beginner';
      case 'intermediate': return 'Intermediate';
      case 'advanced': return 'Advanced';
      case 'expert': return 'Expert';
      default: return 'Beginner';
    }
  };

  const handleNodeClick = (node) => {
    if (node.type === 'skill') {
      setSelectedNode(node);
      setNewSkill({
        name: node.name,
        category: node.category,
        level: node.level
      });
      setEditMode(true);
      setOpenDialog(true);
    }
  };

  const handleAddSkill = () => {
    if (!newSkill.name || !newSkill.category || !newSkill.level) return;

    const updatedSkills = [
      ...skills,
      {
        _id: Date.now().toString(),
        ...newSkill
      }
    ];

    onUpdateSkills(updatedSkills);
    setOpenDialog(false);
    setNewSkill({
      name: '',
      category: '',
      level: 'beginner'
    });
  };

  const handleDeleteSkill = () => {
    if (!selectedNode) return;
    
    const skillId = selectedNode.id.replace('skill-', '');
    const updatedSkills = skills.filter(skill => skill._id !== skillId);
    onUpdateSkills(updatedSkills);
    setOpenDialog(false);
    setSelectedNode(null);
    setEditMode(false);
  };

  const handleUpdateSkill = () => {
    if (!newSkill.name || !newSkill.category || !newSkill.level || !selectedNode) return;

    const skillId = selectedNode.id.replace('skill-', '');
    const updatedSkills = skills.map(skill => {
      if (skill._id === skillId) {
        return {
          ...skill,
          ...newSkill
        };
      }
      return skill;
    });

    onUpdateSkills(updatedSkills);
    setOpenDialog(false);
    setEditMode(false);
    setSelectedNode(null);
    setNewSkill({
      name: '',
      category: '',
      level: 'beginner'
    });
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedNode(null);
    setEditMode(false);
    setNewSkill({
      name: '',
      category: '',
      level: 'beginner'
    });
  };

  return (
    <Box sx={{ 
      height: '400px', 
      width: '100%',
      position: 'relative',
      bgcolor: '#f8f9fa',
      borderRadius: 2,
      overflow: 'hidden',
      border: '1px solid rgba(0, 0, 0, 0.1)'
    }}>
      <ForceGraph2D
        graphData={graphData}
        nodeLabel="name"
        nodeRelSize={6}
        linkWidth={1}
        linkDirectionalParticles={1}
        linkDirectionalParticleSpeed={0.004}
        d3Force={('charge', -1000)}
        d3VelocityDecay={0.3}
        onNodeClick={handleNodeClick}
        onNodeHover={setHoveredNode}
        nodeCanvasObject={(node, ctx, globalScale) => {
          const label = node.name;
          const fontSize = node.type === 'category' ? 14 : 12;
          ctx.font = `${fontSize}px Sans-Serif`;
          ctx.fillStyle = node.color;
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.type === 'category' ? 8 : 6, 0, 2 * Math.PI);
          ctx.fill();
          ctx.fillStyle = '#000';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(label, node.x, node.y + 15);
        }}
      />
      <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setEditMode(false);
            setSelectedNode(null);
            setNewSkill({
              name: '',
              category: '',
              level: 'beginner'
            });
            setOpenDialog(true);
          }}
        >
          Add Skill
        </Button>
      </Box>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editMode ? 'Edit Skill' : 'Add New Skill'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              select
              label="Category"
              value={newSkill.category}
              onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
              fullWidth
              required
            >
              {skillCategories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Skill Name"
              value={newSkill.name}
              onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
              fullWidth
              required
            />
            <TextField
              select
              label="Level"
              value={newSkill.level}
              onChange={(e) => setNewSkill({ ...newSkill, level: e.target.value })}
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
          <Button onClick={handleCloseDialog}>Cancel</Button>
          {editMode ? (
            <>
              <Button onClick={handleDeleteSkill} color="error">
                Delete
              </Button>
              <Button onClick={handleUpdateSkill} variant="contained">
                Update
              </Button>
            </>
          ) : (
            <Button onClick={handleAddSkill} variant="contained">
              Add
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SkillTree; 