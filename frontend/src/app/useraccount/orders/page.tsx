// app/account/orders/page.tsx
'use client';
import React from 'react';
import { motion } from 'framer-motion';
import UserPageLayout from '@/app/components/UserPageLayout/UserPageLayout';
import Sidebar from '@/app/components/Sidebar/Sidebar';
import Orders from '@/app/components/orders/orders';

const OrdersPage = () => {
  return (
    <UserPageLayout>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex gap-8"
      >
        <div className="hidden md:block w-1/4">
          <Sidebar />
        </div>
        <motion.div 
          className="w-full md:w-3/4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Orders />
        </motion.div>
      </motion.div>
    </UserPageLayout>
  );
};

export default OrdersPage;