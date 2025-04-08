import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useState } from "react"
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
import { Heart, MapPin, Pencil, Plus, ShoppingBag } from "lucide-react"
import { Checkbox } from "@radix-ui/react-checkbox"
import Image from "next/image"
import Link from "next/link"
export default function WishListPage() {
    const [user, setUser] = useState({
        name: "Nguyễn Văn A",
        firstName: "Nguyễn",
        lastName: "Văn A",
        email: "nguyenvana@example.com",
        phone: "0912345678",
        avatar: "/placeholder.svg?height=100&width=100&text=NVA",
        address: "123 Đường ABC, Quận 1, TP. Hồ Chí Minh",
        memberSince: "01/01/2023",
        birthday: "1990-01-01",
        gender: "male",
        orders: [
          {
            id: "ORD-12345",
            date: "15/06/2023",
            total: 1250000,
            status: "Đã giao hàng",
            items: [
              {
                id: 1,
                name: "Kem dưỡng ẩm Cocolux Hydra",
                price: 450000,
                discount: 15,
                finalPrice: 382500,
                quantity: 1,
                image: "/placeholder.svg?height=100&width=100",
                variant: "30ml",
              },
              {
                id: 2,
                name: "Serum Vitamin C Cocolux",
                price: 650000,
                discount: 0,
                finalPrice: 650000,
                quantity: 2,
                image: "/placeholder.svg?height=100&width=100",
                variant: "50ml",
              },
            ],
          },
          {
            id: "ORD-12346",
            date: "20/05/2023",
            total: 850000,
            status: "Đã giao hàng",
            items: [
              {
                id: 3,
                name: "Sữa rửa mặt Cocolux Gentle",
                price: 280000,
                discount: 0,
                finalPrice: 280000,
                quantity: 1,
                image: "/placeholder.svg?height=100&width=100",
                variant: "150ml",
              },
              {
                id: 4,
                name: "Mặt nạ dưỡng ẩm Cocolux Moisture",
                price: 180000,
                discount: 10,
                finalPrice: 162000,
                quantity: 2,
                image: "/placeholder.svg?height=100&width=100",
                variant: "25ml",
              },
            ],
          },
          {
            id: "ORD-12347",
            date: "10/04/2023",
            total: 450000,
            status: "Đã giao hàng",
            items: [
              {
                id: 5,
                name: "Tẩy tế bào chết Cocolux Exfoliate",
                price: 320000,
                discount: 0,
                finalPrice: 320000,
                quantity: 1,
                image: "/placeholder.svg?height=100&width=100",
                variant: "100ml",
              },
            ],
          },
        ],
        wishlist: [
          {
            id: 1,
            name: "Kem dưỡng ẩm Cocolux Hydra",
            price: 450000,
            image: "/placeholder.svg?height=100&width=100",
            discount: 15,
          },
          {
            id: 2,
            name: "Serum Vitamin C Cocolux",
            price: 650000,
            image: "/placeholder.svg?height=100&width=100",
            discount: 0,
          },
        ],
        addresses: [
          {
            id: 1,
            name: "Nguyễn Văn A",
            phone: "0912345678",
            address: "123 Đường ABC, Quận 1, TP. Hồ Chí Minh",
            isDefault: true,
          },
        ],
        paymentMethods: [
          {
            id: 1,
            type: "credit_card",
            name: "Thẻ tín dụng",
            cardNumber: "4242XXXXXXXX4242",
            cardType: "Visa",
            expiryDate: "12/2025",
            isDefault: true,
          },
        ],
      })
    return(
        <Card>
                <CardHeader>
                  <CardTitle>Sản phẩm yêu thích</CardTitle>
                  <CardDescription>Danh sách sản phẩm bạn đã đánh dấu yêu thích</CardDescription>
                </CardHeader>
                <CardContent>
                  {user.wishlist.length > 0 ? (
                    <div className="space-y-4">
                      {user.wishlist.map((product) => (
                        <div key={product.id} className="flex items-center gap-4 p-4 border rounded-lg">
                          <div className="relative w-16 h-16 flex-shrink-0">
                            <Image
                              src={product.image || "/placeholder.svg"}
                              alt={product.name}
                              fill
                              className="object-cover rounded-md"
                            />
                            {product.discount > 0 && (
                              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                                -{product.discount}%
                              </span>
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium line-clamp-1">{product.name}</h3>
                            <div className="flex items-center mt-1">
                              {product.discount > 0 ? (
                                <>
                                  <span className="text-red-500 font-medium">
                                    {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
                                      product.price * (1 - product.discount / 100),
                                    )}
                                  </span>
                                  <span className="text-gray-400 text-xs line-through ml-1">
                                    {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
                                      product.price,
                                    )}
                                  </span>
                                </>
                              ) : (
                                <span className="font-medium">
                                  {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
                                    product.price,
                                  )}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Heart className="h-4 w-4 mr-1 fill-current" />
                              Bỏ thích
                            </Button>
                            <Button size="sm" className="bg-pink-500 hover:bg-pink-600">
                              <ShoppingBag className="h-4 w-4 mr-1" />
                              Thêm vào giỏ
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Heart className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium mb-2">Danh sách yêu thích trống</h3>
                      <p className="text-gray-500 mb-4">Bạn chưa thêm sản phẩm nào vào danh sách yêu thích</p>
                      <Link href="/products">
                        <Button className="bg-pink-500 hover:bg-pink-600">
                          <ShoppingBag className="mr-2 h-4 w-4" />
                          Khám phá sản phẩm
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
    )
}