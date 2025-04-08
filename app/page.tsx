"use client"
import Link from "next/link"
import Image from "next/image"
import { ChevronRight, ShoppingBag } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useCallback, useEffect, useState } from "react"
import { Product, ApiResponse, ProductPage } from "@/app/types/product";
import { useAuth } from "./context/AuthContext"
import { CartItem, AddToCartDto } from "./types/cart"
import { useCart } from "./context/CartContext"
import { toast, Bounce } from "react-toastify"

interface categorytop {
  categoryID: number;
  name: string;
  description: string;
  thumbNail: string | null;
  createdDate: string;
  updatedDate: string | null;
};

interface brands {
  brandID: number;
  name: string;
  description: string | null,
  thumbNail: string | null;
}

export default function Home() {
  const [categories, setCategories] = useState<categorytop[]>([])
  const [products, setProducts] = useState<ProductPage[]>([])
  const [brand, setBrand] = useState<brands[]>([])
  const { user, token } = useAuth()
  const { cartItems } = useCart();
  const { refreshCart } = useCart()
  const slugify = (str: string) =>
    str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // bỏ dấu tiếng Việt
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "")
  useEffect(() => {
    fetch("http://localhost:5000/api/Category/Get-top-categories?number=4")
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 1 && data.data) {
          setCategories(data.data)
        }
      })
      .catch((error) => console.error("Lỗi fetch danh mục:", error))
  }, [])

  useEffect(() => {
    fetch("http://localhost:5000/api/Product/Get-newest-product-top?number=4")
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 1 && data.data) {
          setProducts(data.data)
          console.log(data.data)
        }
      })
      .catch((error) => console.error("Lỗi fetch danh mục:", error))
  }, [])

  useEffect(() => {
    fetch("http://localhost:5000/api/Brand/Get-brand-top?number=6")
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 1 && data.data) {
          setBrand(data.data);
        }
      })
      .catch((error) => console.error("Lỗi fetch danh mục:", error))
  }, [])

  

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full h-[500px] overflow-hidden">
        <Image
          src="/logoto2.jpg?height=500&width=1920"
          alt="Cocolux Banner"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center">
          <div className="container px-4 md:px-6">
            <div className="max-w-md space-y-4">
              <Badge className="bg-pink-500 hover:bg-pink-600 px-3 py-1 text-white">Mới ra mắt</Badge>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white">
                Khám phá vẻ đẹp tự nhiên cùng Cocolux
              </h1>
              <p className="text-white/90 md:text-xl">Sản phẩm mỹ phẩm chất lượng cao, an toàn và hiệu quả</p>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href={`/products`}>
                  <Button size="lg" className="bg-pink-500 hover:bg-pink-600">
                    Mua ngay
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="text-black border-white hover:bg-white/10">
                  Tìm hiểu thêm
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="container px-4 py-12 md:px-6 md:py-16">
        <h2 className="text-2xl font-bold tracking-tight mb-6">Danh mục nổi bật</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Link
              key={category.categoryID}
              href={`/category/${category.categoryID}`}
              className="group relative h-40 overflow-hidden rounded-lg"
            >
              <Image
                src={`http://localhost:5000/${category.thumbNail}` || "/placeholder.svg"}
                alt={"anhtrong"}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/30 flex items-end p-4">
                <h3 className="text-white font-medium">{category.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-gray-50 py-12 md:py-16">
        <div className="container px-4 md:px-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold tracking-tight">Sản phẩm nổi bật</h2>
            <Link href="/products" className="text-pink-500 hover:text-pink-600 flex items-center text-sm font-medium">
              Xem tất cả <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products?.map((product) => {
              const imageSrc = product.productImages
                ? `http://localhost:5000/${product.productImages.replace(/\\/g, "/")}`
                : "/placeholder.svg";
              return (
                <Card key={product.productID} className="h-full overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow">
                  <Link href={`/products/${product.productID}`}>
                    <div className="relative aspect-square">

                      <Image src={imageSrc} alt={product.productName} fill className="object-cover" />
                      {product.productDiscount > 0 && (
                        <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">-{product.productDiscount}%</Badge>
                      )}

                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-medium text-sm line-clamp-2 mb-1">{product.productName}</h3>
                      <p className="text-gray-500 text-xs line-clamp-2 mb-2">
                        {product.productDescription || "Sản phẩm chăm sóc da chất lượng cao, giúp làn da khỏe mạnh và rạng rỡ."}
                      </p>
                      <div className="flex items-center justify-between">

                        <div>
                          {product.variants && product.variants.length > 0 ? (
                            // Hiển thị giá theo variant đầu tiên nếu có
                            product.productDiscount > 0 ? (
                              <>
                                <span className="text-red-500 font-medium">
                                  {new Intl.NumberFormat("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                  }).format(
                                    product.variants[0].price - product.variants[0].price * (product.productDiscount / 100)
                                  )}
                                </span>
                                <span className="text-gray-400 text-xs line-through ml-1">
                                  {new Intl.NumberFormat("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                  }).format(product.variants[0].price)}
                                </span>
                              </>
                            ) : (
                              <span className="text-gray-900 font-medium">
                                {new Intl.NumberFormat("vi-VN", {
                                  style: "currency",
                                  currency: "VND",
                                }).format(product.variants[0].price)}
                              </span>
                            )
                          ) : (
                            // Hiển thị giá mặc định nếu không có variants
                            product.productDiscount > 0 ? (
                              <>
                                <span className="text-red-500 font-medium">
                                  {new Intl.NumberFormat("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                  }).format(
                                    product.productPrice - product.productPrice * ((product.productDiscount / 100))
                                  )}
                                </span>
                                <span className="text-gray-400 text-xs line-through ml-1">
                                  {new Intl.NumberFormat("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                  }).format(product.productPrice)}
                                </span>
                              </>
                            ) : (
                              <span className="text-gray-900 font-medium">
                                {new Intl.NumberFormat("vi-VN", {
                                  style: "currency",
                                  currency: "VND",
                                }).format(product.productPrice)}
                              </span>
                            )
                          )}
                        </div>

                        <Button size="icon" variant="ghost" className="h-8 w-8">
                          <ShoppingBag className="h-4 w-4" />
                          <span className="sr-only">Thêm vào giỏ hàng</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Link>
                </Card>

              )
            }
            )
            }
          </div>
        </div>
      </section>
      {/* Promotions */}
      <section className="container px-4 py-12 md:px-6 md:py-16">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="relative h-64 overflow-hidden rounded-lg">
            <Image
              src="/placeholder.svg?height=256&width=600&text=Khuyến%20mãi%20mùa%20hè"
              alt="Khuyến mãi mùa hè"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/70 to-transparent flex items-center p-6">
              <div className="max-w-xs">
                <h3 className="text-xl font-bold text-white mb-2">Khuyến mãi mùa hè</h3>
                <p className="text-white/90 mb-4">Giảm đến 30% cho tất cả sản phẩm chăm sóc da</p>
                <Button className="bg-white text-pink-500 hover:bg-white/90">Mua ngay</Button>
              </div>
            </div>
          </div>
          <div className="relative h-64 overflow-hidden rounded-lg">
            <Image
              src="/placeholder.svg?height=256&width=600&text=Bộ%20sản%20phẩm%20mới"
              alt="Bộ sản phẩm mới"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/70 to-transparent flex items-center p-6">
              <div className="max-w-xs">
                <h3 className="text-xl font-bold text-white mb-2">Bộ sản phẩm mới</h3>
                <p className="text-white/90 mb-4">Khám phá bộ sản phẩm chăm sóc toàn diện mới nhất</p>
                <Button className="bg-white text-purple-500 hover:bg-white/90">Khám phá</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brands */}
      <section className="container px-4 py-12 md:px-6 md:py-16">
        <h2 className="text-2xl font-bold tracking-tight text-center mb-8">Thương hiệu nổi tiếng</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {brand.map((brand) => {
            const imageSrc = brand.thumbNail ? `http://localhost:5000/${brand.thumbNail.replace(/\\/g, "/")}`
              : "/placeholder.svg";
            return (
              <Link
                key={brand.brandID}
                href={`/brand/${brand.brandID}`}
                className="flex items-center justify-center h-24 border rounded-lg hover:border-pink-500 hover:shadow-sm transition-all"
              >
                <Image
                  src={imageSrc}
                  alt={brand.name}
                  width={120}
                  style={{ height: 90 }}
                  height={50}
                  className="object-contain"
                />
              </Link>
            )
          })}
        </div>
      </section>

      {/* Brand Story */}
      <section className="container px-4 py-12 md:px-6 md:py-16">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl font-bold tracking-tight mb-4">Về Cocolux</h2>
            <p className="text-gray-600 mb-4">
              Cocolux là thương hiệu mỹ phẩm Việt Nam với sứ mệnh mang đến những sản phẩm chăm sóc da chất lượng cao, an
              toàn và hiệu quả. Chúng tôi tin rằng vẻ đẹp tự nhiên đến từ làn da khỏe mạnh.
            </p>
            <p className="text-gray-600 mb-6">
              Với đội ngũ chuyên gia hàng đầu và công nghệ hiện đại, Cocolux không ngừng nghiên cứu và phát triển những
              sản phẩm phù hợp với làn da người Việt, giúp bạn tự tin tỏa sáng mỗi ngày.
            </p>
            <Button variant="outline" className="border-pink-500 text-pink-500 hover:bg-pink-50">
              Tìm hiểu thêm về chúng tôi
            </Button>
          </div>
          <div className="relative h-80 rounded-lg overflow-hidden">
            <Image
              src="/cocoluxbrandlogo_1.jpg?height=320&width=600&text=Về%20Cocolux"
              alt="Về Cocolux"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-pink-50 py-12 md:py-16">
        <div className="container px-4 md:px-6 text-center">
          <h2 className="text-2xl font-bold tracking-tight mb-2">Đăng ký nhận tin</h2>
          <p className="text-gray-600 max-w-md mx-auto mb-6">
            Nhận thông tin về sản phẩm mới, khuyến mãi hấp dẫn và các mẹo làm đẹp hữu ích.
          </p>
          <form className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Email của bạn"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              required
            />
            <Button className="bg-pink-500 hover:bg-pink-600 h-10">Đăng ký</Button>
          </form>
        </div>
      </section>
    </div>
  )
}

