// export default function Newsletter() {
//   return (
//     <div className="my-20 bg-gradient-to-r from-red-500 to-red-600 text-white py-16 px-6 shadow-lg relative overflow-hidden">
//       {/* Decorative elements */}
//       <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-red-400 opacity-10"></div>
//       <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-red-400 opacity-10"></div>
      
//       <div className="max-w-5xl mx-auto text-center relative z-10">
//         <div className="mb-10">
//           <h2 className="text-4xl md:text-5xl font-bold mb-4">
//             <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-red-100">
//               Stay Updated
//             </span>
//           </h2>
//           <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
//             Join our newsletter for exclusive <span className="font-semibold">red tag</span> deals and updates
//           </p>
//         </div>

//         <div className="flex flex-col md:flex-row gap-4 max-w-xl mx-auto">
//           <div className="relative flex-1">
//             <input 
//               type="email" 
//               placeholder="Your best email" 
//               className="w-full px-6 py-4 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-red-500 shadow-md transition-all duration-300 placeholder-gray-400"
//             />
//             <svg 
//               className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5"
//               fill="none" 
//               stroke="currentColor" 
//               viewBox="0 0 24 24" 
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//             </svg>
//           </div>
//           <button className="bg-white text-red-600 hover:bg-gray-100 px-8 py-4 rounded-xl font-bold text-lg shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300 border border-red-300">
//             Subscribe
//             <span className="ml-2 text-red-500">→</span>
//           </button>
//         </div>

//         <p className="mt-6 text-sm opacity-80 font-light">
//           We'll never share your email. Unsubscribe anytime.
//         </p>
//       </div>
//     </div>
//   );
// }
// export default function Newsletter() {
//   return (
//     <div className="relative bg-gradient-to-r from-red-600 to-red-700 text-white py-16 px-6 rounded-2xl shadow-2xl overflow-hidden">
//       {/* Background pattern */}
//       <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiIHN0cm9rZS13aWR0aD0iMiI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMTUiLz48L2c+PC9zdmc+')] opacity-20"></div>
      
//       {/* Decorative elements */}
//       <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-red-500/10"></div>
//       <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-red-500/10"></div>
      
//       <div className="max-w-4xl mx-auto text-center relative z-10">
//         <div className="mb-10">
//           <h2 className="text-4xl md:text-5xl font-bold mb-4">
//             Stay Updated
//           </h2>
//           <p className="text-lg md:text-xl text-red-100 max-w-2xl mx-auto">
//             Join our newsletter for exclusive <span className="font-semibold text-white">red tag</span> deals and updates
//           </p>
//         </div>

//         <div className="flex flex-col md:flex-row gap-4 max-w-xl mx-auto">
//           <div className="relative flex-1">
//             <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
//               <svg 
//                 className="w-5 h-5 text-red-400" 
//                 fill="none" 
//                 stroke="currentColor" 
//                 viewBox="0 0 24 24" 
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//               </svg>
//             </div>
//             <input 
//               type="email" 
//               placeholder="Your best email" 
//               className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-red-500 shadow-lg transition-all duration-300 placeholder-gray-500"
//             />
//           </div>
//           <button className="bg-white text-red-600 hover:bg-gray-100 px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 border border-red-300 flex items-center justify-center">
//             Subscribe
//             <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
//             </svg>
//           </button>
//         </div>

//         <p className="mt-6 text-sm text-red-200 font-light">
//           We'll never share your email. Unsubscribe anytime.
//         </p>
//       </div>
//     </div>
//   );
// }

'use client'
export default function Newsletter() {
  return (
    <div className="relative bg-gradient-to-br from-red-600 via-red-700 to-red-800 text-white py-20 px-6 rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-700 hover:shadow-2xl hover:shadow-red-500/30">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-500/10 via-red-700/5 to-transparent"></div>
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-20 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${5 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>
      
      {/* Glowing orbs */}
      <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-red-500/20 animate-pulse-slow"></div>
      <div className="absolute -bottom-24 -left-24 w-56 h-56 rounded-full bg-red-400/15 animate-pulse-slower"></div>
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="mb-12 transform transition-transform duration-700 hover:scale-105">
          {/* Animated icon */}
          <div className="flex justify-center mb-6">
            <div className="relative w-20 h-20 bg-gradient-to-br from-white to-red-100 rounded-2xl shadow-lg flex items-center justify-center transform rotate-3 transition-transform duration-500 hover:rotate-6">
              <svg 
                className="w-10 h-10 text-red-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-md">
                !
              </div>
            </div>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-black mb-5 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-red-100">
            Stay Updated
          </h2>
          <p className="text-xl md:text-2xl text-red-100 max-w-2xl mx-auto leading-relaxed">
            Join our newsletter for exclusive <span className="font-bold text-white underline decoration-red-300 decoration-2 underline-offset-4">red tag</span> deals and updates
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-5 max-w-2xl mx-auto mb-8">
          <div className="relative flex-1 group">
            <div className="absolute inset-0 bg-gradient-to-r from-red-700 to-red-800 rounded-2xl blur-md group-hover:blur-lg transition-all duration-300 opacity-70 group-hover:opacity-100"></div>
            <div className="absolute inset-y-0 left-0 flex items-center pl-5 pointer-events-none">
              <svg 
                className="w-6 h-6 text-red-300 group-focus-within:text-red-100 transition-colors" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <input 
              type="email" 
              placeholder="Your best email" 
              className="relative w-full pl-14 pr-5 py-5 rounded-2xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-red-600 shadow-lg transition-all duration-300 placeholder-gray-500 text-lg"
            />
          </div>
          <button className="relative px-10 py-5 bg-gradient-to-r from-white to-gray-100 text-red-600 hover:from-gray-100 hover:to-white rounded-2xl font-black text-lg shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-[1.03] active:scale-100 group">
            <span className="relative z-10 flex items-center justify-center">
              Subscribe
              <svg className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-white rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>

        <p className="text-sm text-red-200 font-medium flex items-center justify-center">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          We'll never share your email. Unsubscribe anytime.
        </p>
      </div>
      
      {/* Add these to your global CSS */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(5deg); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.4; }
        }
        @keyframes pulse-slower {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 0.3; }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 6s ease-in-out infinite;
        }
        .animate-pulse-slower {
          animation: pulse-slower 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}