'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-lg font-semibold mb-6 text-gray-700">Account Settings</h2>
      <nav>
        <ul className="space-y-3">
          {navigationItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  pathname === item.href
                    ? 'bg-red-50 text-red-600 font-semibold'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;