import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Mail, MapPin, Phone, Twitter, Youtube } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="container px-4 py-12 md:px-6 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="inline-block mb-4">
              <Image src="/logokimvu.png?height=40&width=120&text=Cocolux" alt="Cocolux" width={120} height={40} />
            </Link>
            <p className="text-gray-600 text-sm mb-4">
              Kim vũ store - Chuỗi cửa hàng thời trang chất lượng cao.
            </p>
            <div className="flex items-center gap-4">
              <Link href="https://facebook.com" className="text-gray-500 hover:text-pink-500">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="https://instagram.com" className="text-gray-500 hover:text-pink-500">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="https://twitter.com" className="text-gray-500 hover:text-pink-500">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="https://youtube.com" className="text-gray-500 hover:text-pink-500">
                <Youtube className="h-5 w-5" />
                <span className="sr-only">Youtube</span>
              </Link>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Thông tin</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-gray-600 hover:text-pink-500">
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-600 hover:text-pink-500">
                  Blog thời trang
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-gray-600 hover:text-pink-500">
                  Tuyển dụng
                </Link>
              </li>
              <li>
                <Link href="/stores" className="text-gray-600 hover:text-pink-500">
                  Hệ thống cửa hàng
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-pink-500">
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Chính sách</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/policy/shipping" className="text-gray-600 hover:text-pink-500">
                  Chính sách vận chuyển
                </Link>
              </li>
              <li>
                <Link href="/policy/return" className="text-gray-600 hover:text-pink-500">
                  Chính sách đổi trả
                </Link>
              </li>
              <li>
                <Link href="/policy/payment" className="text-gray-600 hover:text-pink-500">
                  Phương thức thanh toán
                </Link>
              </li>
              <li>
                <Link href="/policy/privacy" className="text-gray-600 hover:text-pink-500">
                  Chính sách bảo mật
                </Link>
              </li>
              <li>
                <Link href="/policy/terms" className="text-gray-600 hover:text-pink-500">
                  Điều khoản dịch vụ
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Liên hệ</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-pink-500 shrink-0 mt-0.5" />
                <span className="text-gray-600">Tầng 4, Tòa nhà ABC, 123 Đường XYZ, Quận 1, TP. Hồ Chí Minh</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-pink-500" />
                <a href="tel:1900123456" className="text-gray-600 hover:text-pink-500">
                  1900 123 456
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-pink-500" />
                <a href="mailto:info@kimvu.com" className="text-gray-600 hover:text-pink-500">
                  info@kimvu.com
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t mt-12 pt-6 text-center text-sm text-gray-600">
          <p>© {new Date().getFullYear()} Kim Vũ Store. Tất cả các quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  )
}

