import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import CreateJob from './pages/CreateJob';
import ActiveGigs from './pages/ActiveGigs';
import JobDetail from './pages/JobDetail';
import Jobs from './pages/Jobs';
import MyApplications from './pages/MyApplications';
import EditJob from './pages/EditJob';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/AuthContext';
import Box from '@mui/material/Box';

// Protected Route wrapper for recruiter-only pages
const RecruiterRoute = ({ children }) => {
  const { user } = useAuth();
  
  if (!user || user.role !== 'recruiter') {
    return <Navigate to="/" />;
  }
  
  return children;
};

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#f48fb1',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              pt: 8, // Add padding top to account for fixed navbar
              pb: 4,
              minHeight: '100vh',
              background: theme.palette.background.default,
            }}
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/profile/:id" element={<Profile />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/jobs/:id" element={<JobDetail />} />
              <Route path="/jobs/:id/edit" element={<EditJob />} />
              <Route
                path="/active-gigs"
                element={
                  <RecruiterRoute>
                    <ActiveGigs />
                  </RecruiterRoute>
                }
              />
              <Route
                path="/create-job"
                element={
                  <RecruiterRoute>
                    <CreateJob />
                  </RecruiterRoute>
                }
              />
              <Route path="/my-applications" element={<MyApplications />} />
            </Routes>
          </Box>
        </Box>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App; 