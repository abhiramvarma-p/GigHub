import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Jobs from './pages/Jobs';
import JobDetail from './pages/JobDetail';
import Messages from './pages/Messages';
import MyApplications from './pages/MyApplications';
import CreateJob from './pages/CreateJob';
import EditJob from './pages/EditJob';
import StudentDashboard from './pages/StudentDashboard';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Box from '@mui/material/Box';

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

const HomeRedirect = () => {
  const { user } = useAuth();
  if (user?.role === 'student') {
    return <Navigate to="/dashboard" replace />;
  }
  return <Home />;
};

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
              <Route path="/" element={<HomeRedirect />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile/:id?" element={<Profile />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/jobs/:id" element={<JobDetail />} />
              <Route path="/jobs/:id/edit" element={<EditJob />} />
              <Route path="/messages/:userId?/:jobId?" element={<Messages />} />
              <Route path="/my-applications" element={<MyApplications />} />
              <Route path="/create-job" element={<CreateJob />} />
              <Route path="/dashboard" element={<StudentDashboard />} />
            </Routes>
          </Box>
        </Box>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App; 