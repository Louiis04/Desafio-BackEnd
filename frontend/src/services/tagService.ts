import api from './api';
import { Tag } from '../types';

export const tagService = {
  getTags: async () => {
    try {
      const response = await api.get<Tag[]>('/tags');
      return response.data;
    } catch (error) {
      console.error('Error fetching tags:', error);
      throw error;
    }
  },

  createTag: async (tagData: { name: string; color: string }) => {
    const response = await api.post<Tag>('/tags', tagData);
    return response.data;
  },

  updateTag: async (id: string, tagData: { name: string; color: string }) => {
    const response = await api.put<Tag>(`/tags/${id}`, tagData);
    return response.data;
  },

  deleteTag: async (id: string) => {
    await api.delete(`/tags/${id}`);
  },
};