// // components/SearchPage/CategoryFilter.tsx
// import { Category } from "@/app/types/types";

// interface CategoryFilterProps {
//   categories: Category[];
//   selectedCategories: string[];
//   toggleCategory: (categoryId: string) => void;
// }

// export const CategoryFilter = ({
//   categories,
//   selectedCategories,
//   toggleCategory,
// }: CategoryFilterProps) => (
//   <div className="bg-white p-4 rounded-xl shadow-sm">
//     <h3 className="font-medium mb-4 text-gray-700">Categories</h3>
//     <div className="space-y-3">
//       {categories.map((category) => (
//         <label
//           key={category._id}
//           className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-red-50 transition-colors"
//         >
//           <input
//             type="checkbox"
//             checked={selectedCategories.includes(category._id)}
//             onChange={() => toggleCategory(category._id)}
//             className="h-4 w-4 text-red-500 border-gray-300 rounded focus:ring-red-500"
//           />
//           <span className="text-gray-700 text-sm">{category.name}</span>
//         </label>
//       ))}
//     </div>
//   </div>
// );
// CategoryFilter.tsx
'use client';
import { motion } from 'framer-motion';
import { FiCheck } from 'react-icons/fi';
import { Category } from "@/app/types/types";

interface CategoryFilterProps {
  categories: Category[];
  selectedCategories: string[];
  toggleCategory: (categoryId: string) => void;
}

export const CategoryFilter = ({
  categories,
  selectedCategories,
  toggleCategory,
}: CategoryFilterProps) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
  >
    <h3 className="font-medium mb-4 text-gray-700">Categories</h3>
    <div className="space-y-2">
      {categories.map((category) => (
        <motion.label
          key={category._id}
          whileHover={{ x: 5 }}
          className={`flex items-center justify-between cursor-pointer p-3 rounded-lg transition-colors ${
            selectedCategories.includes(category._id)
              ? 'bg-red-50 border border-red-200'
              : 'hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-5 h-5 rounded border flex items-center justify-center ${
              selectedCategories.includes(category._id)
                ? 'bg-red-500 border-red-500'
                : 'border-gray-300'
            }`}>
              {selectedCategories.includes(category._id) && (
                <FiCheck className="text-white text-xs" />
              )}
            </div>
            <span className="text-gray-700">{category.name}</span>
          </div>
        </motion.label>
      ))}
    </div>
  </motion.div>
);