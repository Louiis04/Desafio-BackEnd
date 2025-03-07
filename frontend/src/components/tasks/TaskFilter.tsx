import React from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
} from '@mui/material';
import { Priority, Tag } from '../../types';

interface TaskFiltersProps {
  search: string;
  setSearch: (value: string) => void;
  selectedPriority: Priority | 'all';
  setSelectedPriority: (priority: Priority | 'all') => void;
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
  availableTags: Tag[];
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({
  search,
  setSearch,
  selectedPriority,
  setSelectedPriority,
  selectedTags,
  setSelectedTags,
  availableTags,
}) => {
  return (
    <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
      <TextField
        label="Search tasks"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ minWidth: 200 }}
      />

      <FormControl sx={{ minWidth: 150 }}>
        <InputLabel>Priority</InputLabel>
        <Select
          value={selectedPriority}
          onChange={(e) => setSelectedPriority(e.target.value as Priority | 'all')}
          label="Priority"
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="none">None</MenuItem>
          <MenuItem value="low">Low</MenuItem>
          <MenuItem value="medium">Medium</MenuItem>
          <MenuItem value="high">High</MenuItem>
        </Select>
      </FormControl>

      <FormControl sx={{ minWidth: 200 }}>
        <InputLabel>Tags</InputLabel>
        <Select
          multiple
          value={selectedTags}
          onChange={(e) => setSelectedTags(typeof e.target.value === 'string' ? [] : e.target.value)}
          input={<OutlinedInput label="Tags" />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((tagId) => {
                const tag = availableTags.find((t) => t.id === tagId);
                return tag ? (
                  <Chip
                    key={tag.id}
                    label={tag.name}
                    sx={{ backgroundColor: tag.color, color: 'white' }}
                  />
                ) : null;
              })}
            </Box>
          )}
        >
          {availableTags.map((tag) => (
            <MenuItem key={tag.id} value={tag.id}>
              {tag.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};