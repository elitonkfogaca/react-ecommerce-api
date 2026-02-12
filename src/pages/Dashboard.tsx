import { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { authService, User } from '../services/auth';
import { productService } from '../services/products';
import { orderService } from '../services/orders';
import { categoryService } from '../services/categories';
import { 
  Package, 
  ShoppingCart, 
  Tag, 
  TrendingUp,
  AlertCircle,
  DollarSign,
  Users,
  RefreshCw,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const Dashboard = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalCategories: 0,
    pendingOrders: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      // Carrega o usuário primeiro
      const userData = await authService.getCurrentUser();
      setCurrentUser(userData);

      // Tenta carregar os dados, mas não falha se der erro
      try {
        const [products, orders, categories] = await Promise.all([
          productService.getProducts().catch(() => []),
          orderService.getOrders().catch(() => []),
          categoryService.getCategories().catch(() => []),
        ]);

        setStats({
          totalProducts: products.length,
          totalOrders: orders.length,
          totalCategories: categories.length,
          pendingOrders: orders.filter(o => o.status === 'pending').length,
        });
      } catch (statsErr) {
        console.error('Error loading stats:', statsErr);
        // Stats permanecem em 0, mas não exibe erro
      }
    } catch (err: any) {
      console.error('Error loading user data:', err);
      setError(err.response?.data?.detail || 'Failed to load user data');
    } finally {
      setIsLoading(false);
    }
  };

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
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {currentUser?.name || 'User'}! 👋
          </h1>
          <p className="text-gray-600 mt-1">
            Here's what's happening with your e-commerce today
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-red-800">{error}</p>
              <button
                onClick={() => {
                  setError('');
                  loadData();
                }}
                className="text-sm text-red-600 hover:text-red-700 font-medium mt-2 flex items-center gap-1"
              >
                <RefreshCw className="w-4 h-4" />
                Try again
              </button>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link to="/products" className="block">
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {stats.totalProducts}
              </h3>
              <p className="text-gray-600 text-sm">Total Products</p>
              {stats.totalProducts === 0 && (
                <p className="text-xs text-gray-500 mt-1">Click to add products</p>
              )}
            </div>
          </Link>

          <Link to="/orders" className="block">
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-green-600" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {stats.totalOrders}
              </h3>
              <p className="text-gray-600 text-sm">Total Orders</p>
              {stats.totalOrders === 0 && (
                <p className="text-xs text-gray-500 mt-1">No orders yet</p>
              )}
            </div>
          </Link>

          <Link to="/categories" className="block">
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Tag className="w-6 h-6 text-purple-600" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {stats.totalCategories}
              </h3>
              <p className="text-gray-600 text-sm">Categories</p>
              {stats.totalCategories === 0 && (
                <p className="text-xs text-gray-500 mt-1">Click to add categories</p>
              )}
            </div>
          </Link>

          <Link to="/orders" className="block">
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-yellow-600" />
                </div>
                {stats.pendingOrders > 0 ? (
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                ) : (
                  <TrendingUp className="w-5 h-5 text-green-600" />
                )}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {stats.pendingOrders}
              </h3>
              <p className="text-gray-600 text-sm">Pending Orders</p>
              {stats.pendingOrders === 0 && (
                <p className="text-xs text-gray-500 mt-1">All caught up!</p>
              )}
            </div>
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Link
              to="/products"
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition"
            >
              <Package className="w-5 h-5 text-blue-600" />
              <div>
                <h3 className="font-semibold text-gray-900">Manage Products</h3>
                <p className="text-sm text-gray-600">Add or edit products</p>
              </div>
            </Link>

            <Link
              to="/orders"
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition"
            >
              <ShoppingCart className="w-5 h-5 text-green-600" />
              <div>
                <h3 className="font-semibold text-gray-900">View Orders</h3>
                <p className="text-sm text-gray-600">Process customer orders</p>
              </div>
            </Link>

            <Link
              to="/categories"
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition"
            >
              <Tag className="w-5 h-5 text-purple-600" />
              <div>
                <h3 className="font-semibold text-gray-900">Categories</h3>
                <p className="text-sm text-gray-600">Organize your catalog</p>
              </div>
            </Link>
          </div>
        </div>

        {/* User Info */}
        {currentUser && (
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-md p-6 text-white">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <Users className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{currentUser.name}</h2>
                <p className="text-blue-100">{currentUser.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm font-medium">
                    {currentUser.role?.toUpperCase() || 'USER'}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    currentUser.is_active 
                      ? 'bg-green-500 bg-opacity-80' 
                      : 'bg-red-500 bg-opacity-80'
                  }`}>
                    {currentUser.is_active ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};
