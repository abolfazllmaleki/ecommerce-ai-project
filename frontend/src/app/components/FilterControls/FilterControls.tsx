interface FilterControlsProps {
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  minRating: number;
  setMinRating: (rating: number) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
}

export const FilterControls = ({
  priceRange,
  setPriceRange,
  minRating,
  setMinRating,
  sortBy,
  setSortBy,
}: FilterControlsProps) => (
  <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
    <div className="space-y-6">
      <div>
        <h3 className="font-medium mb-3 text-gray-700">Price Range</h3>
        <div className="relative pt-2">
          <input
            type="range"
            min="0"
            max="1000"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-500"
          />
          <div className="flex justify-between text-sm text-gray-600 mt-2">
            <span>$0</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-3 text-gray-700">Minimum Rating</h3>
        <select
          value={minRating}
          onChange={(e) => setMinRating(Number(e.target.value))}
          className="w-full p-3 rounded-lg border border-gray-300 text-sm transition-colors focus:border-red-500 focus:ring-2 focus:ring-red-200"
        >
          <option value={0}>All Ratings</option>
          <option value={4}>4 stars & up</option>
          <option value={3}>3 stars & up</option>
          <option value={2}>2 stars & up</option>
        </select>
      </div>

      <div>
        <h3 className="font-medium mb-3 text-gray-700">Sort By</h3>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full p-3 rounded-lg border border-gray-300 text-sm transition-colors focus:border-red-500 focus:ring-2 focus:ring-red-200"
        >
          <option value="popularity">Popularity</option>
          <option value="priceAsc">Price: Low to High</option>
          <option value="priceDesc">Price: High to Low</option>
          <option value="rating">Rating</option>
        </select>
      </div>
    </div>
  </div>
);