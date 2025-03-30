// components/Newsletter/Newsletter.tsx
export default function Newsletter() {
    return (
      <div className="my-12 bg-red-500 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Subscribe to Our Newsletter</h2>
          <p className="mb-8">Get the latest updates and exclusive offers</p>
          <div className="flex flex-col md:flex-row gap-4 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-1 px-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="bg-green-500 px-8 py-3 rounded-lg font-bold hover:bg-green-600 transition-colors duration-300">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    );
  }