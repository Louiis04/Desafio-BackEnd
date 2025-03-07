import React from 'react';
import { 
  List, 
  ListItem, 
  ListItemText, 
  IconButton, 
  Chip,
  Box,
  Typography 
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { Task, Priority } from '../../types';

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

export const TaskList: React.FC<TaskListProps> = ({ tasks, onDelete, onEdit }) => {
  return (
    <List>
      {tasks.map((task) => (
        <ListItem
          key={task.id}
          secondaryAction={
            <Box>
              <IconButton onClick={() => onEdit(task)}>
                <Edit />
              </IconButton>
              <IconButton onClick={() => onDelete(task.id)}>
                <Delete />
              </IconButton>
            </Box>
          }
        >
          <ListItemText
            primary={
              <Typography variant="h6">{task.title}</Typography>
            }
            secondary={
              <Box>
                <Typography>{task.description}</Typography>
                <Box sx={{ mt: 1 }}>
                  <Chip
                    label={task.priority}
                    color={priorityColors[task.priority] as any}
                    size="small"
                    sx={{ mr: 1 }}
                  />
                  {task.tags.map((tag) => (
                    <Chip
                      key={tag.id}
                      label={tag.name}
                      size="small"
                      sx={{
                        mr: 1,
                        backgroundColor: tag.color,
                        color: 'white',
                      }}
                    />
                  ))}
                </Box>
              </Box>
            }
          />
        </ListItem>
      ))}
    </List>
  );
};