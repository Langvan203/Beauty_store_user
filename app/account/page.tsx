"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  Bell,
  CreditCard,
  Heart,
  LogOut,
  MapPin,
  Package,
  Settings,
  UserIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bounce, toast } from "react-toastify"
import PaymentPage from "@/components/payment"
import NotificationsPage from "@/components/notification"
import SettingPage from "@/components/setting"
import AddressPage from "@/components/address"
import OverViewPage from "@/components/overview"
import OrderPage from "@/components/order"
import WishListPage from "@/components/wishlist"
import { useAuth } from "../context/AuthContext"
import { useOrder } from "../context/OrderContext"
import { Order } from "../types/order"


export default function AccountPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const { user, logout } = useAuth();
  const formatDate = (dateString: string | undefined) => {
    if (dateString) {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date);
    }
  };
  const handleLogout = () => {
    toast.info("Đã đăng xuất tài khoản", {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
      onClose: () => {
        router.push("/auth/login")
        logout()
      }
    })
  }

  return (
    <div className="container px-4 py-8 md:py-12">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Tài khoản của tôi</h1>
      <div className="grid md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <Card className="md:col-span-1">
          <CardContent className="p-6">
            <div className="flex flex-col items-center mb-6">
              <Avatar className="h-20 w-20 mb-4">
                <AvatarImage src={user?.avatar ? `http://localhost:5000/${user.avatar.replace(/\\/g, "/")}` : ""}
                  alt={user?.userName} />
                <AvatarFallback>{user?.userName.charAt(0)}</AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-semibold">{user?.userName}</h2>
              <p className="text-sm text-gray-500">{user?.email}</p>
              <p className="text-xs text-gray-400 mt-1">Thành viên từ: {formatDate(user?.createdDate)}</p>
            </div>

            <nav className="space-y-1">
              <Button
                variant={activeTab === "overview" ? "default" : "ghost"}
                className={`w-full justify-start ${activeTab === "overview" ? "bg-pink-500 hover:bg-pink-600" : ""}`}
                onClick={() => setActiveTab("overview")}
              >
                <UserIcon className="mr-2 h-4 w-4" />
                Tổng quan
              </Button>
              <Button
                variant={activeTab === "orders" ? "default" : "ghost"}
                className={`w-full justify-start ${activeTab === "orders" ? "bg-pink-500 hover:bg-pink-600" : ""}`}
                onClick={() => setActiveTab("orders")}
              >
                <Package className="mr-2 h-4 w-4" />
                Đơn hàng
              </Button>
              {/* <Button
                variant={activeTab === "wishlist" ? "default" : "ghost"}
                className={`w-full justify-start ${activeTab === "wishlist" ? "bg-pink-500 hover:bg-pink-600" : ""}`}
                onClick={() => setActiveTab("wishlist")}
              >
                <Heart className="mr-2 h-4 w-4" />
                Sản phẩm yêu thích
              </Button> */}
              <Button
                variant={activeTab === "addresses" ? "default" : "ghost"}
                className={`w-full justify-start ${activeTab === "addresses" ? "bg-pink-500 hover:bg-pink-600" : ""}`}
                onClick={() => setActiveTab("addresses")}
              >
                <MapPin className="mr-2 h-4 w-4" />
                Địa chỉ
              </Button>
              {/* <Button
                variant={activeTab === "notifications" ? "default" : "ghost"}
                className={`w-full justify-start ${activeTab === "notifications" ? "bg-pink-500 hover:bg-pink-600" : ""}`}
                onClick={() => setActiveTab("notifications")}
              >
                <Bell className="mr-2 h-4 w-4" />
                Thông báo
              </Button> */}
              {/* <Button
                variant={activeTab === "settings" ? "default" : "ghost"}
                className={`w-full justify-start ${activeTab === "settings" ? "bg-pink-500 hover:bg-pink-600" : ""}`}
                onClick={() => setActiveTab("settings")}
              >
                <Settings className="mr-2 h-4 w-4" />
                Cài đặt tài khoản
              </Button> */}
              <Separator className="my-2" />
              <Button
                variant="ghost"
                className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Đăng xuất
              </Button>
            </nav>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="md:col-span-3">
          {activeTab === "overview" && (
            <OverViewPage />
          )}

          {activeTab === "orders" && (
            <OrderPage />
          )}

          {activeTab === "wishlist" && (
            <WishListPage />
          )}

          {activeTab === "addresses" && (
            <AddressPage />
          )}

          {activeTab === "payment" && (
            <PaymentPage />
          )}

          {activeTab === "notifications" && (
            <NotificationsPage />
          )}

          {activeTab === "settings" && (
            <SettingPage />
          )}
        </div>
      </div>
    </div>
  )
}
