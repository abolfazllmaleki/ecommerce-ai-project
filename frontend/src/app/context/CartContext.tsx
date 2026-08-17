"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

interface CartProduct {
  id: string;
  _id: string;
  name: string;
  price: number;
  images: string[];
}

interface CartItem {
  product: CartProduct;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  total: number;
  addToCart: (product: any) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const normalizeProduct = (product: any): CartProduct => ({
  ...product,
  _id: String(product?._id ?? product?.id ?? ""),
  id: String(product?.id ?? product?._id ?? ""),
  name: product?.name ?? "",
  price: Number(product?.price ?? 0),
  images: Array.isArray(product?.images) ? product.images : [],
});

const normalizeCartItem = (item: any): CartItem => ({
  ...item,
  product: normalizeProduct(item?.product ?? {}),
  quantity: Number(item?.quantity ?? 1),
});

const normalizeCart = (items: any[]): CartItem[] => {
  if (!Array.isArray(items)) return [];
  return items.map(normalizeCartItem).filter((item) => item.product.id);
};

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, token } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const lastCleared = localStorage.getItem("cartLastCleared");
    const now = Date.now();
    const twentyFourHours = 24 * 60 * 60 * 1000;

    if (!lastCleared || now - parseInt(lastCleared) > twentyFourHours) {
      localStorage.removeItem("cart");
      localStorage.setItem("cartLastCleared", now.toString());
    }
  }, []);

  const calculateTotal = (items: CartItem[]) =>
    items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const fetchCart = async () => {
    if (!token) {
      const storedCart = localStorage.getItem("cart");
      if (storedCart) {
        const parsedCart = JSON.parse(storedCart);
        const normalizedCart = normalizeCart(parsedCart);
        setCart(normalizedCart);
        setTotal(calculateTotal(normalizedCart));
        localStorage.setItem("cart", JSON.stringify(normalizedCart));
      } else {
        setCart([]);
        setTotal(0);
      }
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch cart");

      const data = await res.json();
      const normalizedCart = normalizeCart(data?.items ?? []);

      setCart(normalizedCart);
      setTotal(calculateTotal(normalizedCart));
      localStorage.setItem("cart", JSON.stringify(normalizedCart));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user, token]);

  const addToCart = async (product: any) => {
    const normalizedProduct = normalizeProduct(product);

    const existingItem = cart.find(
      (item) => item.product.id === normalizedProduct.id
    );

    const newQuantity = (existingItem?.quantity || 0) + 1;

    const updatedCart = existingItem
      ? cart.map((item) =>
          item.product.id === normalizedProduct.id
            ? { ...item, quantity: newQuantity }
            : item
        )
      : [...cart, { product: normalizedProduct, quantity: 1 }];

    setCart(updatedCart);
    setTotal(calculateTotal(updatedCart));
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    if (token) {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cart`, {
          method: "POST",
          body: JSON.stringify({ productId: normalizedProduct._id }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (error) {
        console.error("Failed to add item to server cart:", error);
      }
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    const newQuantity = Math.max(1, quantity);

    const updatedCart = cart.map((item) =>
      item.product.id === productId ? { ...item, quantity: newQuantity } : item
    );

    setCart(updatedCart);
    setTotal(calculateTotal(updatedCart));
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    const targetItem = cart.find((item) => item.product.id === productId);

    if (token && targetItem) {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cart`, {
          method: "PATCH",
          body: JSON.stringify({
            productId: targetItem.product._id,
            quantity: newQuantity,
          }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (error) {
        console.error("Failed to update quantity on server:", error);
      }
    }
  };

  const removeItem = async (productId: string) => {
    const targetItem = cart.find((item) => item.product.id === productId);

    const updatedCart = cart.filter((item) => item.product.id !== productId);

    setCart(updatedCart);
    setTotal(calculateTotal(updatedCart));
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    if (token && targetItem) {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cart?productId=${targetItem.product._id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (error) {
        console.error("Failed to remove item from server:", error);
      }
    }
  };

  const clearCart = async () => {
    const itemsToClear = token ? [...cart] : [];

    setCart([]);
    setTotal(0);
    localStorage.removeItem("cart");
    localStorage.setItem("cartLastCleared", Date.now().toString());

    if (token && itemsToClear.length > 0) {
      try {
        await Promise.all(
          itemsToClear.map((item) =>
            fetch(
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/cart?productId=${item.product._id}`,
              {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
              }
            )
          )
        );
      } catch (error) {
        console.error("Failed to clear server cart:", error);
      }
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        total,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        loading,
      }}
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
