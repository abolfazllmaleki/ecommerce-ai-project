// "use client";
// import React, { useState } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";

// const RegisterPage: React.FC = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     confirmPassword: ""
//   });
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     // Validation
//     if (formData.password !== formData.confirmPassword) {
//       setError("Passwords do not match");
//       setLoading(false);
//       return;
//     }

//     if (formData.password.length < 6) {
//       setError("Password must be at least 6 characters");
//       setLoading(false);
//       return;
//     }

//     try {
//       const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/register`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           name: formData.name,
//           email: formData.email,
//           password: formData.password
//         }),
//       });

//       if (response.ok) {
//         router.push("/login?message=Registration successful. Please login.");
//       } else {
//         const errorData = await response.json();
//         setError(errorData.message || "Registration failed");
//       }
//     } catch (error) {
//       setError("Network error. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       <div className="flex-1 flex flex-col justify-center items-center px-6 bg-white shadow-lg">
//         <div className="w-full max-w-md">
//           <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Create Account</h2>
          
//           <form className="space-y-6" onSubmit={handleSubmit}>
//             {error && (
//               <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
//                 {error}
//               </div>
//             )}

//             <div>
//               <input
//                 type="text"
//                 name="name"
//                 placeholder="Full Name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 className="w-full border-b border-gray-300 py-3 px-4 focus:outline-none focus:border-red-400 transition-colors"
//                 required
//                 disabled={loading}
//               />
//             </div>

//             <div>
//               <input
//                 type="email"
//                 name="email"
//                 placeholder="Email Address"
//                 value={formData.email}
//                 onChange={handleChange}
//                 className="w-full border-b border-gray-300 py-3 px-4 focus:outline-none focus:border-red-400 transition-colors"
//                 required
//                 disabled={loading}
//               />
//             </div>

//             <div>
//               <input
//                 type="password"
//                 name="password"
//                 placeholder="Password (min 6 characters)"
//                 value={formData.password}
//                 onChange={handleChange}
//                 className="w-full border-b border-gray-300 py-3 px-4 focus:outline-none focus:border-red-400 transition-colors"
//                 required
//                 minLength={6}
//                 disabled={loading}
//               />
//             </div>

//             <div>
//               <input
//                 type="password"
//                 name="confirmPassword"
//                 placeholder="Confirm Password"
//                 value={formData.confirmPassword}
//                 onChange={handleChange}
//                 className="w-full border-b border-gray-300 py-3 px-4 focus:outline-none focus:border-red-400 transition-colors"
//                 required
//                 disabled={loading}
//               />
//             </div>

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full bg-red-500 text-white py-3 px-4 rounded-lg hover:bg-red-600 disabled:bg-red-300 transition-colors font-semibold"
//             >
//               {loading ? "Creating Account..." : "Create Account"}
//             </button>
//           </form>

//           <div className="mt-6 text-center border-t border-gray-200 pt-4">
//             <p className="text-gray-600 text-sm">
//               Already have an account?{" "}
//               <Link 
//                 href="/login" 
//                 className="text-red-500 hover:text-red-600 font-semibold transition-colors"
//               >
//                 Sign in
//               </Link>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RegisterPage;
// app/register/page.tsx
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ReCaptcha from "../components/Recaptcha/Recaptcha";

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRecaptchaVerify = (token: string | null) => {
    setRecaptchaToken(token);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // reCAPTCHA validation
    if (!recaptchaToken) {
      setError("Please complete the reCAPTCHA verification");
      setLoading(false);
      return;
    }

    // Password validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          recaptchaToken // Send the token to the backend for verification
        }),
      });

      if (response.ok) {
        router.push("/login?message=Registration successful. Please login.");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Registration failed");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1 flex flex-col justify-center items-center px-6 bg-white shadow-lg">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Create Account</h2>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border-b border-gray-300 py-3 px-4 focus:outline-none focus:border-red-400 transition-colors"
                required
                disabled={loading}
              />
            </div>

            <div>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className="w-full border-b border-gray-300 py-3 px-4 focus:outline-none focus:border-red-400 transition-colors"
                required
                disabled={loading}
              />
            </div>

            <div>
              <input
                type="password"
                name="password"
                placeholder="Password (min 6 characters)"
                value={formData.password}
                onChange={handleChange}
                className="w-full border-b border-gray-300 py-3 px-4 focus:outline-none focus:border-red-400 transition-colors"
                required
                minLength={6}
                disabled={loading}
              />
            </div>

            <div>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full border-b border-gray-300 py-3 px-4 focus:outline-none focus:border-red-400 transition-colors"
                required
                disabled={loading}
              />
            </div>

            {/* reCAPTCHA Component */}
            <ReCaptcha onVerify={handleRecaptchaVerify} />

            <button
              type="submit"
              disabled={loading || !recaptchaToken}
              className="w-full bg-red-500 text-white py-3 px-4 rounded-lg hover:bg-red-600 disabled:bg-red-300 transition-colors font-semibold"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className="mt-6 text-center border-t border-gray-200 pt-4">
            <p className="text-gray-600 text-sm">
              Already have an account?{" "}
              <Link 
                href="/login" 
                className="text-red-500 hover:text-red-600 font-semibold transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;