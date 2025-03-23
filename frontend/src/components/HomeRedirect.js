import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import Home from '../pages/Home';

const HomeRedirect = () => {
  const { user } = useAuth();
  return <Home />;
};

export default HomeRedirect; 