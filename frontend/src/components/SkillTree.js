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

  const processSkills = useCallback(() => {
    const nodes = [];
    const links = [];

    // Add root node
    nodes.push({
      id: 'root',
      name: 'Skills',
      val: 40,
      color: '#2c3e50',
      level: 0,
      fx: 0,
      fy: 0
    });

    // Process categories
    const categories = new Set(skills.map(skill => skill.category));
    categories.forEach((category, index) => {
      if (category) {
        const angle = (index / categories.size) * 2 * Math.PI;
        const radius = 250;
        nodes.push({
          id: category,
          name: category,
          val: 25,
          color: '#34495e',
          level: 1,
          fx: radius * Math.cos(angle),
          fy: radius * Math.sin(angle)
        });
        links.push({
          source: 'root',
          target: category,
          value: 2,
          color: '#95a5a6'
        });
      }
    });

    // Process skills
    skills.forEach((skill, index) => {
      if (skill.category) {
        const categoryNode = nodes.find(n => n.id === skill.category);
        if (categoryNode) {
          const angle = (index / skills.length) * 2 * Math.PI;
          const radius = 180;
          nodes.push({
            id: skill._id,
            name: skill.name,
            val: 20,
            color: getSkillColor(skill.level),
            level: 2,
            skillLevel: skill.level,
            fx: categoryNode.fx + radius * Math.cos(angle),
            fy: categoryNode.fy + radius * Math.sin(angle)
          });
          links.push({
            source: skill.category,
            target: skill._id,
            value: 1,
            color: '#bdc3c7'
          });
        }
      }
    });

    return { nodes, links };
  }, [skills]);

  useEffect(() => {
    const data = processSkills();
    setGraphData(data);
  }, [skills, processSkills]);

  const getSkillColor = (level) => {
    switch (level) {
      case 'beginner': return '#3498db';
      case 'intermediate': return '#2ecc71';
      case 'advanced': return '#f1c40f';
      case 'expert': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  const getSkillLevelIcon = (level) => {
    switch (level) {
      case 'beginner': return '★';
      case 'intermediate': return '★★';
      case 'advanced': return '★★★';
      case 'expert': return '★★★★';
      default: return '★';
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

  const handleDeleteSkill = (skillId) => {
    const updatedSkills = skills.filter(skill => skill._id !== skillId);
    onUpdateSkills(updatedSkills);
    setSelectedNode(null);
  };

  const handleEditSkill = (skillId) => {
    const skill = skills.find(s => s._id === skillId);
    if (skill) {
      setNewSkill({
        name: skill.name,
        category: skill.category,
        level: skill.level
      });
      setEditMode(true);
      setOpenDialog(true);
    }
  };

  const handleUpdateSkill = () => {
    if (!newSkill.name || !newSkill.category || !newSkill.level) return;

    const updatedSkills = skills.map(skill => {
      if (skill._id === selectedNode.id) {
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

  const nodeCanvasObject = (node, ctx, globalScale) => {
    const label = node.name;
    const fontSize = node.level === 0 ? 18 : node.level === 1 ? 16 : 14;
    ctx.font = `${fontSize}px Arial`;
    const textWidth = ctx.measureText(label).width;
    const bckgDimensions = [textWidth + 20, fontSize + 12].map(n => n + fontSize * 0.2);

    // Draw background
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.beginPath();
    ctx.roundRect(
      node.x - bckgDimensions[0] / 2,
      node.y - bckgDimensions[1] / 2,
      bckgDimensions[0],
      bckgDimensions[1],
      8
    );
    ctx.fill();

    // Draw border
    ctx.strokeStyle = node.color;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw text
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = node.color;
    ctx.fillText(label, node.x, node.y);

    // Draw skill level
    if (node.skillLevel) {
      ctx.font = '12px Arial';
      ctx.fillStyle = '#666';
      ctx.fillText(
        getSkillLevelIcon(node.skillLevel),
        node.x,
        node.y + fontSize
      );
    }
  };

  return (
    <Box sx={{ width: '100%', height: '700px', position: 'relative', bgcolor: '#f8f9fa', borderRadius: 2, p: 2 }}>
      <Box sx={{ position: 'absolute', top: 16, right: 16, zIndex: 1 }}>
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
          sx={{ 
            bgcolor: '#2c3e50',
            '&:hover': { bgcolor: '#34495e' }
          }}
        >
          Add Skill
        </Button>
      </Box>
      
      <ForceGraph2D
        graphData={graphData}
        nodeCanvasObject={nodeCanvasObject}
        nodeCanvasObjectMode={() => 'replace'}
        linkColor={link => link.color}
        linkWidth={link => link.value}
        nodeRelSize={6}
        d3Force={('charge', null)}
        cooldownTicks={50}
        onNodeClick={(node) => {
          if (node.level === 2) { // Only select skill nodes
            setSelectedNode(node);
          }
        }}
        onNodeHover={(node) => {
          setHoveredNode(node);
        }}
        onEngineStop={() => {
          // Adjust graph after initial render
          const fg = document.querySelector('canvas');
          if (fg) fg.style.height = '600px';
        }}
      />

      {selectedNode && (
        <Paper
          elevation={3}
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            p: 2,
            borderRadius: 2,
            zIndex: 2,
            display: 'flex',
            gap: 1,
            bgcolor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <Tooltip title="Edit Skill">
            <IconButton 
              onClick={() => handleEditSkill(selectedNode.id)}
              sx={{ color: '#2c3e50' }}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Skill">
            <IconButton 
              onClick={() => handleDeleteSkill(selectedNode.id)}
              sx={{ color: '#e74c3c' }}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Paper>
      )}

      {hoveredNode && hoveredNode.level === 2 && (
        <Paper
          elevation={3}
          sx={{
            position: 'absolute',
            top: 16,
            left: 16,
            p: 2,
            borderRadius: 2,
            zIndex: 2,
            bgcolor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
            {hoveredNode.name}
          </Typography>
          <Chip
            icon={<StarIcon />}
            label={hoveredNode.skillLevel.charAt(0).toUpperCase() + hoveredNode.skillLevel.slice(1)}
            size="small"
            sx={{ 
              mt: 1,
              bgcolor: getSkillColor(hoveredNode.skillLevel),
              color: 'white'
            }}
          />
        </Paper>
      )}

      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle sx={{ bgcolor: '#2c3e50', color: 'white' }}>
          {editMode ? 'Edit Skill' : 'Add New Skill'}
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              select
              label="Category"
              value={newSkill.category}
              onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
              fullWidth
              required
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
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
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
            <TextField
              select
              label="Level"
              value={newSkill.level}
              onChange={(e) => setNewSkill({ ...newSkill, level: e.target.value })}
              fullWidth
              required
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            >
              <MenuItem value="beginner">Beginner ★</MenuItem>
              <MenuItem value="intermediate">Intermediate ★★</MenuItem>
              <MenuItem value="advanced">Advanced ★★★</MenuItem>
              <MenuItem value="expert">Expert ★★★★</MenuItem>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={() => setOpenDialog(false)}
            sx={{ color: '#666' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={editMode ? handleUpdateSkill : handleAddSkill} 
            variant="contained"
            sx={{ 
              bgcolor: '#2c3e50',
              '&:hover': { bgcolor: '#34495e' }
            }}
          >
            {editMode ? 'Update' : 'Add'} Skill
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SkillTree; 