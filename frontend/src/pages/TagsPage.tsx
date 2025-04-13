import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Button,
  Typography,
  CircularProgress,
  Stack,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Paper, } from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { TagManagerDialog } from '../components/tags/TagManagerDialog'; 
import { tagService } from '../services/tagService';
import { Tag } from '../types';
import { useNotification } from '../Context/NotificationContext';

export const TagsPage: React.FC = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [dialogSubmitting, setDialogSubmitting] = useState(false);
  const { showNotification } = useNotification();

  useEffect(() => {
    loadTags();
  }, []);

  const loadTags = async () => {
    setLoading(true);
    try {
      const data = await tagService.getTags();
      setTags(data);
    } catch (error) {
      showNotification('Failed to load tags', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (tag?: Tag) => {
    setEditingTag(tag || null);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    if (dialogSubmitting) return; // Prevent closing while submitting
    setIsDialogOpen(false);
    setEditingTag(null);
  };

  const handleDialogSubmit = async (formData: { name: string; color: string }) => {
    setDialogSubmitting(true);
    try {
      if (editingTag) {
        await tagService.updateTag(editingTag.id, formData);
        showNotification('Tag updated successfully', 'success');
      } else {
        await tagService.createTag(formData);
        showNotification('Tag created successfully', 'success');
      }
      loadTags();
      handleCloseDialog(); // Close dialog on success
    } catch (error) {
      showNotification(
        `Failed to ${editingTag ? 'update' : 'create'} tag`,
        'error'
      );
    } finally {
      setDialogSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    // Consider adding a confirmation dialog here
    try {
      await tagService.deleteTag(id);
      showNotification('Tag deleted successfully', 'success');
      loadTags();
    } catch (error: any) {
       const errorMessage = error.response?.data?.error || 'Failed to delete tag';
       showNotification(errorMessage, 'error');
       console.error("Delete tag error:", error.response?.data || error);
    }
  };

  return (
    <Container maxWidth="md"> {/* Use Container */}
      <Box sx={{ my: 4 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Typography variant="h4">Manage Tags</Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
            disabled={loading}
          >
            New Tag
          </Button>
        </Stack>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Paper elevation={2}> {/* Wrap List in Paper */}
            <List>
              {tags.length === 0 && !loading ? (
                 <ListItem>
                    <ListItemText primary="No tags found." sx={{textAlign: 'center'}}/>
                 </ListItem>
              ) : (
                tags.map((tag) => (
                  <ListItem
                    key={tag.id}
                    secondaryAction={
                      <Stack direction="row" spacing={1}> {/* Use Stack for actions */}
                        <IconButton edge="end" aria-label="edit" onClick={() => handleOpenDialog(tag)}>
                          <Edit />
                        </IconButton>
                        <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(tag.id)}>
                          <Delete />
                        </IconButton>
                      </Stack>
                    }
                    sx={{ '&:not(:last-child)': { borderBottom: '1px solid #eee' } }} // Add divider
                  >
                    <Box
                      component="span"
                      sx={{
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        backgroundColor: tag.color,
                        mr: 2, // Add margin right
                        display: 'inline-block',
                        verticalAlign: 'middle', // Align color dot vertically
                      }}
                    />
                    <ListItemText primary={tag.name} />
                  </ListItem>
                ))
              )}
            </List>
          </Paper>
        )}
      </Box>

      {/* Use the separate Dialog component */}
      <TagManagerDialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        onSubmit={handleDialogSubmit}
        initialData={editingTag}
        isSubmitting={dialogSubmitting}
      />
    </Container>
  );
};