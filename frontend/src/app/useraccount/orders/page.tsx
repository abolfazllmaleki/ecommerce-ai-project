'use client';

import React from 'react';
import UserPageLayout from '@/app/components/UserPageLayout/UserPageLayout';
import AccountPageShell from '@/app/components/AccountPageShell/AccountPageShell';
import Orders from '@/app/components/orders/orders';

const OrdersPage = () => {
  return (
    <UserPageLayout>
      <AccountPageShell
        title="My Orders"
        description="Track your orders and view your purchase history."
      >
        <Orders />
      </AccountPageShell>
    </UserPageLayout>
  );
};

export default OrdersPage;