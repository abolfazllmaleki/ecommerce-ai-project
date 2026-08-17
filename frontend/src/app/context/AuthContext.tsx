"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode, Key } from "react";

export interface User {
  _id?: string; // از سمت بک‌اند می‌آید
  id?: string;  // این را خودمان ایجاد می‌کنیم یا از _id مقدار می‌دهیم
  name: string;
  lastname?: string;
  email: string;
  role?: string;
  wishList?: any[]; 
}
// --- پایان تعریف User ---


// --- تعریف اینترفیس Context ---
interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  fetchUser: (token: string) => Promise<void>;
  updateUser: (userData: Partial<User>) => void; // userData باید Partial<User> باشد
}
// --- پایان تعریف Context ---

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// --- تابع کمکی برای نرمال‌سازی کاربر ---
// این تابع داده‌های خام کاربر را می‌گیرد و اطمینان حاصل می‌کند که
// هم id و هم _id را دارد (با اولویت مقداردهی از _id اگر id وجود نداشت)
const normalizeUser = (user: any): User => {
  if (!user) return { name: "", email: "" }; // اگر کاربر null یا undefined بود، یک آبجکت خالی برگردان

  const normalized: User = {
    ...user, // سایر فیلدها را کپی کن
    _id: user?._id ?? user?.id ?? "",
    id: user?.id ?? user?._id ?? "",   
    name: user?.name ?? "",
    email: user?.email ?? "",
    role: user?.role ?? "customer", // نقش دیفالت
    wishList: user?.wishList ?? [],
  };

  if (!normalized.id && normalized._id) {
    normalized.id = normalized._id;
  }
  if (!normalized._id && normalized.id) {
    normalized._id = normalized.id;
  }

  return normalized;
};
// --- پایان تابع normalizeUser ---


export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const fetchUser = async (token: string) => {
    try {
      // مطمئن شوید که NEXT_PUBLIC_BACKEND_URL درست تنظیم شده باشد
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      if (!backendUrl) {
          console.error("NEXT_PUBLIC_BACKEND_URL is not defined!");
          logout();
          return;
      }

      const response = await fetch(`${backendUrl}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        console.log(`Failed to fetch user. Status: ${response.status}`);
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
        return;
      }

      const userDataRaw: any = await response.json(); // فعلا داده خام را بگیریم
      const normalizedUserData = normalizeUser(userDataRaw); // اینجا داده‌ها را نرمال می‌کنیم
      setUser(normalizedUserData);
    } catch (error) {
      console.error("Error fetching user:", error);
      logout(); // در صورت بروز خطا، لاگ‌اوت کن
    }
  };

  const login = (token: string) => {
    localStorage.setItem("token", token);
    setToken(token);
    fetchUser(token); // fetchUser خودش نرمال‌سازی را انجام می‌دهد
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  // تابع updateUser برای کار با state کاربر نرمال شده
  const updateUser = (userData: Partial<User>) => {
    setUser(prevUser => {
      if (!prevUser) {
        // اگر قبلا کاربری نبوده، کاربر جدید را بساز و نرمال کن
        return normalizeUser(userData);
      }
      // کاربر قبلی را با داده‌های جدید ترکیب کن و سپس نرمال کن
      return normalizeUser({ ...prevUser, ...userData });
    });
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
          setToken(storedToken);
          await fetchUser(storedToken); // fetchUser داده‌ها را نرمال می‌کند
        }
      } catch (error) {
        console.error("Authentication initialization error:", error);
        logout(); // در صورت بروز خطا در هنگام مقداردهی اولیه، لاگ‌اوت کن
      }
    };

    initializeAuth();
  }, []); // این useEffect فقط یک بار در زمان mount شدن کامپوننت اجرا می‌شود

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        fetchUser,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    // اگر context پیدا نشد، یک خطا پرتاب کن
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
