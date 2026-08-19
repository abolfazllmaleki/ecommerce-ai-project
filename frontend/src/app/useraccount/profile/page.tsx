'use client';

import React from 'react';
import UserPageLayout from '@/app/components/UserPageLayout/UserPageLayout';
import AccountPageShell from '@/app/components/AccountPageShell/AccountPageShell';
import UserProfile from '@/app/components/UserProfile/UserProfile';

const ProfilePage: React.FC = () => {
  return (
    <UserPageLayout>
      <AccountPageShell
        title="Profile"
        description="Update your personal details and account information."
      >
        <UserProfile />
      </AccountPageShell>
    </UserPageLayout>
  );
};

export default ProfilePage;