import api from './api';
import { Task, TaskInput, priorityToNumber } from '../types';

export const taskService = {
  getTasks: async () => {
    const response = await api.get<Task[]>('/tasks');
    return response.data;
  },

  createTask: async (taskData: Partial<Task>) => {
    try {
      const formattedTask = {
        title: taskData.title,
        description: taskData.description || '',
        status: taskData.status || 'Em andamento',
        priority: priorityToNumber(taskData.priority || 'none'),
      };

      const response = await api.post<Task>('/tasks', formattedTask);
      
      if (taskData.tags && taskData.tags.length > 0 && response.data.id) {
        await Promise.all(
          taskData.tags.map(tag =>
            api.post(`/tasks/${response.data.id}/tags`, { tagId: tag.id })
          )
        );
      }

      return response.data;
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        console.error('Error creating task:', (error as any).response?.data);
      } else {
        console.error('Error creating task:', error);
      }
      throw error;
    }
  },


  updateTask: async (id: string, taskData: Partial<Task>) => {
    const formattedTask = {
      ...(taskData.title && { title: taskData.title }),
      ...(taskData.description && { description: taskData.description }),
      ...(taskData.status && { status: taskData.status }),
      ...(taskData.priority && { priority: priorityToNumber(taskData.priority) }), 
    };

    const response = await api.put<Task>(`/tasks/${id}`, formattedTask);
    
    if (taskData.tags && response.data.id) {
    }

    return response.data;
  },

  deleteTask: async (id: string) => {
    await api.delete(`/tasks/${id}`);
  },
};