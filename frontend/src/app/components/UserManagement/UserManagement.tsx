'use client';
import { useState, useEffect } from 'react';
import { FiUserPlus, FiUsers, FiRefreshCw, FiTrash2, FiEdit2, FiCheckCircle, FiAlertCircle, FiShield } from 'react-icons/fi';
import { User } from '../../types/types';
import UserForm from '../UserForm/UserForm';
import UserTable from '../UserTable/UserTable';

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    admins: 0
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users`);
      
      if (!response.ok) throw new Error('Failed to fetch users');
      
      const { data } = await response.json();
      const transformedUsers = data.map((user: any) => ({
        ...user,
        id: user._id,
        _id: undefined
      }));
      
      setUsers(transformedUsers);
      
      // Calculate stats
      setStats({
        total: data.length,
        active: data.filter((u: any) => u.status === 'active').length,
        admins: data.filter((u: any) => u.role === 'admin').length
      });
      
      showSuccess('Users loaded successfully');
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const showError = (message: string) => {
    setError(message);
    setTimeout(() => setError(null), 5000);
  };

  const showSuccess = (message: string) => {
    setSuccess(message);
    setTimeout(() => setSuccess(null), 5000);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = async (newUser: Omit<User, 'id'>) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) throw new Error('Failed to create user');
      
      const createdUser = await response.json();
      
      setUsers(prev => [...prev, {
        ...createdUser,
        id: createdUser._id,
        _id: undefined
      }]);
      
      showSuccess('User created successfully');
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Failed to create user');
    }
  };

  const handleRemoveUser = async (userId: string) => {
    try {
      const response = await fetch(`${process.env.NUBLIC_BACKEND_URL}/users/${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete user');
      
      setUsers(prev => prev.filter(u => u.id !== userId));
      showSuccess('User deleted successfully');
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Failed to delete user');
    }
  };

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          {/* <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
            User Dashboard
          </h1>
          <p className="text-gray-500">Manage your system users and permissions</p> */}
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={fetchUsers}
            className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 px-4 py-2.5 rounded-xl border border-gray-200 shadow-xs transition-all hover:shadow-sm"
          >
            <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-red-50 to-white p-5 rounded-xl border border-red-100 shadow-xs">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Total Users</p>
              <h3 className="text-2xl font-bold mt-1">{stats.total}</h3>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <FiUsers className="text-red-500 w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-white p-5 rounded-xl border border-green-100 shadow-xs">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Active Users</p>
              <h3 className="text-2xl font-bold mt-1">{stats.active}</h3>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <FiCheckCircle className="text-green-500 w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-white p-5 rounded-xl border border-purple-100 shadow-xs">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Admin Users</p>
              <h3 className="text-2xl font-bold mt-1">{stats.admins}</h3>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <FiShield className="text-purple-500 w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Status Toasts */}
      {error && (
        <div className="animate-fade-in-up bg-red-50 border-l-4 border-red-500 p-4 rounded-lg flex items-start gap-3 shadow-lg">
          <FiAlertCircle className="text-red-500 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
          <button 
            onClick={() => setError(null)}
            className="text-red-500 hover:text-red-700"
          >
            &times;
          </button>
        </div>
      )}

      {success && (
        <div className="animate-fade-in-up bg-green-50 border-l-4 border-green-500 p-4 rounded-lg flex items-start gap-3 shadow-lg">
          <FiCheckCircle className="text-green-500 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-green-700 font-medium">{success}</p>
          </div>
          <button 
            onClick={() => setSuccess(null)}
            className="text-green-500 hover:text-green-700"
          >
            &times;
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add User Card */}
        <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-red-50 to-white px-6 py-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <FiUserPlus className="text-red-500" />
              <span>Add New User</span>
            </h3>
          </div>
          <div className="p-6">
            <UserForm onSubmit={handleAddUser} />
          </div>
        </div>

        {/* User Table Card */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-red-50 to-white px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-semibold text-gray-800">User Directory</h3>
            <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-medium">
              {users.length} {users.length === 1 ? 'user' : 'users'}
            </span>
          </div>
          <div className="p-1">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-red-500"></div>
                <p className="text-gray-500">Loading users...</p>
              </div>
            ) : (
              <UserTable
                users={users}
                onRemove={handleRemoveUser}
              />
            )}
          </div>
        </div>
      </div>

      {/* Custom Animation CSS */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default UserManagement;