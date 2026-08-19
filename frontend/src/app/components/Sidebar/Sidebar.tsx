// 'use client';

// import React from 'react';
// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import {
//   FiUser,
//   FiMapPin,
//   FiShoppingBag,
//   FiHeart,
//   FiSettings,
//   FiLogOut,
//   FiChevronRight,
//   FiRotateCcw,
//   FiCreditCard,
//   FiXCircle,
//   FiStar,
// } from 'react-icons/fi';

// const Sidebar = () => {
//   const pathname = usePathname();

//   const navigation = [
//     {
//       label: 'Profile',
//       href: '/useraccount/profile',
//       icon: FiUser,
//     },
//     {
//       label: 'Addresses',
//       href: '/useraccount/address',
//       icon: FiMapPin,
//     },
//     {
//       label: 'Orders',
//       href: '/useraccount/orders',
//       icon: FiShoppingBag,
//     },
//     {
//       label: 'Wishlist',
//       href: '/useraccount/wishlist',
//       icon: FiHeart,
//     },
//     {
//       label: 'Returns',
//       href: '/useraccount/returns',
//       icon: FiRotateCcw,
//     },
//     {
//       label: 'Cancellations',
//       href: '/useraccount/cancellations',
//       icon: FiXCircle,
//     },
//     {
//       label: 'Payment Options',
//       href: '/useraccount/payment',
//       icon: FiCreditCard,
//     },
//     {
//       label: 'Recommendations',
//       href: '/useraccount/recommendations',
//       icon: FiStar,
//     },
//   ];

//   const isActive = (href: string) => {
//     if (!pathname) return false;

//     return (
//       pathname === href ||
//       pathname.startsWith(`${href}/`)
//     );
//   };

//   return (
//     <aside className="w-full">
//       <div
//         className="
//           overflow-hidden
//           rounded-[24px]
//           border
//           border-gray-100
//           bg-white
//           shadow-[0_8px_30px_rgba(0,0,0,0.04)]
//         "
//       >
//         {/* ============================================================
//             ACCOUNT HEADER
//         ============================================================ */}

//         <div
//           className="
//             relative
//             overflow-hidden
//             border-b
//             border-gray-100
//             px-5
//             py-5
//           "
//         >
//           {/* decorative glow */}

//           <div
//             className="
//               pointer-events-none
//               absolute
//               -right-12
//               -top-12
//               h-28
//               w-28
//               rounded-full
//               bg-red-100/60
//               blur-3xl
//             "
//           />

//           <div
//             className="
//               pointer-events-none
//               absolute
//               -bottom-10
//               left-1/3
//               h-20
//               w-20
//               rounded-full
//               bg-rose-50
//               blur-2xl
//             "
//           />

//           <div className="relative flex items-center gap-3">
//             <div
//               className="
//                 flex
//                 h-12
//                 w-12
//                 shrink-0
//                 items-center
//                 justify-center
//                 rounded-2xl
//                 bg-[#fff1f3]
//                 text-[#DF2648]
//                 ring-4
//                 ring-[#fff8f9]
//               "
//             >
//               <FiUser size={20} />
//             </div>

//             <div className="min-w-0">
//               <p className="truncate text-sm font-bold text-gray-900">
//                 My Account
//               </p>

//               <p className="mt-0.5 text-xs text-gray-400">
//                 Manage your account
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* ============================================================
//             NAVIGATION
//         ============================================================ */}

//         <nav className="p-2.5">
//           <p
//             className="
//               mb-2
//               px-3
//               pt-1
//               text-[10px]
//               font-bold
//               uppercase
//               tracking-[0.14em]
//               text-gray-300
//             "
//           >
//             Account
//           </p>

//           <div className="space-y-0.5">
//             {navigation.map((item) => {
//               const Icon = item.icon;
//               const active = isActive(item.href);

//               return (
//                 <Link
//                   key={item.href}
//                   href={item.href}
//                   className={`
//                     group
//                     relative
//                     flex
//                     min-h-[46px]
//                     items-center
//                     gap-3
//                     rounded-xl
//                     px-3
//                     py-2.5
//                     transition-all
//                     duration-200
//                     ${
//                       active
//                         ? `
//                           bg-[#fff3f5]
//                           text-[#DF2648]
//                         `
//                         : `
//                           text-gray-500
//                           hover:bg-gray-50
//                           hover:text-gray-900
//                         `
//                     }
//                   `}
//                 >
//                   {/* Active line */}

//                   {active && (
//                     <span
//                       className="
//                         absolute
//                         left-0
//                         top-1/2
//                         h-6
//                         w-[3px]
//                         -translate-y-1/2
//                         rounded-r-full
//                         bg-[#DF2648]
//                       "
//                     />
//                   )}

//                   {/* Icon */}

//                   <span
//                     className={`
//                       flex
//                       h-8
//                       w-8
//                       shrink-0
//                       items-center
//                       justify-center
//                       rounded-lg
//                       transition-all
//                       duration-200
//                       ${
//                         active
//                           ? `
//                             bg-white
//                             text-[#DF2648]
//                             shadow-[0_2px_8px_rgba(223,38,72,0.08)]
//                           `
//                           : `
//                             bg-gray-50
//                             text-gray-400
//                             group-hover:bg-white
//                             group-hover:text-gray-600
//                           `
//                       }
//                     `}
//                   >
//                     <Icon size={16} />
//                   </span>

//                   {/* Label */}

//                   <span
//                     className={`
//                       flex-1
//                       truncate
//                       text-sm
//                       ${
//                         active
//                           ? 'font-bold'
//                           : 'font-medium'
//                       }
//                     `}
//                   >
//                     {item.label}
//                   </span>

//                   {/* Arrow */}

//                   <FiChevronRight
//                     size={14}
//                     className={`
//                       shrink-0
//                       transition-all
//                       duration-200
//                       ${
//                         active
//                           ? `
//                             translate-x-0
//                             text-[#DF2648]
//                             opacity-100
//                           `
//                           : `
//                             -translate-x-1
//                             text-gray-300
//                             opacity-0
//                             group-hover:translate-x-0
//                             group-hover:opacity-100
//                           `
//                       }
//                     `}
//                   />
//                 </Link>
//               );
//             })}
//           </div>
//         </nav>

//         {/* ============================================================
//             LOGOUT
//         ============================================================ */}

//         <div className="border-t border-gray-100 p-2.5">
//           <button
//             type="button"
//             className="
//               group
//               flex
//               min-h-[46px]
//               w-full
//               items-center
//               gap-3
//               rounded-xl
//               px-3
//               py-2.5
//               text-gray-500
//               transition-all
//               duration-200
//               hover:bg-red-50
//               hover:text-red-600
//             "
//           >
//             <span
//               className="
//                 flex
//                 h-8
//                 w-8
//                 shrink-0
//                 items-center
//                 justify-center
//                 rounded-lg
//                 bg-gray-50
//                 text-gray-400
//                 transition-all
//                 duration-200
//                 group-hover:bg-white
//                 group-hover:text-red-500
//               "
//             >
//               <FiLogOut size={16} />
//             </span>

//             <span className="text-sm font-semibold">
//               Sign out
//             </span>
//           </button>
//         </div>
//       </div>
//     </aside>
//   );
// };

// export default Sidebar;
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  FiUser,
  FiMapPin,
  FiShoppingBag,
  FiHeart,
  FiLogOut,
  FiChevronRight,
  FiRotateCcw,
  FiCreditCard,
  FiXCircle,
  FiStar,
  FiLoader,
} from 'react-icons/fi';

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const [loggingOut, setLoggingOut] = useState(false);

  const navigation = [
    {
      label: 'Profile',
      href: '/useraccount/profile',
      icon: FiUser,
    },
    {
      label: 'Addresses',
      href: '/useraccount/address',
      icon: FiMapPin,
    },
    {
      label: 'Orders',
      href: '/useraccount/orders',
      icon: FiShoppingBag,
    },
    {
      label: 'Wishlist',
      href: '/useraccount/wishlist',
      icon: FiHeart,
    },
    {
      label: 'Returns',
      href: '/useraccount/returns',
      icon: FiRotateCcw,
    },
    {
      label: 'Cancellations',
      href: '/useraccount/cancellations',
      icon: FiXCircle,
    },
    {
      label: 'Payment Options',
      href: '/useraccount/payment',
      icon: FiCreditCard,
    },
    {
      label: 'Recommendations',
      href: '/useraccount/recommendations',
      icon: FiStar,
    },
  ];

  const isActive = (href: string) => {
    if (!pathname) return false;

    return (
      pathname === href ||
      pathname.startsWith(`${href}/`)
    );
  };

  // ============================================================
  // REAL LOGOUT
  // ============================================================

  const handleLogout = async () => {
    if (loggingOut) return;

    try {
      setLoggingOut(true);

      /*
       * اگر backend برای logout endpoint دارد،
       * اینجا می‌توانی قبل از پاک کردن token آن را صدا بزنی.
       *
       * مثال:
       *
       * await axios.post(
       *   `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/logout`,
       *   {},
       *   {
       *     headers: {
       *       Authorization: `Bearer ${localStorage.getItem('token')}`,
       *     },
       *   }
       * );
       */

      // پاک کردن authentication
      localStorage.removeItem('token');

      // اگر اطلاعات کاربر را هم ذخیره کرده‌ای
      localStorage.removeItem('user');

      // پاک کردن موارد احتمالی دیگر auth
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');

      // انتقال به login
      router.replace('/login');

      // refresh نکردن صفحه باعث transition سریع‌تر می‌شود
      router.refresh();
    } catch (error) {
      console.error('Logout failed:', error);

      // حتی اگر request دیگری fail شود،
      // token محلی را پاک می‌کنیم.
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      router.replace('/login');
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <aside className="w-full">
      <div
        className="
          overflow-hidden
          rounded-[24px]
          border
          border-gray-100
          bg-white
          shadow-[0_8px_30px_rgba(0,0,0,0.04)]
        "
      >
        {/* ============================================================
            ACCOUNT HEADER
        ============================================================ */}

        <div
          className="
            relative
            overflow-hidden
            border-b
            border-gray-100
            px-5
            py-5
          "
        >
          {/* decorative glow */}

          <div
            className="
              pointer-events-none
              absolute
              -right-12
              -top-12
              h-28
              w-28
              rounded-full
              bg-red-100/60
              blur-3xl
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              -bottom-10
              left-1/3
              h-20
              w-20
              rounded-full
              bg-rose-50
              blur-2xl
            "
          />

          <div className="relative flex items-center gap-3">
            <div
              className="
                flex
                h-12
                w-12
                shrink-0
                items-center
                justify-center
                rounded-2xl
                bg-[#fff1f3]
                text-[#DF2648]
                ring-4
                ring-[#fff8f9]
              "
            >
              <FiUser size={20} />
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-gray-900">
                My Account
              </p>

              <p className="mt-0.5 text-xs text-gray-400">
                Manage your account
              </p>
            </div>
          </div>
        </div>

        {/* ============================================================
            NAVIGATION
        ============================================================ */}

        <nav className="p-2.5">
          <p
            className="
              mb-2
              px-3
              pt-1
              text-[10px]
              font-bold
              uppercase
              tracking-[0.14em]
              text-gray-300
            "
          >
            Account
          </p>

          <div className="space-y-0.5">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch={true}
                  className={`
                    group
                    relative
                    flex
                    min-h-[46px]
                    items-center
                    gap-3
                    rounded-xl
                    px-3
                    py-2.5
                    transition-all
                    duration-150

                    ${
                      active
                        ? `
                          bg-[#fff3f5]
                          text-[#DF2648]
                        `
                        : `
                          text-gray-500
                          hover:bg-gray-50
                          hover:text-gray-900
                        `
                    }
                  `}
                >
                  {/* Active line */}

                  {active && (
                    <span
                      className="
                        absolute
                        left-0
                        top-1/2
                        h-6
                        w-[3px]
                        -translate-y-1/2
                        rounded-r-full
                        bg-[#DF2648]
                      "
                    />
                  )}

                  {/* Icon */}

                  <span
                    className={`
                      flex
                      h-8
                      w-8
                      shrink-0
                      items-center
                      justify-center
                      rounded-lg
                      transition-colors
                      duration-150

                      ${
                        active
                          ? `
                            bg-white
                            text-[#DF2648]
                            shadow-[0_2px_8px_rgba(223,38,72,0.08)]
                          `
                          : `
                            bg-gray-50
                            text-gray-400
                            group-hover:bg-white
                            group-hover:text-gray-600
                          `
                      }
                    `}
                  >
                    <Icon size={16} />
                  </span>

                  {/* Label */}

                  <span
                    className={`
                      flex-1
                      truncate
                      text-sm

                      ${
                        active
                          ? 'font-bold'
                          : 'font-medium'
                      }
                    `}
                  >
                    {item.label}
                  </span>

                  {/* Arrow */}

                  <FiChevronRight
                    size={14}
                    className={`
                      shrink-0
                      transition-all
                      duration-150

                      ${
                        active
                          ? `
                            translate-x-0
                            text-[#DF2648]
                            opacity-100
                          `
                          : `
                            -translate-x-1
                            text-gray-300
                            opacity-0
                            group-hover:translate-x-0
                            group-hover:opacity-100
                          `
                      }
                    `}
                  />
                </Link>
              );
            })}
          </div>
        </nav>

        {/* ============================================================
            LOGOUT
        ============================================================ */}

        <div className="border-t border-gray-100 p-2.5">
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="
              group
              flex
              min-h-[46px]
              w-full
              items-center
              gap-3
              rounded-xl
              px-3
              py-2.5
              text-gray-500
              transition-all
              duration-150
              hover:bg-red-50
              hover:text-red-600
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            <span
              className="
                flex
                h-8
                w-8
                shrink-0
                items-center
                justify-center
                rounded-lg
                bg-gray-50
                text-gray-400
                transition-all
                duration-150
                group-hover:bg-white
                group-hover:text-red-500
              "
            >
              {loggingOut ? (
                <FiLoader
                  size={16}
                  className="animate-spin"
                />
              ) : (
                <FiLogOut size={16} />
              )}
            </span>

            <span className="text-sm font-semibold">
              {loggingOut ? 'Signing out...' : 'Sign out'}
            </span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;