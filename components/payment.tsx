

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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
import { useState } from "react"
import { CreditCard, Plus } from "lucide-react"
import { Checkbox } from "@radix-ui/react-checkbox"
import { usePayment } from "@/app/context/PaymentMethod"
import { useAuth } from "@/app/context/AuthContext"

export default function PaymentPage() {
    const [isAddingPayment, setIsAddingPayment] = useState(false);
    const [paymentForm, setPaymentForm] = useState({
        paymentType: 0,
        paymentName: "",
        cvv: "",
        cardNumber: "",
        outerDateUsing: "",
    });
    const cardTypes: Record<string, string> = {
        "1": "Visa",
        "2": "Mastercard",
        "3": "JCB",
        "4": "American Express",
    };
    const [selectedDate, setSelectedDate] = useState(null);
    const { payment, refreshPayment } = usePayment();
    const { user, token } = useAuth();
    const handleDateChange = (date: any) => {
        setSelectedDate(date);
        if (date) {
            const formattedDate = date.toISOString().split("T")[0]; // Định dạng "YYYY-MM-DD"
            setPaymentForm((prev) => ({ ...prev, outerDateUsing: formattedDate }));
        } else {
            setPaymentForm((prev) => ({ ...prev, outerDateUsing: "" }));
        }
    };
    const handlePaymentChange = (e: any) => {
        const { name, value } = e.target;
        setPaymentForm((prev) => ({ ...prev, [name]: value }));
    };
    const formatExpiryForInput = (isoDate: any) => {
        if (!isoDate) return "";
        const date = new Date(isoDate);
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear().toString().slice(-2);
        return `${month}/${year}`;
    };

    const handleCardTypeChange = (value: any) => {
        setPaymentForm((prev) => ({
            ...prev,
            paymentType: value,
            paymentName: cardTypes[value], // Lấy tên từ mapping
        }));
    };


    const handleExpiryDateChange = (e: any) => {
        const { value } = e.target; // value theo định dạng "MM/YY"

        // Kiểm tra định dạng đúng MM/YY
        if (!/^\d{1,2}\/\d{2}$/.test(value)) {
            setPaymentForm(prev => ({ ...prev, outerDateUsing: value }));
            return;
        }

        const [month, year] = value.split("/");

        // Lấy ngày hiện tại
        const currentDate = new Date();
        const day = currentDate.getDate();

        // Tạo ngày hết hạn với định dạng YYYY/MM/DD
        const fullYear = "20" + year;
        const formattedMonth = month.padStart(2, "0");
        const formattedDay = day.toString().padStart(2, "0");

        const formattedDate = `${fullYear}/${formattedMonth}/${formattedDay}`;

        setPaymentForm(prev => ({ ...prev, outerDateUsing: formattedDate }));
    };
    const formatDate = (dateString: string | undefined) => {
        if (dateString) {
            const date = new Date(dateString);
            return new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date);
        }
    };

    const handlePaymentSubmit = () => {
        try {
            const response = fetch("http://localhost:5000/api/PaymentMethod/Create-new-paymentmethod", {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(paymentForm),
            }).then((res) => res.json()).then((res) => {
                if(res.status === 1)
                {
                    toast.success("Xóa phương thức thanh toán thành công", {
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
                            refreshPayment()
                            setIsAddingPayment(false);
                        } 
                    })
                }
                else {
                    toast.success("Có lỗi xảy ra khi thêm phương thức thanh toán", {
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
            });
        } catch (error) {
            console.error("Error adding payment method:", error);
        }
    };

    const handleDeletePayment = async (type: number) => {
        try {
            const response = await fetch(`http://localhost:5000/api/PaymentMethod/Delete-paymentmethod?PaymentMethodType=${type}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.ok) {
                toast.success("Xóa phương thức thanh toán thành công", {
                    position: "top-right",
                    autoClose: 1000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    transition: Bounce,
                    onClose: () => refreshPayment()
                })
            } else {
                toast.success("Có lỗi xảy ra khi xóa phương thức thanh toán", {
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
        } catch (error) {
            console.error("Error deleting payment method:", error);
        }
    }
    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>Phương thức thanh toán</CardTitle>
                        <CardDescription>Quản lý thẻ và phương thức thanh toán của bạn</CardDescription>
                    </div>
                    <Button
                        onClick={() => {
                            setPaymentForm({
                                paymentType: 0,
                                paymentName: "credit_card",
                                cardNumber: "",
                                outerDateUsing: "",
                                cvv: "",
                            })
                            setIsAddingPayment(true)
                        }}
                        className="bg-pink-500 hover:bg-pink-600"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Thêm phương thức
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                    {payment.map((item) => (
                        <div key={item.paymentMethodID} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="font-medium">Loại: {item.paymentName}</h3>
                                    <p className="text-sm text-gray-500">
                                        Số thẻ: {item.cardNumber}
                                    </p>
                                </div>

                            </div>
                            <div className="space-y-1 mb-4">
                                <p>Hết hạn: {formatDate(item.outerDateUsing)}</p>
                                <p>Tên chủ thẻ: {user?.userName}</p>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" >
                                    Chỉnh sửa
                                </Button>
                                <Button onClick={() => handleDeletePayment(item.paymentType)} variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50">
                                    Xóa
                                </Button>
                            </div>
                        </div>
                    ))}
                    <div className="border rounded-lg p-4 border-dashed flex flex-col items-center justify-center text-center">
                        <CreditCard className="h-8 w-8 text-gray-300 mb-2" />
                        <h3 className="font-medium mb-1">Thêm phương thức thanh toán</h3>
                        <p className="text-sm text-gray-500 mb-4">Thêm thẻ tín dụng hoặc phương thức thanh toán khác</p>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setPaymentForm({
                                    paymentType: 0,
                                    paymentName: "credit_card",
                                    cardNumber: "",
                                    outerDateUsing: "",
                                    cvv: "",
                                })
                                setIsAddingPayment(true)
                            }}
                        >
                            Thêm phương thức
                        </Button>
                    </div>
                </div>

                {/* Dialog thêm phương thức thanh toán mới */}
                <Dialog open={isAddingPayment} onOpenChange={setIsAddingPayment}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Thêm phương thức thanh toán</DialogTitle>
                            <DialogDescription>Nhập thông tin thẻ của bạn</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="cardholderName">Tên chủ thẻ</Label>
                                <Input
                                    id="cardholderName"
                                    name="cardholderName"
                                    value={user?.userName}
                                    onChange={handlePaymentChange}
                                    placeholder="NGUYEN VAN A"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="cardNumber">Số thẻ</Label>
                                <Input
                                    id="cardNumber"
                                    name="cardNumber"
                                    value={paymentForm.cardNumber}
                                    onChange={handlePaymentChange}
                                    placeholder="1234 5678 9012 3456"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="expiryDate">Ngày hết hạn</Label>
                                    <DatePicker
                                        selected={selectedDate}
                                        onChange={handleDateChange}
                                        dateFormat="MM/yy" // Hiển thị định dạng "MM/YY" cho người dùng
                                        showMonthYearPicker // Chỉ cho phép chọn tháng và năm
                                        placeholderText="Chọn ngày hết hạn (MM/YY)"
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="cvv">CVV</Label>
                                    <Input
                                        id="cvv"
                                        name="cvv"
                                        type="password"
                                        value={paymentForm.cvv}
                                        onChange={handlePaymentChange}
                                        placeholder="123"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="cardType">Loại thẻ</Label>
                                <Select onValueChange={handleCardTypeChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn loại thẻ" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">Visa</SelectItem>
                                        <SelectItem value="2">Mastercard</SelectItem>
                                        <SelectItem value="3">JCB</SelectItem>
                                        <SelectItem value="4">American Express</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsAddingPayment(false)}>
                                Hủy
                            </Button>
                            <Button type="submit" onClick={handlePaymentSubmit} className="bg-pink-500 hover:bg-pink-600">
                                Lưu phương thức
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </CardContent>
        </Card>
    )
}
