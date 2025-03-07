import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Chip,
} from '@mui/material';
import { Task, Priority, Tag, TaskStatus } from '../../types';

interface TaskFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (task: Partial<Task>) => void;
  initialData?: Task;
  tags: Tag[];
}

export const TaskForm: React.FC<TaskFormProps> = ({
    open,
    onClose,
    onSubmit,
    initialData,
    tags,
  }) => {
    const [title, setTitle] = useState(initialData?.title || '');
    const [description, setDescription] = useState(initialData?.description || '');
    const [priority, setPriority] = useState<Priority>(initialData?.priority || 'none');
    const [status, setStatus] = useState<TaskStatus>(initialData?.status || 'Em andamento');
    const [selectedTags, setSelectedTags] = useState<string[]>(
      initialData?.tags?.map((tag) => tag.id) || []
    );

  // Reset form when initialData changes
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description);
      setPriority(initialData.priority);
      setSelectedTags(initialData.tags?.map((tag) => tag.id) || []);
    } else {
      setTitle('');
      setDescription('');
      setPriority('none');
      setSelectedTags([]);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      description,
      priority,
      status,
      tags: tags.filter((tag) => selectedTags.includes(tag.id)),
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {initialData ? 'Edit Task' : 'Create New Task'}
      </DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            margin="normal"
            multiline
            rows={4}
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
              label="Status"
            >
              <MenuItem value="Em andamento">Em andamento</MenuItem>
              <MenuItem value="Finalizado">Finalizado</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Priority</InputLabel>
            <Select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              label="Priority"
            >
              <MenuItem value="none">None</MenuItem>
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Tags</InputLabel>
            <Select
              multiple
              value={selectedTags}
              onChange={(e) => {
                const value = e.target.value;
                setSelectedTags(typeof value === 'string' ? [] : value);
              }}
              label="Tags"
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((tagId) => {
                    const tag = tags.find((t) => t.id === tagId);
                    return tag ? (
                      <Chip
                        key={tag.id}
                        label={tag.name}
                        sx={{
                          backgroundColor: tag.color,
                          color: '#fff',
                        }}
                      />
                    ) : null;
                  })}
                </Box>
              )}
            >
              {tags.map((tag) => (
                <MenuItem key={tag.id} value={tag.id}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      sx={{
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        backgroundColor: tag.color,
                      }}
                    />
                    {tag.name}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          {initialData ? 'Save' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};