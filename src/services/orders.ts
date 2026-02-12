// src/services/orders.ts
import { apiClient } from './api';

export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  product_id: number;
  quantity: number;
  price?: number;
}

export interface Order {
  id: number;
  user_id: number;
  total: number;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
  items: OrderItemResponse[];
}

export interface OrderItemResponse {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
  product?: {
    id: number;
    name: string;
  };
}

export interface CreateOrderData {
  items: OrderItem[];
}

export interface UpdateOrderStatusData {
  status: OrderStatus;
}

export interface OrderFilters {
  status?: OrderStatus;
  skip?: number;
  limit?: number;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

class OrderService {
  async getOrders(filters?: OrderFilters): Promise<Order[]> {
    const response = await apiClient.get<ApiResponse<Order[]>>('/api/v1/orders', {
      params: filters,
    });
    return response.data.data;
  }

  async getOrder(id: number): Promise<Order> {
    const response = await apiClient.get<ApiResponse<Order>>(`/api/v1/orders/${id}`);
    return response.data.data;
  }

  async createOrder(data: CreateOrderData): Promise<Order> {
    const response = await apiClient.post<ApiResponse<Order>>('/api/v1/orders', data);
    return response.data.data;
  }

  async updateOrderStatus(id: number, status: OrderStatus): Promise<Order> {
    const response = await apiClient.patch<ApiResponse<Order>>(
      `/api/v1/orders/${id}/status`,
      { status }
    );
    return response.data.data;
  }

  async cancelOrder(id: number): Promise<void> {
    await apiClient.delete(`/api/v1/orders/${id}`);
  }
}

export const orderService = new OrderService();