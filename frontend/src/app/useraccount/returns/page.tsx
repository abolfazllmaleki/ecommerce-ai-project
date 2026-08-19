'use client';

import React from 'react';
import UserPageLayout from '@/app/components/UserPageLayout/UserPageLayout';
import AccountPageShell from '@/app/components/AccountPageShell/AccountPageShell';
import Returns from '@/app/components/Returns/Returns';

const Page = () => {
  return (
    <UserPageLayout>
      <AccountPageShell
        title="Returns"
        description="Track your return requests and their current status."
      >
        <Returns />
      </AccountPageShell>
    </UserPageLayout>
  );
};

export default Page;