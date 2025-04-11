import Link from "next/link";
import { FaPhone, FaLaptop, FaClock, FaCamera, FaHeadphones, FaGamepad } from "react-icons/fa";

import {Category} from '../../types/types'

const CategoriesSection = () => {
  const categories: Category[] = [
    { id: 1, name: "Phones", icon: <FaPhone className="w-6 h-6" />, href: "/category/phones" },
    { id: 2, name: "Computers", icon: <FaLaptop className="w-6 h-6" />, href: "/category/computers" },
    { id: 3, name: "SmartWatch", icon: <FaClock className="w-6 h-6" />, href: "/category/smartwatch" },
    { id: 4, name: "Camera", icon: <FaCamera className="w-6 h-6" />, href: "/category/camera" },
    { id: 5, name: "HeadPhones", icon: <FaHeadphones className="w-6 h-6" />, href: "/category/headphones" },
    { id: 6, name: "Gaming", icon: <FaGamepad className="w-6 h-6" />, href: "/category/gaming" },
  ];

  return (
    <section className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Browse By Category</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={category.href}
            className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border hover:border-primary-500"
            aria-label={`Browse ${category.name}`}
          >
            <div className="mb-2 text-primary-600">{category.icon}</div>
            <span className="text-sm font-medium text-gray-700 hover:text-primary-600">
              {category.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategoriesSection;