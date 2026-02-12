import { useAuth } from '../hooks/useAuth';
import { LogOut, Shield, CheckCircle } from 'lucide-react';

export const Dashboard = () => {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Authentication Successful</h2>
              <p className="text-gray-600">You are now logged in and viewing a protected route</p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Protected Content</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              This page is only accessible to authenticated users. Your JWT token is automatically
              included in all API requests via the Authorization header.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900 font-medium mb-2">How it works:</p>
              <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                <li>JWT token stored securely in localStorage</li>
                <li>Axios interceptor adds Bearer token to requests</li>
                <li>Protected routes redirect unauthenticated users</li>
                <li>Token cleared on logout or 401 responses</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure</h3>
            <p className="text-gray-600 text-sm">
              JWT-based authentication with secure token storage and automatic header injection
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Protected</h3>
            <p className="text-gray-600 text-sm">
              Route-level protection ensures only authenticated users can access sensitive areas
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center mb-4">
              <LogOut className="w-6 h-6 text-slate-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Managed</h3>
            <p className="text-gray-600 text-sm">
              Clean logout flow with token cleanup and automatic redirection to login
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};
