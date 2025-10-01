// 'use client';

// import { useState } from 'react';
// import { useForm } from 'react-hook-form';
// import Head from 'next/head';

// interface ContactFormData {
//   name: string;
//   email: string;
//   subject: string;
//   message: string;
//   phone?: string;
//   orderNumber?: string;
// }

// interface ContactInfo {
//   icon: React.ReactNode;
//   title: string;
//   details: string[];
//   description?: string;
// }

// const ContactPage: React.FC = () =>{
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);
  
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//   } = useForm<ContactFormData>();

// const onSubmit = async (data: ContactFormData) => {
//   setIsSubmitting(true);
//   setSubmitStatus(null);

//   try {
    
//     const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/contact`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(data),
//     });

//     const responseData = await response.json();
    
//     if (response.ok) {
//       setSubmitStatus('success');
//       reset();
//       setTimeout(() => setSubmitStatus(null), 5000);
//     } else {
//       console.error('Backend error:', responseData);
//       setSubmitStatus('error');
//     }
//   } catch (error) {
//     console.error('Network error:', error);
//     setSubmitStatus('error');
//   } finally {
//     setIsSubmitting(false);
//   }
// };

//   const contactInfo: ContactInfo[] = [
//     {
//       icon: (
//         <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
//         </svg>
//       ),
//       title: "Phone Support",
//       details: ["+1 (555) 123-4567", "+1 (555) 987-6543"],
//       description: "Mon-Fri: 9AM-6PM EST, Sat: 10AM-4PM EST"
//     },
//     {
//       icon: (
//         <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//         </svg>
//       ),
//       title: "Email",
//       details: ["support@yourstore.com", "sales@yourstore.com"],
//       description: "We respond within 24 hours"
//     },
//     {
//       icon: (
//         <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
//         </svg>
//       ),
//       title: "Address",
//       details: ["123 Commerce Street", "New York, NY 10001", "United States"],
//       description: "Visit our flagship store"
//     },
//     {
//       icon: (
//         <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//         </svg>
//       ),
//       title: "Business Hours",
//       details: ["Monday - Friday: 9:00 AM - 6:00 PM", "Saturday: 10:00 AM - 4:00 PM", "Sunday: Closed"],
//       description: "Eastern Standard Time"
//     }
//   ];

//   const faqs = [
//     {
//       question: "How long does it take to get a response?",
//       answer: "We typically respond to all inquiries within 24 hours during business days."
//     },
//     {
//       question: "Do you offer international shipping?",
//       answer: "Yes, we ship to over 50 countries worldwide. Shipping costs and delivery times vary by location."
//     },
//     {
//       question: "What's your return policy?",
//       answer: "We offer a 30-day return policy for all unused items in their original packaging."
//     },
//     {
//       question: "Can I track my order?",
//       answer: "Yes, you'll receive a tracking number via email once your order ships."
//     }
//   ];

//   return (
//     <>
//       <Head>
//         <title>Contact Us - Your E-commerce Store</title>
//         <meta name="description" content="Get in touch with our support team for any questions or concerns about your orders" />
//       </Head>

//       <div className="min-h-screen bg-gray-50 py-12">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           {/* Header Section */}
//           <div className="text-center mb-16">
//             <h1 className="text-4xl font-bold text-gray-900 mb-4">Get in Touch</h1>
//             <p className="text-xl text-gray-600 max-w-3xl mx-auto">
//               Have questions about your order or need assistance? Our support team is here to help you.
//             </p>
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
//             {/* Contact Form Section */}
//             <div className="bg-white rounded-2xl shadow-lg p-8">
//               <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a message</h2>
              
//               {submitStatus === 'success' && (
//                 <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
//                   ✅ Thank you for your message! We'll get back to you within 24 hours.
//                 </div>
//               )}

//               {submitStatus === 'error' && (
//                 <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
//                   ❌ Something went wrong. Please try again later or contact us directly.
//                 </div>
//               )}

//               <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div>
//                     <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
//                       Full Name *
//                     </label>
//                     <input
//                       {...register('name', { required: 'Name is required' })}
//                       type="text"
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                       placeholder="Your full name"
//                     />
//                     {errors.name && (
//                       <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
//                     )}
//                   </div>

//                   <div>
//                     <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
//                       Email Address *
//                     </label>
//                     <input
//                       {...register('email', {
//                         required: 'Email is required',
//                         pattern: {
//                           value: /^\S+@\S+$/i,
//                           message: 'Invalid email address',
//                         },
//                       })}
//                       type="email"
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                       placeholder="your.email@example.com"
//                     />
//                     {errors.email && (
//                       <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
//                     )}
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div>
//                     <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
//                       Phone Number
//                     </label>
//                     <input
//                       {...register('phone')}
//                       type="tel"
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                       placeholder="+1 (555) 123-4567"
//                     />
//                   </div>

//                   <div>
//                     <label htmlFor="orderNumber" className="block text-sm font-medium text-gray-700 mb-2">
//                       Order Number
//                     </label>
//                     <input
//                       {...register('orderNumber')}
//                       type="text"
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                       placeholder="ORD-123456"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
//                     Subject *
//                   </label>
//                   <select
//                     {...register('subject', { required: 'Subject is required' })}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   >
//                     <option value="">Select a subject</option>
//                     <option value="General Inquiry">General Inquiry</option>
//                     <option value="Order Support">Order Support</option>
//                     <option value="Returns & Refunds">Returns & Refunds</option>
//                     <option value="Product Questions">Product Questions</option>
//                     <option value="Shipping">Shipping Information</option>
//                     <option value="Technical Support">Technical Support</option>
//                     <option value="Other">Other</option>
//                   </select>
//                   {errors.subject && (
//                     <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>
//                   )}
//                 </div>

//                 <div>
//                   <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
//                     Message *
//                   </label>
//                   <textarea
//                     {...register('message', { 
//                       required: 'Message is required',
//                       minLength: {
//                         value: 10,
//                         message: 'Message must be at least 10 characters'
//                       }
//                     })}
//                     rows={6}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     placeholder="Please describe your inquiry in detail..."
//                   />
//                   {errors.message && (
//                     <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
//                   )}
//                 </div>

//                 <div>
//                   <button
//                     type="submit"
//                     disabled={isSubmitting}
//                     className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
//                   >
//                     {isSubmitting ? (
//                       <span className="flex items-center justify-center">
//                         <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                         </svg>
//                         Sending...
//                       </span>
//                     ) : (
//                       'Send Message'
//                     )}
//                   </button>
//                 </div>
//               </form>
//             </div>

//             {/* Contact Information & FAQ Section */}
//             <div className="space-y-8">
//               {/* Contact Information */}
//               <div className="bg-white rounded-2xl shadow-lg p-8">
//                 <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
//                 <div className="space-y-6">
//                   {contactInfo.map((info, index) => (
//                     <div key={index} className="flex items-start space-x-4">
//                       <div className="bg-blue-100 p-3 rounded-lg flex-shrink-0">
//                         {info.icon}
//                       </div>
//                       <div>
//                         <h3 className="font-semibold text-gray-900">{info.title}</h3>
//                         {info.details.map((detail, i) => (
//                           <p key={i} className="text-gray-600">{detail}</p>
//                         ))}
//                         {info.description && (
//                           <p className="text-sm text-gray-500 mt-1">{info.description}</p>
//                         )}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* FAQ Section */}
//               <div className="bg-white rounded-2xl shadow-lg p-8">
//                 <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
//                 <div className="space-y-4">
//                   {faqs.map((faq, index) => (
//                     <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
//                       <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
//                       <p className="text-gray-600 text-sm">{faq.answer}</p>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Social Media */}
//               <div className="bg-white rounded-2xl shadow-lg p-8">
//                 <h2 className="text-2xl font-bold text-gray-900 mb-6">Follow Us</h2>
//                 <div className="flex space-x-4">
//                   <a href="#" className="bg-gray-100 p-3 rounded-lg hover:bg-blue-100 transition duration-200">
//                     <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
//                       <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
//                     </svg>
//                   </a>
//                   <a href="#" className="bg-gray-100 p-3 rounded-lg hover:bg-blue-100 transition duration-200">
//                     <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
//                       <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.042-3.441.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
//                     </svg>
//                   </a>
//                   <a href="#" className="bg-gray-100 p-3 rounded-lg hover:bg-blue-100 transition duration-200">
//                     <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
//                       <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
//                     </svg>
//                   </a>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }
// export default ContactPage;
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Head from 'next/head';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  phone?: string;
  orderNumber?: string;
}

interface ContactInfo {
  icon: React.ReactNode;
  title: string;
  details: string[];
  description?: string;
}

const ContactPage: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>();

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();
      
      if (response.ok) {
        setSubmitStatus('success');
        reset();
        setTimeout(() => setSubmitStatus(null), 5000);
      } else {
        console.error('Backend error:', responseData);
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Network error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo: ContactInfo[] = [
    {
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      title: "Phone Support",
      details: ["+1 (555) 123-4567", "+1 (555) 987-6543"],
      description: "Mon-Fri: 9AM-6PM EST, Sat: 10AM-4PM EST"
    },
    {
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: "Email",
      details: ["support@yourstore.com", "sales@yourstore.com"],
      description: "We respond within 24 hours"
    },
    {
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: "Address",
      details: ["123 Commerce Street", "New York, NY 10001", "United States"],
      description: "Visit our flagship store"
    },
    {
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Business Hours",
      details: ["Monday - Friday: 9:00 AM - 6:00 PM", "Saturday: 10:00 AM - 4:00 PM", "Sunday: Closed"],
      description: "Eastern Standard Time"
    }
  ];

  const faqs = [
    {
      question: "How long does it take to get a response?",
      answer: "We typically respond to all inquiries within 24 hours during business days."
    },
    {
      question: "Do you offer international shipping?",
      answer: "Yes, we ship to over 50 countries worldwide. Shipping costs and delivery times vary by location."
    },
    {
      question: "What's your return policy?",
      answer: "We offer a 30-day return policy for all unused items in their original packaging."
    },
    {
      question: "Can I track my order?",
      answer: "Yes, you'll receive a tracking number via email once your order ships."
    }
  ];

  return (
    <>
      <Head>
        <title>Contact Us - Your E-commerce Store</title>
        <meta name="description" content="Get in touch with our support team for any questions or concerns about your orders" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-96 bg-red-600 opacity-5 -z-10"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-red-600 rounded-full -translate-y-1/2 translate-x-1/2 opacity-5 -z-10"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Header Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-900 mb-6 relative">
              Get in Touch
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-red-600 rounded-full"></div>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Have questions about your order or need assistance? Our support team is here to help you.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form Section */}
            <div className="bg-white rounded-2xl shadow-xl p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-red-600"></div>
              <div className="absolute -top-4 -right-4 w-28 h-28 bg-red-600 rounded-full opacity-5"></div>
              <div className="absolute -bottom-8 -left-8 w-36 h-36 bg-red-600 rounded-full opacity-5"></div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-6 relative z-10">Send us a message</h2>
              
              {submitStatus === 'success' && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Thank you for your message! We'll get back to you within 24 hours.
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  Something went wrong. Please try again later or contact us directly.
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      {...register('name', { required: 'Name is required' })}
                      type="text"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200"
                      placeholder="Your full name"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^\S+@\S+$/i,
                          message: 'Invalid email address',
                        },
                      })}
                      type="email"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200"
                      placeholder="your.email@example.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      {...register('phone')}
                      type="tel"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>

                  <div>
                    <label htmlFor="orderNumber" className="block text-sm font-medium text-gray-700 mb-2">
                      Order Number
                    </label>
                    <input
                      {...register('orderNumber')}
                      type="text"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200"
                      placeholder="ORD-123456"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <select
                    {...register('subject', { required: 'Subject is required' })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200"
                  >
                    <option value="">Select a subject</option>
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Order Support">Order Support</option>
                    <option value="Returns & Refunds">Returns & Refunds</option>
                    <option value="Product Questions">Product Questions</option>
                    <option value="Shipping">Shipping Information</option>
                    <option value="Technical Support">Technical Support</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.subject && (
                    <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    {...register('message', { 
                      required: 'Message is required',
                      minLength: {
                        value: 10,
                        message: 'Message must be at least 10 characters'
                      }
                    })}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200"
                    placeholder="Please describe your inquiry in detail..."
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
                  )}
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-red-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </span>
                    ) : (
                      'Send Message'
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Contact Information & FAQ Section */}
            <div className="space-y-8">
              {/* Contact Information */}
              <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-2xl shadow-xl p-8 text-white">
                <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                <div className="space-y-6">
                  {contactInfo.map((info, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="bg-white bg-opacity-20 p-3 rounded-lg flex-shrink-0 backdrop-blur-sm">
                        {info.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold">{info.title}</h3>
                        {info.details.map((detail, i) => (
                          <p key={i} className="text-white text-opacity-90">{detail}</p>
                        ))}
                        {info.description && (
                          <p className="text-sm text-white text-opacity-70 mt-1">{info.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* FAQ Section */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <div key={index} className="border-l-4 border-red-600 pl-4 py-2">
                      <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                      <p className="text-gray-600 text-sm">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social Media */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Follow Us</h2>
                <div className="flex space-x-4">
                  <a href="#" className="bg-gray-100 p-4 rounded-xl hover:bg-red-100 transition duration-200 transform hover:-translate-y-1">
                    <svg className="w-6 h-6 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                    </svg>
                  </a>
                  <a href="#" className="bg-gray-100 p-4 rounded-xl hover:bg-red-100 transition duration-200 transform hover:-translate-y-1">
                    <svg className="w-6 h-6 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.042-3.441.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
                    </svg>
                  </a>
                  <a href="#" className="bg-gray-100 p-4 rounded-xl hover:bg-red-100 transition duration-200 transform hover:-translate-y-1">
                    <svg className="w-6 h-6 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.20-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default ContactPage;