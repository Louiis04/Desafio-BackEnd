import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  IconButton,
  Chip,
  Box,
  Typography,
  Grid,
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { Task, Priority, TaskStatus } from '../../types';

interface TaskListProps {
  tasks: Task[];
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

const priorityColors: Record<Priority, string> = {
  none: 'default',
  low: 'success',
  medium: 'warning',
  high: 'error',
};

const getTaskStyle = (status: TaskStatus) => {
  return status === 'Finalizado' ? { textDecoration: 'line-through', opacity: 0.7 } : {};
};

export const TaskList: React.FC<TaskListProps> = ({ tasks, onDelete, onEdit }) => {
  if (!tasks || tasks.length === 0) {
    return <Typography sx={{ textAlign: 'center', mt: 4 }}>No tasks found.</Typography>;
  }

  return (
    <Grid container spacing={2}>
      {tasks.map((task) => (
        <Grid item xs={12} sm={6} md={4} key={task.id}>
          <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography
                variant="h6"
                component="div"
                sx={{ ...getTaskStyle(task.status), mb: 1 }}
              >
                {task.title}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ ...getTaskStyle(task.status), mb: 2 }}
              >
                {task.description}
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                <Chip
                  label={`Status: ${task.status}`}
                  size="small"
                  color={task.status === 'Finalizado' ? 'secondary' : 'primary'}
                  sx={{ mr: 1 }}
                />
                <Chip
                  label={`Priority: ${task.priority}`}
                  color={priorityColors[task.priority] as any}
                  size="small"
                  sx={{ mr: 1 }}
                />
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {task.tags?.map((tag) => (
                  <Chip
                    key={tag.id}
                    label={tag.name}
                    size="small"
                    sx={{
                      backgroundColor: tag.color,
                      color: 'white',
                    }}
                  />
                ))}
              </Box>
            </CardContent>
            <CardActions sx={{ justifyContent: 'flex-end' }}>
              <IconButton size="small" onClick={() => onEdit(task)}>
                <Edit />
              </IconButton>
              <IconButton size="small" onClick={() => onDelete(task.id)}>
                <Delete />
              </IconButton>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};