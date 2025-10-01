'use client';

import Head from 'next/head';
import Link from 'next/link';

const AboutPage = () => {
  return (
    <>
      <Head>
        <title>About This Project - E-commerce Store</title>
        <meta name="description" content="Learn about this full-stack e-commerce portfolio project built with Next.js, NestJS, MongoDB, and TypeScript" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-96 bg-red-600 opacity-5 -z-10"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-red-600 rounded-full -translate-y-1/2 translate-x-1/2 opacity-5 -z-10"></div>
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-900 mb-6 relative">
              About This Project
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-red-600 rounded-full"></div>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A modern full-stack e-commerce solution built as a portfolio project showcasing cutting-edge web development technologies.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {/* Tech Stack Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-red-600"></div>
              <div className="absolute -top-4 -right-4 w-28 h-28 bg-red-600 rounded-full opacity-5"></div>
              
              <div className="text-center mb-6">
                <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Tech Stack</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Next.js</h3>
                    <p className="text-sm text-gray-600">React framework for server-side rendering</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="bg-red-100 p-2 rounded-lg">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">NestJS</h3>
                    <p className="text-sm text-gray-600">Progressive Node.js framework for backend</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">MongoDB</h3>
                    <p className="text-sm text-gray-600">NoSQL database for flexible data storage</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">TypeScript</h3>
                    <p className="text-sm text-gray-600">Typed superset of JavaScript</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Features Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-red-600"></div>
              <div className="absolute -top-4 -right-4 w-28 h-28 bg-red-600 rounded-full opacity-5"></div>
              
              <div className="text-center mb-6">
                <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Key Features</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-red-500 w-2 h-2 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h3 className="font-semibold text-gray-900">User Authentication</h3>
                    <p className="text-sm text-gray-600">Secure login and registration system</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="bg-red-500 w-2 h-2 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Product Management</h3>
                    <p className="text-sm text-gray-600">Full CRUD operations for products</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="bg-red-500 w-2 h-2 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Shopping Cart</h3>
                    <p className="text-sm text-gray-600">Persistent cart functionality</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="bg-red-500 w-2 h-2 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Order Processing</h3>
                    <p className="text-sm text-gray-600">Complete order management system</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="bg-red-500 w-2 h-2 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Admin Dashboard</h3>
                    <p className="text-sm text-gray-600">Comprehensive management interface</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="bg-red-500 w-2 h-2 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Responsive Design</h3>
                    <p className="text-sm text-gray-600">Optimized for all device sizes</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Architecture Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-red-600"></div>
              <div className="absolute -top-4 -right-4 w-28 h-28 bg-red-600 rounded-full opacity-5"></div>
              
              <div className="text-center mb-6">
                <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Architecture</h2>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Frontend</h3>
                  <p className="text-sm text-gray-600">Next.js with TypeScript, Tailwind CSS for styling, React Hook Form for forms, and responsive design principles.</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Backend</h3>
                  <p className="text-sm text-gray-600">NestJS framework with TypeScript, MongoDB with Mongoose for data modeling, JWT authentication, and RESTful API design.</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Database</h3>
                  <p className="text-sm text-gray-600">MongoDB Atlas for cloud database storage with optimized schemas for users, products, orders, and categories.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Project Purpose Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 relative overflow-hidden mb-16">
            <div className="absolute top-0 left-0 w-full h-2 bg-red-600"></div>
            <div className="absolute -top-4 -right-4 w-28 h-28 bg-red-600 rounded-full opacity-5"></div>
            
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Project Purpose</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-gray-900 text-lg mb-4 flex items-center">
                  <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  Learning Experience
                </h3>
                <p className="text-gray-600">
                  This project was designed to demonstrate proficiency with modern full-stack development technologies, including Next.js, NestJS, MongoDB, and TypeScript. It showcases the ability to build complex, feature-rich applications from concept to deployment.
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-gray-900 text-lg mb-4 flex items-center">
                  <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Portfolio Showcase
                </h3>
                <p className="text-gray-600">
                  As a portfolio project, this e-commerce platform demonstrates capabilities in UI/UX design, frontend and backend development, database design, authentication systems, and responsive web design. It serves as a comprehensive example of full-stack development skills.
                </p>
              </div>
            </div>
          </div>

          {/* Developer Section */}
          <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-2xl shadow-xl p-8 text-white text-center">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold mb-6">About the Developer</h2>
              <p className="text-lg mb-6">
                This project was designed and developed by Abolfazl Maleki as a demonstration of modern full-stack development capabilities.
              </p>
              <div className="flex justify-center space-x-4">
                <a href="#" className="bg-white bg-opacity-20 p-3 rounded-lg backdrop-blur-sm hover:bg-opacity-30 transition duration-200">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
                <a href="#" className="bg-white bg-opacity-20 p-3 rounded-lg backdrop-blur-sm hover:bg-opacity-30 transition duration-200">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
                <a href="#" className="bg-white bg-opacity-20 p-3 rounded-lg backdrop-blur-sm hover:bg-opacity-30 transition duration-200">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-12">
            <Link href="/contact" className="inline-block bg-red-600 text-white py-3 px-8 rounded-lg font-semibold hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300 transition duration-200 transform hover:-translate-y-1 shadow-lg hover:shadow-xl">
              Get In Touch
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutPage;