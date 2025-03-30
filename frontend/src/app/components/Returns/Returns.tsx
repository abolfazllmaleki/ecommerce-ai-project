const Returns = () => {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-6">My Returns</h2>
        <div className="space-y-4">
          <div className="p-4 border rounded-md">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">Return #R12345</h3>
                <p className="text-sm text-gray-500">Initiated on January 20, 2024</p>
              </div>
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                Processing
              </span>
            </div>
          </div>
          
          {/* Add more return items as needed */}
        </div>
      </div>
    );
  };
  
  export default Returns;