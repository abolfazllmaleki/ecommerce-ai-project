// import { NextApiRequest, NextApiResponse } from 'next';

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   // if (req.method !== 'POST') {
//   //   return res.status(405).json({ message: 'Method not allowed' });
//   // }

//   try {
//     const { name, email, subject, message, phone, orderNumber } = req.body;

//     // Validate required fields
//     if (!name || !email || !subject || !message) {
//       return res.status(400).json({ message: 'Missing required fields' });
//     }

//     // Validate email format
//     const emailRegex = /^\S+@\S+$/i;
//     if (!emailRegex.test(email)) {
//       return res.status(400).json({ message: 'Invalid email format' });
//     }

//     console.log('Contact form submission:', {
//       name,
//       email,
//       subject,
//       message,
//       phone,
//       orderNumber,
//       timestamp: new Date().toISOString(),
//     });

//     // If you have a backend API, forward the request
//     if (process.env.NEXT_PUBLIC_BACKEND_URL) {
//       const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/contact`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ name, email, subject, message, phone, orderNumber }),
//       });

//       if (!backendResponse.ok) {
//         throw new Error('Failed to submit contact form to backend');
//       }
//     }

//     return res.status(200).json({
//       message: 'Contact form submitted successfully',
//       data: {
//         id: Math.random().toString(36).substr(2, 9),
//         name,
//         email,
//         subject,
//         message,
//         phone,
//         orderNumber,
//         status: 'new',
//         createdAt: new Date().toISOString(),
//       },
//     });
//   } catch (error) {
//     console.error('Contact form error:', error);
//     return res.status(500).json({ message: 'Internal server error' });
//   }
// }