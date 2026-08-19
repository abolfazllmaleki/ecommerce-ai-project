'use client';

import { useState } from 'react';
import { Tab } from '@headlessui/react';
import {
  FiBox,
  FiUsers,
  FiSettings,
  FiPieChart,
  FiShoppingBag,
  FiTrendingUp,
  FiTrendingDown,
  FiActivity,
  FiChevronRight,
} from 'react-icons/fi';

import ProductManagement from '../components/ProductManagement/ProductManagement';
import UserManagement from '../components/UserManagement/UserManagement';
import OrdersManagement from '../components/OrdersManagement/OrdersManagement';

const ManagerPage = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const tabs = [
    {
      name: 'Orders',
      icon: FiShoppingBag,
      description: 'Manage customer orders',
    },
    {
      name: 'Products',
      icon: FiBox,
      description: 'Manage products & inventory',
    },
    {
      name: 'Users',
      icon: FiUsers,
      description: 'Manage users',
    },
    {
      name: 'Analytics',
      icon: FiPieChart,
      description: 'View store analytics',
    },
    {
      name: 'Settings',
      icon: FiSettings,
      description: 'Configure dashboard',
    },
  ];

  const stats = [
    {
      title: 'Total Products',
      value: '1,248',
      change: '+12%',
      trend: 'up',
      icon: FiBox,
    },
    {
      title: 'Active Users',
      value: '892',
      change: '+5%',
      trend: 'up',
      icon: FiUsers,
    },
    {
      title: 'Pending Orders',
      value: '56',
      change: '-3%',
      trend: 'down',
      icon: FiShoppingBag,
    },
    {
      title: 'Monthly Revenue',
      value: '$24,589',
      change: '+18%',
      trend: 'up',
      icon: FiTrendingUp,
    },
  ];

  return (
    <main className="min-h-screen bg-[#fafafa]">
      <div className="mx-auto max-w-[1600px] px-4 py-5 sm:px-6 lg:px-8 lg:py-7">

        {/* ================================================================ */}
        {/* HEADER */}
        {/* ================================================================ */}

        <header className="mb-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">

            <div>
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#DF2648]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#DF2648]" />
                Admin Dashboard
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-gray-950 sm:text-[34px]">
                Manager Dashboard
              </h1>

              <p className="mt-1.5 text-sm text-gray-500">
                Manage your store operations from one place.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start rounded-full border border-gray-200 bg-white px-3 py-2 shadow-sm lg:self-auto">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </span>

              <span className="text-xs font-semibold text-gray-600">
                System Operational
              </span>
            </div>
          </div>
        </header>

        {/* ================================================================ */}
        {/* DASHBOARD SHELL */}
        {/* ================================================================ */}

        <div
          className="
            overflow-hidden
            rounded-[28px]
            border
            border-gray-200/80
            bg-white
            shadow-[0_8px_30px_rgba(0,0,0,0.04)]
          "
        >
          <Tab.Group
            selectedIndex={selectedIndex}
            onChange={setSelectedIndex}
          >

            {/* ============================================================ */}
            {/* NAVIGATION */}
            {/* ============================================================ */}

            <div className="border-b border-gray-100 bg-white px-3 py-3 sm:px-5">
              <div className="flex items-center justify-between gap-4">

                <Tab.List
                  className="
                    scrollbar-hide
                    flex
                    min-w-0
                    flex-1
                    gap-1
                    overflow-x-auto
                    rounded-2xl
                    bg-gray-50
                    p-1
                  "
                >
                  {tabs.map((tab) => {
                    const Icon = tab.icon;

                    return (
                      <Tab
                        key={tab.name}
                        className={({ selected }) =>
                          `
                            group
                            relative
                            flex
                            shrink-0
                            items-center
                            gap-2
                            rounded-xl
                            px-3.5
                            py-2.5
                            text-sm
                            font-semibold
                            outline-none
                            transition-all
                            duration-200
                            focus-visible:ring-2
                            focus-visible:ring-[#DF2648]/20

                            ${
                              selected
                                ? `
                                  bg-white
                                  text-gray-900
                                  shadow-sm
                                  ring-1
                                  ring-gray-200/70
                                `
                                : `
                                  text-gray-500
                                  hover:bg-white/70
                                  hover:text-gray-800
                                `
                            }
                          `
                        }
                      >
                        {({ selected }) => (
                          <>
                            <Icon
                              size={16}
                              className={`
                                shrink-0
                                transition-colors
                                duration-200
                                ${
                                  selected
                                    ? 'text-[#DF2648]'
                                    : 'text-gray-400 group-hover:text-gray-600'
                                }
                              `}
                            />

                            <span>{tab.name}</span>

                            {selected && (
                              <span className="absolute bottom-0.5 left-1/2 h-0.5 w-5 -translate-x-1/2 rounded-full bg-[#DF2648]" />
                            )}
                          </>
                        )}
                      </Tab>
                    );
                  })}
                </Tab.List>

                {/* Current section */}

                <div className="hidden items-center gap-2 text-xs text-gray-400 xl:flex">
                  <span>{tabs[selectedIndex].description}</span>
                  <FiChevronRight size={14} />
                </div>
              </div>
            </div>

            {/* ============================================================ */}
            {/* PANELS */}
            {/* ============================================================ */}

            <Tab.Panels className="relative">

              {/* ORDERS */}

              <Tab.Panel
                className="
                  outline-none
                  animate-[tabFade_220ms_ease-out]
                "
              >
                <div className="p-4 sm:p-5 lg:p-6">
                  <OrdersManagement />
                </div>
              </Tab.Panel>

              {/* PRODUCTS */}

              <Tab.Panel
                className="
                  outline-none
                  animate-[tabFade_220ms_ease-out]
                "
              >
                {/*
                  ProductManagement خودش layout کامل دارد.
                  بنابراین اینجا padding اضافی نمی‌دهیم
                  تا UI تو در تو نشود.
                */}
                <ProductManagement />
              </Tab.Panel>

              {/* USERS */}

              <Tab.Panel
                className="
                  outline-none
                  animate-[tabFade_220ms_ease-out]
                "
              >
                <div className="p-4 sm:p-5 lg:p-6">
                  <UserManagement />
                </div>
              </Tab.Panel>

              {/* ANALYTICS */}

              <Tab.Panel
                className="
                  outline-none
                  animate-[tabFade_220ms_ease-out]
                "
              >
                <ComingSoon
                  icon={<FiPieChart size={24} />}
                  title="Analytics Dashboard"
                  description="Detailed store analytics and performance insights are coming soon."
                />
              </Tab.Panel>

              {/* SETTINGS */}

              <Tab.Panel
                className="
                  outline-none
                  animate-[tabFade_220ms_ease-out]
                "
              >
                <ComingSoon
                  icon={<FiSettings size={24} />}
                  title="Settings"
                  description="Dashboard and store configuration options are coming soon."
                />
              </Tab.Panel>

            </Tab.Panels>
          </Tab.Group>
        </div>

        {/* ================================================================ */}
        {/* QUICK STATS */}
        {/* ================================================================ */}

        <section className="mt-6">

          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-gray-900">
                Store Overview
              </h2>

              <p className="mt-0.5 text-xs text-gray-400">
                Key metrics from your store
              </p>
            </div>

            <div className="hidden items-center gap-1.5 text-xs font-medium text-gray-400 sm:flex">
              <FiActivity size={13} />
              Updated recently
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">

            {stats.map((stat) => {
              const Icon = stat.icon;
              const isUp = stat.trend === 'up';

              return (
                <div
                  key={stat.title}
                  className="
                    group
                    relative
                    overflow-hidden
                    rounded-2xl
                    border
                    border-gray-200/80
                    bg-white
                    p-4
                    shadow-[0_4px_18px_rgba(0,0,0,0.025)]
                    transition-all
                    duration-200
                    hover:-translate-y-0.5
                    hover:border-gray-300
                    hover:shadow-[0_8px_25px_rgba(0,0,0,0.05)]
                  "
                >
                  {/* Accent */}

                  <div
                    className="
                      absolute
                      right-0
                      top-0
                      h-20
                      w-20
                      rounded-full
                      bg-red-50
                      opacity-0
                      blur-2xl
                      transition-opacity
                      duration-300
                      group-hover:opacity-100
                    "
                  />

                  <div className="relative flex items-start justify-between">

                    <div>
                      <p className="text-xs font-medium text-gray-400">
                        {stat.title}
                      </p>

                      <p className="mt-1.5 text-2xl font-bold tracking-tight text-gray-950">
                        {stat.value}
                      </p>

                      <div className="mt-2 flex items-center gap-1.5">

                        <span
                          className={`
                            inline-flex
                            items-center
                            gap-0.5
                            text-xs
                            font-bold
                            ${
                              isUp
                                ? 'text-emerald-600'
                                : 'text-red-500'
                            }
                          `}
                        >
                          {isUp ? (
                            <FiTrendingUp size={12} />
                          ) : (
                            <FiTrendingDown size={12} />
                          )}

                          {stat.change}
                        </span>

                        <span className="text-[11px] text-gray-400">
                          vs last month
                        </span>
                      </div>
                    </div>

                    <div
                      className="
                        flex
                        h-10
                        w-10
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        bg-gray-50
                        text-gray-500
                        transition-all
                        duration-200
                        group-hover:bg-red-50
                        group-hover:text-[#DF2648]
                      "
                    >
                      <Icon size={18} />
                    </div>
                  </div>
                </div>
              );
            })}

          </div>
        </section>
      </div>

      {/* ================================================================ */}
      {/* ANIMATIONS */}
      {/* ================================================================ */}

      <style jsx global>{`
        @keyframes tabFade {
          from {
            opacity: 0;
            transform: translateY(4px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </main>
  );
};

export default ManagerPage;

// ============================================================================
// COMING SOON
// ============================================================================

interface ComingSoonProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const ComingSoon = ({
  icon,
  title,
  description,
}: ComingSoonProps) => {
  return (
    <div className="flex min-h-[360px] items-center justify-center px-6 py-10">
      <div className="max-w-md text-center">

        <div
          className="
            mx-auto
            mb-5
            flex
            h-16
            w-16
            items-center
            justify-center
            rounded-2xl
            border
            border-red-100
            bg-red-50
            text-[#DF2648]
            shadow-sm
          "
        >
          {icon}
        </div>

        <h3 className="text-lg font-bold text-gray-900">
          {title}
        </h3>

        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500">
          {description}
        </p>

        <div className="mx-auto mt-5 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3.5 py-2 text-xs font-semibold text-gray-500">
          <span className="h-1.5 w-1.5 rounded-full bg-gray-300" />
          Coming soon
        </div>
      </div>
    </div>
  );
};