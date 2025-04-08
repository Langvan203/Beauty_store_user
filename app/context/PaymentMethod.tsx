"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { Payment } from "../types/payment";
import { useAuth } from "./AuthContext";

interface PaymentContextProps {
  payment: Payment[];
  token: string | null;
  refreshPayment: () => Promise<void>;
}

const PaymentContext = createContext<PaymentContextProps | undefined>(undefined);

export function PaymentProvider({ children }: { children: React.ReactNode }) {
  const [payment, setPayment] = useState<Payment[]>([])
  const { token } = useAuth();

  useEffect(() => {
    if (!token) return;
    fetch("http://localhost:5000/api/PaymentMethod/GetAllPaymentMethod", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => res.json())
      .then((data) => {
        setPayment(data.data)
      })
      .catch((error) => {
        console.error("Error fetching cart:", error);
      });
  }, [token]);

  const refreshPayment = async () => {
    if(token)
      try {
        await fetch("http://localhost:5000/api/PaymentMethod/GetAllPaymentMethod", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.data) {
              setPayment(data.data)
            } else {
              // Nếu API trả về null hoặc không có data, reset giỏ hàng
              setPayment([])
            }
          }
          );
      } catch (error) {
        console.error("Error refreshing cart:", error);
      }
  };


  

  return (
    <PaymentContext.Provider value={{ payment, token, refreshPayment,}}>
      {children}
    </PaymentContext.Provider>
  );
}

export function usePayment() {
  const context = useContext(PaymentContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}
