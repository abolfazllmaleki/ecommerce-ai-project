// "use client";
// import React, { useState, useEffect } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import Link from "next/link";

// const ResetPasswordPage: React.FC = () => {
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [error, setError] = useState("");
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [token, setToken] = useState("");
//   const [tokenValid, setTokenValid] = useState(false);
//   const [validating, setValidating] = useState(true);

//   const router = useRouter();
//   const searchParams = useSearchParams();

//   useEffect(() => {
//     const tokenFromUrl = searchParams.get("token");
//     if (tokenFromUrl) {
//       setToken(tokenFromUrl);
//       validateToken(tokenFromUrl);
//     } else {
//       setValidating(false);
//       setError("Invalid reset link. Please request a new reset link.");
//     }
//   }, [searchParams]);

//   const validateToken = async (token: string) => {
//     try {
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/validate-reset-token/${token}`,
//         {
//           method: "POST",
//         }
//       );

//       if (response.ok) {
//         setTokenValid(true);
//       } else {
//         setError("Invalid or expired reset token. Please request a new reset link.");
//       }
//     } catch (error) {
//       setError("Network error. Please try again.");
//     } finally {
//       setValidating(false);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     if (password !== confirmPassword) {
//       setError("Passwords do not match");
//       setLoading(false);
//       return;
//     }

//     if (password.length < 6) {
//       setError("Password must be at least 6 characters");
//       setLoading(false);
//       return;
//     }

//     try {
//       const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/reset-password`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ token, password }),
//       });

//       if (response.ok) {
//         setMessage("Password reset successfully! Redirecting to login...");
//         setTimeout(() => {
//           router.push("/login");
//         }, 2000);
//       } else {
//         const errorData = await response.json();
//         setError(errorData.message || "Failed to reset password");
//       }
//     } catch (error) {
//       setError("Network error. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (validating) {
//     return (
//       <div className="flex min-h-screen bg-gray-50 items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Validating reset token...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!tokenValid) {
//     return (
//       <div className="flex min-h-screen bg-gray-50">
//         <div className="flex-1 flex flex-col justify-center items-center px-6 bg-white shadow-lg">
//           <div className="w-full max-w-md text-center">
//             <div className="text-red-500 text-6xl mb-4">⚠️</div>
//             <h2 className="text-2xl font-bold mb-4 text-gray-800">Invalid Reset Link</h2>
//             <p className="text-gray-600 mb-6">{error}</p>
//             <Link 
//               href="/forgot-password" 
//               className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
//             >
//               Request New Link
//             </Link>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       <div className="flex-1 flex flex-col justify-center items-center px-6 bg-white shadow-lg">
//         <div className="w-full max-w-md">
//           <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Set New Password</h2>
          
//           <form className="space-y-6" onSubmit={handleSubmit}>
//             {error && (
//               <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
//                 {error}
//               </div>
//             )}

//             {message && (
//               <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
//                 {message}
//               </div>
//             )}

//             <div>
//               <input
//                 type="password"
//                 placeholder="New Password (min 6 characters)"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="w-full border-b border-gray-300 py-3 px-4 focus:outline-none focus:border-red-400 transition-colors"
//                 required
//                 minLength={6}
//                 disabled={loading}
//               />
//             </div>

//             <div>
//               <input
//                 type="password"
//                 placeholder="Confirm New Password"
//                 value={confirmPassword}
//                 onChange={(e) => setConfirmPassword(e.target.value)}
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
//               {loading ? "Resetting..." : "Reset Password"}
//             </button>
//           </form>

//           <div className="mt-6 text-center border-t border-gray-200 pt-4">
//             <p className="text-gray-600 text-sm">
//               Remember your password?{" "}
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

// export default ResetPasswordPage;
"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

// کامپوننت اصلی که از useSearchParams استفاده می‌کند
function ResetPasswordContent() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");
  const [tokenValid, setTokenValid] = useState(false);
  const [validating, setValidating] = useState(true);

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const tokenFromUrl = searchParams.get("token");
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
      validateToken(tokenFromUrl);
    } else {
      setValidating(false);
      setError("Invalid reset link. Please request a new reset link.");
    }
  }, [searchParams]);

  const validateToken = async (token: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/reset-password/validate/${token}`,
        {
          method: "GET",
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data?.valid) {
          setTokenValid(true);
        } else {
          setError("Invalid or expired reset token. Please request a new reset link.");
        }
      } else {
        setError("Invalid or expired reset token. Please request a new reset link.");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setValidating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      if (response.ok) {
        setMessage("Password reset successfully! Redirecting to login...");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to reset password");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (validating) {
    return (
      <div className="flex min-h-screen bg-gray-50 items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Validating reset token...</p>
        </div>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <div className="flex-1 flex flex-col justify-center items-center px-6 bg-white shadow-lg">
          <div className="w-full max-w-md text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Invalid Reset Link</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link 
              href="/forgot-password" 
              className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              Request New Link
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1 flex flex-col justify-center items-center px-6 bg-white shadow-lg">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Set New Password</h2>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {message && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                {message}
              </div>
            )}

            <div>
              <input
                type="password"
                placeholder="New Password (min 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-b border-gray-300 py-3 px-4 focus:outline-none focus:border-red-400 transition-colors"
                required
                minLength={6}
                disabled={loading}
              />
            </div>

            <div>
              <input
                type="password"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border-b border-gray-300 py-3 px-4 focus:outline-none focus:border-red-400 transition-colors"
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-500 text-white py-3 px-4 rounded-lg hover:bg-red-600 disabled:bg-red-300 transition-colors font-semibold"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>

          <div className="mt-6 text-center border-t border-gray-200 pt-4">
            <p className="text-gray-600 text-sm">
              Remember your password?{" "}
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
}

const ResetPasswordPage: React.FC = () => {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen bg-gray-50 items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
};

export default ResetPasswordPage;