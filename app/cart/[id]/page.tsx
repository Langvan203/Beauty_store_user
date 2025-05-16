"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent } from "@/components/ui/card"
import { useParams } from "next/navigation"
import { useCart } from "@/app/context/CartContext"
import { useAuth } from "@/app/context/AuthContext"
import { Bounce, toast } from "react-toastify"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
export default function CartPage() {
  const params = useParams();
  const { id } = params;
  const { cartItems, cart, refreshCart, removeCart } = useCart();
  const subtotal = cartItems.reduce((total, item) => total + item.subTotal, 0);
  const shipping = subtotal > 500000 ? 0 : 30000;
  const total = Number(cart?.totalPrice) + shipping;
  const { token } = useAuth();


  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const [showClearCartDialog, setShowClearCartDialog] = useState(false);

  const confirmRemoveItem = (cartItemId: number) => {
    setItemToDelete(cartItemId);
  };
  const updateQuantity = (cartItemId: number, newQuantity: number) => {
    if (!token) return;

    fetch(`http://localhost:5000/api/Cart/update?cartItemId=${cartItemId}&quantity=${newQuantity}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        refreshCart();
      })
      .catch((err) => console.error("Error updating quantity:", err));
  };

  // Hàm xóa một item khỏi giỏ hàng
  const handleRemoveItem = () => {
    if (!token || itemToDelete === null) return;

    fetch(`http://localhost:5000/api/Cart/remove?CartItemID=${itemToDelete}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const prn = cartItems.find((p) => p.cart_ItemID == itemToDelete)?.productName
        toast.success(`Đã xóa thành công sản phẩm ${prn} ra khỏi giỏ hàng`, {
          position: "top-right",
          autoClose: 500,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
          onClose: () => refreshCart()
        });
        setItemToDelete(null);
      })
      .catch((err) => console.error("Error removing item:", err));
  };

  // Hàm xóa toàn bộ giỏ hàng
  const confirmClearCart = () => {
    setShowClearCartDialog(true);
  };

  // Actual clear cart function after confirmation
  const handleClearCart = () => {
    if (!token) return;


    
    toast.success(`Đã xóa thành công giỏ hàng`, {
          position: "top-right",
          autoClose: 500,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
          onClose: () => {
            removeCart();
            refreshCart()
          }
        });
    setShowClearCartDialog(false);
  };
  return (
    <div className="container px-4 py-8 md:py-12">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Giỏ hàng của bạn</h1>
      <AlertDialog open={itemToDelete !== null} onOpenChange={(open) => !open && setItemToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa sản phẩm</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
            <AlertDialogAction onClick={handleRemoveItem} className="bg-red-500 text-white hover:bg-red-600">
              Xóa sản phẩm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={showClearCartDialog} onOpenChange={setShowClearCartDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa giỏ hàng</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc muốn xóa tất cả sản phẩm trong giỏ hàng?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
            <AlertDialogAction onClick={handleClearCart} className="bg-red-500 text-white hover:bg-red-600">
              Xóa giỏ hàng
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {cartItems.length > 0 ? (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.cart_ItemID} className="flex flex-col sm:flex-row gap-4 p-4 border rounded-lg">
                  <div className="relative w-full sm:w-24 h-24 flex-shrink-0">
                    <Image
                      src={`http://localhost:5000/${item.productImage.replace(/\\/g, "/")}` || "/placeholder.svg"}
                      alt={item.productName}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                  <div className="flex-1 flex flex-col">
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                      <div>
                        <h3 className="font-medium line-clamp-1">{item.productName}</h3>
                        <p className="text-sm text-gray-500 mb-2">Kích thước: {item.variant}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-sm text-gray-500">Màu:</span>
                        <div
                          className="w-4 h-4 rounded-full border border-gray-300"
                          style={{ backgroundColor: item.colorCode }}
                          title={item.colorName}
                        ></div>
                        <span className="text-sm text-gray-500">{item.colorName}</span>
                      </div>
                      <div className="text-right">
                        {item.discount > 0 ? (
                          <div>
                            <span className="font-medium text-red-500">
                              {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
                                item.subTotal,
                              )}
                            </span>
                            <span className="text-sm text-gray-500 line-through ml-1">
                              {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
                                item.price,
                              )}
                            </span>
                          </div>
                        ) : (
                          <span className="font-medium">
                            {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(item.price * item.quantity)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-auto pt-2">
                      <div className="flex items-center">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-r-none"
                          onClick={() => updateQuantity(item.cart_ItemID, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                          <span className="sr-only">Giảm</span>
                        </Button>
                        <div className="h-8 w-10 flex items-center justify-center border-y text-sm">
                          {item.quantity}
                        </div>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-l-none"
                          onClick={() => updateQuantity(item.cart_ItemID, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                          <span className="sr-only">Tăng</span>
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => confirmRemoveItem(item.cart_ItemID)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        <span className="text-xs">Xóa</span>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-between items-center">
              <Link
                href="/products"
                className="text-pink-500 hover:text-pink-600 text-sm font-medium flex items-center"
              >
                <ShoppingBag className="mr-2 h-4 w-4" />
                Tiếp tục mua sắm
              </Link>
              <Button variant="outline" className="text-sm" onClick={confirmClearCart}>
                Xóa giỏ hàng
              </Button>
            </div>
          </div>

          <div>
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">Tóm tắt đơn hàng</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tạm tính</span>
                    <span>
                      {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phí vận chuyển</span>
                    {shipping === 0 ? (
                      <span className="text-green-500">Miễn phí</span>
                    ) : (
                      <span>
                        {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(shipping)}
                      </span>
                    )}
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Tổng cộng</span>
                    <span>{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(Number(total))}</span>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div>
                    <label htmlFor="coupon" className="text-sm font-medium mb-1 block">
                      Mã giảm giá
                    </label>
                    <div className="flex gap-2">
                      <Input id="coupon" placeholder="Nhập mã giảm giá" />
                      <Button variant="outline">Áp dụng</Button>
                    </div>
                  </div>

                  <Link href={`/checkout/${cart?.cartID}`}>
                    <Button className="w-full mt-4 bg-pink-500 hover:bg-pink-600 h-11">
                      Tiến hành thanh toán
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>

                <div className="mt-6 text-sm text-gray-500">
                  <p>Đơn hàng từ 500.000đ được miễn phí vận chuyển</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <ShoppingBag className="h-8 w-8 text-gray-500" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Giỏ hàng của bạn đang trống</h2>
          <p className="text-gray-500 mb-6">Hãy thêm sản phẩm vào giỏ hàng để tiến hành mua sắm</p>
          <Link href="/products">
            <Button className="bg-pink-500 hover:bg-pink-600">Tiếp tục mua sắm</Button>
          </Link>
        </div>
      )}
    </div>
  )
}

