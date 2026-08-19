'use client';

import React from 'react';
import UserPageLayout from '@/app/components/UserPageLayout/UserPageLayout';
import AccountPageShell from '@/app/components/AccountPageShell/AccountPageShell';
import PaymentOptions from '@/app/components/PaymentOptions/PaymentOptions';

const Page = () => {
  return (
    <UserPageLayout>
      <AccountPageShell
        title="Payment Options"
        description="Manage your saved payment methods and preferences."
      >
        <PaymentOptions />
      </AccountPageShell>
    </UserPageLayout>
  );
};

export default Page;