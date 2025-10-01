// "use client";
// import React, { useState } from "react";
// import { useRouter } from "next/navigation";
// import { useAuth } from "../context/AuthContext";
// import Link from "next/link";

// const LoginPage: React.FC = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();
//   const { login } = useAuth();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//       const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password }),
//       });

//       if (response.ok) {
//         const data = await response.json();
//         // login(data.access_token, data.user);
//         login(data.access_token);
//         router.push("/useraccount");
//       } else {
//         const errorData = await response.json();
//         setError(errorData.message || "Invalid credentials");
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
//           <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Welcome Back</h2>
          
//           <form className="space-y-6" onSubmit={handleSubmit}>
//             {error && (
//               <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
//                 {error}
//               </div>
//             )}

//             <div>
//               <input
//                 type="email"
//                 placeholder="Email Address"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="w-full border-b border-gray-300 py-3 px-4 focus:outline-none focus:border-red-400 transition-colors"
//                 required
//                 disabled={loading}
//               />
//             </div>

//             <div>
//               <input
//                 type="password"
//                 placeholder="Password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
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
//               {loading ? "Signing in..." : "Sign In"}
//             </button>
//           </form>

//           <div className="mt-6 text-center space-y-4">
//             <Link 
//               href="/forgot-password" 
//               className="text-red-500 hover:text-red-600 text-sm transition-colors"
//             >
//               Forgot your password?
//             </Link>
            
//             <div className="border-t border-gray-200 pt-4">
//               <p className="text-gray-600 text-sm">
//                 Don't have an account?{" "}
//                 <Link 
//                   href="/register" 
//                   className="text-red-500 hover:text-red-600 font-semibold transition-colors"
//                 >
//                   Sign up
//                 </Link>
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;
// app/login/page.tsx
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import Link from "next/link";
import ReCaptcha from "../components/Recaptcha/Recaptcha";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const router = useRouter();
  const { login } = useAuth();

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

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email, 
          password,
          recaptchaToken // Send the token to the backend for verification
        }),
      });

      if (response.ok) {
        const data = await response.json();
        login(data.access_token);
        router.push("/useraccount");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Invalid credentials");
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
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Welcome Back</h2>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div>
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-b border-gray-300 py-3 px-4 focus:outline-none focus:border-red-400 transition-colors"
                required
                disabled={loading}
              />
            </div>

            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 text-center space-y-4">
            <Link 
              href="/forgot-password" 
              className="text-red-500 hover:text-red-600 text-sm transition-colors"
            >
              Forgot your password?
            </Link>
            
            <div className="border-t border-gray-200 pt-4">
              <p className="text-gray-600 text-sm">
                Don't have an account?{" "}
                <Link 
                  href="/register" 
                  className="text-red-500 hover:text-red-600 font-semibold transition-colors"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;