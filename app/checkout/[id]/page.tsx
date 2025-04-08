"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, CreditCard, Landmark, Truck } from "lucide-react"
import { useSearchParams } from "next/navigation" // Added to access query params

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCart } from "../../context/CartContext"
import { useAuth } from "../../context/AuthContext"
import { useParams, useRouter } from "next/navigation"
import { CheckOutDto } from "@/app/types/cart"
import { Bounce, toast } from "react-toastify"

interface Province {
  code: number;
  codename: string;
  name: string;
  phone_code: number;
  division_type: string;
  districts: []
}

interface District {
  code: number;
  codename: string;
  division_type: string;
  province_code: number;
  name: string;
  wards: []
}

interface Ward {
  code: number;
  codename: string;
  division_type: string;
  province_code: number;
  name: string;
}

const BASE_API_URL = "https://provinces.open-api.vn/api"

export default function CheckoutPage() {
  const params = useParams();
  const { id } = params;
  const searchParams = useSearchParams(); // Get URL search params
  const [paymentProcessed, setPaymentProcessed] = useState(false);
  // Giả lập dữ liệu giỏ hàng
  const { cartItems, cart, refreshCart, removeCart, checkout } = useCart();
  const subtotal = cartItems.reduce((total, item) => total + item.subTotal, 0);
  const shipping = subtotal > 500000 ? 0 : 30000;
  const total = Number(cart?.totalPrice) + shipping;
  const { token, user } = useAuth();

  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const router = useRouter();
  const [address, setAdress] = useState('')
  const [fisrtName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  
  // Check VNPAY payment result on component mount
  useEffect(() => {
    if (paymentProcessed) return;
    // Process VNPAY payment result if available in URL
    const vnp_ResponseCode = searchParams.get('vnp_ResponseCode');
    const signature_valid = searchParams.get('signature_valid');
    if (vnp_ResponseCode) {
      setPaymentProcessed(true);
      // VNPAY payment was attempted, check result
      if (vnp_ResponseCode === '00' && signature_valid === 'true') {
        // Payment successful
        const data = {
          shippingAdress: address,
          receiverName: fisrtName + " " + lastName,
          phoneNumber: phone,
          paymentMethod: "VNPAY",
          shippingMethod: "Giao hàng tiêu chuẩn",
        };
        const token = sessionStorage.getItem("token") || "";
        checkout(data, token);
        router.replace(`/checkout/${id}`);
        toast.success("Thanh toán thành công! Đơn hàng của bạn đã được đặt.", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
          onClose: () => {
            // Clear payment params from URL and refresh cart
            router.push("/products");
            refreshCart();
          },
        });
      } else {
        // Payment failed
        toast.error("Thanh toán không thành công. Vui lòng thử lại hoặc chọn phương thức thanh toán khác.", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    }
  }, [searchParams, checkout, address, fisrtName, lastName, phone, router, refreshCart]);
  
  function splitFullName(fullName: string) {
    const parts = fullName.trim().split(/\s+/);
    const firstNamePart = parts[0] || "";
    const lastNamePart = parts.slice(1).join(" ") || "";
    return { firstName: firstNamePart, lastName: lastNamePart };
  }
  
  useEffect(() => {
    if (user) {
      setEmail(user.email || "rỗng");
      setPhone(user.phone || "rỗng");
      setAdress(user.address || "rỗng");
      const { firstName, lastName } = splitFullName(user.userName);
      setFirstName(firstName);
      setLastName(lastName);
    }
  }, [user]);
  
  const handleCheckout = async () => {
    // Validate required fields
    if (!fisrtName || !lastName || !phone || !address) {
      toast.error("Vui lòng điền đầy đủ thông tin giao hàng.", {
        position: "top-right",
        autoClose: 1000,
      });
      return;
    }
    
    if (paymentMethod === "bank") {
      // Khi chọn chuyển khoản ngân hàng (VNPAY)
      const payload = {
        amount: total, // tổng số tiền cần thanh toán
        orderDescription: `Thanh toán cho đơn hàng: ${id}`, // nối với mã đơn hàng (cartId)
        orderType: "other", // hoặc giá trị phù hợp theo hệ thống của bạn
        language: "vn",
        bankCode: "",
        id: id // Nếu có giao diện chọn ngân hàng, bạn có thể thay đổi giá trị này
      };
      try {
        const response = await fetch("/api/create_payment_url", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
        const data = await response.json();
        if (data.paymentUrl) {
          // Chuyển hướng người dùng tới URL thanh toán của VNPAY
          window.location.href = data.paymentUrl;
        } else {
          console.error("Không nhận được paymentUrl từ API");
          toast.error("Có lỗi xảy ra, vui lòng thử lại");
        }
      } catch (error) {
        console.error("Lỗi tạo URL thanh toán:", error);
        toast.error("Có lỗi xảy ra, vui lòng thử lại");
      }
    } else {
      // Nếu chọn thanh toán COD (thanh toán khi nhận hàng)
      const data: CheckOutDto = {
        shippingAdress: address,
        receiverName: fisrtName + " " + lastName,
        phoneNumber: phone,
        paymentMethod: "COD",
        shippingMethod: "Giao hàng tiêu chuẩn",
      };
      const token = sessionStorage.getItem("token") || "";
      checkout(data, token);
      toast.success("Đặt hàng thành công", {
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
          refreshCart();
          router.push("/products");
        },
      });
    }
  };

  // State cho phương thức thanh toán
  const [paymentMethod, setPaymentMethod] = useState("cod")

  // --- State cho địa chỉ ---
  const [provinces, setProvinces] = useState<Province[]>([])
  const [districts, setDistricts] = useState<District[]>([])
  const [wards, setWards] = useState<Ward[]>([])

  const [selectedProvince, setSelectedProvince] = useState<string>("")
  const [selectedDistrict, setSelectedDistrict] = useState<string>("")
  const [selectedWard, setSelectedWard] = useState<string>("")

  // Fetch danh sách tỉnh khi component mount
  useEffect(() => {
    async function fetchProvinces() {
      try {
        const res = await fetch(`${BASE_API_URL}/p/`)
        const data = await res.json()
        // API trả về mảng các tỉnh trực tiếp (hoặc có thể cần điều chỉnh theo cấu trúc)
        setProvinces(data)
      } catch (error) {
        console.error("Lỗi lấy danh sách tỉnh:", error)
      }
    }
    fetchProvinces()
  }, [])

  // Khi chọn tỉnh, lấy danh sách huyện của tỉnh đó và reset các lựa chọn sau
  useEffect(() => {
    async function fetchDistricts() {
      if (!selectedProvince) {
        setDistricts([])
        return
      }
      try {
        const res = await fetch(`${BASE_API_URL}/p/${selectedProvince}?depth=2`)
        const data = await res.json()
        // data.districts chứa danh sách huyện của tỉnh được chọn
        setDistricts(data.districts || [])
      } catch (error) {
        console.error("Lỗi lấy danh sách huyện:", error)
      }
    }
    fetchDistricts()
    // Reset huyện và xã khi tỉnh thay đổi
    setSelectedDistrict("")
    setWards([])
    setSelectedWard("")
  }, [selectedProvince])

  // Khi chọn huyện, lấy danh sách xã của huyện đó và reset xã
  useEffect(() => {
    async function fetchWards() {
      if (!selectedDistrict) {
        setWards([])
        return
      }
      try {
        const res = await fetch(`${BASE_API_URL}/d/${selectedDistrict}?depth=2`)
        const data = await res.json()
        // data.wards chứa danh sách xã của huyện được chọn
        setWards(data.wards || [])
      } catch (error) {
        console.error("Lỗi lấy danh sách xã:", error)
      }
    }
    fetchWards()
    setSelectedWard("")
  }, [selectedDistrict])

  return (
    <div className="container px-4 py-8 md:py-12">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Thanh toán</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Thông tin giao hàng */}
          {user ? (
            <div>
              <h2 className="text-xl font-semibold mb-4">Thông tin giao hàng</h2>
              <div className="grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Họ</Label>
                    <Input value={fisrtName || ""} onChange={(e) => setFirstName(e.target.value)} id="firstName" placeholder="Nhập họ" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Tên</Label>
                    <Input  value={lastName || ""} onChange={(e) => setLastName(e.target.value)} id="lastName" placeholder="Nhập tên" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Số điện thoại</Label>
                  <Input id="phone" value={phone || ""} onChange={(e) => setPhone(e.target.value)} placeholder="Nhập số điện thoại" type="tel" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={email || ""} onChange={(e) => setEmail(e.target.value)} placeholder="Nhập email" type="email" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="province">Tỉnh/Thành phố</Label>
                    <Select
                      value={selectedProvince}
                      onValueChange={(value) => setSelectedProvince(value)}
                    >
                      <SelectTrigger id="province">
                        <SelectValue placeholder="Chọn tỉnh/thành phố" />
                      </SelectTrigger>
                      <SelectContent>
                        {provinces.map((province) => (
                          <SelectItem key={province.code} value={province.code.toString() || ""}>
                            {province.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="district">Quận/Huyện</Label>
                    <Select
                      value={selectedDistrict}
                      onValueChange={(value) => setSelectedDistrict(value)}
                    >
                      <SelectTrigger id="district">
                        <SelectValue placeholder="Chọn quận/huyện" />
                      </SelectTrigger>
                      <SelectContent>
                        {districts.map((district) => (
                          <SelectItem key={district.code} value={district.code.toString() || ""}>
                            {district.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="wards">Xã/Xóm</Label>
                    <Select
                      value={selectedWard}
                      onValueChange={(value) => setSelectedWard(value)}
                    >
                      <SelectTrigger id="wards">
                        <SelectValue placeholder="Chọn xã/xóm" />
                      </SelectTrigger>
                      <SelectContent>
                        {wards.map((ward) => (
                          <SelectItem key={ward.code} value={ward.code.toString() || ""}>
                            {ward.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Địa chỉ</Label>
                  <Input value={address || ""} onChange={(e) => setAdress(e.target.value)} id="address" placeholder="Nhập địa chỉ" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="note">Ghi chú</Label>
                  <Textarea
                    id="note"
                    placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn."
                  />
                </div>
              </div>
            </div>
          ) : (
            // Khi người dùng chưa đăng nhập, render giao diện trống
            <div>
              <h2 className="text-xl font-semibold mb-4">Thông tin giao hàng</h2>
              <div className="grid gap-4">
                {/* Các trường input tương tự, nhưng không có giá trị mặc định */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Họ</Label>
                    <Input id="firstName" placeholder="Nhập họ" onChange={(e) => setFirstName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Tên</Label>
                    <Input id="lastName" placeholder="Nhập tên" onChange={(e) => setLastName(e.target.value)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Số điện thoại</Label>
                  <Input id="phone" placeholder="Nhập số điện thoại" type="tel" onChange={(e) => setPhone(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" placeholder="Nhập email" type="email" onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="province">Tỉnh/Thành phố</Label>
                    <Select
                      value={selectedProvince}
                      onValueChange={(value) => setSelectedProvince(value)}
                    >
                      <SelectTrigger id="province">
                        <SelectValue placeholder="Chọn tỉnh/thành phố" />
                      </SelectTrigger>
                      <SelectContent>
                        {provinces.map((province) => (
                          <SelectItem key={province.code} value={province.code.toString() || ""}>
                            {province.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="district">Quận/Huyện</Label>
                    <Select
                      value={selectedDistrict}
                      onValueChange={(value) => setSelectedDistrict(value)}
                    >
                      <SelectTrigger id="district">
                        <SelectValue placeholder="Chọn quận/huyện" />
                      </SelectTrigger>
                      <SelectContent>
                        {districts.map((district) => (
                          <SelectItem key={district.code} value={district.code.toString() || ""}>
                            {district.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="wards">Xã/Xóm</Label>
                    <Select
                      value={selectedWard}
                      onValueChange={(value) => setSelectedWard(value)}
                    >
                      <SelectTrigger id="wards">
                        <SelectValue placeholder="Chọn xã/xóm" />
                      </SelectTrigger>
                      <SelectContent>
                        {wards.map((ward) => (
                          <SelectItem key={ward.code} value={ward.code.toString() || ""}>
                            {ward.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Địa chỉ</Label>
                  <Input id="address" placeholder="Nhập địa chỉ" onChange={(e) => setAdress(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="note">Ghi chú</Label>
                  <Textarea
                    id="note"
                    placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Phương thức vận chuyển */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Phương thức vận chuyển</h2>
            <RadioGroup defaultValue="standard" className="space-y-3">
              <div className="flex items-center space-x-2 border p-4 rounded-lg">
                <RadioGroupItem value="standard" id="standard" />
                <Label htmlFor="standard" className="flex items-center gap-2 cursor-pointer">
                  <Truck className="h-5 w-5 text-pink-500" />
                  <div>
                    <div>Giao hàng tiêu chuẩn</div>
                    <div className="text-sm text-gray-500">Nhận hàng trong 3-5 ngày</div>
                  </div>
                </Label>
                <div className="ml-auto font-medium">
                  {shipping === 0 ? (
                    <span className="text-green-500">Miễn phí</span>
                  ) : (
                    <span>
                      {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(shipping)}
                    </span>
                  )}
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Phương thức thanh toán */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Phương thức thanh toán</h2>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
              <div className="flex items-center space-x-2 border p-4 rounded-lg">
                <RadioGroupItem value="cod" id="cod" />
                <Label htmlFor="cod" className="flex items-center gap-2 cursor-pointer">
                  <div className="h-5 w-5 flex items-center justify-center bg-pink-100 text-pink-500 rounded">
                    <span className="text-xs font-bold">₫</span>
                  </div>
                  <div>Thanh toán khi nhận hàng (COD)</div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 border p-4 rounded-lg">
                <RadioGroupItem value="bank" id="bank" />
                <Label htmlFor="bank" className="flex items-center gap-2 cursor-pointer">
                  <Landmark className="h-5 w-5 text-pink-500" />
                  <div>Chuyển khoản ngân hàng (VNPAY)</div>
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <div>
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4">Đơn hàng của bạn</h2>

              <div className="space-y-4 mb-4">
                {cartItems.map((item) => (
                  <div key={item.cart_ItemID} className="flex gap-3">
                    <div className="relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden border">
                      <Image src={`http://localhost:5000/${item.productImage.replace(/\\/g, "/")}` || "/placeholder.svg"} alt={item.productName} fill className="object-cover" />
                      <div className="absolute top-0 right-0 bg-gray-800 text-white text-xs w-5 h-5 flex items-center justify-center rounded-bl-md">
                        {item.quantity}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium line-clamp-1">{item.productName}</h4>
                      <p className="text-xs text-gray-500">{item.variant}ml</p>
                      <p className="text-xs text-gray-500">{ }</p>
                      <div className="mt-1">
                        {item.discount > 0 ? (
                          <div className="flex items-center">
                            <span className="text-sm font-medium text-red-500">
                              {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(item.subTotal)}
                            </span>
                            <span className="text-xs text-gray-500 line-through ml-1">
                              {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(item.price * item.quantity)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm font-medium">
                            {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(item.price * item.quantity)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tạm tính</span>
                  <span>{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(subtotal)}</span>
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
                  <span>{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(total)}</span>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <Button onClick={handleCheckout} className="w-full bg-pink-500 hover:bg-pink-600 h-11">Đặt hàng</Button>
                <Link href={`/cart/${id}`}>
                  <Button variant="outline" className="w-full mt-3">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Quay lại giỏ hàng
                  </Button>
                </Link>
              </div>

              <div className="mt-6 text-xs text-gray-500">
                <p>
                  Bằng cách đặt hàng, bạn đồng ý với{" "}
                  <Link href="/policy/terms" className="text-pink-500 hover:underline">
                    Điều khoản dịch vụ
                  </Link>{" "}
                  và{" "}
                  <Link href="/policy/privacy" className="text-pink-500 hover:underline">
                    Chính sách bảo mật
                  </Link>{" "}
                  của Cocolux.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}