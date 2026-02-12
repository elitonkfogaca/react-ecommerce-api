// src/pages/Orders.tsx
import { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { orderService, Order, OrderStatus, CreateOrderData, OrderItem } from '../services/orders';
import { productService, Product } from '../services/products';
import { authService, User } from '../services/auth';
import {
  ShoppingCart,
  Plus,
  AlertCircle,
  X,
  Package,
  Clock,
  CheckCircle,
  Truck,
  Ban,
  DollarSign,
  Filter,
} from 'lucide-react';

export const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | ''>('');
  const [orderItems, setOrderItems] = useState<OrderItem[]>([{ product_id: 0, quantity: 1 }]);

  useEffect(() => {
    loadData();
  }, [selectedStatus]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      // Carrega usuário primeiro
      const userData = await authService.getCurrentUser();
      setCurrentUser(userData);
      
      // Tenta carregar orders e products
      try {
        const filters = selectedStatus ? { status: selectedStatus } : undefined;
        const [ordersData, productsData] = await Promise.all([
          orderService.getOrders(filters).catch(() => []),
          productService.getProducts().catch(() => []),
        ]);
        setOrders(ordersData);
        setProducts(productsData);
      } catch (dataErr) {
        console.error('Error loading data:', dataErr);
        // Mantém arrays vazios
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load page data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const validItems = orderItems.filter(item => item.product_id > 0 && item.quantity > 0);
      if (validItems.length === 0) {
        setError('Please add at least one product to the order');
        return;
      }
      
      const orderData: CreateOrderData = { items: validItems };
      await orderService.createOrder(orderData);
      await loadData();
      handleCloseModal();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to create order');
    }
  };

  const handleUpdateStatus = async (id: number, status: OrderStatus) => {
    try {
      await orderService.updateOrderStatus(id, status);
      await loadData();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to update order status');
    }
  };

  const handleCancelOrder = async (id: number) => {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    try {
      await orderService.cancelOrder(id);
      await loadData();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to cancel order');
    }
  };

  const handleOpenModal = () => {
    setOrderItems([{ product_id: 0, quantity: 1 }]);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setOrderItems([{ product_id: 0, quantity: 1 }]);
  };

  const addOrderItem = () => {
    setOrderItems([...orderItems, { product_id: 0, quantity: 1 }]);
  };

  const removeOrderItem = (index: number) => {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  };

  const updateOrderItem = (index: number, field: keyof OrderItem, value: number) => {
    const newItems = [...orderItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setOrderItems(newItems);
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'paid': return <DollarSign className="w-5 h-5 text-green-600" />;
      case 'shipped': return <Truck className="w-5 h-5 text-blue-600" />;
      case 'delivered': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'cancelled': return <Ban className="w-5 h-5 text-red-600" />;
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
    }
  };

  const isAdmin = currentUser?.role === 'admin';

  if (isLoading) {
    return (
      <Layout currentUser={currentUser || undefined}>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout currentUser={currentUser || undefined}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
            <p className="text-gray-600 mt-1">Manage customer orders</p>
          </div>
          <button
            onClick={handleOpenModal}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
          >
            <Plus className="w-5 h-5" />
            New Order
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-red-800">{error}</p>
              <button
                onClick={() => setError('')}
                className="text-sm text-red-600 hover:text-red-700 font-medium mt-1"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Filter */}
        <div className="flex gap-4 items-center">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as OrderStatus | '')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <ShoppingCart className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Order #{order.id}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {new Date(order.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    {order.status.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Order Items */}
              <div className="border-t border-gray-200 pt-4 mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Items:</h4>
                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-700">
                          {item.product?.name || `Product #${item.product_id}`}
                        </span>
                        <span className="text-gray-500">x{item.quantity}</span>
                      </div>
                      <span className="font-medium text-gray-900">
                        ${item.price.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total & Actions */}
              <div className="flex justify-between items-center border-t border-gray-200 pt-4">
                <div className="text-lg font-bold text-gray-900">
                  Total: <span className="text-green-600">${order.total.toFixed(2)}</span>
                </div>
                
                <div className="flex gap-2">
                  {isAdmin && order.status !== 'cancelled' && order.status !== 'delivered' && (
                    <select
                      value={order.status}
                      onChange={(e) => handleUpdateStatus(order.id, e.target.value as OrderStatus)}
                      className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                    </select>
                  )}
                  
                  {order.status !== 'cancelled' && order.status !== 'delivered' && (
                    <button
                      onClick={() => handleCancelOrder(order.id)}
                      className="px-3 py-1 text-red-600 hover:bg-red-50 rounded-lg transition text-sm font-medium"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {orders.length === 0 && (
          <div className="text-center py-12">
            <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No orders found</p>
          </div>
        )}
      </div>

      {/* Create Order Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">New Order</h2>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="space-y-4">
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">Order Items</label>
                {orderItems.map((item, index) => (
                  <div key={index} className="flex gap-3 items-start">
                    <div className="flex-1">
                      <select
                        required
                        value={item.product_id}
                        onChange={(e) => updateOrderItem(index, 'product_id', Number(e.target.value))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      >
                        <option value={0}>Select product</option>
                        {products.filter(p => p.is_active).map((product) => (
                          <option key={product.id} value={product.id}>
                            {product.name} - ${product.price.toFixed(2)} ({product.stock_quantity} in stock)
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <input
                      type="number"
                      required
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateOrderItem(index, 'quantity', Number(e.target.value))}
                      className="w-24 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="Qty"
                    />
                    
                    {orderItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeOrderItem(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={addOrderItem}
                  className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition text-sm font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Add Item
                </button>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                >
                  Create Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};