import React from 'react';
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Chip,
  Grid,
  OutlinedInput,
} from '@mui/material';
import { Priority, Tag, TaskStatus } from '../../types';

interface TaskFiltersProps {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  selectedPriority: Priority | 'all';
  setSelectedPriority: React.Dispatch<React.SetStateAction<Priority | 'all'>>;
  selectedTags: string[];
  setSelectedTags: React.Dispatch<React.SetStateAction<string[]>>;
  availableTags: Tag[];
  selectedStatus: TaskStatus | 'all';
  setSelectedStatus: React.Dispatch<React.SetStateAction<TaskStatus | 'all'>>;
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export const TaskFilters: React.FC<TaskFiltersProps> = ({
  search,
  setSearch,
  selectedPriority,
  setSelectedPriority,
  selectedTags,
  setSelectedTags,
  availableTags,
  selectedStatus,
  setSelectedStatus,
}) => {
  return (
    <Box sx={{ mb: 3 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            label="Search Tasks"
            variant="outlined"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
          />
        </Grid>

        <Grid item xs={6} sm={3} md={2}>
          <FormControl fullWidth size="small">
            <InputLabel>Priority</InputLabel>
            <Select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value as Priority | 'all')}
              label="Priority"
            >
              <MenuItem value="all">All Priorities</MenuItem>
              <MenuItem value="none">None</MenuItem>
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={6} sm={3} md={2}>
          <FormControl fullWidth size="small">
            <InputLabel>Status</InputLabel>
            <Select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as TaskStatus | 'all')}
              label="Status"
            >
              <MenuItem value="all">All Statuses</MenuItem>
              <MenuItem value="Em andamento">Em andamento</MenuItem>
              <MenuItem value="Finalizado">Finalizado</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={12} md={4}>
          <FormControl fullWidth size="small">
            <InputLabel>Tags</InputLabel>
            <Select
              multiple
              value={selectedTags}
              onChange={(e) => {
                const value = e.target.value;
                setSelectedTags(typeof value === 'string' ? value.split(',') : value);
              }}
              input={<OutlinedInput label="Tags" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((tagId) => {
                    const tag = availableTags.find((t) => t.id === tagId);
                    return tag ? (
                      <Chip
                        key={tag.id}
                        label={tag.name}
                        size="small"
                        sx={{ backgroundColor: tag.color, color: '#fff' }}
                        onMouseDown={(event) => {
                          event.stopPropagation();
                        }}
                      />
                    ) : null;
                  })}
                </Box>
              )}
              MenuProps={MenuProps}
            >
              {availableTags.length === 0 && <MenuItem disabled>No tags available</MenuItem>}
              {availableTags.map((tag) => (
                <MenuItem key={tag.id} value={tag.id}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      component="span"
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        backgroundColor: tag.color,
                        display: 'inline-block',
                        mr: 1,
                      }}
                    />
                    {tag.name}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  );
};