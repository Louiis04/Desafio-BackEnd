import React, { useState, useEffect } from 'react';
import { Container, Box, Button, Typography } from '@mui/material';
import { Add } from '@mui/icons-material';
import { TaskList } from '../components/tasks/TaskList';
import { TaskForm } from '../components/tasks/TaskForm';
import { taskService } from '../services/taskService';
import { tagService } from '../services/tagService';
import { useNotification } from '../Context/NotificationContext';
import { Task, Tag } from '../types';

export const TasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const { showNotification } = useNotification();

  useEffect(() => {
    loadTasks();
    loadTags();
  }, []);

  const loadTasks = async () => {
    try {
      const data = await taskService.getTasks();
      setTasks(data);
    } catch (error) {
      console.error('Failed to load tasks:', error);
      showNotification('Failed to load tasks', 'error');
    }
  };

  const loadTags = async () => {
    try {
      const data = await tagService.getTags();
      console.log('Loaded tags:', data); // Debug log
      setTags(data);
    } catch (error) {
      console.error('Failed to load tags:', error);
      showNotification('Failed to load tags', 'error');
    }
  };

  const handleCreateTask = async (taskData: Partial<Task>) => {
    try {
      console.log('Creating task with data:', taskData); // Debug log
      await taskService.createTask(taskData);
      showNotification('Task created successfully', 'success');
      loadTasks();
      setIsFormOpen(false);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Unknown error';

      // Safe type checking for axios error structure
      const axiosError = error as { response?: { data?: any } };
      console.error('Failed to create task:', axiosError.response?.data || errorMessage); // Log detalhado do erro
      
      showNotification(
        `Failed to create task: ${axiosError.response?.data?.error || errorMessage}`,
        'error'
      );
    }
  };

  const handleUpdateTask = async (taskData: Partial<Task>) => {
    if (!editingTask) return;
    try {
      await taskService.updateTask(editingTask.id, taskData);
      showNotification('Task updated successfully', 'success');
      loadTasks();
      setEditingTask(undefined);
    } catch (error) {
      console.error('Failed to update task:', error);
      showNotification('Failed to update task', 'error');
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await taskService.deleteTask(id);
      showNotification('Task deleted successfully', 'success');
      loadTasks();
    } catch (error) {
      console.error('Failed to delete task:', error);
      showNotification('Failed to delete task', 'error');
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h4">My Tasks</Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setIsFormOpen(true)}
          >
            Add Task
          </Button>
        </Box>

        <TaskList
          tasks={tasks}
          onDelete={handleDeleteTask}
          onEdit={setEditingTask}
        />

        <TaskForm
          open={isFormOpen || !!editingTask}
          onClose={() => {
            setIsFormOpen(false);
            setEditingTask(undefined);
          }}
          onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
          initialData={editingTask}
          tags={tags} // Passando as tags carregadas para o TaskForm
        />
      </Box>
    </Container>
  );
};