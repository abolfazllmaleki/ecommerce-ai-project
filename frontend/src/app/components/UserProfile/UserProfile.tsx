// 'use client';

// import React, { useState, useEffect } from 'react';
// import { useAuth } from '@/app/context/AuthContext';
// const UserProfile = () => {
//   const { user, token, logout, fetchUser } = useAuth();
//   console.log(useAuth())
//   console.log('ther shoudl be data here....',user,token)
//   const [formData, setFormData] = useState({
//     firstName: '',
//     lastName: '',
//     email: '',
//   });
//   const [isLoading, setIsLoading] = useState(true);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   useEffect(() => {
//     if (user) {
//       const [firstName, ...lastNameParts] = user.name.split(' ');
//       setFormData({
//         firstName,
//         lastName: lastNameParts.join(' '),
//         email: user.email,
//       });
//       setIsLoading(false);
//     }
//   }, [user]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!user || !token) {
//       alert('Session expired. Please login again.');
//       logout();
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       const payload = {
//         name: `${formData.firstName} ${formData.lastName}`.trim(),
//         email: formData.email,
//       };

//       const response = await fetch(`http://localhost:3000/users/${user._id}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(payload),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || 'Failed to update profile');
//       }

//       // Refresh user data in AuthContext
//       await fetchUser(token);
//       alert('Profile updated successfully!');
//     } catch (error) {
//       console.error('Update error:', error);
//       alert(error instanceof Error ? error.message : 'Failed to update profile');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (isLoading) {
//     return <div className="p-4 text-center">Loading profile...</div>;
//   }

//   if (!user) {
//     return <div className="p-4 text-center text-red-500">User not authenticated</div>;
//   }

//   return (
//     <div className="bg-white p-6 rounded-lg shadow-md">
//       <h2 className="text-xl font-semibold mb-6">My Profile</h2>
//       <div className="space-y-4 max-w-lg">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             First Name
//           </label>
//           <input
//             type="text"
//             name="firstName"
//             value={formData.firstName}
//             onChange={handleChange}
//             className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#DF2648] focus:border-[#DF2648]"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Last Name
//           </label>
//           <input
//             type="text"
//             name="lastName"
//             value={formData.lastName}
//             onChange={handleChange}
//             className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#DF2648] focus:border-[#DF2648]"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Email
//           </label>
//           <input
//             type="email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#DF2648] focus:border-[#DF2648]"
//           />
//         </div>

//         <div className="flex gap-4 pt-6">
//           <button 
//             type="button"
//             className="px-6 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
//             onClick={() => setFormData({
//               firstName: user.name.split(' ')[0] || '',
//               lastName: user.name.split(' ').slice(1).join(' ') || '',
//               email: user.email,
//             })}
//           >
//             Reset
//           </button>
//           <button
//             type="submit"
//             className="px-6 py-2 bg-[#DF2648] text-white rounded-md hover:bg-[#DF2648]/90 disabled:opacity-50"
//             onClick={handleSubmit}
//             disabled={isSubmitting}
//           >
//             {isSubmitting ? 'Saving...' : 'Save Changes'}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserProfile;
'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { FiUser, FiMail, FiSave } from 'react-icons/fi';

const UserProfile = () => {
  const { user, token, logout, fetchUser } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      const [firstName, ...lastNameParts] = user.name.split(' ');
      setFormData({
        firstName,
        lastName: lastNameParts.join(' '),
        email: user.email,
      });
      setIsLoading(false);
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !token) {
      alert('Session expired. Please login again.');
      logout();
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
      };

      const response = await fetch(`http://localhost:3000/users/${user._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }

      // Refresh user data in AuthContext
      await fetchUser(token);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Update error:', error);
      alert(error instanceof Error ? error.message : 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="p-4 text-center">Loading profile...</div>;
  }

  if (!user) {
    return <div className="p-4 text-center text-red-500">User not authenticated</div>;
  }

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-red-100 rounded-full">
          <FiUser className="text-2xl text-red-600" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-800">Profile Information</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name
            </label>
            <div className="relative">
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full pl-4 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <div className="relative">
            <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex gap-4 pt-6">
          {/* <button
            type="button"
            className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            onClick={resetForm}
          >
            Reset
          </button> */}
          <button
            type="submit"
            className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            disabled={isSubmitting}
          >
            <FiSave />
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};
export default UserProfile