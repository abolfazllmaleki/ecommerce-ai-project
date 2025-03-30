// components/HomePageManagement.tsx
'use client';
import { HomeContent } from '../../types/types';

interface HomePageManagementProps {
  homeContent: HomeContent;
  setHomeContent: React.Dispatch<React.SetStateAction<HomeContent>>;
}

const HomePageManagement = ({ homeContent, setHomeContent }: HomePageManagementProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-6">Home Page Configuration</h2>
      <div className="space-y-6">
        <div>
          <label className="block font-medium mb-2">Banner Text</label>
          <textarea
            className="w-full p-2 border rounded-md"
            value={homeContent.bannerText}
            onChange={(e) => setHomeContent(prev => ({ ...prev, bannerText: e.target.value }))}
            rows={4}
          />
        </div>
        
        <div>
          <label className="block font-medium mb-2">Promotional Discount (%)</label>
          <input
            type="number"
            className="p-2 border rounded-md w-32"
            value={homeContent.promotionalDiscount}
            onChange={(e) => setHomeContent(prev => ({ 
              ...prev, 
              promotionalDiscount: +e.target.value 
            }))}
            min="0"
            max="100"
          />
        </div>
      </div>
    </div>
  );
};

export default HomePageManagement;