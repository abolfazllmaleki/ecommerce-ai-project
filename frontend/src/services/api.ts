// services/api.ts
import axios from "axios";

const API_BASE_URL = "http://localhost:3000"; // آدرس بک‌اند NestJS

export const productService = {
  async searchProducts(params: {
    query?: string;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    categories?: string[];
    sortBy?: string;
  }) {
    const response = await axios.get(`${API_BASE_URL}/products/search`, {
      params: {
        q: params.query,
        minPrice: params.minPrice,
        maxPrice: params.maxPrice,
        minRating: params.minRating,
        categories: params.categories?.join(","),
        sortBy: params.sortBy,
      },
    });
    console.log(response.data);
    return response.data;
  },

  async getCategories() {
    const response = await axios.get(`${API_BASE_URL}/categories`);
    return response.data;
  },
};
