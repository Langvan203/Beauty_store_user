"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Package, Truck, CheckCircle, Clock, AlertCircle, HelpCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/app/context/AuthContext"
import Link from "next/link"

// Cập nhật interface để phù hợp với API
interface Order {
  id: number;
  date: string;
  status: string;
  statusCode: number;
  shippingMethod: string | null;
  paymentMethod: string | null;
  shippingAdress: string;
  phoneNumber: string;
  receiverName: string;
  items: ItemOrder[];
  subtotal: number;
  shipping: number;
  total: number;
  timeLine: TimeLine[];
}

interface ItemOrder {
  id: number;
  name: string;
  price: number;
  discount: number;
  finalPrice: number;
  quantity: number;
  image: string;
  variant: string;
  colorName: string;
  colorCode: string;
}

interface TimeLine {
  status: string;
  date: string;
  description: string;
}

export default function OrderDetailPage() {
  const router = useRouter()
  const params = useParams()
  const orderId = params.id
  const [reviewText, setReviewText] = useState("")
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const { token } = useAuth();
  const [cancelling, setCancelling] = useState(false)
  useEffect(() => {
    // Fetch order data from API
    fetch(`http://localhost:5000/api/Order/Get-Order-history?orderId=${orderId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === 1 && data.data) {
          setOrder(data.data)
        } else {
          console.error("Error fetching order:", data)
        }
      })
      .catch(error => {
        console.error("Failed to fetch order:", error)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [orderId])
  const handleCancelOrder = async () => {
    if (!confirm("Bạn có chắc chắn muốn hủy đơn hàng này?")) {
      return
    }

    setCancelling(true)

    try {
      const response = await fetch(`http://localhost:5000/api/Order/Cancelled-order?orderId=${orderId}`, {
        method: "POST", // Hoặc "GET" tùy vào API của bạn
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })

      const data = await response.json()

      if (data.status === 1) {
        alert("Hủy đơn hàng thành công")
        // Cập nhật trạng thái đơn hàng trong state
        setOrder(prev => prev ? { ...prev, statusCode: 6, status: "Đã hủy" } : null)
      } else {
        alert(`Không thể hủy đơn hàng: ${data.des || "Đã có lỗi xảy ra"}`)
      }
    } catch (error) {
      console.error("Lỗi khi hủy đơn hàng:", error)
      alert("Đã xảy ra lỗi khi hủy đơn hàng. Vui lòng thử lại sau.")
    } finally {
      setCancelling(false)
    }
  }
  if (loading) {
    return <div className="container px-4 py-8 flex justify-center">
      <p>Đang tải thông tin đơn hàng...</p>
    </div>
  }

  if (!order) {
    return <div className="container px-4 py-8 flex justify-center">
      <p>Không tìm thấy thông tin đơn hàng.</p>
    </div>
  }

  const getStatusIcon = (statusCode: number) => {
    switch (statusCode) {
      case 1: // Đang chờ xử lý
        return <Clock className="h-5 w-5 text-yellow-500" />
      case 2: // Đặt hàng thành công
        return <CheckCircle className="h-5 w-5 text-blue-500" />
      case 3: // Đang giao hàng
        return <Truck className="h-5 w-5 text-blue-500" />
      case 4: // Đã giao hàng thành công
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 5: // Đã nhận
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 6: // Đã hủy
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default: // Không xác định
        return <HelpCircle className="h-5 w-5 text-gray-500" />
    }
  }

  // Cập nhật hàm getStatusColor để phù hợp với các trạng thái mới
  const getStatusColor = (statusCode: number) => {
    switch (statusCode) {
      case 1: // Đang chờ xử lý
        return "bg-yellow-100 text-yellow-800"
      case 2: // Đặt hàng thành công
        return "bg-blue-100 text-blue-800"
      case 3: // Đang giao hàng
        return "bg-blue-100 text-blue-800"
      case 4: // Đã giao hàng thành công
        return "bg-green-100 text-green-800"
      case 5: // Đã nhận
        return "bg-green-200 text-green-900"
      case 6: // Đã hủy
        return "bg-red-100 text-red-800"
      default: // Không xác định
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch (e) {
      return dateString
    }
  }

  return (
    <div className="container px-4 py-8 md:py-12">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          Quay lại
        </Button>
        <h1 className="text-2xl font-bold">Chi tiết đơn hàng #{order.id}</h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Order Status */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle>Trạng thái đơn hàng</CardTitle>
                <Badge className={getStatusColor(order.statusCode)}>
                  {getStatusIcon(order.statusCode)}
                  <span className="ml-1">{order.status}</span>
                </Badge>
              </div>
              <CardDescription>Đặt hàng ngày {formatDate(order.date)}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                <div className="space-y-6">
                  {order.timeLine.map((event, index) => (
                    <div key={index + 1} className="relative pl-8">
                      <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-white border-2 border-pink-500 flex items-center justify-center">
                        {index === order.timeLine.length - 1 ? (
                          <div className="w-2 h-2 rounded-full bg-pink-500"></div>
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium">{event.description}</h3>
                        <p className="text-sm text-gray-500">{formatDate(event.date)}</p>
                        <p className="text-sm">{event.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Sản phẩm</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="relative w-16 h-16 flex-shrink-0">
                      <Image
                        src={item.image ? `http://localhost:5000/${item.image}` : "/placeholder.svg"}
                        alt={item.name}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-sm text-gray-500">Phân loại: {item.variant}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <div
                            className="w-3 h-3 rounded-full border border-gray-300"
                            style={{ backgroundColor: item.colorCode }}
                            title={item.colorName}
                          ></div>
                          <span className="text-sm text-gray-500">{item.colorName}</span>
                        </div>
                        <p className="text-sm">x{item.quantity}</p>
                      </div>
                      <div className="flex justify-between items-end mt-2">
                        <div>
                          {item.discount > 0 ? (
                            <div className="flex items-center">
                              <span className="text-red-500 font-medium">
                                {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
                                  item.finalPrice,
                                )}
                              </span>
                              <span className="text-gray-400 text-xs line-through ml-1">
                                {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
                                  item.price,
                                )}
                              </span>
                            </div>
                          ) : (
                            <span className="font-medium">
                              {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
                                item.price,
                              )}
                            </span>
                          )}
                        </div>
                        <div>
                          <span className="font-medium">
                            {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
                              item.finalPrice * item.quantity,
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {order.statusCode === 4 && ( // Đã giao hàng
                <div className="mt-6 pt-6 border-t">
                  <h3 className="font-medium mb-2">Đánh giá sản phẩm</h3>
                  <Textarea
                    placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    className="mb-3"
                  />
                  <Button className="bg-pink-500 hover:bg-pink-600">Gửi đánh giá</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Tóm tắt đơn hàng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tạm tính</span>
                  <span>
                    {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(order.subtotal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phí vận chuyển</span>
                  <span>
                    {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(order.shipping)}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Tổng cộng</span>
                  <span>
                    {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(order.total)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping & Payment Info */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin giao hàng & thanh toán</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-1">Địa chỉ giao hàng</h3>
                  <p className="text-gray-600">{order.receiverName}</p>
                  <p className="text-gray-600">{order.shippingAdress}</p>
                  <p className="text-gray-600">{order.phoneNumber}</p>
                </div>
                {order.shippingMethod && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="font-medium mb-1">Phương thức vận chuyển</h3>
                      <p className="text-gray-600">{order.shippingMethod}</p>
                    </div>
                  </>
                )}
                {order.paymentMethod && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="font-medium mb-1">Phương thức thanh toán</h3>
                      <p className="text-gray-600">{order.paymentMethod}</p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-3">
                <Link href={"/products"}>
                  <Button className="w-full bg-pink-500 hover:bg-pink-600">Mua lại</Button>
                </Link>
                {order.statusCode !== 6 && ( // Hiển thị nút hủy đơn khi đơn hàng chưa bị hủy
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={handleCancelOrder}
                    disabled={cancelling}
                  >
                    {cancelling ? "Đang xử lý..." : "Hủy đơn hàng"}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}