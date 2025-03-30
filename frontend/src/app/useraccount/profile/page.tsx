import React from 'react';
import UserPageLayout from '@/app/components/UserPageLayout/UserPageLayout';
import Sidebar from '@/app/components/Sidebar/Sidebar';
import UserProfile from '@/app/components/UserProfile/UserProfile';

const ProfilePage: React.FC = () => {
  return (
    <UserPageLayout>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <Sidebar />
        </div>
        <div className="md:col-span-3">
          <UserProfile />
        </div>
      </div>
    </UserPageLayout>
  );
};

export default ProfilePage;