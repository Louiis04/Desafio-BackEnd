import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Stack,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import { useAuth } from '../Context/AuthContext';
import { authService } from '../services/authService';
import { useNotification } from '../Context/NotificationContext';

export const ProfilePage: React.FC = () => {
  const { user, setUser } = useAuth();
  const { showNotification } = useNotification();

  const [name, setName] = useState('');
  const [isProfileSubmitting, setIsProfileSubmitting] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isPasswordSubmitting, setIsPasswordSubmitting] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
    }
  }, [user]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || isProfileSubmitting) return;
    if (name === user.name) {
      showNotification('No changes detected in name.', 'info');
      return;
    }
    setProfileError(null);
    setProfileSuccess(null);
    setIsProfileSubmitting(true);

    try {
      const responseData = await authService.updateProfile(user.id, { name });

      if (responseData && responseData.user) {
          const updatedUser = { ...user, ...responseData.user };
          setUser(updatedUser); 
          localStorage.setItem('user', JSON.stringify(updatedUser)); 
          setProfileSuccess(responseData.message || 'Profile updated successfully!'); 
          showNotification(responseData.message || 'Profile updated successfully!', 'success');
      } else {
          console.error("Unexpected API response structure:", responseData);
          throw new Error("Received unexpected data from server.");
      }

    } catch (err: any) {
      const message = err.response?.data?.error || err.message || 'Failed to update profile.';
      setProfileError(message);
      showNotification(message, 'error');
      console.error("Profile Update API Error:", err.response?.data || err);
    } finally {
      setIsProfileSubmitting(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isPasswordSubmitting) return;

    if (newPassword !== confirmNewPassword) {
      setPasswordError('New passwords do not match.');
      showNotification('New passwords do not match.', 'error');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long.');
      showNotification('New password must be at least 6 characters long.', 'error');
      return;
    }

    setPasswordError(null);
    setPasswordSuccess(null);
    setIsPasswordSubmitting(true);

    try {
      await authService.changePassword({ currentPassword, newPassword });
      setPasswordSuccess('Password changed successfully!');
      showNotification('Password changed successfully!', 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err: any) {
      const message = err.response?.data?.error || 'Failed to change password.';
      setPasswordError(message);
      showNotification(message, 'error');
      console.error("Change Password API Error:", err.response || err);
    } finally {
      setIsPasswordSubmitting(false);
    }
  };

  if (!user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 'sm', mx: 'auto' }}>
      <Paper sx={{ p: 3, mt: 4, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Edit Profile
        </Typography>
        <Box component="form" onSubmit={handleProfileUpdate}>
          <Stack spacing={2}>
            <TextField
              label="Name"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isProfileSubmitting}
            />
            <TextField
              label="Email"
              fullWidth
              value={user.email}
              disabled
              InputProps={{ readOnly: true }}
              sx={{ backgroundColor: '#f5f5f5' }}
            />
            {profileError && <Alert severity="error" onClose={() => setProfileError(null)}>{profileError}</Alert>}
            {profileSuccess && <Alert severity="success" onClose={() => setProfileSuccess(null)}>{profileSuccess}</Alert>}
            <Button
              type="submit"
              variant="contained"
              disabled={isProfileSubmitting || name === user.name}
              startIcon={isProfileSubmitting ? <CircularProgress size={20} /> : null}
            >
              {isProfileSubmitting ? 'Saving...' : 'Save Profile Changes'}
            </Button>
          </Stack>
        </Box>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Change Password
        </Typography>
        <Box component="form" onSubmit={handlePasswordChange}>
          <Stack spacing={2}>
            <TextField
              type="password"
              label="Current Password"
              fullWidth
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              disabled={isPasswordSubmitting}
            />
            <TextField
              type="password"
              label="New Password"
              fullWidth
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              disabled={isPasswordSubmitting}
            />
            <TextField
              type="password"
              label="Confirm New Password"
              fullWidth
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              required
              disabled={isPasswordSubmitting}
            />
            {passwordError && <Alert severity="error" onClose={() => setPasswordError(null)}>{passwordError}</Alert>}
            {passwordSuccess && <Alert severity="success" onClose={() => setPasswordSuccess(null)}>{passwordSuccess}</Alert>}
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              disabled={isPasswordSubmitting || !currentPassword || !newPassword || !confirmNewPassword}
              startIcon={isPasswordSubmitting ? <CircularProgress size={20} /> : null}
            >
              {isPasswordSubmitting ? 'Changing...' : 'Change Password'}
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
};