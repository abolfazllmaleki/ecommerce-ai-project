import React from 'react';

const PasswordChange: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-6">
      <h2 className="text-xl font-semibold mb-4">Password Change</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Current Password</label>
          <input type="password" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">New Password</label>
          <input type="password" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
          <input type="password" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
        </div>
      </div>
    </div>
  );
};

export default PasswordChange;