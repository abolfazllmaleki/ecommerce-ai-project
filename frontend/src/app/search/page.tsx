// components/SearchPage/SearchPage.tsx
'use client';
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Product, Category } from "../types/types";
import { SearchBar } from "../components/SearchBar/SearchBar";
import { FilterControls } from "../components/FilterControls/FilterControls";
import { CategoryFilter } from "../components/CategoryFilter/CategoryFilter";
import { ProductList } from "../components/ProductList/ProductList";
import { productService } from "@/services/api";

const SearchPage = () => {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("query") || "";

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState("popularity");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  console.log('searching params is...',searchParams)

  // Sync searchQuery with URL parameters
  useEffect(() => {
    const query = searchParams.get("query") || "";
    setSearchQuery(query);
  }, [searchParams]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log('Fetching with filters:', {
          query: searchQuery,
          minPrice: priceRange[0],
          maxPrice: priceRange[1],
          minRating,
          categories: selectedCategories,
          sortBy
        });

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
        
        console.log('Received products:', productsData);
        setProducts(productsData);
        setCategories(categoriesData);
        setError("");
      } catch (err) {
        console.error('Fetch error:', err);
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
      <div className="mb-8 max-w-2xl mx-auto">
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      </div>
      
      {error && <div className="text-red-500 text-center mb-8">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-6">
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

        <div className="lg:col-span-3">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
            </div>
          ) : (
            <>
              {products.length > 0 ? (
                <ProductList products={products} />
              ) : (
                !error && <div className="text-gray-500 text-center py-8">No products found matching your criteria</div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;