import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, isAuthenticated } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Todo App
        </Typography>
        {isAuthenticated ? (
          <Box>
            <Button
              color="inherit"
              onClick={() => navigate('/tasks')}
              sx={{ fontWeight: isActive('/tasks') ? 'bold' : 'normal' }}
            >
              Tasks
            </Button>
            <Button
              color="inherit"
              onClick={() => navigate('/tags')}
              sx={{ fontWeight: isActive('/tags') ? 'bold' : 'normal' }}
            >
              Tags
            </Button>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        ) : (
          <Box>
            <Button
              color="inherit"
              onClick={() => navigate('/login')}
              sx={{ fontWeight: isActive('/login') ? 'bold' : 'normal' }}
            >
              Login
            </Button>
            <Button
              color="inherit"
              onClick={() => navigate('/register')}
              sx={{ fontWeight: isActive('/register') ? 'bold' : 'normal' }}
            >
              Register
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};