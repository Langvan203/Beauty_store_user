"use client"

import Image from "next/image"
import Link from "next/link"
import { Check, Heart, Minus, Plus, Share2, ShoppingCart, Star, Truck } from "lucide-react"
import { Facebook, Twitter, Instagram } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import React, { use, useEffect, useState } from "react"
import { Product, ApiResponse } from "@/app/types/product"
import { Bounce, toast } from "react-toastify"
import { AddToCartDto } from "@/app/types/cart"
import { useAuth } from "@/app/context/AuthContext"
import { useCart } from "@/app/context/CartContext"

import { useParams } from "next/navigation"

export default function ProductPage() {
  const params = useParams();
  const { id } = params;

  // Giả lập dữ liệu sản phẩm
  const { token } = useAuth();
  const { refreshCart } = useCart();
  const [productd, setProductd] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  // State cho biến thể sản phẩm đã chọn
  const [selectedVariant, setSelectedVariant] = useState(productd?.variants?.[0] || null)
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(null)
  const [selectedColor, setSelectedColor] = useState(productd?.colors?.[0])

  const handleColorChange = (color: any) => {
    setSelectedColor(color)
  }
  useEffect(() => {
    if (productd && productd.variants && productd.variants.length > 0) {
      // Tự động chọn variant đầu tiên có sẵn
      const defaultVariant = productd.variants[0];
      setSelectedVariant(defaultVariant);
      setSelectedVariantId(defaultVariant.variantId);
    }
  }, [productd]);
  useEffect(() => {
    if (productd && productd.colors && productd.colors.length > 0) {
      // Tự động chọn màu đầu tiên có sẵn
      setSelectedColor(productd.colors[0]);
    }
  }, [productd]);
  // State cho ảnh hiện tại
  const updateQuantity = (newQuantity: number) => {
    if (newQuantity < 1) return
    if (newQuantity > (selectedVariant?.stock ?? 0)) {
      toast.warning("Số lượng vượt quá tồn kho", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      })
      return
    }
    setQuantity(newQuantity)
  }
  const handleVariantChange = (variant: any) => {
    setSelectedVariant(variant)
    // Reset số lượng về 1 khi đổi biến thể
    setSelectedVariantId(variant.variantId)
    setQuantity(1)
  }

  useEffect(() => {
    try {
      const res = fetch(`http://localhost:5000/api/Product/Get-product-id?id=${id}`).then((res) => res.json())
        .then((data) => {
          setProductd(data.data)
          console.log(data.data)
        })
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu sản phẩm:", error)
      setProductd(null)
    } finally {
      setLoading(false)
    }
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!productd) {
    return <div>Product not found</div>
  }
  const mainImage = productd.productImages.find(img => img.is_primary === 1)?.imageUrl || "/placeholder.svg"
  const nonPrimaryImages = productd.productImages.filter(img => img.is_primary !== 1);

  // Xử lý logic hiển thị thumbnail
  let thumbImages: string[] = [];

  if (productd.productImages.length <= 1) {
    // Nếu chỉ có 1 ảnh hoặc ít hơn, sử dụng ảnh đó làm thumbnail
    thumbImages = productd.productImages.map(img => img.imageUrl);
  } else {
    // Nếu có nhiều hơn 1 ảnh
    if (mainImage) {
      // Thêm ảnh chính vào đầu mảng thumbnail
      thumbImages.push(mainImage);
    }

    // Thêm tối đa 3 ảnh ngẫu nhiên khác (không phải ảnh chính)
    const randomNonPrimaryImages = [...nonPrimaryImages]
      .sort(() => 0.5 - Math.random()) // Trộn ngẫu nhiên
      .slice(0, 3); // Lấy tối đa 3 ảnh

    thumbImages = [...thumbImages, ...randomNonPrimaryImages.map(img => img.imageUrl)];
  }


  function handleAddToCart(id: number) {
    const addToCart: AddToCartDto = {
      productID: id,
      quantity: quantity,
      variantID: selectedVariantId || 0,
      colorID: selectedColor?.colorId || 0
    }
    if (token) {
      fetch("http://localhost:5000/api/Cart/CreateNewCart", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(addToCart)
      }).then((res) => res.json()).then((data) => {
        toast.success("Thêm sản phẩm thành công", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
          onClose: () => refreshCart()
        })
      })
    }
    else {
      toast.warning("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      })
    }
  }
  // Giả lập sản phẩm liên quan


  return (
    <div className="container px-4 py-8 md:py-12">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-pink-500">
          Trang chủ
        </Link>
        <span className="mx-2">/</span>
        <Link href="/category/cham-soc-da" className="hover:text-pink-500">
          Chăm sóc da
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{productd.productName}</span>
      </div>

      {/* Product Info */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-lg border bg-gray-100">
            <Image
              src={`http://localhost:5000/${mainImage}`}
              alt={productd.productName}
              fill
              className="object-cover"
              priority
            />
            {productd.productDiscount > 0 && (
              <Badge className="absolute top-4 left-4 bg-red-500 hover:bg-red-600">-{productd.productDiscount}%</Badge>
            )}
          </div>
          <div className="grid grid-cols-4 gap-4">
            {thumbImages.length > 0 ? (
              thumbImages.map((image, index) => (
                <div
                  key={index}
                  className="relative aspect-square cursor-pointer overflow-hidden rounded-md border bg-gray-100"
                >
                  <Image
                    src={`http://localhost:5000/${image}` || "/placeholder.svg"}
                    alt={`${productd.productName} - Hình ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))

            ) : (
              <div className="relative aspect-square cursor-pointer overflow-hidden rounded-md border bg-gray-100">
                <Image
                  src="/placeholder.svg"
                  alt={`${productd.productName} - Hình 1`}
                  fill
                  className="object-cover"
                />
              </div>
            )}

          </div>
        </div>

        {/* Product Details */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{productd.productName}</h1>
          <div className="mb-6">
            {selectedVariant ? (
              // Hiển thị giá của variant được chọn
              productd.productDiscount > 0 ? (
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-red-500">
                    {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
                      selectedVariant.price - (selectedVariant.price * productd.productDiscount / 100)
                    )}
                  </span>
                  <span className="text-gray-500 line-through">
                    {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
                      selectedVariant.price
                    )}
                  </span>
                </div>
              ) : (
                <span className="text-2xl font-bold">
                  {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
                    selectedVariant.price
                  )}
                </span>
              )
            ) : (
              // Fallback khi chưa chọn variant nào
              productd.productDiscount > 0 ? (
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-red-500">
                    {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
                      productd.productPrice - (productd.productPrice * productd.productDiscount / 100)
                    )}
                  </span>
                  <span className="text-gray-500 line-through">
                    {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
                      productd.productPrice
                    )}
                  </span>
                </div>
              ) : (
                <span className="text-2xl font-bold">
                  {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
                    productd.productPrice
                  )}
                </span>
              )
            )}
          </div>

          <div className="mb-6">
            <h3 className="font-medium mb-2">Kích thước</h3>
            <div className="flex flex-wrap gap-2">
              {[...productd.variants]
                .sort((a, b) => {
                  // Lấy số từ variantName và chuyển đổi thành số
                  const sizeA = parseInt(a.variantName);
                  const sizeB = parseInt(b.variantName);
                  return sizeA - sizeB; // Sắp xếp tăng dần
                })
                .map((variant) => (
                  <Button
                    key={variant.variantId}
                    variant={selectedVariant?.variantId === variant.variantId ? "default" : "outline"}
                    className={
                      selectedVariant?.variantId === variant.variantId
                        ? "bg-pink-500 hover:bg-pink-600"
                        : "border-gray-300 hover:border-pink-500 hover:text-pink-500"
                    }
                    onClick={() => handleVariantChange(variant)}
                    disabled={variant.stock === 0}
                  >
                    {variant.variantName}
                    {variant.stock === 0 && " (Hết hàng)"}
                  </Button>
                ))}
            </div>
          </div>

          {/* Phần chọn màu sắc */}
          <div className="mb-6">
            <h3 className="font-medium mb-2">Màu sắc</h3>
            <div className="flex flex-wrap gap-3">
              {productd.colors.map((color) => (
                <button
                  key={color.colorId}
                  type="button"
                  className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${selectedColor?.colorId === color.colorId ? "border-pink-500" : "border-gray-200"
                    }`}
                  style={{ backgroundColor: color.colorCode }}
                  onClick={() => handleColorChange(color)}
                  title={color.colorName}
                >
                  {selectedColor?.colorId === color.colorId && <Check className="h-5 w-5 text-white" />}
                  {/* {color.stock === 0 && <div className="absolute w-12 h-0.5 bg-gray-500 rotate-45 rounded-full"></div>} */}
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-600 mt-2">Màu đã chọn: {selectedColor?.colorName}</p>
          </div>

          <div className="mb-4">
            <div className="flex items-center">
              <span className="text-sm font-medium mr-2">Tình trạng:</span>
              {selectedVariant && selectedVariant.stock > 0 ? (
                <span className="text-sm text-green-600">Còn hàng ({selectedVariant.stock} sản phẩm)</span>
              ) : (
                <span className="text-sm text-red-600">Hết hàng</span>
              )}
            </div>
            {selectedVariant && selectedVariant.stock <= 5 && selectedVariant.stock > 0 && (
              <p className="text-xs text-red-500 mt-1">Chỉ còn {selectedVariant.stock} sản phẩm, mua ngay kẻo hết!</p>
            )}
          </div>

          <div className="mb-6">
            <h3 className="font-medium mb-2">Số lượng</h3>
            <div className="flex items-center">
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-r-none"
                onClick={() => updateQuantity(quantity - 1)}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
                <span className="sr-only">Giảm</span>
              </Button>
              <div className="h-10 w-12 flex items-center justify-center border-y">{quantity}</div>
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-l-none"
                onClick={() => updateQuantity(quantity + 1)}
                disabled={selectedVariant ? quantity >= selectedVariant.stock : true}
              >
                <Plus className="h-4 w-4" />
                <span className="sr-only">Tăng</span>
              </Button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <Button onClick={(e) => { handleAddToCart(Number(id)); e.stopPropagation(); }} className="bg-pink-500 hover:bg-pink-600 h-12" size="lg">
              <ShoppingCart className="mr-2 h-5 w-5" />
              Thêm vào giỏ hàng
            </Button>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <div className="flex items-start gap-3 mb-3">
              <Truck className="h-5 w-5 text-pink-500 mt-0.5" />
              <div>
                <h4 className="font-medium">Miễn phí vận chuyển</h4>
                <p className="text-sm text-gray-600">Cho đơn hàng từ 500.000đ</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Share2 className="h-5 w-5 text-pink-500" />
              <span className="text-sm">Chia sẻ:</span>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                  <Facebook className="h-4 w-4" />
                  <span className="sr-only">Facebook</span>
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                  <Twitter className="h-4 w-4" />
                  <span className="sr-only">Twitter</span>
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                  <Instagram className="h-4 w-4" />
                  <span className="sr-only">Instagram</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Tabs */}
      <Tabs defaultValue="description" className="mb-12">
        <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 mb-6">
          <TabsTrigger
            value="description"
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-pink-500 data-[state=active]:text-pink-500 pb-2"
          >
            Mô tả
          </TabsTrigger>
          <TabsTrigger
            value="ingredients"
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-pink-500 data-[state=active]:text-pink-500 pb-2"
          >
            Thành phần
          </TabsTrigger>
          <TabsTrigger
            value="usage"
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-pink-500 data-[state=active]:text-pink-500 pb-2"
          >
            Hướng dẫn sử dụng
          </TabsTrigger>
        </TabsList>
        <TabsContent value="description" className="mt-0">
          <div className="space-y-4">
            <p>{productd.productDescription}</p>
          </div>
        </TabsContent>
        <TabsContent value="ingredients" className="mt-0">
          <p>{productd.ingredient}</p>
        </TabsContent>
        <TabsContent value="usage" className="mt-0">
          <p>{productd.userManual}</p>
        </TabsContent>
      </Tabs>


    </div>
  )
}

