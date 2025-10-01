import Link from "next/link";
import { FaPhone, FaLaptop, FaClock, FaCamera, FaHeadphones, FaGamepad } from "react-icons/fa";
import {Category} from '../../types/types'

const CategoriesSection = () => {
  const categories: Category[] = [
    { _id: 1, name: "Phones", icon: <FaPhone className="w-6 h-6" />, href: "/search?Categorie=phone" },
    { _id: 2, name: "Computers", icon: <FaLaptop className="w-6 h-6" />, href: "/search" },
    { _id: 3, name: "SmartWatch", icon: <FaClock className="w-6 h-6" />, href: "/search" },
    { _id: 4, name: "Camera", icon: <FaCamera className="w-6 h-6" />, href: "/search" },
    { _id: 5, name: "HeadPhones", icon: <FaHeadphones className="w-6 h-6" />, href: "/search" },
    { _id: 6, name: "Gaming", icon: <FaGamepad className="w-6 h-6" />, href: "/search" },
  ];

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-3 text-gray-800">Browse By Category</h2>
        <p className="text-gray-500 max-w-2xl mx-auto">Discover products in our most popular categories</p>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
        {categories.map((category) => (
          <Link
            key={category._id}
            href={category.href}
            className="group flex flex-col items-center p-6 bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-red-200 hover:bg-red-50"
            aria-label={`Browse ${category.name}`}
          >
            <div className="mb-4 p-4 bg-red-50 group-hover:bg-white rounded-full text-red-500 group-hover:text-red-600 transition-colors duration-300">
              {category.icon}
            </div>
            <span className="text-md font-semibold text-gray-700 group-hover:text-red-600 transition-colors duration-300">
              {category.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategoriesSection;