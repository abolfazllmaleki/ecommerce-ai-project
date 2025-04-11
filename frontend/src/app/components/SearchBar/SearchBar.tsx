import { FiSearch } from "react-icons/fi";

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const SearchBar = ({ searchQuery, setSearchQuery }: SearchBarProps) => (
  <div className="relative max-w-2xl mx-auto mb-8">
    <input
      type="text"
      placeholder="Search products..."
      className="w-full px-4 py-3 pl-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
    />
    <FiSearch className="absolute left-4 top-4 text-gray-400 text-xl" />
  </div>
);