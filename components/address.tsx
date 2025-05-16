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
import { Bounce, toast, ToastContainer } from "react-toastify"
import { MapPin, Plus } from "lucide-react"
import { Checkbox } from "@radix-ui/react-checkbox"
import { useAuth } from "@/app/context/AuthContext"
export default function AddressPage() {
    const [isAddingAddress, setIsAddingAddress] = useState(false)
    const [isEditingAddress, setIsEditingAddress] = useState(false)
    const editAddress = (address: any) => {
        setAddressForm(address)
        setIsEditingAddress(true)
    }
    const { user, token, refreshUser } = useAuth();
    const [addressForm, setAddressForm] = useState({
        name: user?.userName || "",
        phone: user?.phone || "",
        address: user?.address || ""
    })

    const handleAddressSubmit = async () => {
        if (token) {
            try {
                const response = await fetch("http://localhost:5000/api/User/UpdateUserAddress", {
                    method: "PUT",
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(addressForm),
                }).then((res) => res.json()).then((data) => {
                    if (data.status === 1) {
                        toast.success("Cập nhật thông tin địa chỉ thành công", {
                            position: "top-right",
                            autoClose: 2000,
                            hideProgressBar: false,
                            closeOnClick: false,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "light",
                            transition: Bounce,
                            onClose: () => {
                                setIsEditingAddress(false)
                                refreshUser(token)
                            }
                        })
                    }
                    else
                    {
                        toast.warning("Lỗi cập nhật thông tin"), {
                            position: "top-right",
                            autoClose: 1000,
                            hideProgressBar: false,
                            closeOnClick: false,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "light",
                            transition: Bounce,
                        }
                    }
                })
            }
            catch (err) {
                console.error("Error when updating user address:", err);
                toast.error("Có lỗi xảy ra khi cập nhật địa chỉ");
            }
        }
    };

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setAddressForm((prev) => ({ ...prev, [name]: value }))
    }
    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>Địa chỉ của tôi</CardTitle>
                        <CardDescription>Quản lý địa chỉ giao hàng và thanh toán</CardDescription>
                    </div>
                    {/* <Button
                        onClick={() => {
                            setAddressForm({
                                id: 0,
                                name: "",
                                phone: "",
                                address: "",
                                isDefault: false,
                            })
                            setIsAddingAddress(true)
                        }}
                        className="bg-pink-500 hover:bg-pink-600"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Thêm địa chỉ mới
                    </Button> */}
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                    <div key={user?.userID} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h3 className="font-medium">{user?.address ? "Địa chỉ mặc định" : "Địa chỉ"}</h3>
                                <p className="text-sm text-gray-500">Địa chỉ giao hàng & thanh toán</p>
                            </div>
                            {user?.address && (
                                <span className="text-xs bg-pink-100 text-pink-800 px-2 py-1 rounded-full">Mặc định</span>
                            )}
                        </div>
                        <div className="space-y-1 mb-4">
                            <p className="font-medium">{user?.userName}</p>
                            <p>{user?.address}</p>
                            <p>{user?.phone}</p>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => editAddress({
                                name: user?.userName || "",
                                phone: user?.phone || "",
                                address: user?.address || ""
                            })}>
                                Chỉnh sửa
                            </Button>
                            {/* <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50">
                                    Xóa
                                </Button> */}
                        </div>
                    </div>
                </div>

                {/* Dialog thêm địa chỉ mới */}
                <Dialog open={isAddingAddress} onOpenChange={setIsAddingAddress}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Thêm địa chỉ mới</DialogTitle>
                            <DialogDescription>Nhập thông tin địa chỉ mới của bạn</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleAddressSubmit}>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Họ tên</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        value={addressForm.name}
                                        onChange={handleAddressChange}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Số điện thoại</Label>
                                    <Input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        value={addressForm.phone}
                                        onChange={handleAddressChange}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="address">Địa chỉ đầy đủ</Label>
                                    <Textarea
                                        id="address"
                                        name="address"
                                        value={addressForm.address}
                                        onChange={(e) => setAddressForm((prev) => ({ ...prev, address: e.target.value }))}
                                        required
                                    />
                                </div>
                                {/* <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="isDefault"
                                        checked={addressForm.isDefault}
                                        onCheckedChange={(checked) =>
                                            setAddressForm((prev) => ({ ...prev, isDefault: checked as boolean }))
                                        }
                                    />
                                    <Label htmlFor="isDefault">Đặt làm địa chỉ mặc định</Label>
                                </div> */}
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsAddingAddress(false)}>
                                    Hủy
                                </Button>
                                <Button type="submit" className="bg-pink-500 hover:bg-pink-600">
                                    Lưu địa chỉ
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Dialog chỉnh sửa địa chỉ */}
                <Dialog open={isEditingAddress} onOpenChange={setIsEditingAddress}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Chỉnh sửa địa chỉ</DialogTitle>
                            <DialogDescription>Cập nhật thông tin địa chỉ của bạn</DialogDescription>
                        </DialogHeader>
                        {/* <form onSubmit={handleAddressSubmit}> */}
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-name">Họ tên</Label>
                                <Input
                                    id="edit-name"
                                    name="name"
                                    value={addressForm.name}
                                    onChange={handleAddressChange}
                                    required
                                    disabled
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-phone">Số điện thoại</Label>
                                <Input
                                    id="edit-phone"
                                    name="phone"
                                    type="tel"
                                    value={addressForm.phone}
                                    onChange={handleAddressChange}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-address">Địa chỉ đầy đủ</Label>
                                <Textarea
                                    id="edit-address"
                                    name="address"
                                    value={addressForm.address}
                                    onChange={(e) => setAddressForm((prev) => ({ ...prev, address: e.target.value }))}
                                    required
                                />
                            </div>
                            {/* <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="edit-isDefault"
                                        checked={addressForm.isDefault}
                                        onCheckedChange={(checked) =>
                                            setAddressForm((prev) => ({ ...prev, isDefault: checked as boolean }))
                                        }
                                    />
                                    <Label htmlFor="edit-isDefault">Đặt làm địa chỉ mặc định</Label>
                                </div> */}
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsEditingAddress(false)}>
                                Hủy
                            </Button>
                            <Button onClick={handleAddressSubmit} type="button" className="bg-pink-500 hover:bg-pink-600">
                                Lưu thay đổi
                            </Button>
                        </DialogFooter>
                        {/* </form> */}
                    </DialogContent>
                </Dialog>
            </CardContent>
        </Card>
    )
}