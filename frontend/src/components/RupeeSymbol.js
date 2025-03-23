import React from 'react';
import { Typography } from '@mui/material';

const RupeeSymbol = ({ style }) => {
  return (
    <Typography
      component="span"
      sx={{
        fontFamily: 'Arial, sans-serif', // Use Arial for the rupee symbol
        ...style
      }}
    >
      &#8377;
    </Typography>
  );
};

export default RupeeSymbol; 