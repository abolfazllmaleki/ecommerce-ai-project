// components/SearchPage/CategoryFilter.tsx
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
  <div className="bg-white p-4 rounded-xl shadow-sm">
    <h3 className="font-medium mb-4 text-gray-700">Categories</h3>
    <div className="space-y-3">
      {categories.map((category) => (
        <label
          key={category._id}
          className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-red-50 transition-colors"
        >
          <input
            type="checkbox"
            checked={selectedCategories.includes(category._id)}
            onChange={() => toggleCategory(category._id)}
            className="h-4 w-4 text-red-500 border-gray-300 rounded focus:ring-red-500"
          />
          <span className="text-gray-700 text-sm">{category.name}</span>
        </label>
      ))}
    </div>
  </div>
);