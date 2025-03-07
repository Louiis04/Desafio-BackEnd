import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { useNotification } from '../../Context/NotificationContext';

export const RegisterForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      showNotification('Passwords do not match', 'error');
      return;
    }

    try {
      await authService.register(username, email, password);
      showNotification('Registration successful! Please login.', 'success');
      navigate('/login');
    } catch (error) {
      showNotification('Registration failed. Please try again.', 'error');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>Register</Typography>
      
      <TextField
        fullWidth
        margin="normal"
        label="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />

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

      <TextField
        fullWidth
        margin="normal"
        label="Confirm Password"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />

      <Button
        type="submit"
        variant="contained"
        fullWidth
        sx={{ mt: 3, mb: 2 }}
      >
        Register
      </Button>

      <Box sx={{ textAlign: 'center' }}>
        <Link href="/login" variant="body2">
          Already have an account? Login
        </Link>
      </Box>
    </Box>
  );
};