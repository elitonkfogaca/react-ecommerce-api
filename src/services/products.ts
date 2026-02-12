// src/services/products.ts
import { apiClient } from './api';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  category_id: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  category?: Category;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  created_at: string;
  updated_at: string;
  product_count?: number;
}

export interface CreateProductData {
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  category_id: number;
}

export interface UpdateProductData extends Partial<CreateProductData> {}

export interface ProductFilters {
  name?: string;
  category_id?: number;
  min_price?: number;
  max_price?: number;
  skip?: number;
  limit?: number;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  total?: number;
  page?: number;
  page_size?: number;
  total_pages?: number;
}

class ProductService {
  async getProducts(filters?: ProductFilters): Promise<Product[]> {
    const response = await apiClient.get<ApiResponse<Product[]>>('/api/v1/products', {
      params: filters,
    });
    return response.data.data;
  }

  async getProduct(id: number): Promise<Product> {
    const response = await apiClient.get<ApiResponse<Product>>(`/api/v1/products/${id}`);
    return response.data.data;
  }

  async createProduct(data: CreateProductData): Promise<Product> {
    const response = await apiClient.post<ApiResponse<Product>>('/api/v1/products', data);
    return response.data.data;
  }

  async updateProduct(id: number, data: UpdateProductData): Promise<Product> {
    const response = await apiClient.put<ApiResponse<Product>>(`/api/v1/products/${id}`, data);
    return response.data.data;
  }

  async updateStock(id: number, quantity: number): Promise<Product> {
    const response = await apiClient.patch<ApiResponse<Product>>(
      `/api/v1/products/${id}/stock`,
      { stock_quantity: quantity }
    );
    return response.data.data;
  }

  async deleteProduct(id: number): Promise<void> {
    await apiClient.delete(`/api/v1/products/${id}`);
  }
}

export const productService = new ProductService();