'use client';

import React from 'react';
import UserPageLayout from '@/app/components/UserPageLayout/UserPageLayout';
import AccountPageShell from '@/app/components/AccountPageShell/AccountPageShell';
import Recommendations from './rec';

const RecommendationsPage = () => {
  return (
    <UserPageLayout>
      <AccountPageShell
        title="Recommended For You"
        description="Discover products selected based on your interests."
        compact
      >
        <Recommendations />
      </AccountPageShell>
    </UserPageLayout>
  );
};

export default RecommendationsPage;