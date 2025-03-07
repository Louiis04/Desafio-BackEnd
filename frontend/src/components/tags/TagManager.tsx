import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { tagService } from '../../services/tagService';
import { Tag } from '../../types';
import { useNotification } from '../../Context/NotificationContext';
import { ChromePicker } from 'react-color';

interface TagFormData {
  name: string;
  color: string;
}

export const TagManager: React.FC = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [formData, setFormData] = useState<TagFormData>({ name: '', color: '#000000' });
  const { showNotification } = useNotification();
  const [showColorPicker, setShowColorPicker] = useState(false);

  useEffect(() => {
    loadTags();
  }, []);

  const loadTags = async () => {
    try {
      const data = await tagService.getTags();
      setTags(data);
    } catch (error) {
      showNotification('Failed to load tags', 'error');
    }
  };

  const handleOpenDialog = (tag?: Tag) => {
    if (tag) {
      setEditingTag(tag);
      setFormData({ name: tag.name, color: tag.color });
    } else {
      setEditingTag(null);
      setFormData({ name: '', color: '#000000' });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingTag(null);
    setFormData({ name: '', color: '#000000' });
    setShowColorPicker(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingTag) {
        await tagService.updateTag(editingTag.id, formData);
        showNotification('Tag updated successfully', 'success');
      } else {
        await tagService.createTag(formData);
        showNotification('Tag created successfully', 'success');
      }
      loadTags();
      handleCloseDialog();
    } catch (error) {
      showNotification(
        `Failed to ${editingTag ? 'update' : 'create'} tag`,
        'error'
      );
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await tagService.deleteTag(id);
      showNotification('Tag deleted successfully', 'success');
      loadTags();
    } catch (error) {
      showNotification('Failed to delete tag', 'error');
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">Manage Tags</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          New Tag
        </Button>
      </Box>

      <List>
        {tags.map((tag) => (
          <ListItem
            key={tag.id}
            secondaryAction={
              <Box>
                <IconButton onClick={() => handleOpenDialog(tag)}>
                  <Edit />
                </IconButton>
                <IconButton onClick={() => handleDelete(tag.id)}>
                  <Delete />
                </IconButton>
              </Box>
            }
          >
            <ListItemText
              primary={tag.name}
              secondary={
                <Box
                  component="span"
                  sx={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    display: 'inline-block',
                    backgroundColor: tag.color,
                    mr: 1,
                  }}
                />
              }
            />
          </ListItem>
        ))}
      </List>

      <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>
          {editingTag ? 'Edit Tag' : 'Create New Tag'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Tag Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              margin="normal"
              required
            />

            <Box sx={{ mt: 2 }}>
              <Button
                type="button"
                variant="outlined"
                onClick={() => setShowColorPicker(!showColorPicker)}
                sx={{ mb: 2 }}
              >
                Select Color
              </Button>
              {showColorPicker && (
                <Box sx={{ position: 'absolute', zIndex: 2 }}>
                  <ChromePicker
                    color={formData.color}
                    onChange={(color) => setFormData({ ...formData, color: color.hex })}
                  />
                </Box>
              )}
              <Box
                sx={{
                  width: '100%',
                  height: 40,
                  backgroundColor: formData.color,
                  borderRadius: 1,
                  border: '1px solid #ccc',
                }}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingTag ? 'Save' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};