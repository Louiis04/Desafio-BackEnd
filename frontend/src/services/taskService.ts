import api from './api';
import { Task, TaskInput, priorityToNumber } from '../types';

export const taskService = {
  getTasks: async () => {
    const response = await api.get<Task[]>('/tasks');
    return response.data;
  },

  createTask: async (taskData: Partial<Task>) => {
    try {
      console.log('Original task data:', taskData); // Debug log

      // Formata os dados conforme esperado pelo backend
      const formattedTask = {
        title: taskData.title,
        description: taskData.description || '',
        status: taskData.status || 'Em andamento',
        priority: priorityToNumber(taskData.priority || 'none'), // Converte para número
      };

      console.log('Formatted task data:', formattedTask); // Debug log

      const response = await api.post<Task>('/tasks', formattedTask);
      
      // Se há tags, associa elas à tarefa
      if (taskData.tags && taskData.tags.length > 0 && response.data.id) {
        await Promise.all(
          taskData.tags.map(tag =>
            api.post(`/tasks/${response.data.id}/tags`, { tagId: tag.id })
          )
        );
      }

      return response.data;
    } catch (error: any) {
      console.error('Error details:', error.response?.data); // Debug log
      throw error;
    }
  },

  updateTask: async (id: string, taskData: Partial<Task>) => {
    // Formata os dados para o backend
    const formattedTask = {
      ...(taskData.title && { title: taskData.title }),
      ...(taskData.description && { description: taskData.description }),
      ...(taskData.status && { status: taskData.status }),
      ...(taskData.priority && { priority: priorityToNumber(taskData.priority) }), // Converte para número
    };

    const response = await api.put<Task>(`/tasks/${id}`, formattedTask);
    
    // Atualiza as tags se necessário
    if (taskData.tags && response.data.id) {
      // Implementar lógica de atualização de tags se necessário
    }

    return response.data;
  },

  deleteTask: async (id: string) => {
    await api.delete(`/tasks/${id}`);
  },
};