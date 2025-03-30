import React from 'react';
import UserPageLayout from '@/app/components/UserPageLayout/UserPageLayout';
import Sidebar from '@/app/components/Sidebar/Sidebar';
import Cancellations from '@/app/components/Cancellations/Cancellations';

const Page = () => {
  return (
    <UserPageLayout>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <Sidebar />
        </div>
        <div className="md:col-span-3">
          <Cancellations />
        </div>
      </div>
    </UserPageLayout>
  );
};

export default Page;