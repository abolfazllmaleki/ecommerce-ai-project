const Cancellations = () => {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-6">My Cancellations</h2>
        <div className="space-y-4">
          <div className="p-4 border rounded-md">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">Cancellation #C12345</h3>
                <p className="text-sm text-gray-500">Requested on January 18, 2024</p>
                <p className="text-sm mt-1">Refund status: <span className="text-[#DF2648]">Processing</span></p>
              </div>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
                View Details
              </button>
            </div>
          </div>
          
          {/* Add more cancellation items */}
        </div>
      </div>
    );
  };
  
  export default Cancellations;