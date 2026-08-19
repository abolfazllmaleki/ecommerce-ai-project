'use client';

import React from 'react';
import UserPageLayout from '../components/UserPageLayout/UserPageLayout';
import AccountPageShell from '../components/AccountPageShell/AccountPageShell';
import UserProfile from '../components/UserProfile/UserProfile';

const AccountPage: React.FC = () => {
  return (
    <UserPageLayout>
      <AccountPageShell
        title="My Account"
        description="Manage your profile and personal information."
      >
        <UserProfile />
      </AccountPageShell>
    </UserPageLayout>
  );
};

export default AccountPage;