import * as React from "react";
import { MemoryRouter, Routes, Route, Navigate } from "react-router-dom";
import { UserProfile } from "../../types";
import { PreferencesProvider } from "./context/PreferencesContext";
import { CartProvider } from "./context/CartContext";
import { NotificationProvider } from "./context/NotificationContext";

// Shop Pages
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Featured from "./pages/Featured";
import NewArrivals from "./pages/NewArrivals";
import SpecialOffers from "./pages/SpecialOffers";
import FAQ from "./pages/FAQ";
import ShippingInfo from "./pages/ShippingInfo";
import Returns from "./pages/Returns";
import Reviews from "./pages/Reviews";
import About from "./pages/About";
import Contact from "./pages/Contact";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import ShopSettings from "./pages/ShopSettings";

// Shop Components
import Navbar from "./ui/Navbar";
import Footer from "./ui/Footer";

interface ShopViewProps {
  user: UserProfile | null;
  onExit?: () => void;
  onOpenSettings?: () => void;
  themeMode?: "dark" | "light";
  accentColor?: string;
}

const ShopView: React.FC<ShopViewProps> = ({
  user,
  onExit,
  onOpenSettings,
  themeMode = "dark",
  accentColor = "orange",
}) => {
  // Map UserProfile to a format that Shop expects (Firebase User partial)
  const shopUser: any = user
    ? {
        uid: user.email,
        displayName: user.fullName,
        email: user.email,
        photoURL: user.avatarUrl,
      }
    : null;

  const isDark = themeMode === "dark";

  const colorMap: Record<string, string> = {
    orange: "#FFD700",
    blue: "#3b82f6",
    green: "#22c55e",
    purple: "#a855f7",
    red: "#ef4444",
    pink: "#ec4899",
    teal: "#14b8a6",
    cyan: "#06b6d4",
    indigo: "#6366f1",
  };

  const actualAccentColor = colorMap[accentColor] || accentColor;

  return (
    <PreferencesProvider>
      <NotificationProvider>
        <CartProvider>
          <style
            dangerouslySetInnerHTML={{
              __html: `
            :root {
              --bg-input: ${isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)"};
              --border: ${isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"};
              --glass: ${isDark ? "rgba(10, 10, 10, 0.8)" : "rgba(255, 255, 255, 0.8)"};
              --bg-card: ${isDark ? "rgba(23, 23, 23, 0.6)" : "rgba(255, 255, 255, 0.9)"};
              --accent: ${actualAccentColor};
            }
            ::-webkit-scrollbar {
              width: 8px;
            }
            ::-webkit-scrollbar-track {
              background: ${isDark ? "#000" : "#fff"};
            }
            ::-webkit-scrollbar-thumb {
              background: var(--accent);
              border-radius: 10px;
              border: 2px solid ${isDark ? "#000" : "#fff"};
            }
            ::-webkit-scrollbar-thumb:hover {
              background: ${isDark ? "rgba(255, 215, 0, 0.8)" : "rgba(0, 0, 0, 0.8)"};
            }
            .glass-morphism {
              background: var(--glass);
              backdrop-filter: blur(24px) saturate(180%);
              -webkit-backdrop-filter: blur(24px) saturate(180%);
              border: 1px solid var(--border);
            }
            .shop-container {
              font-family: 'Outfit', sans-serif;
              transition: background-color 0.3s ease, color 0.3s ease;
              -webkit-font-smoothing: antialiased;
            }
            .shop-container h1, .shop-container h2, .shop-container h3 {
              font-family: 'Outfit', sans-serif;
              font-weight: 900;
              letter-spacing: -0.05em;
            }
            .shop-card {
              transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
            }
            .shop-card:hover {
              transform: translateY(-8px) scale(1.02);
              box-shadow: 0 40px 80px -20px rgba(0,0,0,0.4);
            }
          `,
            }}
          />
          <div
            className={`min-h-screen shop-container transition-colors duration-300 ${
              isDark ? "bg-[#000] text-white" : "bg-white text-gray-900"
            }`}
            style={{ backgroundColor: isDark ? "#000" : "#ffffff" }}
          >
            <MemoryRouter initialEntries={["/"]}>
              <div className="flex flex-col min-h-screen">
                <Navbar
                  user={shopUser}
                  onExit={onExit}
                  onNavigateToSettings={onOpenSettings || onExit}
                  themeMode={themeMode}
                  accentColor={actualAccentColor}
                />
                <main className="flex-grow pt-8 overflow-x-hidden">
                  <Routes>
                    <Route
                      path="/"
                      element={
                        <Home
                          themeMode={themeMode}
                          accentColor={actualAccentColor}
                        />
                      }
                    />
                    <Route
                      path="/shop"
                      element={
                        <Shop
                          themeMode={themeMode}
                          accentColor={actualAccentColor}
                        />
                      }
                    />
                    <Route
                      path="/collection"
                      element={
                        <Shop
                          themeMode={themeMode}
                          accentColor={actualAccentColor}
                        />
                      }
                    />
                    <Route
                      path="/product/:id"
                      element={
                        <Product
                          themeMode={themeMode}
                          accentColor={actualAccentColor}
                        />
                      }
                    />
                    <Route
                      path="/cart"
                      element={
                        <Cart
                          themeMode={themeMode}
                          accentColor={actualAccentColor}
                        />
                      }
                    />
                    <Route
                      path="/checkout"
                      element={
                        <Checkout
                          themeMode={themeMode}
                          accentColor={actualAccentColor}
                        />
                      }
                    />
                    <Route
                      path="/orders"
                      element={
                        <Orders
                          themeMode={themeMode}
                          accentColor={actualAccentColor}
                        />
                      }
                    />
                    <Route
                      path="/featured"
                      element={
                        <Featured
                          themeMode={themeMode}
                          accentColor={actualAccentColor}
                        />
                      }
                    />
                    <Route
                      path="/new-arrivals"
                      element={
                        <NewArrivals
                          themeMode={themeMode}
                          accentColor={actualAccentColor}
                        />
                      }
                    />
                    <Route
                      path="/offers"
                      element={
                        <SpecialOffers
                          themeMode={themeMode}
                          accentColor={actualAccentColor}
                        />
                      }
                    />
                    <Route
                      path="/faq"
                      element={
                        <FAQ
                          themeMode={themeMode}
                          accentColor={actualAccentColor}
                        />
                      }
                    />
                    <Route
                      path="/shipping"
                      element={
                        <ShippingInfo
                          themeMode={themeMode}
                          accentColor={actualAccentColor}
                        />
                      }
                    />
                    <Route
                      path="/returns"
                      element={
                        <Returns
                          themeMode={themeMode}
                          accentColor={actualAccentColor}
                        />
                      }
                    />
                    <Route
                      path="/reviews"
                      element={
                        <Reviews
                          themeMode={themeMode}
                          accentColor={actualAccentColor}
                        />
                      }
                    />
                    <Route
                      path="/about"
                      element={
                        <About
                          themeMode={themeMode}
                          accentColor={actualAccentColor}
                        />
                      }
                    />
                    <Route
                      path="/contact"
                      element={
                        <Contact
                          themeMode={themeMode}
                          accentColor={actualAccentColor}
                        />
                      }
                    />
                    <Route
                      path="/privacy"
                      element={
                        <PrivacyPolicy
                          themeMode={themeMode}
                          accentColor={actualAccentColor}
                        />
                      }
                    />
                    <Route
                      path="/terms"
                      element={
                        <TermsOfService
                          themeMode={themeMode}
                          accentColor={actualAccentColor}
                        />
                      }
                    />
                    <Route
                      path="/settings"
                      element={
                        <ShopSettings
                          themeMode={themeMode}
                          accentColor={actualAccentColor}
                          user={user}
                        />
                      }
                    />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </main>
                <Footer themeMode={themeMode} accentColor={actualAccentColor} />
              </div>
            </MemoryRouter>
          </div>
        </CartProvider>
      </NotificationProvider>
    </PreferencesProvider>
  );
};

export default ShopView;
