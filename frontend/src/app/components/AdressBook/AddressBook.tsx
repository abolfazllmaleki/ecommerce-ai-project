'use client';

const AddressBook = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-6">Address Book</h2>
      <div className="space-y-4 max-w-lg">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Street Address
          </label>
          <input
            type="text"
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#DF2648] focus:border-[#DF2648]"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#DF2648] focus:border-[#DF2648]"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ZIP Code
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#DF2648] focus:border-[#DF2648]"
            />
          </div>
        </div>

        <div className="flex gap-4 pt-6">
          <button className="px-6 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
            Cancel
          </button>
          <button className="px-6 py-2 bg-[#DF2648] text-white rounded-md hover:bg-[#DF2648]/90">
            Save Address
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddressBook;