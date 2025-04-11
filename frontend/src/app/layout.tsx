import type { Metadata } from "next";
import Header from "./components/header/header";
import Footer from "./components/footer/footer";
import { CartProvider } from "./context/CartContext";
import "./globals.css";

// ✅ Import AuthProvider
import { AuthProvider } from "./context/AuthContext";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {/* ✅ Wrap entire app with AuthProvider */}
        <AuthProvider >  
          <CartProvider>
          <Header />
          {children}
          <Footer />
          </CartProvider>
        </AuthProvider>  
      </body>
    </html>
  );
}
