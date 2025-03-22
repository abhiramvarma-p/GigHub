'use client';

import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import SkillTree from '../components/SkillTree';

const Skills = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Skill Tree Visualization
        </Typography>
        <Box sx={{ 
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 3,
          p: 3,
          height: '800px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <SkillTree width={928} height={680} />
        </Box>
      </Box>
    </Container>
  );
};

export default Skills; 