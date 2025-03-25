import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Navbar from './components/Navbar';
import HomeRedirect from './components/HomeRedirect';
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
import theme from './theme';
import GigAI from './components/GigAI';

// Protected route component for students only
const StudentRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return null;
  }
  
  if (!user || user.role !== 'student') {
    return <Navigate to="/jobs" />;
  }
  
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile/:id?" element={<Profile />} />
      <Route path="/jobs" element={<Jobs />} />
      <Route path="/jobs/:id" element={<JobDetail />} />
      <Route path="/jobs/:id/edit" element={<EditJob />} />
      <Route path="/messages/:userId?/:jobId?" element={<Messages />} />
      <Route 
        path="/my-applications" 
        element={
          <StudentRoute>
            <MyApplications />
          </StudentRoute>
        } 
      />
      <Route path="/create-job" element={<CreateJob />} />
      <Route 
        path="/dashboard" 
        element={
          <StudentRoute>
            <StudentDashboard />
          </StudentRoute>
        } 
      />
    </Routes>
  );
}

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
              pt: 8,
              pb: 4,
              minHeight: '100vh',
              background: theme.palette.background.default,
            }}
          >
            <AppRoutes />
          </Box>
          <GigAI />
        </Box>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App; 