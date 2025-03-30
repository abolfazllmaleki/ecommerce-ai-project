'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const SignupPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/auth/register', {  // ✅ Connects to NestJS
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      if (response.ok) {
        router.push('/login'); // Redirect to login
      } else {
        const error = await response.json();
        console.log(error.message);
        alert(error.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  return (
    <div className="flex h-screen w-screen bg-gray-50">
      {/* Form Section */}
      <div className="flex-1 flex flex-col justify-center px-16 bg-white shadow-lg">
        <h2 className="text-2xl font-bold mb-2">Create an account</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-red-400"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-red-400"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-red-400"
            required
          />
          <button
            type="submit"
            className="w-full bg-red-500 text-white py-2 text-sm rounded hover:bg-red-600 transition"
          >
            Create Account
          </button>
        </form>
        <p className="text-gray-600 mt-6 text-center">
          Already have an account?{" "}
          <a href="/login" className="text-red-500 hover:underline">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
