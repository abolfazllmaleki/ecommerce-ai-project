'use client';

import React from 'react';
import UserPageLayout from '@/app/components/UserPageLayout/UserPageLayout';
import AccountPageShell from '@/app/components/AccountPageShell/AccountPageShell';
import Cancellations from '@/app/components/Cancellations/Cancellations';

const Page = () => {
  return (
    <UserPageLayout>
      <AccountPageShell
        title="Cancellations"
        description="View and manage your cancelled orders."
      >
        <Cancellations />
      </AccountPageShell>
    </UserPageLayout>
  );
};

export default Page;