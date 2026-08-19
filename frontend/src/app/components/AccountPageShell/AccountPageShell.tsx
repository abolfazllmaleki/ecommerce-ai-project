'use client';

import React from 'react';
import Sidebar from '../Sidebar/Sidebar';

interface AccountPageShellProps {
  children: React.ReactNode;
}

const AccountPageShell = ({
  children,
}: AccountPageShellProps) => {
  return (
    <div className="relative min-h-full bg-[#fafafa]">
      <div className="mx-auto w-full max-w-[1400px] px-4 py-5 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[250px_minmax(0,1fr)] lg:gap-8">

          <aside className="hidden md:block">
            <div className="sticky top-5">
              <Sidebar />
            </div>
          </aside>

          <main className="min-w-0">
            {children}
          </main>

        </div>
      </div>
    </div>
  );
};

export default AccountPageShell;