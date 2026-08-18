'use client';

import { useState } from 'react';
import { Tab } from '@headlessui/react';
import {
  FiBox,
  FiUsers,
  FiSettings,
  FiPieChart,
  FiShoppingBag,
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
    },
    {
      name: 'Products',
      icon: FiBox,
    },
    {
      name: 'Users',
      icon: FiUsers,
    },
    {
      name: 'Analytics',
      icon: FiPieChart,
    },
    {
      name: 'Settings',
      icon: FiSettings,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50/20 p-4 md:p-6">
      <div className="mx-auto max-w-7xl">

        {/* ================= HEADER ================= */}
        <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Manager Dashboard
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage your store operations
            </p>
          </div>

          <div
            className="
              inline-flex
              w-fit
              items-center
              gap-2
              rounded-full
              border
              border-red-100
              bg-red-50
              px-3.5
              py-1.5
              text-sm
              font-semibold
              text-[#DF2648]
            "
          >
            <span className="h-2 w-2 rounded-full bg-[#DF2648] shadow-sm" />
            Admin Mode
          </div>
        </div>

        {/* ================= MAIN CARD ================= */}
        <div
          className="
            overflow-hidden
            rounded-3xl
            border
            border-gray-100
            bg-white
            shadow-sm
          "
        >
          <Tab.Group
            selectedIndex={selectedIndex}
            onChange={setSelectedIndex}
          >

            {/* ================= TAB SWITCHER ================= */}
            <div className="border-b border-gray-100 bg-white px-4 py-3 md:px-6">
              <div
                className="
                  inline-flex
                  w-full
                  overflow-x-auto
                  rounded-2xl
                  border
                  border-gray-100
                  bg-gray-50/80
                  p-1
                  scrollbar-hide
                  md:w-auto
                "
              >
                <Tab.List className="flex min-w-max gap-1">
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
                          items-center
                          justify-center
                          gap-2
                          rounded-xl
                          px-4
                          py-2.5
                          text-sm
                          font-medium
                          outline-none
                          transition-all
                          duration-300
                          ease-out

                          focus-visible:ring-2
                          focus-visible:ring-red-200

                          ${
                            selected
                              ? `
                                bg-white
                                text-[#DF2648]
                                shadow-sm
                                ring-1
                                ring-black/[0.03]
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
                              size={17}
                              className={`
                                transition-all
                                duration-300
                                ${
                                  selected
                                    ? 'scale-105 text-[#DF2648]'
                                    : 'text-gray-400 group-hover:text-gray-600'
                                }
                              `}
                            />

                            <span>{tab.name}</span>

                            {/* Active indicator */}
                            <span
                              className={`
                                absolute
                                bottom-1
                                left-1/2
                                h-0.5
                                -translate-x-1/2
                                rounded-full
                                bg-[#DF2648]
                                transition-all
                                duration-300
                                ${
                                  selected
                                    ? 'w-5 opacity-100'
                                    : 'w-0 opacity-0'
                                }
                              `}
                            />
                          </>
                        )}
                      </Tab>
                    );
                  })}
                </Tab.List>
              </div>
            </div>

            {/* ================= TAB CONTENT ================= */}
            <Tab.Panels
              className="
                relative
                overflow-hidden
              "
            >
              <Tab.Panel
                className="
                  p-4
                  outline-none
                  animate-[tabFade_250ms_ease-out]
                  md:p-6
                "
              >
                <OrdersManagement />
              </Tab.Panel>

              <Tab.Panel
                className="
                  p-4
                  outline-none
                  animate-[tabFade_250ms_ease-out]
                  md:p-6
                "
              >
                <ProductManagement />
              </Tab.Panel>

              <Tab.Panel
                className="
                  p-4
                  outline-none
                  animate-[tabFade_250ms_ease-out]
                  md:p-6
                "
              >
                <UserManagement />
              </Tab.Panel>

              <Tab.Panel
                className="
                  p-4
                  outline-none
                  animate-[tabFade_250ms_ease-out]
                  md:p-6
                "
              >
                <div className="flex min-h-[300px] items-center justify-center">
                  <div className="text-center">
                    <div
                      className="
                        mx-auto
                        mb-4
                        flex
                        h-14
                        w-14
                        items-center
                        justify-center
                        rounded-2xl
                        bg-red-50
                        text-[#DF2648]
                      "
                    >
                      <FiPieChart size={24} />
                    </div>

                    <h3 className="font-semibold text-gray-800">
                      Analytics Dashboard
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      Analytics dashboard coming soon
                    </p>
                  </div>
                </div>
              </Tab.Panel>

              <Tab.Panel
                className="
                  p-4
                  outline-none
                  animate-[tabFade_250ms_ease-out]
                  md:p-6
                "
              >
                <div className="flex min-h-[300px] items-center justify-center">
                  <div className="text-center">
                    <div
                      className="
                        mx-auto
                        mb-4
                        flex
                        h-14
                        w-14
                        items-center
                        justify-center
                        rounded-2xl
                        bg-red-50
                        text-[#DF2648]
                      "
                    >
                      <FiSettings size={24} />
                    </div>

                    <h3 className="font-semibold text-gray-800">
                      Settings
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      Settings panel coming soon
                    </p>
                  </div>
                </div>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>

        {/* ================= QUICK STATS ================= */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: 'Total Products',
              value: '1,248',
              change: '+12%',
              trend: 'up',
            },
            {
              title: 'Active Users',
              value: '892',
              change: '+5%',
              trend: 'up',
            },
            {
              title: 'Pending Orders',
              value: '56',
              change: '-3%',
              trend: 'down',
            },
            {
              title: 'This Month Revenue',
              value: '$24,589',
              change: '+18%',
              trend: 'up',
            },
          ].map((stat, index) => (
            <div
              key={index}
              className="
                rounded-2xl
                border
                border-gray-100
                bg-white
                p-5
                shadow-sm
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:border-red-100
                hover:shadow-md
              "
            >
              <p className="text-sm text-gray-500">
                {stat.title}
              </p>

              <p className="mt-1 text-2xl font-bold tracking-tight text-gray-900">
                {stat.value}
              </p>

              <p
                className={`
                  mt-1
                  text-xs
                  font-medium
                  ${
                    stat.trend === 'up'
                      ? 'text-green-500'
                      : 'text-red-500'
                  }
                `}
              >
                {stat.change}{' '}
                {stat.trend === 'up' ? '↑' : '↓'} from last month
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ================= ANIMATIONS ================= */}
      <style jsx global>{`
        @keyframes tabFade {
          from {
            opacity: 0;
            transform: translateY(5px);
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
    </div>
  );
};

export default ManagerPage;