'use client';

import React from 'react';
import UserPageLayout from '@/app/components/UserPageLayout/UserPageLayout';
import AccountPageShell from '@/app/components/AccountPageShell/AccountPageShell';
import WishList from '@/app/components/WishList/WishList';

const Page = () => {
  return (
    <UserPageLayout>
      <AccountPageShell
        title="Wishlist"
        description="Keep your favorite products in one place."
        compact
      >
        <WishList />
      </AccountPageShell>
    </UserPageLayout>
  );
};

export default Page;