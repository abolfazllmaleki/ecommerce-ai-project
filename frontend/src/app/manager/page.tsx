'use client';
import { useState } from 'react';
import { Tab } from '@headlessui/react';
import ProductManagement from '../components/ProductManagement/ProductManagement';
import UserManagement from '../components/UserManagement/UserManagement';

const ManagerPage = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-red-500 mb-8">Manager Dashboard</h1>
        
        <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
          <Tab.List className="flex space-x-2 mb-8 border-b border-gray-200">
            {['Products', 'Users'].map((tab) => (
              <Tab
                key={tab}
                className={({ selected }) =>
                  `px-6 py-3 rounded-t-lg font-medium transition-colors ${
                    selected 
                      ? 'bg-red-500 text-white shadow-lg'
                      : 'text-gray-500 hover:bg-red-50 hover:text-red-600'
                  }`
                }
              >
                {tab}
              </Tab>
            ))}
          </Tab.List>

          <Tab.Panels className="bg-white rounded-xl shadow-lg p-6">
            <Tab.Panel>
              <ProductManagement />
            </Tab.Panel>

            <Tab.Panel>
              <UserManagement />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
};

export default ManagerPage;