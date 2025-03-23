import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import { AuthProvider } from './contexts/AuthContext';
import Box from '@mui/material/Box';
import theme from './theme';

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