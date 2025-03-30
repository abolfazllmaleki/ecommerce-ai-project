'use client';
import { useState } from 'react';
import { User } from '../../types/types';

interface UserFormProps {
  onSubmit: (user: Omit<User, 'id'> & { password: string }) => void;
}

const UserForm = ({ onSubmit }: UserFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = 'Invalid email address';
    }
    
    if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    onSubmit({
      name: formData.name,
      email: formData.email,
      password: formData.password
    });
    
    setFormData({ name: '', email: '', password: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {['name', 'email', 'password'].map((field) => (
          <div key={field} className="space-y-2">
            <label
              htmlFor={field}
              className="block text-sm font-medium text-gray-700"
            >
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </label>
            <input
              type={field === 'password' ? 'password' : field === 'email' ? 'email' : 'text'}
              id={field}
              value={formData[field as keyof typeof formData]}
              onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
              className={`w-full px-4 py-2 rounded-lg border ${
                errors[field] ? 'border-red-500' : 'border-gray-300'
              } focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all`}
            />
            {errors[field] && (
              <p className="text-sm text-red-500 mt-1">{errors[field]}</p>
            )}
          </div>
        ))}
      </div>

      <button
        type="submit"
        className="mt-6 w-full sm:w-auto px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 font-medium shadow-sm hover:shadow-md"
      >
        Add User
      </button>
    </form>
  );
};

export default UserForm;