// Sidebar.tsx
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiUser, FiMapPin, FiPackage, FiHeart, FiStar } from 'react-icons/fi';

const Sidebar = () => {
  const pathname = usePathname();

  const navigationItems = [
    { name: 'My Profile', href: '/useraccount/profile', icon: <FiUser /> },
    { name: 'Address Book', href: '/useraccount/address', icon: <FiMapPin /> },
    { name: 'My Orders', href: '/useraccount/orders', icon: <FiPackage /> },
    { name: 'My WishList', href: '/useraccount/wishlist', icon: <FiHeart /> },
    { name: 'Recommendations', href: '/useraccount/recommendations', icon: <FiStar /> },
  ];

  return (
    <motion.div 
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 sticky top-32"
    >
      <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b border-gray-100 pb-3">
        Account Settings
      </h2>
      <nav>
        <ul className="space-y-2">
          {navigationItems.map((item, index) => (
            <motion.li 
              key={item.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={item.href}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                  pathname === item.href
                    ? 'bg-gradient-to-r from-red-50 to-red-100 text-red-600 font-medium shadow-inner'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className={`text-lg ${pathname === item.href ? 'text-red-500' : 'text-gray-400'}`}>
                  {item.icon}
                </span>
                <span>{item.name}</span>
              </Link>
            </motion.li>
          ))}
        </ul>
      </nav>
    </motion.div>
  );
};

export default Sidebar;