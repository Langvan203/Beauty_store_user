import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { MapPin, Pencil, Plus } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useAuth } from "@/app/context/AuthContext"
import { Order } from "@/app/types/order"
import { useOrder } from "@/app/context/OrderContext"
import { Bounce, toast } from "react-toastify"
export default function OverViewPage() {
    const { user, updateUserInfo } = useAuth();
    const formatDate = (dateString: string | undefined) => {
        if (dateString) {
            const date = new Date(dateString);
            return new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date);
        }
    };
    const [isEditingProfile, setIsEditingProfile] = useState(false)
    const [activeTab, setActiveTab] = useState("overview")
    const { order, orderItems, orderItemsDetail, getOrderDetails } = useOrder();
    const viewOrderDetails = (id: number) => {
        getOrderDetails(id);
    }
    const [selectedOrder, setSelectedOrder] = useState<any>(null)
    const [lastOrder, setLastOrder] = useState<Order[]>([])

    const [formData, setFormData] = useState({
        userName: "",
        email: "",
        phone: "",
        dateOfBirth: "",
        gender: 1
    });
    const formatDateForInput = (dateString: string | undefined) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    };
    useEffect(() => {
        if (isEditingProfile && user) {
            setFormData({
                userName: user.userName || "",
                email: user.email || "",
                phone: user.phone || "",
                dateOfBirth: formatDateForInput(user.dateOfBirth),
                gender: user.gender || 1
            });
        }
    }, [isEditingProfile, user]);
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    const handleGenderChange = (value: string) => {
        const genderMap: Record<string, number> = {
            "female": 1,
            "male": 2,
            "other": 3
        };
        setFormData(prev => ({
            ...prev,
            gender: genderMap[value]
        }));
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // Format date to ISO string for API
            const formattedDate = formData.dateOfBirth ?
                new Date(formData.dateOfBirth).toISOString() : undefined;

            const updateData = {
                userName: formData.userName,
                phone: formData.phone,
                dateOfBirth: formattedDate,
                gender: formData.gender
            };

            const success = await updateUserInfo(updateData);

            if (success) {
                // Show success message
                toast.success(`Cập nhật thông tin cá nhân thành công`, {
                    position: "top-right",
                    autoClose: 500,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    transition: Bounce,
                })
                setIsEditingProfile(false);
                // You may want to add toast notification here
            } else {
                // Show error message
                // You may want to add toast notification here
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            // Show error message
        }
    };
    console.log(orderItemsDetail);
    useEffect(() => {
        setLastOrder(order.slice(0, 2))
    }, [order])

    return (
        <Card>
            <CardHeader>
                <CardTitle>Tổng quan tài khoản</CardTitle>
                <CardDescription>Xem thông tin tài khoản và hoạt động gần đây của bạn</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        {isEditingProfile ? (
                            <form onSubmit={handleSubmit}>
                                <h3 className="text-lg font-medium mb-4">Cập nhật thông tin cá nhân</h3>
                                <div className="space-y-2">

                                    <div className="space-y-2">
                                        <Label htmlFor="userName">Họ và tên</Label>
                                        <Input
                                            id="userName"
                                            name="userName"
                                            required
                                            value={formData.userName}
                                            onChange={handleInputChange}
                                        />
                                    </div>


                                    {/* <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            required
                                            onChange={handleInputChange}
                                        />
                                    </div> */}
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Số điện thoại</Label>
                                        <Input
                                            id="phone"
                                            name="phone"
                                            type="tel"
                                            value={formData.phone}
                                            required
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="dateOfBirth">Ngày sinh</Label>
                                        <Input
                                            id="dateOfBirth"
                                            name="dateOfBirth"
                                            type="date"
                                            value={formData.dateOfBirth}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Giới tính</Label>
                                        <RadioGroup
                                            value={formData.gender === 1 ? "female" : formData.gender === 2 ? "male" : "other"}
                                            className="flex space-x-4"
                                            onValueChange={handleGenderChange}
                                        >
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="female" id="female" />
                                                <Label htmlFor="female">Nam</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="male" id="male" />
                                                <Label htmlFor="male">Nữ</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="other" id="other" />
                                                <Label htmlFor="other">Khác</Label>
                                            </div>
                                        </RadioGroup>
                                    </div>
                                    <div className="flex gap-2 pt-2">
                                        <Button type="submit" className="bg-pink-500 hover:bg-pink-600">
                                            Lưu thay đổi
                                        </Button>
                                        <Button type="button" variant="outline" onClick={() => setIsEditingProfile(false)}>
                                            Hủy
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        ) : (
                            <>
                                <h3 className="text-lg font-medium mb-4">Thông tin cá nhân</h3>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-sm text-gray-500">Họ và tên</p>
                                        <p>{user?.userName}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Email</p>
                                        <p>{user?.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Số điện thoại</p>
                                        <p>{user?.phone}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Ngày sinh</p>
                                        <p>
                                            {user?.dateOfBirth ? formatDate(user?.dateOfBirth) : "Chưa cập nhật"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Giới tính</p>
                                        <p>
                                            {user?.gender === 1 ? "Nam" : user?.gender === 2 ? "Nữ" : "Khác"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Địa chỉ mặc định</p>
                                        <p>{user?.address}</p>
                                    </div>
                                </div>
                                <Button variant="outline" className="mt-4" onClick={() => setIsEditingProfile(true)}>
                                    <Pencil className="h-4 w-4 mr-2" />
                                    Cập nhật thông tin
                                </Button>
                            </>
                        )}
                    </div>

                    <div>
                        <h3 className="text-lg font-medium mb-4">Đơn hàng gần đây</h3>
                        {lastOrder.map((order) => (
                            <div key={order.orderID} className="mb-4 p-4 border rounded-lg">
                                <div className="flex justify-between mb-2">
                                    <p className="font-medium">{`ORD-${order.orderID}`}</p>
                                    <p className="text-sm text-gray-500">{formatDate(order.orderDate)}</p>
                                </div>
                                <div className="flex justify-between mb-2">
                                    <p className="text-sm text-gray-500">{order.items.length} sản phẩm</p>
                                    <p className="font-medium">
                                        {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(order.totalAmount)}
                                    </p>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className={`text-sm px-2 py-1 bg-green-100 rounded-full
                                        ${order.status === "Đang chờ xử lý"
                                            ? "bg-slate-400"
                                            : order.status === "Đang giao hàng"
                                                ? "bg-orange-400"
                                                : order.status === "Đã hoàn thành"
                                                    ? "bg-green-400"
                                                    : order.status === "Đã hủy"
                                                        ? "bg-red-400"
                                                        : "bg-slate-700"
                                        }`}>
                                        {order.status}
                                    </span>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-pink-500 hover:text-pink-600"
                                                onClick={() => viewOrderDetails(order.orderID)}
                                            >
                                                Xem chi tiết
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-3xl">
                                            <DialogHeader>
                                                <DialogTitle>Chi tiết đơn hàng #{order.orderID}</DialogTitle>
                                                <DialogDescription>
                                                    Đặt hàng ngày {formatDate(order.orderDate)} - {order.status}
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="space-y-4 my-4">
                                                <h4 className="font-medium">Sản phẩm</h4>
                                                <div className="space-y-4">
                                                    {orderItemsDetail.map((item) => (
                                                        <div key={item.orderItemID} className="flex gap-4">
                                                            <div className="relative w-16 h-16 flex-shrink-0">
                                                                <Image
                                                                    src={`http://localhost:5000/${item.productImage.replace('/\\/g', '/')}`}
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
                                                            order.totalAmount,
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                            <DialogFooter>
                                                <Button variant="outline">Mua lại</Button>
                                                <Link href={`/account/orders/${order.orderID}`}>
                                                    <Button className="bg-pink-500 hover:bg-pink-600">Xem đầy đủ</Button>
                                                </Link>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}