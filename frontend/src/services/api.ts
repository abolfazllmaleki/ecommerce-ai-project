// services/api.ts
import { CATEGORIES } from "@/app/types/types";
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'; // آدرس بک‌اند NestJS

export const productService = {
  async searchProducts(params: {
    query?: string;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    categories?: string[];
    sortBy?: string;
    page?: number;
    limit?: number;
  }) {
    console.log('API Base URL:', API_BASE_URL);
    console.log('Search params:', params);

    try {
      const response = await axios.get(`${API_BASE_URL}/products/search`, {
        params: {
          q: params.query || '',
          minPrice: params.minPrice,
          maxPrice: params.maxPrice,
          minRating: params.minRating,
          categories: params.categories && params.categories.length > 0 ? params.categories.join(",") : undefined,
          sortBy: params.sortBy,
          page: params.page || 1,
          limit: params.limit || 20,
        },
      });
      
      console.log("Search response:", response.data);
      
      // Handle both old and new response formats
      if (response.data.products) {
        return response.data.products;
      }
      return response.data;
    } catch (error) {
      console.error('Search API error:', error);
      throw error;
    }
  },

  async getCategories() {
    try {
      const response = await axios.get(`${API_BASE_URL}/categories`);
      console.log('Categories response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Categories API error:', error);
      throw error;
    }
  },
};
