'use client';

import React from 'react';
import UserPageLayout from '@/app/components/UserPageLayout/UserPageLayout';
import AccountPageShell from '@/app/components/AccountPageShell/AccountPageShell';
import AddressBook from '@/app/components/AdressBook/AddressBook';

const AddressPage = () => {
  return (
    <UserPageLayout>
      <AccountPageShell
        title="Address Book"
        description="Manage your saved shipping and delivery addresses."
      >
        <AddressBook />
      </AccountPageShell>
    </UserPageLayout>
  );
};

export default AddressPage;