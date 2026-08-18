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
export interface Category {
  _id: string;
  name: string;
  icon?:any;
  href?:any;
}



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
export interface Order {
  _id: string;
  userId: string;
  products: {
    productId: string;
    quantity: number;
    price: number;
    name: string;
  }[];
  totalPrice: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: {
    firstName: string;
    lastName?: string;
    companyName?: string;
    streetAddress: string;
    apartment?: string;
    city: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  contactInfo: {
    phone: string;
    email: string;
  };
  paymentMethod: 'visa' | 'mastercard' | 'paypal' | 'cash_on_delivery';
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  orderDate: Date;
  shippedDate?: Date;
  deliveredDate?: Date;
}
export interface Product {
  _id?: string; 
  id?: string;  
  name: string;
  description: string;
  // categoryId: any;
  category: any;
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
  Specifications:string
  adminNote: string;
}

export interface User {
  id?: string;
  _id?:string;
  name: string;
  lastname?:string;
  email: string;
  role?: string;
  isEmailVerified?:boolean;
}

export interface HomeContent {
  featuredProducts: string[];
  bannerText: string;
  promotionalDiscount: number;
}
// export interface Category {
//   _id: any;
//   name: string;
//   icon: React.ReactNode;
//   href: string;
// }
export interface Comment {
  id: string;
  userId: string | User;
  productId: string;
  content: string;
  likes: number;
  dislikes: number;
  isActive: boolean;
  parentCommentId?: string;
  depth: number;
  currentUserId:string | User;
  replyCount: number;
  createdAt: string;
  updatedAt: string;
  hasLiked?: boolean;
  hasDisliked?: boolean;
  user?: User;
  replies?: Comment[];
}