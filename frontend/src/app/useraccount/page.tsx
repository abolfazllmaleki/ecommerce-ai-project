'use client';
import React from 'react';
import UserPageLayout from '../components/UserPageLayout/UserPageLayout';
import Sidebar from '../components/Sidebar/Sidebar';
import UserProfile from '../components/UserProfile/UserProfile';
import { useAuth } from '../context/AuthContext'; // Add this import

const AccountPage: React.FC = () => {

  return (
    <UserPageLayout>
<div className="flex gap-6">
  <div className="w-1/4">
    <Sidebar />
  </div>
  <div className="w-3/4 flex flex-col gap-4">
    <UserProfile />
  </div>
</div>
    </UserPageLayout>
  );
};

export default AccountPage;