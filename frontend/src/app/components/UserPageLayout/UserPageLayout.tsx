'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface UserPageLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

const UserPageLayout: React.FC<UserPageLayoutProps> = ({
  children,
  title = 'My Account',
  description = 'Manage your profile, addresses and account preferences.',
}) => {
  return (
    <main className="min-h-screen bg-[#fcfcfd]">
      <div className="mx-auto w-full max-w-[1380px] px-4 py-6 sm:px-6 lg:px-8 lg:py-10">

        {/* ============================================================ */}
        {/* PAGE HEADER */}
        {/* ============================================================ */}

        <motion.header
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mb-7"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

            <div>
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#DF2648]">
                Account
              </p>

              <h1 className="text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
                {title}
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-gray-500">
                {description}
              </p>
            </div>

            <div className="hidden items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-500 shadow-sm sm:flex">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Account active
            </div>

          </div>
        </motion.header>

        {/* ============================================================ */}
        {/* CONTENT */}
        {/* ============================================================ */}

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.4,
            delay: 0.05,
          }}
        >
          {children}
        </motion.div>

      </div>
    </main>
  );
};

export default UserPageLayout;