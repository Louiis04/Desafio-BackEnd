// Interfaces principais
export interface User {
    id: string;
    name: string; // Alterado de username para name para corresponder ao modelo do backend
    email: string;
  }
  
  export interface Tag {
    id: string;
    name: string;
    color: string;
    createdAt?: string;
    updatedAt?: string;
  }
  
  // Enums e Types
  export type Priority = 'none' | 'low' | 'medium' | 'high';
  export type TaskStatus = 'Em andamento' | 'Finalizado';
  
  // Interface principal de Task
  export interface Task {
    id: string;
    title: string;
    description: string;
    priority: Priority;
    tags: Tag[];
    status: TaskStatus;
    completed: boolean;
    userId?: string; // Adicionado para corresponder ao modelo do backend
    createdAt: string;
    updatedAt: string;
  }
  
  // Interface para criação/atualização de Task
  export interface TaskInput {
    title: string;
    description?: string;
    priority: Priority;
    status: TaskStatus;
    tags?: string[]; // IDs das tags
  }
  
  // Interface de resposta de autenticação
  export interface AuthResponse {
    token: string;
    user: User;
  }
  
  // Funções auxiliares para conversão de prioridade
  export const priorityToNumber = (priority: Priority): number => {
    const priorityMap: Record<Priority, number> = {
      'none': 1,
      'low': 2,
      'medium': 3,
      'high': 4
    };
    return priorityMap[priority] || 1;
  };
  
  export const numberToPriority = (priority: number): Priority => {
    const priorityMap: Record<number, Priority> = {
      1: 'none',
      2: 'low',
      3: 'medium',
      4: 'high'
    };
    return priorityMap[priority] || 'none';
  };
  
  // Funções auxiliares para status
  export const isValidStatus = (status: string): status is TaskStatus => {
    return ['Em andamento', 'Finalizado'].includes(status);
  };
  
  // Interface para erros da API
  export interface ApiError {
    error: string;
    message?: string;
    statusCode?: number;
  }
  
  // Tipos para respostas da API
  export type ApiResponse<T> = {
    data: T;
    message?: string;
    success: boolean;
  };
  
  // Interface para filtros de busca
  export interface TaskFilters {
    status?: TaskStatus;
    priority?: Priority;
    tags?: string[];
    search?: string;
  }