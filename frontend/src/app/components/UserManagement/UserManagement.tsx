'use client';
import { useState, useEffect } from 'react';
import { User } from '../../types/types';
import UserForm from '../UserForm/UserForm';
import UserTable from '../UserTable/UserTable';

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:3000/users');
        if (!response.ok) throw new Error('Failed to fetch users');
        const { data } = await response.json();
        
        const transformedUsers = data.map((user: any) => ({
          ...user,
          id: user._id,
          _id: undefined
        }));
        
        setUsers(transformedUsers);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleAddUser = async (newUser: Omit<User, 'id'>) => {
    try {
      const response = await fetch('http://localhost:3000/users', {
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
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create user');
    }
  };

  const handleRemoveUser = async (userId: string) => {
    try {
      const response = await fetch(`http://localhost:3000/users/${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete user');
      
      setUsers(prev => prev.filter(u => u.id !== userId));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user');
    }
  };

  if (loading) return (
    <div className="text-center py-8">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
    </div>
  );

  if (error) return (
    <div className="bg-red-50 text-red-500 p-4 rounded-lg mx-4 mt-6">
      Error: {error}
    </div>
  );

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-8">User Management</h2>
      <div className="space-y-8">
        <UserForm onSubmit={handleAddUser} />
        <div className="border-t border-gray-200 pt-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Registered Users</h3>
          <UserTable users={users} onRemove={handleRemoveUser} />
        </div>
      </div>
    </div>
  );
};

export default UserManagement;