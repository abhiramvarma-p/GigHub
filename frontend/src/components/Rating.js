import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Rating,
  Paper,
  Stack,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@mui/material';
import { Star, StarBorder, Edit as EditIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import axios from 'axios';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  background: 'rgba(30, 41, 59, 0.7)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.05)',
  borderRadius: 12,
}));

const RatingComponent = ({ userId, userRole, currentUser }) => {
  const [ratings, setRatings] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [newRating, setNewRating] = useState({
    rating: 0,
    comment: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRatings();
  }, [userId]);

  const fetchRatings = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/ratings/${userId}`);
      setRatings(response.data);
      calculateAverage(response.data);
    } catch (error) {
      console.error('Error fetching ratings:', error);
    }
  };

  const calculateAverage = (ratingsList) => {
    if (ratingsList.length === 0) {
      setAverageRating(0);
      return;
    }
    const sum = ratingsList.reduce((acc, curr) => acc + curr.rating, 0);
    setAverageRating(sum / ratingsList.length);
  };

  const handleSubmitRating = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/ratings',
        {
          ratedUser: userId,
          rating: newRating.rating,
          comment: newRating.comment,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchRatings();
      setOpenDialog(false);
      setNewRating({ rating: 0, comment: '' });
    } catch (error) {
      console.error('Error submitting rating:', error);
    } finally {
      setLoading(false);
    }
  };

  const canRate = currentUser && currentUser._id !== userId;

  return (
    <StyledPaper>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          {userRole === 'student' ? 'Student Rating' : 'Recruiter Rating'}
        </Typography>
        {canRate && (
          <IconButton onClick={() => setOpenDialog(true)}>
            <EditIcon />
          </IconButton>
        )}
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Rating
          value={averageRating}
          precision={0.1}
          readOnly
          size="large"
          sx={{ color: 'primary.main' }}
        />
        <Typography variant="h6" sx={{ ml: 1 }}>
          {averageRating.toFixed(1)}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
          ({ratings.length} ratings)
        </Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Stack spacing={2}>
        {ratings.map((rating) => (
          <Box key={rating._id}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Rating value={rating.rating} readOnly size="small" sx={{ color: 'primary.main' }} />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                {new Date(rating.createdAt).toLocaleDateString()}
              </Typography>
            </Box>
            <Typography variant="body2">{rating.comment}</Typography>
          </Box>
        ))}
      </Stack>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Rate {userRole === 'student' ? 'Student' : 'Recruiter'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <Rating
              value={newRating.rating}
              onChange={(event, newValue) => {
                setNewRating({ ...newRating, rating: newValue });
              }}
              size="large"
              sx={{ color: 'primary.main' }}
            />
            <TextField
              label="Comment"
              multiline
              rows={4}
              value={newRating.comment}
              onChange={(e) => setNewRating({ ...newRating, comment: e.target.value })}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmitRating}
            disabled={loading || newRating.rating === 0}
          >
            Submit Rating
          </Button>
        </DialogActions>
      </Dialog>
    </StyledPaper>
  );
};

export default RatingComponent; 