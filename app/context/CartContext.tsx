"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { Cart, CartItem, CheckOutDto } from "../types/cart";
import { useAuth } from "./AuthContext";

interface CartContextProps {
  cart: Cart | undefined | null;
  cartItems: CartItem[] | [];
  token: string | null;
  refreshCart: () => Promise<void>;
  removeCart: () => Promise<void>;
  checkout: (checkoutData: CheckOutDto, tokenReturn: string) => Promise<void>;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart| null>(null)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const { token } = useAuth();

  useEffect(() => {
    if (!token) return;
    fetch("http://localhost:5000/api/Cart/GetYourCart", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => res.json())
      .then((data) => {
        setCart(data.data);
        setCartItems(data.data.items)
        console.log(data.data);
      })
      .catch((error) => {
        console.error("Error fetching cart:", error);
      });
  }, [token]);

  const refreshCart = async () => {
    if(token)
      try {
        await fetch("http://localhost:5000/api/Cart/GetYourCart", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.data) {
              setCart(data.data);
              setCartItems(data.data.items);
            } else {
              // Nếu API trả về null hoặc không có data, reset giỏ hàng
              setCart(null);
              setCartItems([]);
            }
          }
          );
      } catch (error) {
        console.error("Error refreshing cart:", error);
      }
  };

  const removeCart = async () => {
    try {
      await fetch("http://localhost:5000/api/Cart/DeleteCart", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setCart(null)
          setCartItems([])
        }
        );
    } catch (error) {
      console.error("Error refreshing cart:", error);
    }
  }

  const checkout = async (checkoutData: CheckOutDto, tokenReturn: any) => {
    try {
      if (tokenReturn === null || tokenReturn === "") {
        console.error("Không có token, người dùng chưa đăng nhập!");
        return;
      }
      console.log("Token hiện tại:", token);
      const response = await fetch("http://localhost:5000/api/Cart/Checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenReturn}`,
        },
        body: JSON.stringify(checkoutData),
      });

      if (!response.ok) {
        throw new Error("Checkout failed");
      }
      const data = await response.json();
      setCart(null);
      setCartItems([]);
    } catch (error) {
      console.error("Error during checkout:", error);
    }
  };
  return (
    <CartContext.Provider value={{ cart, cartItems, token, refreshCart, removeCart, checkout}}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}
