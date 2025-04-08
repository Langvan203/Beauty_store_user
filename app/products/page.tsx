"use client"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight, Filter, ShoppingBag } from "lucide-react"
import { useEffect, useMemo, useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ProductDetails, ProductPage } from "../types/product"
import useSortedProducts from "@/hooks/useSortedProducts"
import { AddToCartDto } from "../types/cart"
import { useAuth } from "../context/AuthContext"
import { Bounce, toast } from "react-toastify"
import { useCart } from "../context/CartContext"
import ProductFilters from "@/components/ProductFilter"
interface Filters {
  categories: number[]
  brands: number[]
  priceRange: [number, number]
}

export default function ProductsPage() {
  // Lấy dữ liệu sản phẩm từ API
  const { refreshCart } = useCart()
  const [products, setProducts] = useState<ProductPage[]>([])
  const [filters, setFilters] = useState<Filters>({
    categories: [],
    brands: [],
    priceRange: [0, 5000000],
  })
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(12)
  const { token } = useAuth();
  const { cartItems } = useCart();
  const [totalItem, setTotalItem] = useState(0)
  const totalPages = useMemo(() => {
    return Math.ceil(totalItem / pageSize)
  }, [totalItem, pageSize])

  // Hàm chuyển trang
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage)
    }
  }
  // Sắp xếp sản phẩm theo lựa chọn

  useEffect(() => {
    // Xây dựng query string cho API
    const categoriesParam = filters.categories.join(",");
    const brandsParam = filters.brands.join(",");
    const [minPrice, maxPrice] = filters.priceRange;
    //Gọi API với các filter
    fetch(`http://localhost:5000/api/Product/Pagnation-products?categoryid=&page=${page}&pageSize=${pageSize}&categories=${categoriesParam}&brands=${brandsParam}&minPrice=${minPrice}&maxPrice=${maxPrice}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data.data);
        console.log(`http://localhost:5000/api/Product/Pagnation-products?categoryid=&page=${page}&pageSize=${pageSize}&categories=${categoriesParam}&brands=${brandsParam}&minPrice=${minPrice}&maxPrice=${maxPrice}`);
        setProducts(data.data.listProduct)
        setTotalItem(data.data.totalItem)
      })
      .catch((err) => console.log(err))
  }, [page, pageSize, filters])
  console.log(products);
  const [sortValue, setSortValue] = useState("featured")
  const sortedProducts = useSortedProducts(products, sortValue)

  return (
    <div className="container px-4 py-8 md:py-12">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-pink-500">Trang chủ</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">Tất cả sản phẩm</span>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Tất cả sản phẩm</h1>
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="lg:hidden">
                <Filter className="h-4 w-4 mr-2" />
                Lọc
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>Lọc sản phẩm</SheetTitle>
                <SheetDescription>Tùy chỉnh tìm kiếm sản phẩm theo nhu cầu của bạn</SheetDescription>
              </SheetHeader>
              <div className="py-4">
                <ProductFilters onFilterChange={setFilters} />
              </div>
            </SheetContent>
          </Sheet>
          <Select defaultValue="featured" onValueChange={(value) => setSortValue(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sắp xếp theo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Nổi bật</SelectItem>
              <SelectItem value="newest">Mới nhất</SelectItem>
              <SelectItem value="price-asc">Giá: Thấp đến cao</SelectItem>
              <SelectItem value="price-desc">Giá: Cao đến thấp</SelectItem>
              <SelectItem value="name-asc">Tên: A-Z</SelectItem>
              <SelectItem value="name-desc">Tên: Z-A</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar Filters - Desktop */}
        <div className="hidden lg:block">
          <ProductFilters onFilterChange={setFilters} />
        </div>

        {/* Product Grid */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-6">
            {sortedProducts.map((product) => {
              const imageSrc = product && product.productImages && product.productImages.length > 0
                ? `http://localhost:5000/${product.productImages.replace(/\\/g, "/")}`
                : "/placeholder.svg"
              return (
                <Card key={product.productID} className="h-full overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow">
                  <Link href={`/products/${product.productID}`}>
                    <div className="relative aspect-square">

                      <Image src={imageSrc} alt={product.productName} fill className="object-cover" />
                      {product.productDiscount > 0 && (
                        <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
                          -{product.productDiscount}%
                        </Badge>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-1">
                        <div className="text-xs text-gray-500">{product.brandName}</div>
                        <div className="text-xs text-gray-500">{product.categoryName}</div>
                      </div>
                      <h3 className="font-medium text-sm line-clamp-2 mb-1 group-hover:text-pink-500 transition-colors">
                        {product.productName}
                      </h3>
                      <p className="text-gray-500 text-xs line-clamp-2 mb-2">
                        {product.productDescription ||
                          "Sản phẩm chăm sóc da chất lượng cao, giúp làn da khỏe mạnh và rạng rỡ."}
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
            })}
          </div>

          {sortedProducts.length > 0 && (
            <div className="flex justify-center mt-8">
              <nav className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  disabled={page === 1}
                  onClick={() => handlePageChange(page - 1)}
                >
                  <ChevronRight className="h-4 w-4 rotate-180" />
                  <span className="sr-only">Trang trước</span>
                </Button>

                {/* Hiển thị các nút trang */}
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  // Logic để hiển thị số trang hợp lý khi có nhiều trang
                  let pageNum = i + 1;

                  // Nếu nhiều hơn 5 trang và đang ở trang xa
                  if (totalPages > 5 && page > 3) {
                    pageNum = page - 3 + i;

                    // Hiển thị 2 trang trước, trang hiện tại và 2 trang sau nếu có thể
                    if (page > 3 && page < totalPages - 1) {
                      pageNum = page - 2 + i;
                    }

                    // Nếu ở gần cuối, hiển thị 5 trang cuối
                    if (page >= totalPages - 1) {
                      pageNum = totalPages - 4 + i;
                    }
                  }

                  // Không hiển thị số trang quá tổng số trang
                  if (pageNum > totalPages) return null;

                  return (
                    <Button
                      key={pageNum}
                      variant="outline"
                      size="sm"
                      className={pageNum === page ? "bg-pink-50 text-pink-500 border-pink-200" : ""}
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}

                <Button
                  variant="outline"
                  size="icon"
                  disabled={page === totalPages || totalPages === 0}
                  onClick={() => handlePageChange(page + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                  <span className="sr-only">Trang sau</span>
                </Button>
              </nav>
            </div>
          )}

          {/* Empty State */}
          {sortedProducts.length === 0 && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <ShoppingBag className="h-8 w-8 text-gray-500" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Không tìm thấy sản phẩm</h2>
              <p className="text-gray-500 mb-6">Không có sản phẩm nào trong danh mục này</p>
              <Link href="/products">
                <Button className="bg-pink-500 hover:bg-pink-600">Xem tất cả sản phẩm</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

