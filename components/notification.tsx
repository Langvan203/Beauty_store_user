import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export default function NotificationsPage() {
    return (
    <Card>
        <CardHeader>
            <CardTitle>Thông báo</CardTitle>
            <CardDescription>Quản lý cài đặt thông báo của bạn</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-medium">Thông báo đơn hàng</h3>
                        <p className="text-sm text-gray-500">Nhận thông báo về trạng thái đơn hàng của bạn</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                            Email
                        </Button>
                        <Button variant="outline" size="sm">
                            SMS
                        </Button>
                    </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-medium">Khuyến mãi</h3>
                        <p className="text-sm text-gray-500">Nhận thông tin về khuyến mãi và ưu đãi đặc biệt</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                            Email
                        </Button>
                        <Button variant="outline" size="sm">
                            SMS
                        </Button>
                    </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-medium">Sản phẩm mới</h3>
                        <p className="text-sm text-gray-500">Nhận thông báo khi có sản phẩm mới</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                            Email
                        </Button>
                        <Button variant="outline" size="sm">
                            SMS
                        </Button>
                    </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-medium">Bản tin</h3>
                        <p className="text-sm text-gray-500">Nhận bản tin hàng tháng của chúng tôi</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                            Email
                        </Button>
                    </div>
                </div>
            </div>
        </CardContent>
    </Card>
    )
}