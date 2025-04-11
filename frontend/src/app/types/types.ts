// types.ts
export const CATEGORIES = [
  "Phone",
  "Computer",
  "Camera",
  "Tablet",
  "Accessories",
  "Audio",
  "Wearables",
];

export const COLOR_OPTIONS = [
  "#FF0000",
  "#00FF00",
  "#0000FF",
  "#FFFF00",
  "#FF00FF",
  "#00FFFF",
  "#800000",
  "#008000",
  "#000080",
  "#808000",
  "#800080",
  "#008080",
  "#C0C0C0",
  "#808080",
  "#FFA500",
  "#A52A2A",
  "#8B4513",
  "#D2691E",
  "#2E8B57",
  "#6A5ACD",
];

export interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  tags?: string[];
  price: number;
  stock: number;
  brand?: string;
  colors: string[];
  sizes: string[];
  rating: number;
  numberOfReviews: number;
  images: string[];
  discount: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface HomeContent {
  featuredProducts: string[];
  bannerText: string;
  promotionalDiscount: number;
}
export interface Category {
  _id: string;
  name: string;
  icon: React.ReactNode;
  href: string;
}
