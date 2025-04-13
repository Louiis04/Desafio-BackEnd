import React, { useState, useEffect, useMemo } from 'react';
import { Container, Box, Button, Typography, CircularProgress, Stack } from '@mui/material';
import { Add } from '@mui/icons-material';
import { TaskList } from '../components/tasks/TaskList';
import { TaskForm } from '../components/tasks/TaskForm';
import { TaskFilters } from '../components/tasks/TaskFilter';
import { taskService } from '../services/taskService';
import { tagService } from '../services/tagService';
import { useNotification } from '../Context/NotificationContext';
import { Task, Tag, Priority, TaskStatus } from '../types';

export const TasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [loading, setLoading] = useState(true);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const { showNotification } = useNotification();

  const [search, setSearch] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<Priority | 'all'>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus | 'all'>('all');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [tasksData, tagsData] = await Promise.all([
          taskService.getTasks(),
          tagService.getTags(),
        ]);
        setTasks(tasksData);
        setTags(tagsData);
      } catch (error) {
        console.error('Failed to load data:', error);
        showNotification('Failed to load tasks or tags', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const loadTasks = async () => {
    try {
      const data = await taskService.getTasks();
      setTasks(data);
    } catch (error) {
      console.error('Failed to reload tasks:', error);
      showNotification('Failed to reload tasks', 'error');
    }
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase()) ||
                            task.description.toLowerCase().includes(search.toLowerCase());
      const matchesPriority = selectedPriority === 'all' || task.priority === selectedPriority;
      const matchesStatus = selectedStatus === 'all' || task.status === selectedStatus;
      const matchesTags = selectedTags.length === 0 ||
                          selectedTags.every(tagId => task.tags?.some(taskTag => taskTag.id === tagId));

      return matchesSearch && matchesPriority && matchesStatus && matchesTags;
    });
  }, [tasks, search, selectedPriority, selectedStatus, selectedTags]);

  const handleCreateTask = async (taskData: Partial<Task>) => {
    setFormSubmitting(true);
    try {
      await taskService.createTask(taskData);
      showNotification('Task created successfully', 'success');
      loadTasks();
      setIsFormOpen(false);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Unknown error';

      const axiosError = error as { response?: { data?: any } };
      console.error('Failed to create task:', axiosError.response?.data || errorMessage);
      
      showNotification(
        `Failed to create task: ${axiosError.response?.data?.error || errorMessage}`,
        'error'
      );
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleUpdateTask = async (taskData: Partial<Task>) => {
    if (!editingTask) return;
    setFormSubmitting(true);
    try {
      await taskService.updateTask(editingTask.id, taskData);
      showNotification('Task updated successfully', 'success');
      loadTasks();
      setEditingTask(undefined);
      setIsFormOpen(false);
    } catch (error) {
      console.error('Failed to update task:', error);
      showNotification('Failed to update task', 'error');
    } finally {
      setFormSubmitting(false);
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

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTask(undefined);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Typography variant="h4">My Tasks</Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setIsFormOpen(true)}
            disabled={loading}
          >
            Add Task
          </Button>
        </Stack>

        <TaskFilters
          search={search}
          setSearch={setSearch}
          selectedPriority={selectedPriority}
          setSelectedPriority={setSelectedPriority}
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
          availableTags={tags}
        />

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TaskList
            tasks={filteredTasks}
            onDelete={handleDeleteTask}
            onEdit={handleEdit}
          />
        )}

        <TaskForm
          open={isFormOpen}
          onClose={handleCloseForm}
          onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
          initialData={editingTask}
          tags={tags}
          isSubmitting={formSubmitting}
        />
      </Box>
    </Container>
  );
};