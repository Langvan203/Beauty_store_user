import { ShoppingBag } from "lucide-react";
import Link from "next/link"

import { Button } from "@/components/ui/button"
export default function CartPage() {
    return (
        <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <ShoppingBag className="h-8 w-8 text-gray-500" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Giỏ hàng của bạn đang trống</h2>
            <p className="text-gray-500 mb-6">Hãy thêm sản phẩm vào giỏ hàng để tiến hành mua sắm</p>
            <Link href="/products">
                <Button className="bg-pink-500 hover:bg-pink-600">Tiếp tục mua sắm</Button>
            </Link>
        </div>
    )
}

