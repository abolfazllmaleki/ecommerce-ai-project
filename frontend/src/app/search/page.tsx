// // components/SearchPage/SearchPage.tsx
// 'use client';
// import { useState, useEffect } from "react";
// import { useSearchParams } from "next/navigation";
// import { Product, Category } from "../types/types";
// import { SearchBar } from "../components/SearchBar/SearchBar";
// import { FilterControls } from "../components/FilterControls/FilterControls";
// import { CategoryFilter } from "../components/CategoryFilter/CategoryFilter";
// import { ProductList } from "../components/ProductList/ProductList";
// import { productService } from "@/services/api";

// const SearchPage = () => {
//   const searchParams = useSearchParams()
//   const initialQuery = searchParams.get("query") || "";

//   const [searchQuery, setSearchQuery] = useState(initialQuery);
//   const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
//   const [minRating, setMinRating] = useState(0);
//   const [sortBy, setSortBy] = useState("popularity");
//   const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
//   const [products, setProducts] = useState<Product[]>([]);
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   console.log('searching params is...',searchParams)

//   // Sync searchQuery with URL parameters
//   useEffect(() => {
//     const query = searchParams.get("query") || "";
//     setSearchQuery(query);
//   }, [searchParams]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         console.log('Fetching with filters:', {
//           query: searchQuery,
//           minPrice: priceRange[0],
//           maxPrice: priceRange[1],
//           minRating,
//           categories: selectedCategories,
//           sortBy
//         });

//         const [productsData, categoriesData] = await Promise.all([
//           productService.searchProducts({
//             query: searchQuery,
//             minPrice: priceRange[0],
//             maxPrice: priceRange[1],
//             minRating,
//             categories: selectedCategories,
//             sortBy,
//           }),
//           productService.getCategories(),
//         ]);
        
//         console.log('Received products:', productsData);
//         setProducts(productsData);
//         setCategories(categoriesData);
//         setError("");
//       } catch (err) {
//         console.error('Fetch error:', err);
//         setError("Error fetching products");
//         setProducts([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     const debounceTimer = setTimeout(() => {
//       fetchData();
//     }, 500);

//     return () => clearTimeout(debounceTimer);
//   }, [searchQuery, priceRange, minRating, selectedCategories, sortBy]);

//   const toggleCategory = (categoryId: string) => {
//     setSelectedCategories(prev =>
//       prev.includes(categoryId)
//         ? prev.filter(id => id !== categoryId)
//         : [...prev, categoryId]
//     );
//   };

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="mb-8 max-w-2xl mx-auto">
//         <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
//       </div>
      
//       {error && <div className="text-red-500 text-center mb-8">{error}</div>}

//       <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
//         <div className="lg:col-span-1 space-y-6">
//           <FilterControls
//             priceRange={priceRange}
//             setPriceRange={setPriceRange}
//             minRating={minRating}
//             setMinRating={setMinRating}
//             sortBy={sortBy}
//             setSortBy={setSortBy}
//           />
//           <CategoryFilter
//             categories={categories}
//             selectedCategories={selectedCategories}
//             toggleCategory={toggleCategory}
//           />
//         </div>

//         <div className="lg:col-span-3">
//           {loading ? (
//             <div className="text-center py-8">
//               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
//             </div>
//           ) : (
//             <>
//               {products.length > 0 ? (
//                 <ProductList products={products} />
//               ) : (
//                 !error && <div className="text-gray-500 text-center py-8">No products found matching your criteria</div>
//               )}
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SearchPage;
// 'use client';
// import { useState, useEffect, Suspense } from "react";
// import { useSearchParams } from "next/navigation";
// import { Product, Category } from "../types/types";
// import { SearchBar } from "../components/SearchBar/SearchBar";
// import { FilterControls } from "../components/FilterControls/FilterControls";
// import { CategoryFilter } from "../components/CategoryFilter/CategoryFilter";
// import { ProductList } from "../components/ProductList/ProductList";
// import { productService } from "@/services/api";

// // Client component that handles the search logic
// const SearchComponent = () => {
//   const searchParams = useSearchParams();
//   const initialQuery = searchParams.get("query") || "";

//   const [searchQuery, setSearchQuery] = useState(initialQuery);
//   const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
//   const [minRating, setMinRating] = useState(0);
//   const [sortBy, setSortBy] = useState("popularity");
//   const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
//   const [products, setProducts] = useState<Product[]>([]);
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   // Sync searchQuery with URL parameters
//   useEffect(() => {
//     const query = searchParams.get("query") || "";
//     setSearchQuery(query);
//   }, [searchParams]);

//   useEffect(() => {

//     const fetchData = async () => {
//       try {
//         setLoading(true);
        
//         const [productsData, categoriesData] = await Promise.all([
//           productService.searchProducts({
//             query: searchQuery,
//             minPrice: priceRange[0],
//             maxPrice: priceRange[1],
//             minRating,
//             categories: selectedCategories,
//             sortBy,
//           }),
//           productService.getCategories(),
//         ]);
        
//         setProducts(productsData);
//         setCategories(categoriesData);
//         setError("");
//       } catch (err) {
//         console.error('Fetch error:', err);
//         setError("Error fetching products");
//         setProducts([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     const debounceTimer = setTimeout(() => {
//       fetchData();
//     }, 500);

//     return () => clearTimeout(debounceTimer);
//   }, [searchQuery, priceRange, minRating, selectedCategories, sortBy]);

//   const toggleCategory = (categoryId: string) => {
//     setSelectedCategories(prev =>
//       prev.includes(categoryId)
//         ? prev.filter(id => id !== categoryId)
//         : [...prev, categoryId]
//     );
//   };

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="mb-8 max-w-2xl mx-auto">
//         <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
//       </div>

//       {error && <div className="text-red-500 text-center mb-8">{error}</div>}

//       <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
//         <div className="lg:col-span-1 space-y-6">
//           <FilterControls
//             priceRange={priceRange}
//             setPriceRange={setPriceRange}
//             minRating={minRating}
//             setMinRating={setMinRating}
//             sortBy={sortBy}
//             setSortBy={setSortBy}
//           />
//           <CategoryFilter
//             categories={categories}
//             selectedCategories={selectedCategories}
//             toggleCategory={toggleCategory}
//           />
//         </div>

//         <div className="lg:col-span-3">
//           {loading ? (
//             <div className="text-center py-8">
//               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
//             </div>
//           ) : (
//             <>
//               {products.length > 0 ? (
//                 <ProductList products={products} />
//               ) : (
//                 !error && <div className="text-gray-500 text-center py-8">
//                   No products found matching your criteria
//                 </div>
//               )}
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// // Main page component with Suspense boundary
// const SearchPage = () => {
//   return (
//     <Suspense fallback={
//       <div className="text-center py-8">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
//       </div>
//     }>
//       <SearchComponent />
//     </Suspense>
//   );
// };

// export default SearchPage;
// SearchPage.tsx
'use client';
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Product, Category } from "../types/types";
import { SearchBar } from "../components/SearchBar/SearchBar";
import { FilterControls } from "../components/FilterControls/FilterControls";
import { CategoryFilter } from "../components/CategoryFilter/CategoryFilter";
import { ProductList } from "../components/ProductList/ProductList";
import { productService } from "@/services/api";
import { FiFilter, FiX, FiLoader } from "react-icons/fi";

const SearchComponent = () => {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("query") || "";
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState("popularity");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const query = searchParams.get("query") || "";
    setSearchQuery(query);
  }, [searchParams]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsData, categoriesData] = await Promise.all([
          productService.searchProducts({
            query: searchQuery,
            minPrice: priceRange[0],
            maxPrice: priceRange[1],
            minRating,
            categories: selectedCategories,
            sortBy,
          }),
          productService.getCategories(),
        ]);
        
        setProducts(productsData);
        setCategories(categoriesData);
        setError("");
      } catch (err) {
        setError("Error fetching products");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchData();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, priceRange, minRating, selectedCategories, sortBy]);

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Header */}
      <div className="mb-8 max-w-3xl mx-auto relative">
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <button 
          onClick={() => setMobileFiltersOpen(true)}
          className="lg:hidden absolute right-0 top-0 mt-2 mr-4 flex items-center gap-2 text-gray-600 hover:text-red-500"
        >
          <FiFilter /> Filters
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-lg flex items-start gap-3"
        >
          <div className="text-red-700 font-medium">{error}</div>
          <button onClick={() => setError("")} className="text-red-500 ml-auto">
            <FiX />
          </button>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Filters */}
        <div className="hidden lg:block lg:col-span-1 space-y-6">
          <FilterControls
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            minRating={minRating}
            setMinRating={setMinRating}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />
          <CategoryFilter
            categories={categories}
            selectedCategories={selectedCategories}
            toggleCategory={toggleCategory}
          />
        </div>

        {/* Mobile Filters Overlay */}
        <AnimatePresence>
          {mobileFiltersOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              onClick={() => setMobileFiltersOpen(false)}
            >
              <motion.div 
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
                transition={{ type: "spring", damping: 30 }}
                className="h-full w-80 bg-white p-6 shadow-xl overflow-y-auto"
                onClick={e => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Filters</h2>
                  <button onClick={() => setMobileFiltersOpen(false)}>
                    <FiX size={24} />
                  </button>
                </div>
                <div className="space-y-6">
                  <FilterControls {...{ priceRange, setPriceRange, minRating, setMinRating, sortBy, setSortBy }} />
                  <CategoryFilter {...{ categories, selectedCategories, toggleCategory }} />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Product Results */}
        <div className="lg:col-span-3">
          {loading ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-16"
            >
              <FiLoader className="animate-spin text-red-500 text-4xl mb-4" />
              <p className="text-gray-600">Finding your perfect products...</p>
            </motion.div>
          ) : (
            <>
              {products.length > 0 ? (
                <ProductList products={products} />
              ) : (
                !error && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-16"
                  >
                    <div className="text-gray-400 text-5xl mb-4">🔍</div>
                    <h3 className="text-xl font-medium text-gray-700 mb-2">No products found</h3>
                    <p className="text-gray-500">Try adjusting your search or filters</p>
                  </motion.div>
                )
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const SearchPage = () => {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    }>
      <SearchComponent />
    </Suspense>
  );
};

export default SearchPage;