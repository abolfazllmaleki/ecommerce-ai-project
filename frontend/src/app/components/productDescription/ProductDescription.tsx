'use client';

import { useState } from 'react';

interface ProductDescriptionProps {
  description: string;
  details?: Array<{key: string, value: string}>;
}

export default function ProductDescription({ description, details = [] }: ProductDescriptionProps) {
  const [activeTab, setActiveTab] = useState<'description' | 'features'>('description');

  return (
    <div className="mt-10 bg-white rounded-2xl shadow-lg p-6 border border-gray-100 overflow-hidden">
      {/* Tabs Navigation */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('description')}
          className={`px-4 py-3 font-medium text-sm relative transition-all duration-300 ${
            activeTab === 'description'
              ? 'text-red-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Description
          {activeTab === 'description' && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-red-600"></span>
          )}
        </button>
        
        <button
          onClick={() => setActiveTab('features')}
          className={`px-4 py-3 font-medium text-sm relative transition-all duration-300 ${
            activeTab === 'features'
              ? 'text-red-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Features & Specifications
          {activeTab === 'features' && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-red-600"></span>
          )}
        </button>
      </div>

      {/* Tab Content */}
      <div className="min-h-[300px]">
        {/* Description Tab */}
        {activeTab === 'description' && (
          <div className="animate-fade-in">
            <div 
              className="prose prose-lg max-w-none text-gray-600"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          </div>
        )}

        {/* Features & Specifications Tab */}
        {activeTab === 'features' && (
          <div className="animate-fade-in">
            {details.length > 0 ? (
              <>
                <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
                  <table className="min-w-full divide-y divide-gray-200">
                    <tbody className="divide-y divide-gray-150 bg-white">
                      {details.map((detail, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 w-1/3">
                            {detail.key}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {detail.value}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800">Need more information?</h3>
                      <div className="mt-2 text-sm text-blue-700">
                        <p>If you have any questions about these specifications, please contact our customer support team.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-10">
                <svg className="w-16 h-16 text-gray-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900">No specifications available</h3>
                <p className="mt-1 text-gray-500">Product specifications will be added soon.</p>
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}