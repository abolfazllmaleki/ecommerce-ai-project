"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  _id: string;
  name: string;
  email: string;
  wishList?: any[]; // اضافه کردن فیلدهای ضروری
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  fetchUser: (token: string) => Promise<void>;
  updateUser: (userData: User) => void; // اضافه کردن تابع جدید
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const fetchUser = async (token: string) => {
    try {
      const response = await fetch("http://localhost:3000/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        console.log("Response status:", response.status);
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
        return;
      }

      const userData: User = await response.json();
      setUser(userData);
    } catch (error) {
      console.error("Failed to fetch user:", error);
      logout();
    }
  };

  const login = (token: string) => {
    localStorage.setItem("token", token);
    setToken(token);
    fetchUser(token);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  // تابع جدید برای آپدیت کاربر
  const updateUser = (userData: User) => {
    setUser(prev => ({
      ...prev,
      ...userData,
      wishList: userData.wishList || prev?.wishList || []
    }));
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
          setToken(storedToken);
          await fetchUser(storedToken);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        logout();
      }
    };

    initializeAuth();
  }, []);

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        token, 
        login, 
        logout, 
        fetchUser,
        updateUser // اضافه کردن تابع به context
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};