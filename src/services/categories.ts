// src/services/categories.ts
import { apiClient } from './api';
import { Category } from './products';

export type { Category };

export interface CreateCategoryData {
  name: string;
  description?: string;
}

export interface UpdateCategoryData extends Partial<CreateCategoryData> {}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

class CategoryService {
  async getCategories(): Promise<Category[]> {
    const response = await apiClient.get<ApiResponse<Category[]>>('/api/v1/categories');
    return response.data.data;
  }

  async getCategory(id: number): Promise<Category> {
    const response = await apiClient.get<ApiResponse<Category>>(`/api/v1/categories/${id}`);
    return response.data.data;
  }

  async getCategoryBySlug(slug: string): Promise<Category> {
    const response = await apiClient.get<ApiResponse<Category>>(`/api/v1/categories/slug/${slug}`);
    return response.data.data;
  }

  async createCategory(data: CreateCategoryData): Promise<Category> {
    const response = await apiClient.post<ApiResponse<Category>>('/api/v1/categories', data);
    return response.data.data;
  }

  async updateCategory(id: number, data: UpdateCategoryData): Promise<Category> {
    const response = await apiClient.put<ApiResponse<Category>>(`/api/v1/categories/${id}`, data);
    return response.data.data;
  }

  async deleteCategory(id: number): Promise<void> {
    await apiClient.delete(`/api/v1/categories/${id}`);
  }
}

export const categoryService = new CategoryService();