import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useState } from "react"

export default function SettingPage() {
    const [isEditingProfile, setIsEditingProfile] = useState(false)
    

    return (
        <Card>
            <CardHeader>
                <CardTitle>Cài đặt tài khoản</CardTitle>
                <CardDescription>Quản lý cài đặt tài khoản và bảo mật</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-medium mb-4">Thông tin cá nhân</h3>
                        <Button variant="outline" onClick={() => setIsEditingProfile(true)}>
                            Cập nhật thông tin
                        </Button>
                    </div>
                    <Separator />
                    <div>
                        <h3 className="text-lg font-medium mb-4">Bảo mật</h3>
                        <div className="space-y-2">
                            <Button variant="outline">Đổi mật khẩu</Button>
                            <Button variant="outline">Bật xác thực hai yếu tố</Button>
                        </div>
                    </div>
                    <Separator />
                    <div>
                        <h3 className="text-lg font-medium mb-4">Quyền riêng tư</h3>
                        <div className="space-y-2">
                            <Button variant="outline">Quản lý dữ liệu cá nhân</Button>
                            <Button variant="outline">Cài đặt cookie</Button>
                        </div>
                    </div>
                    <Separator />
                    <div>
                        <h3 className="text-lg font-medium mb-2 text-red-500">Xóa tài khoản</h3>
                        <p className="text-sm text-gray-500 mb-4">
                            Khi bạn xóa tài khoản, tất cả dữ liệu của bạn sẽ bị xóa vĩnh viễn và không thể khôi phục.
                        </p>
                        <Button variant="destructive">Xóa tài khoản</Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}