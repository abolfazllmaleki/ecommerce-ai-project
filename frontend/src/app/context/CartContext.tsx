"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

interface CartItem {
  product: {
    _id: string;
    name: string;
    price: number;
    images: string[];
  };
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  total: number;
  addToCart: (product: any) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, token } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // محاسبه مجموع قیمت کل
  const calculateTotal = (items: CartItem[]) =>
    items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  // دریافت سبد خرید از API یا LocalStorage
  const fetchCart = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await fetch("http://localhost:3000/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch cart");
      const data = await res.json();
      setCart(data.items);
      setTotal(data.total);
      localStorage.setItem("cart", JSON.stringify(data.items));
    } catch (error) {
      // console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      const storedCart = localStorage.getItem("cart");
      if (storedCart) {
        const parsedCart = JSON.parse(storedCart);
        setCart(parsedCart);
        setTotal(calculateTotal(parsedCart));
      }
    }
  }, [user]);

  // افزودن محصول به سبد خرید
  const addToCart = async (product: any) => {
    console.log('it comes to context 1')
    const existingItem = cart.find((item) => item.product._id === product._id);
    const newQuantity = (existingItem?.quantity || 0) + 1;

    const updatedCart = existingItem
      ? cart.map((item) =>
          item.product._id === product._id
            ? { ...item, quantity: newQuantity }
            : item
        )
      : [...cart, { product, quantity: 1 }];
    console.log('what items come toc context',updatedCart)
    setCart(updatedCart);
    setTotal(calculateTotal(updatedCart));
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    try {
      await fetch("/api/cart", {
        method: "POST",
        body: JSON.stringify({ productId: product._id }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("Failed to add item to cart:", error);
      fetchCart(); // در صورت خطا، اطلاعات مجدد از سرور دریافت شود
    }
  };

  // بروزرسانی تعداد محصولات در سبد خرید
  const updateQuantity = async (productId: string, quantity: number) => {
    const newQuantity = Math.max(1, quantity);
    const updatedCart = cart.map((item) =>
      item.product._id === productId ? { ...item, quantity: newQuantity } : item
    );

    setCart(updatedCart);
    setTotal(calculateTotal(updatedCart));
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    try {
      await fetch("/api/cart", {
        method: "PATCH",
        body: JSON.stringify({ productId, quantity: newQuantity }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("Failed to update quantity:", error);
      fetchCart();
    }
  };

  // حذف محصول از سبد خرید
  const removeItem = async (productId: string) => {
    const updatedCart = cart.filter((item) => item.product._id !== productId);

    setCart(updatedCart);
    setTotal(calculateTotal(updatedCart));
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    try {
      await fetch(`/api/cart?productId=${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("Failed to remove item:", error);
      fetchCart();
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, total, addToCart, updateQuantity, removeItem, loading }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};
