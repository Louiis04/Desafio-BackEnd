export interface User {
    id: string;
    name: string; 
    email: string;
  }
  
  export interface Tag {
    id: string;
    name: string;
    color: string;
    createdAt?: string;
    updatedAt?: string;
  }
  
  export type Priority = 'none' | 'low' | 'medium' | 'high';
  export type TaskStatus = 'Em andamento' | 'Finalizado';
  
  export interface Task {
    id: string;
    title: string;
    description: string;
    priority: Priority;
    tags: Tag[];
    status: TaskStatus;
    completed: boolean;
    userId?: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface TaskInput {
    title: string;
    description?: string;
    priority: Priority;
    status: TaskStatus;
    tags?: string[]; 
  }
  
  export interface AuthResponse {
    token: string;
    user: User;
  }
  
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
  
  export const isValidStatus = (status: string): status is TaskStatus => {
    return ['Em andamento', 'Finalizado'].includes(status);
  };
  
  export interface ApiError {
    error: string;
    message?: string;
    statusCode?: number;
  }
  
  export type ApiResponse<T> = {
    data: T;
    message?: string;
    success: boolean;
  };
  
  export interface TaskFilters {
    status?: TaskStatus;
    priority?: Priority;
    tags?: string[];
    search?: string;
  }