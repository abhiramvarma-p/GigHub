import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Rating as MuiRating,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Alert,
  CircularProgress,
  Link,
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RatingComponent = ({ userId, userRole, currentUser }) => {
  const [ratings, setRatings] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [newRating, setNewRating] = useState({ rating: 0, comment: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRatings();
  }, [userId]);

  const fetchRatings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/ratings/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRatings(response.data);
      const avg = response.data.reduce((acc, curr) => acc + curr.rating, 0) / response.data.length;
      setAverageRating(avg || 0);
    } catch (error) {
      console.error('Error fetching ratings:', error);
      setError('Failed to fetch ratings');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitRating = async () => {
    try {
      setSubmitting(true);
      setError(null);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to submit a rating');
        return;
      }

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
      setOpenDialog(false);
      setNewRating({ rating: 0, comment: '' });
      fetchRatings();
    } catch (error) {
      console.error('Error submitting rating:', error);
      setError(error.response?.data?.message || 'Failed to submit rating. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleNavigateToProfile = (reviewerId) => {
    navigate(`/profile/${reviewerId}`);
  };

  const canRate = currentUser && currentUser._id !== userId;

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <MuiRating
          value={averageRating}
          precision={0.1}
          readOnly
          size="large"
          sx={{ color: 'primary.main' }}
        />
        <Typography variant="body1" sx={{ ml: 1 }}>
          ({ratings.length} {ratings.length === 1 ? 'review' : 'reviews'})
        </Typography>
        {canRate && (
          <IconButton
            onClick={() => setOpenDialog(true)}
            sx={{ ml: 'auto' }}
          >
            <EditIcon />
          </IconButton>
        )}
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
          <CircularProgress size={24} />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <Box sx={{ mt: 2 }}>
          {ratings.map((rating) => (
            <Box key={rating._id} sx={{ mb: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Link
                  component="button"
                  variant="body1"
                  onClick={() => handleNavigateToProfile(rating.rater._id)}
                  sx={{ textDecoration: 'none', fontWeight: 'bold' }}
                >
                  {rating.rater.name}
                </Link>
                <MuiRating value={rating.rating} readOnly size="small" />
              </Box>
              <Typography variant="body2" color="text.secondary">
                {rating.comment}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {new Date(rating.createdAt).toLocaleDateString()}
              </Typography>
            </Box>
          ))}
        </Box>
      )}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Write a Review</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            {error && (
              <Alert severity="error">
                {error}
              </Alert>
            )}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
              <MuiRating
                value={newRating.rating}
                onChange={(event, newValue) => {
                  setNewRating({ ...newRating, rating: newValue });
                }}
                size="large"
                sx={{ color: 'primary.main' }}
              />
              <Typography variant="body2" color="text.secondary">
                {newRating.rating === 0 ? 'Select your rating' : 
                 newRating.rating === 1 ? 'Poor' :
                 newRating.rating === 2 ? 'Fair' :
                 newRating.rating === 3 ? 'Good' :
                 newRating.rating === 4 ? 'Very Good' :
                 'Excellent'}
              </Typography>
            </Box>
            <TextField
              label="Write your review"
              multiline
              rows={4}
              value={newRating.comment}
              onChange={(e) => setNewRating({ ...newRating, comment: e.target.value })}
              fullWidth
              required
              placeholder="Share your experience with this user..."
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmitRating}
            disabled={submitting || newRating.rating === 0 || !newRating.comment.trim()}
          >
            {submitting ? <CircularProgress size={24} /> : 'Submit Review'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RatingComponent; 