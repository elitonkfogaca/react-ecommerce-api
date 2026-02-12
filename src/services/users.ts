// src/services/users.ts
import { apiClient } from './api';
import { User } from './auth';

export interface UpdateUserData {
  name?: string;
  email?: string;
}

export interface ChangePasswordData {
  current_password: string;
  new_password: string;
}

export interface ChangeRoleData {
  role: 'admin' | 'customer';
}

export interface ChangeStatusData {
  is_active: boolean;
}

export interface UserFilters {
  name?: string;
  email?: string;
  skip?: number;
  limit?: number;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

class UserService {
  async getUsers(filters?: UserFilters): Promise<User[]> {
    const response = await apiClient.get<ApiResponse<User[]>>('/api/v1/users', {
      params: filters,
    });
    return response.data.data;
  }

  async getUser(id: number): Promise<User> {
    const response = await apiClient.get<ApiResponse<User>>(`/api/v1/users/${id}`);
    return response.data.data;
  }

  async updateUser(id: number, data: UpdateUserData): Promise<User> {
    const response = await apiClient.put<ApiResponse<User>>(`/api/v1/users/${id}`, data);
    return response.data.data;
  }

  async changePassword(id: number, data: ChangePasswordData): Promise<void> {
    await apiClient.patch(`/api/v1/users/${id}/password`, data);
  }

  async changeRole(id: number, role: 'admin' | 'customer'): Promise<User> {
    const response = await apiClient.patch<ApiResponse<User>>(
      `/api/v1/users/${id}/role`,
      { role }
    );
    return response.data.data;
  }

  async changeStatus(id: number, is_active: boolean): Promise<User> {
    const response = await apiClient.patch<ApiResponse<User>>(
      `/api/v1/users/${id}/status`,
      { is_active }
    );
    return response.data.data;
  }

  async deleteUser(id: number): Promise<void> {
    await apiClient.delete(`/api/v1/users/${id}`);
  }
}

export const userService = new UserService();