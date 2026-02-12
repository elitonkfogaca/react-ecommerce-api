// src/pages/Users.tsx
import { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { userService } from '../services/users';
import { authService, User } from '../services/auth';
import {
  Users as UsersIcon,
  Search,
  AlertCircle,
  Shield,
  User as UserIcon,
  Mail,
  Calendar,
  CheckCircle,
  XCircle,
  Edit2,
  Trash2,
} from 'lucide-react';

export const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      // Carrega usuário logado primeiro
      const userData = await authService.getCurrentUser();
      setCurrentUser(userData);
      
      // Tenta carregar lista de usuários (apenas admin)
      if (userData.role === 'admin') {
        try {
          const usersData = await userService.getUsers();
          setUsers(usersData);
        } catch (dataErr) {
          console.error('Error loading users:', dataErr);
          // Mantém array vazio
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load page data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleRole = async (id: number, currentRole: 'admin' | 'customer') => {
    if (!confirm(`Change user role to ${currentRole === 'admin' ? 'customer' : 'admin'}?`)) return;
    try {
      const newRole = currentRole === 'admin' ? 'customer' : 'admin';
      await userService.changeRole(id, newRole);
      await loadData();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to change user role');
    }
  };

  const handleToggleStatus = async (id: number, currentStatus: boolean) => {
    if (!confirm(`${currentStatus ? 'Deactivate' : 'Activate'} this user?`)) return;
    try {
      await userService.changeStatus(id, !currentStatus);
      await loadData();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to change user status');
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    try {
      await userService.deleteUser(id);
      await loadData();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to delete user');
    }
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  if (!isAdmin) {
    return (
      <Layout currentUser={currentUser || undefined}>
        <div className="text-center py-12">
          <Shield className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to view this page.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout currentUser={currentUser || undefined}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-600 mt-1">Manage user accounts and permissions</p>
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

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          />
        </div>

        {/* Users Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className={`bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition ${
                !user.is_active ? 'opacity-60' : ''
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  user.role === 'admin' ? 'bg-purple-100' : 'bg-blue-100'
                }`}>
                  {user.role === 'admin' ? (
                    <Shield className={`w-6 h-6 text-purple-600`} />
                  ) : (
                    <UserIcon className={`w-6 h-6 text-blue-600`} />
                  )}
                </div>
                
                {user.is_active ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {user.name}
                {user.id === currentUser?.id && (
                  <span className="ml-2 text-xs text-blue-600 font-medium">(You)</span>
                )}
              </h3>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span className="truncate">{user.email}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Joined {new Date(user.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <span className={`flex-1 px-3 py-1 rounded-full text-xs font-medium text-center ${
                  user.role === 'admin'
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {user.role.toUpperCase()}
                </span>
                
                <span className={`flex-1 px-3 py-1 rounded-full text-xs font-medium text-center ${
                  user.is_active
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {user.is_active ? 'ACTIVE' : 'INACTIVE'}
                </span>
              </div>

              {user.id !== currentUser?.id && (
                <div className="flex gap-2 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleToggleRole(user.id, user.role)}
                    className="flex-1 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition font-medium"
                  >
                    Toggle Role
                  </button>
                  
                  <button
                    onClick={() => handleToggleStatus(user.id, user.is_active)}
                    className="flex-1 px-3 py-2 text-sm text-yellow-600 hover:bg-yellow-50 rounded-lg transition font-medium"
                  >
                    {user.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                  
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <UsersIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No users found</p>
          </div>
        )}
      </div>
    </Layout>
  );
};