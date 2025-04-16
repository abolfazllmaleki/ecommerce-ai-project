export default function Newsletter() {
  return (
    <div className="my-20 bg-gradient-to-r from-red-500 to-red-600 text-white py-16 px-6 shadow-lg relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-red-400 opacity-10"></div>
      <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-red-400 opacity-10"></div>
      
      <div className="max-w-5xl mx-auto text-center relative z-10">
        <div className="mb-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-red-100">
              Stay Updated
            </span>
          </h2>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
            Join our newsletter for exclusive <span className="font-semibold">red tag</span> deals and updates
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 max-w-xl mx-auto">
          <div className="relative flex-1">
            <input 
              type="email" 
              placeholder="Your best email" 
              className="w-full px-6 py-4 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-red-500 shadow-md transition-all duration-300 placeholder-gray-400"
            />
            <svg 
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <button className="bg-white text-red-600 hover:bg-gray-100 px-8 py-4 rounded-xl font-bold text-lg shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300 border border-red-300">
            Subscribe
            <span className="ml-2 text-red-500">→</span>
          </button>
        </div>

        <p className="mt-6 text-sm opacity-80 font-light">
          We'll never share your email. Unsubscribe anytime.
        </p>
      </div>
    </div>
  );
}