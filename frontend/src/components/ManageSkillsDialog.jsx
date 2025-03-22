import React, { useState, useLayoutEffect, useRef } from 'react';
import {
  Modal,
  Button,
  Box,
  Typography,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  Paper,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { predefinedCategories } from '../data/predefinedCategories';

const Container = styled('div')({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1300,
});

const ModalContent = styled(Paper)(({ theme }) => ({
  background: theme.palette.background.default,
  borderRadius: 24,
  border: '1px solid rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(20px)',
  width: '100%',
  maxWidth: 600,
  maxHeight: '90vh',
  overflow: 'auto',
  position: 'relative',
  outline: 'none',
  margin: theme.spacing(2),
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  background: 'transparent',
  padding: theme.spacing(2),
  marginTop: theme.spacing(2),
}));

const ManageSkillsDialog = ({ open, onClose, onSave }) => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [selectedSubSubcategory, setSelectedSubSubcategory] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    if (open) {
      setMounted(true);
    } else {
      const timer = setTimeout(() => {
        setMounted(false);
      }, 300); // delay to match the fade out animation
      return () => clearTimeout(timer);
    }
  }, [open]);

  const handleClose = () => {
    setSelectedCategory('');
    setSelectedSubcategory('');
    setSelectedSubSubcategory('');
    setSelectedSkills([]);
    onClose();
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    setSelectedSubcategory('');
    setSelectedSubSubcategory('');
    setSelectedSkills([]);
  };

  const handleSubcategoryChange = (event) => {
    setSelectedSubcategory(event.target.value);
    setSelectedSubSubcategory('');
    setSelectedSkills([]);
  };

  const handleSubSubcategoryChange = (event) => {
    setSelectedSubSubcategory(event.target.value);
    setSelectedSkills([]);
  };

  const handleSkillToggle = (skillId) => {
    setSelectedSkills(prev => {
      if (prev.includes(skillId)) {
        return prev.filter(id => id !== skillId);
      } else {
        return [...prev, skillId];
      }
    });
  };

  // Sort categories alphabetically
  const sortedCategories = [...predefinedCategories].sort((a, b) => 
    a.name.localeCompare(b.name)
  );

  // Get the current category object
  const currentCategory = predefinedCategories.find(cat => cat.id === selectedCategory);
  
  // Get the current subcategory object
  const currentSubcategory = currentCategory?.children?.find(sub => sub.id === selectedSubcategory);

  // Get the current sub-subcategory object (if it exists)
  const currentSubSubcategory = currentSubcategory?.children?.find(
    subSub => subSub.id === selectedSubSubcategory
  );

  // Get available skills based on the selected hierarchy
  const availableSkills = currentSubSubcategory?.skills || [];

  // Determine if we should show different levels of the hierarchy
  const hasSubcategories = Boolean(currentCategory?.children?.length);
  const hasSubSubcategories = Boolean(currentSubcategory?.children?.length);
  const hasSkills = Boolean(availableSkills.length);

  const handleSave = () => {
    if (onSave) {
      const selectedData = {
        category: currentCategory,
        subcategory: currentSubcategory,
        subSubcategory: currentSubSubcategory,
        skills: availableSkills.filter(skill => selectedSkills.includes(skill.id))
      };
      onSave(selectedData);
    }
    handleClose();
  };

  if (!open && !mounted) return null;

  return (
    <Container ref={containerRef}>
      <Modal
        open={open}
        onClose={handleClose}
        container={containerRef.current}
        disablePortal
        hideBackdrop
      >
        <ModalContent>
          {/* Header */}
          <Box sx={{ p: 2, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">Select Skills</Typography>
              <IconButton onClick={handleClose} size="small">
                <Close />
              </IconButton>
            </Box>
          </Box>

          {/* Content */}
          <Box sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* Category Selection */}
              <FormControl fullWidth variant="outlined" size="medium">
                <InputLabel>Select a category</InputLabel>
                <Select
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  label="Select a category"
                >
                  {sortedCategories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Subcategory Selection */}
              {hasSubcategories && selectedCategory && (
                <FormControl fullWidth variant="outlined" size="medium">
                  <InputLabel>Select a subcategory</InputLabel>
                  <Select
                    value={selectedSubcategory}
                    onChange={handleSubcategoryChange}
                    label="Select a subcategory"
                  >
                    {currentCategory?.children.map((subcat) => (
                      <MenuItem key={subcat.id} value={subcat.id}>
                        {subcat.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}

              {/* Sub-subcategory Selection */}
              {hasSubSubcategories && selectedSubcategory && (
                <FormControl fullWidth variant="outlined" size="medium">
                  <InputLabel>Select a specialization</InputLabel>
                  <Select
                    value={selectedSubSubcategory}
                    onChange={handleSubSubcategoryChange}
                    label="Select a specialization"
                  >
                    {currentSubcategory?.children.map((subSubcat) => (
                      <MenuItem key={subSubcat.id} value={subSubcat.id}>
                        {subSubcat.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}

              {/* Skills Selection */}
              {hasSkills && (selectedSubSubcategory || (!hasSubSubcategories && selectedSubcategory)) && (
                <StyledPaper elevation={0}>
                  <Typography variant="subtitle1" gutterBottom>
                    Select Skills
                  </Typography>
                  <List sx={{ maxHeight: 300, overflow: 'auto', pt: 0 }}>
                    {availableSkills.map((skill) => (
                      <ListItem
                        key={skill.id}
                        dense
                        button
                        onClick={() => handleSkillToggle(skill.id)}
                        sx={{ py: 0.5 }}
                      >
                        <Checkbox
                          edge="start"
                          checked={selectedSkills.includes(skill.id)}
                          tabIndex={-1}
                          disableRipple
                        />
                        <ListItemText primary={skill.name} />
                      </ListItem>
                    ))}
                  </List>
                </StyledPaper>
              )}
            </Box>
          </Box>

          {/* Actions */}
          <Box sx={{ p: 2, borderTop: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button onClick={handleClose}>CANCEL</Button>
            <Button 
              variant="contained" 
              onClick={handleSave}
              disabled={
                !selectedCategory || 
                (hasSubcategories && !selectedSubcategory) ||
                (hasSubSubcategories && !selectedSubSubcategory) ||
                (hasSkills && selectedSkills.length === 0)
              }
            >
              SAVE
            </Button>
          </Box>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default ManageSkillsDialog; 