'use client';

const PaymentOptions = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-6">Payment Options</h2>
      <div className="space-y-4 max-w-lg">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Card Number
          </label>
          <input
            type="text"
            placeholder="1234 5678 9012 3456"
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#DF2648] focus:border-[#DF2648]"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expiration Date
            </label>
            <input
              type="text"
              placeholder="MM/YY"
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#DF2648] focus:border-[#DF2648]"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CVC
            </label>
            <input
              type="text"
              placeholder="123"
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#DF2648] focus:border-[#DF2648]"
            />
          </div>
        </div>

        <div className="flex gap-4 pt-6">
          <button className="px-6 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
            Cancel
          </button>
          <button className="px-6 py-2 bg-[#DF2648] text-white rounded-md hover:bg-[#DF2648]/90">
            Save Card
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentOptions;