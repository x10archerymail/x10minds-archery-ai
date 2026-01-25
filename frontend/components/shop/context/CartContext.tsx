import { createContext, useContext, useState, useEffect } from "react";
import { Product } from "../services/productService";

interface CartItem extends Product {
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (
    product: Product,
    quantity?: number,
    selectedColor?: string,
    selectedSize?: string,
  ) => void;
  removeFromCart: (
    productId: string,
    selectedColor?: string,
    selectedSize?: string,
  ) => void;
  updateQuantity: (
    productId: string,
    quantity: number,
    selectedColor?: string,
    selectedSize?: string,
  ) => void;
  clearCart: () => void;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      if (typeof window === "undefined") return [];
      const saved = localStorage.getItem("x10minds_cart");
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? (parsed as CartItem[]) : [];
    } catch (e) {
      console.error("Failed to parse saved cart:", e);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("x10minds_cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (
    product: Product,
    quantity: number = 1,
    selectedColor?: string,
    selectedSize?: string,
  ) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.id === product.id &&
          item.selectedColor === selectedColor &&
          item.selectedSize === selectedSize,
      );

      if (existingIndex > -1) {
        const newCart = [...prev];
        newCart[existingIndex] = {
          ...newCart[existingIndex],
          quantity: newCart[existingIndex].quantity + quantity,
        };
        return newCart;
      }

      return [...prev, { ...product, quantity, selectedColor, selectedSize }];
    });
  };

  const removeFromCart = (
    productId: string,
    selectedColor?: string,
    selectedSize?: string,
  ) => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          !(
            item.id === productId &&
            item.selectedColor === selectedColor &&
            item.selectedSize === selectedSize
          ),
      ),
    );
  };

  const updateQuantity = (
    productId: string,
    quantity: number,
    selectedColor?: string,
    selectedSize?: string,
  ) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedColor, selectedSize);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.id === productId &&
        item.selectedColor === selectedColor &&
        item.selectedSize === selectedSize
          ? { ...item, quantity }
          : item,
      ),
    );
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
