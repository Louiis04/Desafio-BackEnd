import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  CircularProgress,
  Stack,
} from '@mui/material';
import { ChromePicker, ColorResult } from 'react-color';
import { Tag } from '../../types';

interface TagManagerDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: { name: string; color: string }) => void;
  initialData: Tag | null;
  isSubmitting: boolean;
}

export const TagManagerDialog: React.FC<TagManagerDialogProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
  isSubmitting,
}) => {
  const [name, setName] = useState('');
  const [color, setColor] = useState('#000000');
  const [showColorPicker, setShowColorPicker] = useState(false);

  useEffect(() => {
    if (open) {
      if (initialData) {
        setName(initialData.name);
        setColor(initialData.color);
      } else {
        setName('');
        setColor('#000000'); 
      }
      setShowColorPicker(false); 
    }
  }, [initialData, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    onSubmit({ name, color });
  };

  const handleColorChange = (colorResult: ColorResult) => {
    setColor(colorResult.hex);
  };

  const handleInternalClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  }

  return (
    <Dialog open={open} onClose={handleInternalClose} maxWidth="xs" fullWidth>
      <DialogTitle>{initialData ? 'Edit Tag' : 'Create New Tag'}</DialogTitle>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}> 
            <TextField
              fullWidth
              label="Tag Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isSubmitting}
            />

            <Box>
              <Button
                type="button"
                variant="outlined"
                onClick={() => setShowColorPicker(!showColorPicker)}
                disabled={isSubmitting}
                fullWidth 
              >
                {showColorPicker ? 'Hide' : 'Select'} Color
              </Button>
              {showColorPicker && (
                <Box sx={{ mt: 2, position: 'relative', display: 'flex', justifyContent: 'center' }}>
                  <ChromePicker
                    color={color}
                    onChangeComplete={handleColorChange} 
                    disableAlpha 
                  />
                </Box>
              )}
              <Box
                sx={{
                  width: '100%',
                  height: 40,
                  backgroundColor: color,
                  borderRadius: 1,
                  border: '1px solid #ccc',
                  mt: 2, 
                }}
                aria-label={`Selected color: ${color}`} 
              />
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleInternalClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting || !name} 
            startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {isSubmitting ? (initialData ? 'Saving...' : 'Creating...') : (initialData ? 'Save' : 'Create')}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};