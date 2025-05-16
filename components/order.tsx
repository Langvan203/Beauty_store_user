import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ToastContainer } from "react-toastify"
import { MapPin, Package, Pencil, Plus, ShoppingBag } from "lucide-react"
import { Checkbox } from "@radix-ui/react-checkbox"
import Image from "next/image"
import Link from "next/link"
import { Order } from "@/app/types/order"
import { useOrder } from "@/app/context/OrderContext"
import * as ScrollArea from '@radix-ui/react-scroll-area'
export default function OrderPage() {
  const { order, orderItems, orderItemsDetail, getOrderDetails } = useOrder();
  const viewOrderDetails = (id: number) => {
    getOrderDetails(id);
  }
  const formatDate = (dateString: string | undefined) => {
    if (dateString) {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date);
    }
  };
  const processingOrder = order.filter((item) => item.status === "Đang chờ xử lý");
  const shippingOrders = order.filter((item) => item.status === "Đang giao hàng");
  const completedOrder = order.filter((item) => item.status === "Đã hoàn thành");
  const cancelledOrder = order.filter((item) => item.status === "Đã hủy");

  return (

    <Card>
      <CardHeader>
        <CardTitle>Đơn hàng của tôi</CardTitle>
        <CardDescription>Quản lý và theo dõi tất cả đơn hàng của bạn</CardDescription>
      </CardHeader>
      <CardContent>

        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">Tất cả</TabsTrigger>
            <TabsTrigger value="processing">Đang chờ xử lý</TabsTrigger>
            <TabsTrigger value="shipping">Đang giao hàng</TabsTrigger>
            <TabsTrigger value="completed">Đã hòa thành</TabsTrigger>
            <TabsTrigger value="cancelled">Đã hủy</TabsTrigger>
          </TabsList>
          <ScrollArea.Root className="h-[400px] w-full">
            <ScrollArea.Viewport className="w-full h-full">
              <TabsContent value="all">
                <div className="space-y-4">
                  {order.map((item) => (
                    <div key={item.orderID} className="p-4 border rounded-lg">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                        <div>
                          <p className="font-medium">ORD-{item.orderID}</p>
                          <p className="text-sm text-gray-500">{formatDate(item.orderDate)}</p>
                        </div>
                        <div className="mt-2 md:mt-0">
                          <span className={`text-sm px-2 py-1 bg-green-100 rounded-full
                                        ${item.status === "Đang chờ xử lý"
                              ? "bg-orange-400"
                              : item.status === "Đang giao hàng"
                                ? "bg-cyan-400"
                                : item.status === "Đã hoàn thành"
                                  ? "bg-green-400"
                                  : item.status === "Đã hủy"
                                    ? "bg-red-400"
                                    : "bg-slate-700"
                            }`}>
                            {item.status}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col md:flex-row md:items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500">{item.items.length} sản phẩm</p>
                          <p className="font-medium">
                            {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
                              item.totalAmount,
                            )}
                          </p>
                        </div>
                        <div className="flex gap-2 mt-3 md:mt-0">
                          <Button variant="outline" size="sm">
                            Mua lại
                          </Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="default"
                                size="sm"
                                className="bg-pink-500 hover:bg-pink-600"
                                onClick={() => viewOrderDetails(item.orderID)}
                              >
                                Xem chi tiết
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl">
                              <DialogHeader>
                                <DialogTitle>Chi tiết đơn hàng #{item.orderID}</DialogTitle>
                                <DialogDescription>
                                  Đặt hàng ngày {formatDate(item.orderDate)} - {item.status}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 my-4">
                                <h4 className="font-medium">Sản phẩm</h4>
                                <div className="space-y-4">
                                  {orderItemsDetail.map((item) => (
                                    <div key={item.orderItemID} className="flex gap-4">
                                      <div className="relative w-16 h-16 flex-shrink-0">
                                        <Image
                                          src={`http://localhost:5000/${item.productImage.replace("/\\/g", "/")}`}
                                          alt={item.productName}
                                          fill
                                          className="object-cover rounded-md"
                                        />
                                      </div>
                                      <div className="flex-1">
                                        <div className="flex justify-between">
                                          <div>
                                            <h3 className="font-medium">{item.productName}</h3>
                                            <p className="text-sm text-gray-500">Kích thước: {item.variant}</p>
                                            <div className="flex items-center gap-1">
                                              <div
                                                className="w-3 h-3 rounded-full border border-gray-300"
                                                style={{ backgroundColor: item.colorCode }}
                                                title={item.colorName}
                                              ></div>
                                              <span className="text-sm text-gray-500">{item.colorName}</span>
                                            </div>
                                          </div>

                                          <p className="text-sm">x{item.quantity}</p>
                                        </div>
                                        <div className="flex justify-between items-end mt-2">
                                          <div>
                                            {item.discount > 0 ? (
                                              <div className="flex items-center">
                                                <span className="text-red-500 font-medium">
                                                  {new Intl.NumberFormat("vi-VN", {
                                                    style: "currency",
                                                    currency: "VND",
                                                  }).format(item.price)}
                                                </span>
                                                <span className="text-gray-400 text-xs line-through ml-1">
                                                  {new Intl.NumberFormat("vi-VN", {
                                                    style: "currency",
                                                    currency: "VND",
                                                  }).format(item.priceOfVariant)}
                                                </span>
                                              </div>
                                            ) : (
                                              <span className="font-medium">
                                                {new Intl.NumberFormat("vi-VN", {
                                                  style: "currency",
                                                  currency: "VND",
                                                }).format(item.price)}
                                              </span>
                                            )}
                                          </div>
                                          <div>
                                            <span className="font-medium">
                                              {new Intl.NumberFormat("vi-VN", {
                                                style: "currency",
                                                currency: "VND",
                                              }).format(item.price * item.quantity)}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                                <Separator />
                                <div className="flex justify-between">
                                  <span className="font-medium">Tổng cộng:</span>
                                  <span className="font-medium">
                                    {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
                                      item.totalAmount,
                                    )}
                                  </span>
                                </div>
                              </div>
                              <DialogFooter>
                                <Button variant="outline">Mua lại</Button>
                                <Link href={`/account/orders/${item.orderID}`}>
                                  <Button className="bg-pink-500 hover:bg-pink-600">Xem đầy đủ</Button>
                                </Link>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="processing">
                {processingOrder.length > 0 ? (
                  <div className="space-y-4">
                    {processingOrder.map((item) => (
                      <div key={item.orderID} className="p-4 border rounded-lg">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                          <div>
                            <p className="font-medium">ORD-{item.orderID}</p>
                            <p className="text-sm text-gray-500">{formatDate(item.orderDate)}</p>
                          </div>
                          <div className="mt-2 md:mt-0">
                            <span className="text-sm px-2 py-1 bg-orange-400 rounded-full">
                              {item.status}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col md:flex-row md:items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-500">{item.items.length} sản phẩm</p>
                            <p className="font-medium">
                              {new Intl.NumberFormat("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              }).format(item.totalAmount)}
                            </p>
                          </div>
                          <div className="flex gap-2 mt-3 md:mt-0">
                            <Button variant="outline" size="sm">
                              Mua lại
                            </Button>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="default"
                                  size="sm"
                                  className="bg-pink-500 hover:bg-pink-600"
                                  onClick={() => viewOrderDetails(item.orderID)}
                                >
                                  Xem chi tiết
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-3xl">
                                {/* Nội dung dialog */}
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium mb-2">Không có đơn hàng đang giao</h3>
                    <p className="text-gray-500 mb-4">Bạn không có đơn hàng nào đang được giao</p>
                    <Link href="/products">
                      <Button className="bg-pink-500 hover:bg-pink-600">
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        Tiếp tục mua sắm
                      </Button>
                    </Link>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="shipping">
                {shippingOrders.length > 0 ? (
                  <div className="space-y-4">
                    {shippingOrders.map((item) => (
                      <div key={item.orderID} className="p-4 border rounded-lg">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                          <div>
                            <p className="font-medium">ORD-{item.orderID}</p>
                            <p className="text-sm text-gray-500">{formatDate(item.orderDate)}</p>
                          </div>
                          <div className="mt-2 md:mt-0">
                            <span className="text-sm px-2 py-1 bg-cyan-400 rounded-full">
                              {item.status}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col md:flex-row md:items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-500">{item.items.length} sản phẩm</p>
                            <p className="font-medium">
                              {new Intl.NumberFormat("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              }).format(item.totalAmount)}
                            </p>
                          </div>
                          <div className="flex gap-2 mt-3 md:mt-0">
                            <Button variant="outline" size="sm">
                              Mua lại
                            </Button>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="default"
                                  size="sm"
                                  className="bg-pink-500 hover:bg-pink-600"
                                  onClick={() => viewOrderDetails(item.orderID)}
                                >
                                  Xem chi tiết
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-3xl">
                                {/* Nội dung dialog */}
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium mb-2">Không có đơn hàng đang giao</h3>
                    <p className="text-gray-500 mb-4">Bạn không có đơn hàng nào đang được giao</p>
                    <Link href="/products">
                      <Button className="bg-pink-500 hover:bg-pink-600">
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        Tiếp tục mua sắm
                      </Button>
                    </Link>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="completed">
                {completedOrder.length > 0 ? (
                  <div className="space-y-4">
                    {completedOrder.map((item) => (
                      <div key={item.orderID} className="p-4 border rounded-lg">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                          <div>
                            <p className="font-medium">ORD-{item.orderID}</p>
                            <p className="text-sm text-gray-500">{formatDate(item.orderDate)}</p>
                          </div>
                          <div className="mt-2 md:mt-0">
                            <span className="text-sm px-2 py-1 bg-green-400 rounded-full">
                              {item.status}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col md:flex-row md:items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-500">{item.items.length} sản phẩm</p>
                            <p className="font-medium">
                              {new Intl.NumberFormat("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              }).format(item.totalAmount)}
                            </p>
                          </div>
                          <div className="flex gap-2 mt-3 md:mt-0">
                            <Button variant="outline" size="sm">
                              Mua lại
                            </Button>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="default"
                                  size="sm"
                                  className="bg-pink-500 hover:bg-pink-600"
                                  onClick={() => viewOrderDetails(item.orderID)}
                                >
                                  Xem chi tiết
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-3xl">
                                {/* Nội dung dialog */}
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium mb-2">Không có đơn hàng đang giao</h3>
                    <p className="text-gray-500 mb-4">Bạn không có đơn hàng nào đang được giao</p>
                    <Link href="/products">
                      <Button className="bg-pink-500 hover:bg-pink-600">
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        Tiếp tục mua sắm
                      </Button>
                    </Link>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="cancelled">
                {cancelledOrder.length > 0 ? (
                  <div className="space-y-4">
                    {cancelledOrder.map((item) => (
                      <div key={item.orderID} className="p-4 border rounded-lg">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                          <div>
                            <p className="font-medium">ORD-{item.orderID}</p>
                            <p className="text-sm text-gray-500">{formatDate(item.orderDate)}</p>
                          </div>
                          <div className="mt-2 md:mt-0">
                            <span className="text-sm px-2 py-1 bg-red-400 rounded-full">
                              {item.status}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col md:flex-row md:items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-500">{item.items.length} sản phẩm</p>
                            <p className="font-medium">
                              {new Intl.NumberFormat("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              }).format(item.totalAmount)}
                            </p>
                          </div>
                          <div className="flex gap-2 mt-3 md:mt-0">
                            <Button variant="outline" size="sm">
                              Mua lại
                            </Button>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="default"
                                  size="sm"
                                  className="bg-pink-500 hover:bg-pink-600"
                                  onClick={() => viewOrderDetails(item.orderID)}
                                >
                                  Xem chi tiết
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-3xl">
                                {/* Nội dung dialog */}
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium mb-2">Không có đơn hàng đang giao</h3>
                    <p className="text-gray-500 mb-4">Bạn không có đơn hàng nào đang được giao</p>
                    <Link href="/products">
                      <Button className="bg-pink-500 hover:bg-pink-600">
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        Tiếp tục mua sắm
                      </Button>
                    </Link>
                  </div>
                )}
              </TabsContent>
            </ScrollArea.Viewport>
            <ScrollArea.Scrollbar orientation="vertical" className="flex select-none touch-none transition-colors">
              <ScrollArea.Thumb className="bg-gray-400 rounded" />
            </ScrollArea.Scrollbar>
            <ScrollArea.Corner className="bg-gray-200" />
          </ScrollArea.Root>
        </Tabs>

      </CardContent >
    </Card >
  )
}