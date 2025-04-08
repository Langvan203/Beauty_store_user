"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { Order, OrderItem } from "../types/order";
import { useAuth } from "./AuthContext";

interface OrderContextProps {
  order: Order[];
  orderItems: OrderItem[];
  orderItemsDetail: OrderItem[]
  token: string | null;
  refreshOrder: () => Promise<void>;
  getOrderDetails: (id:number) => Promise<void>;
}

const OrderContext = createContext<OrderContextProps | undefined>(undefined);

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [order, setOrder] = useState<Order[]>([])
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const [orderItemsDetail, setOrderItemsDetail] = useState<OrderItem[]>([])
  const { token } = useAuth();

  useEffect(() => {
    if (!token) return;
    fetch("http://localhost:5000/api/Order/GetOrder", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => res.json())
      .then((data) => {
        setOrder(data.data);
        setOrderItems(data.data.items)
      })
      .catch((error) => {
        console.error("Error fetching cart:", error);
      });
  }, [token]);

  const refreshOrder = async () => {
    if(token)
      try {
        await fetch("http://localhost:5000/api/Order/GetOrder", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.data) {
              setOrder(data.data);
              setOrderItems(data.data.items);
            } else {
              // Nếu API trả về null hoặc không có data, reset giỏ hàng
              setOrder([]);
              setOrderItems([]);
            }
          }
          );
      } catch (error) {
        console.error("Error refreshing cart:", error);
      }
  };

  const getOrderDetails = async (id: number) => {
    if(token && id)
      try {
        await fetch(`http://localhost:5000/api/Order/GetOrderID-details/?Id=${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.data) {
              setOrderItemsDetail(data.data.items);
            } else {
              // Nếu API trả về null hoặc không có data, reset giỏ hàng
              setOrderItemsDetail([]);
            }
          }
          );
      } catch (error) {
        console.error("Error refreshing cart:", error);
      }
  }

  

  return (
    <OrderContext.Provider value={{ order, orderItems,orderItemsDetail,token, refreshOrder, getOrderDetails}}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const context = useContext(OrderContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}
