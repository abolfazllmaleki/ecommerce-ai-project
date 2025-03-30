const Orders = () => {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-6">My Orders</h2>
        <div className="space-y-4">
          <div className="p-4 border rounded-md">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">Order #12345</h3>
                <p className="text-sm text-gray-500">Placed on January 15, 2024</p>
              </div>
              <button className="px-4 py-2 bg-[#DF2648] text-white rounded-md hover:bg-[#DF2648]/90">
                Track Order
              </button>
            </div>
          </div>
          
          {/* Add more order items as needed */}
        </div>
      </div>
    );
  };
  
  export default Orders;