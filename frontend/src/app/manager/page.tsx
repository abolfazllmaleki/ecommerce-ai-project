'use client';
import { useState } from 'react';
import { Tab } from '@headlessui/react';
import { FiBox, FiUsers, FiSettings, FiPieChart } from 'react-icons/fi';
import ProductManagement from '../components/ProductManagement/ProductManagement';
import UserManagement from '../components/UserManagement/UserManagement';

const ManagerPage = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const tabs = [
    { name: 'Products', icon: <FiBox className="mr-2" /> },
    { name: 'Users', icon: <FiUsers className="mr-2" /> },
    { name: 'Analytics', icon: <FiPieChart className="mr-2" /> },
    { name: 'Settings', icon: <FiSettings className="mr-2" /> }
  ];

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-red-500">Manager Dashboard</h1>
            <p className="text-gray-500 mt-1">Manage your store operations</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-2">
            <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium">
              Admin Mode
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
            {/* Enhanced Tab List */}
            <Tab.List className="flex border-b border-gray-200 px-6">
              {tabs.map((tab) => (
                <Tab
                  key={tab.name}
                  className={({ selected }) =>
                    `flex items-center px-5 py-4 font-medium text-sm transition-all relative
                    ${selected 
                      ? 'text-red-600 border-b-2 border-red-500 font-semibold'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`
                  }
                >
                  {tab.icon}
                  {tab.name}
                  {selectedIndex === tabs.findIndex(t => t.name === tab.name) && (
                    <span className="absolute -bottom-px left-0 right-0 h-0.5 bg-red-500"></span>
                  )}
                </Tab>
              ))}
            </Tab.List>

            {/* Tab Panels with Subtle Animation */}
            <Tab.Panels className="transition-all duration-300">
              <Tab.Panel className="p-6">
                <ProductManagement />
              </Tab.Panel>
              <Tab.Panel className="p-6">
                <UserManagement />
              </Tab.Panel>
              <Tab.Panel className="p-6">
                <div className="text-center py-12 text-gray-500">
                  Analytics dashboard coming soon
                </div>
              </Tab.Panel>
              <Tab.Panel className="p-6">
                <div className="text-center py-12 text-gray-500">
                  Settings panel coming soon
                </div>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>

        {/* Quick Stats Footer (Optional) */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { title: 'Total Products', value: '1,248', change: '+12%', trend: 'up' },
            { title: 'Active Users', value: '892', change: '+5%', trend: 'up' },
            { title: 'Pending Orders', value: '56', change: '-3%', trend: 'down' },
            { title: 'This Month Revenue', value: '$24,589', change: '+18%', trend: 'up' }
          ].map((stat, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <p className="text-sm text-gray-500">{stat.title}</p>
              <p className="text-xl font-bold mt-1">{stat.value}</p>
              <p className={`text-xs mt-1 ${
                stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
              }`}>
                {stat.change} {stat.trend === 'up' ? '↑' : '↓'} from last month
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManagerPage;