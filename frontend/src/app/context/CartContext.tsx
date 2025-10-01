// "use client";
// import { createContext, useContext, useEffect, useState } from "react";
// import { useAuth } from "./AuthContext";

// interface CartItem {
//   product: {
//     _id: string;
//     name: string;
//     price: number;
//     images: string[];
//   };
//   quantity: number;
// }

// interface CartContextType {
//   cart: CartItem[];
//   total: number;
//   addToCart: (product: any) => Promise<void>;
//   updateQuantity: (productId: string, quantity: number) => Promise<void>;
//   removeItem: (productId: string) => Promise<void>;
//   loading: boolean;
// }

// const CartContext = createContext<CartContextType | undefined>(undefined);

// export const CartProvider = ({ children }: { children: React.ReactNode }) => {
//   const { user, token } = useAuth();
//   const [cart, setCart] = useState<CartItem[]>([]);
//   const [total, setTotal] = useState(0);
//   const [loading, setLoading] = useState(true);

//   const calculateTotal = (items: CartItem[]) =>
//     items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

//   const fetchCart = async () => {
//     if (!token) {
//       const storedCart = localStorage.getItem("cart");
//       if (storedCart) {
//         const parsedCart = JSON.parse(storedCart);
//         setCart(parsedCart);
//         setTotal(calculateTotal(parsedCart));
//       }
//       setLoading(false);
//       return;
//     }

//     try {
//       setLoading(true);
//       const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cart`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!res.ok) throw new Error("Failed to fetch cart");
//       const data = await res.json();
//       setCart(data.items);
//       setTotal(data.total);
//       localStorage.setItem("cart", JSON.stringify(data.items));
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCart();
//   }, [user, token]);

//   const addToCart = async (product: any) => {
//     const existingItem = cart.find((item) => item.product._id === product._id);
//     const newQuantity = (existingItem?.quantity || 0) + 1;

//     const updatedCart = existingItem
//       ? cart.map((item) =>
//           item.product._id === product._id
//             ? { ...item, quantity: newQuantity }
//             : item
//         )
//       : [...cart, { product, quantity: 1 }];

//     setCart(updatedCart);
//     setTotal(calculateTotal(updatedCart));
//     localStorage.setItem("cart", JSON.stringify(updatedCart));

//     if (token) {
//       try {
//         await fetch("/api/cart", {
//           method: "POST",
//           body: JSON.stringify({ productId: product._id }),
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         });
//       } catch (error) {
//         console.error("Failed to add item to server cart:", error);
//       }
//     }
//   };

//   const updateQuantity = async (productId: string, quantity: number) => {
//     const newQuantity = Math.max(1, quantity);
//     const updatedCart = cart.map((item) =>
//       item.product._id === productId ? { ...item, quantity: newQuantity } : item
//     );

//     setCart(updatedCart);
//     setTotal(calculateTotal(updatedCart));
//     localStorage.setItem("cart", JSON.stringify(updatedCart));

//     if (token) {
//       try {
//         await fetch("/api/cart", {
//           method: "PATCH",
//           body: JSON.stringify({ productId, quantity: newQuantity }),
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         });
//       } catch (error) {
//         console.error("Failed to update quantity on server:", error);
//       }
//     }
//   };

//   const removeItem = async (productId: string) => {
//     const updatedCart = cart.filter((item) => item.product._id !== productId);
//     setCart(updatedCart);
//     setTotal(calculateTotal(updatedCart));
//     localStorage.setItem("cart", JSON.stringify(updatedCart));

//     if (token) {
//       try {
//         await fetch(`/api/cart?productId=${productId}`, {
//           method: "DELETE",
//           headers: { Authorization: `Bearer ${token}` },
//         });
//       } catch (error) {
//         console.error("Failed to remove item from server:", error);
//       }
//     }
//   };

//   return (
//     <CartContext.Provider
//       value={{ cart, total, addToCart, updateQuantity, removeItem, loading }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// };

// export const useCart = () => {
//   const context = useContext(CartContext);
//   if (!context) throw new Error("useCart must be used within CartProvider");
//   return context;
// };
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
  clearCart: () => Promise<void>;
  loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, token } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // Check if cart should be cleared based on 24-hour rule
  useEffect(() => {
    const lastCleared = localStorage.getItem("cartLastCleared");
    const now = Date.now();
    const twentyFourHours = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

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
        setCart(parsedCart);
        setTotal(calculateTotal(parsedCart));
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
      setCart(data.items);
      setTotal(data.total);
      localStorage.setItem("cart", JSON.stringify(data.items));
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
    const existingItem = cart.find((item) => item.product._id === product._id);
    const newQuantity = (existingItem?.quantity || 0) + 1;

    const updatedCart = existingItem
      ? cart.map((item) =>
          item.product._id === product._id
            ? { ...item, quantity: newQuantity }
            : item
        )
      : [...cart, { product, quantity: 1 }];

    setCart(updatedCart);
    setTotal(calculateTotal(updatedCart));
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    if (token) {
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
        console.error("Failed to add item to server cart:", error);
      }
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    const newQuantity = Math.max(1, quantity);
    const updatedCart = cart.map((item) =>
      item.product._id === productId ? { ...item, quantity: newQuantity } : item
    );

    setCart(updatedCart);
    setTotal(calculateTotal(updatedCart));
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    if (token) {
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
        console.error("Failed to update quantity on server:", error);
      }
    }
  };

  const removeItem = async (productId: string) => {
    const updatedCart = cart.filter((item) => item.product._id !== productId);
    setCart(updatedCart);
    setTotal(calculateTotal(updatedCart));
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    if (token) {
      try {
        await fetch(`/api/cart?productId=${productId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (error) {
        console.error("Failed to remove item from server:", error);
      }
    }
  };

  const clearCart = async () => {
    // Clear local state
    setCart([]);
    setTotal(0);
    
    // Clear localStorage
    localStorage.removeItem("cart");
    
    // Update the last cleared time
    localStorage.setItem("cartLastCleared", Date.now().toString());

    // Clear server cart if user is authenticated
    if (token) {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cart/clear`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
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
        loading 
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