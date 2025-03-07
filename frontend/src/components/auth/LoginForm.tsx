import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { useAuth } from '../../Context/AuthContext';
import { useNotification } from '../../Context/NotificationContext';

export const LoginForm: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();
    const { showNotification } = useNotification();
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        const response = await authService.login(email, password);
        console.log('Login response:', response); 
        
        await login(response.token, response.user);
        
        showNotification('Login successful!', 'success');
        navigate('/tasks');
      } catch (error: any) {
        console.error('Login error:', error);
        showNotification(
          error.response?.data?.error || 'Failed to login. Please try again.',
          'error'
        );
      }
    };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>Login</Typography>
      
      <TextField
        fullWidth
        margin="normal"
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <TextField
        fullWidth
        margin="normal"
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <Button
        type="submit"
        variant="contained"
        fullWidth
        sx={{ mt: 3, mb: 2 }}
      >
        Login
      </Button>

      <Box sx={{ textAlign: 'center' }}>
        <Link href="/register" variant="body2">
          Don't have an account? Register
        </Link>
      </Box>
    </Box>
  );
};