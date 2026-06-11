'use client';

import { useState, useEffect, Suspense, useCallback } from "react";
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

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState("popularity");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [error, setError] = useState("");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Normalize API response to Product[]
  const normalizeProductsResponse = (data: any): Product[] => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.items)) return data.items;
    if (Array.isArray(data?.products)) return data.products;
    if (Array.isArray(data?.data)) return data.data;
    return [];
  };

  // Sync URL query param with search state
  useEffect(() => {
    const query = searchParams.get("query") || "";
    setSearchQuery(query);
    console.log("Initial search query from URL:", query);
  }, [searchParams]);

  // Load categories once
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setCategoriesLoading(true);
        const categoriesData = await productService.getCategories();
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
        console.log("Initial categories loaded:", categoriesData);
      } catch (err) {
        console.error("Error loading initial categories:", err);
        setError("Error loading categories");
      } finally {
        setCategoriesLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Fetch products when filters change
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");
        setPage(1);
        setHasMore(true);

        const requestParams = {
          query: searchQuery,
          minPrice: priceRange[0],
          maxPrice: priceRange[1],
          minRating,
          categories: selectedCategories,
          sortBy,
          page: 1,
          limit: 20,
        };

        console.log("Fetching data with params:", requestParams);

        const productsData = await productService.searchProducts(requestParams);

        console.log("Products data:", productsData);
        console.log("Is productsData array?", Array.isArray(productsData));

        const normalizedProducts = normalizeProductsResponse(productsData);

        console.log("Normalized products:", normalizedProducts);

        setProducts(normalizedProducts);
        setHasMore(normalizedProducts.length === 20);
      } catch (err) {
        console.error("Search error:", err);
        const message =
          err instanceof Error ? err.message : "Unknown error";
        setError("Error fetching products: " + message);
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

  const toggleCategory = useCallback((categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  }, []);

  // Optional load more
  const loadMoreProducts = useCallback(async () => {
    if (isLoadingMore || !hasMore) return;

    try {
      setIsLoadingMore(true);

      const nextPage = page + 1;

      const moreProductsData = await productService.searchProducts({
        query: searchQuery,
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
        minRating,
        categories: selectedCategories,
        sortBy,
        page: nextPage,
        limit: 20,
      });

      const normalizedMoreProducts = normalizeProductsResponse(moreProductsData);

      console.log("Requesting page:", nextPage);
      console.log("More products:", normalizedMoreProducts);

      if (normalizedMoreProducts.length === 0) {
        setHasMore(false);
      } else {
        setProducts((prev) => [...prev, ...normalizedMoreProducts]);
        setPage(nextPage);
        if (normalizedMoreProducts.length < 20) {
          setHasMore(false);
        }
      }
    } catch (err) {
      console.error("Load more error:", err);
      setError("Error loading more products.");
    } finally {
      setIsLoadingMore(false);
    }
  }, [
    isLoadingMore,
    hasMore,
    page,
    searchQuery,
    priceRange,
    minRating,
    selectedCategories,
    sortBy,
  ]);

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const fullHeight = document.body.scrollHeight;

      if (
        scrollTop + windowHeight >= fullHeight - 300 &&
        !isLoadingMore &&
        hasMore &&
        !loading
      ) {
        loadMoreProducts();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLoadingMore, hasMore, loading, loadMoreProducts]);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <button
          onClick={() => setMobileFiltersOpen(true)}
          className="lg:hidden flex items-center gap-2 text-sm text-gray-600 border border-gray-300 rounded px-3 py-1"
        >
          <FiFilter />
          Filters
        </button>
      </div>

      {error && (
        <motion.div
          className="bg-red-100 text-red-700 p-4 rounded mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {error}
        </motion.div>
      )}

      <div className="lg:grid lg:grid-cols-4 gap-6">
        <div className="hidden lg:block">
          <FilterControls
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            minRating={minRating}
            setMinRating={setMinRating}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />
          {categoriesLoading ? (
            <div className="flex justify-center py-6">
              <FiLoader className="animate-spin text-2xl text-gray-500" />
            </div>
          ) : (
            <CategoryFilter
              categories={categories}
              selectedCategories={selectedCategories}
              toggleCategory={toggleCategory}
            />
          )}
        </div>

        <div className="lg:col-span-3">
          {loading ? (
            <div className="flex justify-center py-12">
              <FiLoader className="animate-spin text-3xl text-gray-500" />
            </div>
          ) : products.length > 0 ? (
            <ProductList products={products} />
          ) : (
            <div className="text-center text-gray-500 py-12">
              🔍 No products found matching your search.
            </div>
          )}

          {isLoadingMore && (
            <div className="flex justify-center py-4">
              <FiLoader className="animate-spin text-xl text-gray-500" />
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {mobileFiltersOpen && (
          <motion.div
            className="fixed inset-0 z-50 bg-white shadow-lg p-6 overflow-y-auto"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Filters</h2>
              <button onClick={() => setMobileFiltersOpen(false)}>
                <FiX className="text-2xl" />
              </button>
            </div>

            <FilterControls
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              minRating={minRating}
              setMinRating={setMinRating}
              sortBy={sortBy}
              setSortBy={setSortBy}
            />

            {categoriesLoading ? (
              <div className="flex justify-center py-6">
                <FiLoader className="animate-spin text-2xl text-gray-500" />
              </div>
            ) : (
              <CategoryFilter
                categories={categories}
                selectedCategories={selectedCategories}
                toggleCategory={toggleCategory}
              />
            )}

            <button
              onClick={() => setMobileFiltersOpen(false)}
              className="w-full mt-6 bg-blue-600 text-white py-2 rounded"
            >
              Apply Filters
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SearchPage = () => {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin h-12 w-12 border-red-500 border-t-2 border-b-2 rounded-full"></div>
        </div>
      }
    >
      <SearchComponent />
    </Suspense>
  );
};

export default SearchPage;
