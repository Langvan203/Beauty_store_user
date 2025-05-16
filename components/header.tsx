"use client"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, Search, ShoppingCart, User, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/app/context/AuthContext"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ToastProvider } from "@radix-ui/react-toast"
import { Bounce, toast, ToastContainer } from "react-toastify"
import { useRouter } from "next/navigation"
import { Cart, CartItem } from "@/app/types/cart";
import { useCart } from "@/app/context/CartContext"
import { variants } from "@/app/types/product";

interface categorytop {
  categoryID: number;
  name: string;
  description: string;
  thumbNail: string | null;
  createdDate: string;
  updatedDate: string | null;
};

interface Product {
  productID: number;
  productName: string;
  categoryName: string;
  brandName: string;
  productDescription: string;
  productPrice: number;
  productStock: number;
  productDiscount: number;
  productImages: string;
  createdDate: string;
  updatedDate: string;
  variants: variants[];
}

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [categories, setCategories] = useState<categorytop[]>([])
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const searchRef = useRef<HTMLDivElement>(null);
  
  const router = useRouter()
  const { user, refreshUser, logout, token } = useAuth();
  const {cartItems, cart} = useCart();

  // Fetch categories
  useEffect(() => {
    fetch("http://localhost:5000/api/Category/Get-top-categories?number=3")
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 1 && data.data) {
          setCategories(data.data)
        }
      })
      .catch((error) => console.error("Lỗi fetch danh mục:", error))
  }, [])
  
  // Fetch all products for search functionality
  useEffect(() => {
    fetch("http://localhost:5000/api/Product/Get-all-product")
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 1 && data.data) {
          setAllProducts(data.data)
        }
      })
      .catch((error) => console.error("Lỗi fetch sản phẩm:", error))
  }, [])
  
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value.trim() === "") {
      setSearchResults([]);
    } else {
      const filtered = allProducts.filter(product => 
        product.productName.toLowerCase().includes(value.toLowerCase())
      );
      setSearchResults(filtered.slice(0, 5)); // Limit to 5 results
    }
  };
  
  // Close search results when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchResults([]);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  const handleLogout = () => {
    // Thực hiện logic đăng xuất, ví dụ: xóa token, chuyển hướng, v.v.
    toast.info('Đã đăng xuất tài khoản', {
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
        logout();
        router.push("/auth/login")
      },
    });
  };
  
  const slugify = (str: string) =>
    str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // bỏ dấu tiếng Việt
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "")

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-6 md:gap-8 lg:gap-10">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <nav className="grid gap-6 text-lg font-medium">
                <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
                  <Image
                    src="/logokimvu.png?height=40&width=120&text=Cocolux"
                    alt="Cocolux"
                    width={120}
                    height={40}
                  />
                </Link>
                <Link href="/" className="hover:text-pink-500 transition-colors">
                  Trang chủ
                </Link>
                <Link href="/products" className="hover:text-pink-500 transition-colors">
                  Sản phẩm
                </Link>
                {categories.map((categorytop) => (
                  <Link
                    key={categorytop.categoryID}
                    href={`/category/${categorytop.categoryID}`}
                    className="hover:text-pink-500 transition-colors"
                  >
                    {categorytop.name}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
            <Image src="/logokimvu.png?height=40&width=120&text=Cocolux" style={{ height: 100 }} alt="Cocolux" width={120} height={40} />
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium hover:text-pink-500 transition-colors">
              Trang chủ
            </Link>
            <Link href="/products" className="text-sm font-medium hover:text-pink-500 transition-colors">
              Sản phẩm
            </Link>
            {categories.map((categorytop) => (
              <Link
                key={categorytop.categoryID}
                href={`/category/${categorytop.categoryID}`}
                className="text-sm font-medium hover:text-pink-500 transition-colors"
              >
                {categorytop.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div ref={searchRef} className="relative">
            {isSearchOpen ? (
              <div className="flex items-center">
                <Input 
                  type="search" 
                  placeholder="Tìm kiếm sản phẩm..." 
                  className="w-[200px] md:w-[300px]" 
                  autoFocus 
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                <Button variant="ghost" size="icon" onClick={() => {
                  setIsSearchOpen(false)
                  setSearchTerm("")
                  setSearchResults([])
                }}>
                  <X className="h-5 w-5" />
                  <span className="sr-only">Đóng tìm kiếm</span>
                </Button>
              </div>
            ) : (
              <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)}>
                <Search className="h-5 w-5" />
                <span className="sr-only">Tìm kiếm</span>
              </Button>
            )}
            
            {/* Kết quả tìm kiếm */}
            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-md shadow-lg overflow-hidden z-50">
                <div className="max-h-80 overflow-y-auto">
                  {searchResults.map(product => (
                    <Link 
                      href={`/products/${product.productID}`} 
                      key={product.productID}
                      className="flex items-center p-2 hover:bg-gray-100"
                      onClick={() => {
                        setSearchTerm("")
                        setSearchResults([])
                        setIsSearchOpen(false)
                      }}
                    >
                      <div className="flex-shrink-0 h-10 w-10 relative overflow-hidden rounded">
                        <Image
                          src={`http://localhost:5000/${product.productImages}`}
                          alt={product.productName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="ml-3 flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {product.productName}
                        </p>
                        <p className="text-xs text-red-500">
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(
                            product.variants && product.variants.length > 0
                              ? product.variants[0].price - 
                                (product.productDiscount > 0 
                                  ? product.variants[0].price * (product.productDiscount/100) 
                                  : 0)
                              : product.productPrice - 
                                (product.productDiscount > 0 
                                  ? product.productPrice * (product.productDiscount/100) 
                                  : 0)
                          )}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
                <div className="p-2 bg-gray-50 border-t">
                  <Button 
                    variant="outline" 
                    className="w-full text-pink-500 hover:text-pink-600"
                    onClick={() => {
                      router.push("/products")
                      setSearchTerm("")
                      setSearchResults([])
                      setIsSearchOpen(false)
                    }}
                  >
                    Xem tất cả sản phẩm
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                  <span className="sr-only">Tài khoản</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Link href="/account">
                    Quản lý tài khoản
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  Đăng xuất
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/auth/login">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
                <span className="sr-only">Tài khoản</span>
              </Button>
            </Link>
          )}
          {user != null ? (
            <Link href={`/cart/${cart?.cartID}`}>
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-pink-500">
                  {cartItems.length}
                </Badge>
                <span className="sr-only">Giỏ hàng</span>
              </Button>
            </Link>
          ) : (
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-pink-500">
                  0
                </Badge>
                <span className="sr-only">Giỏ hàng</span>
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}