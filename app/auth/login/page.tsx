"use client"

import type React from "react"

import { useContext, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Lock, LogIn, Mail } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Bounce, ToastContainer, toast } from 'react-toastify';
import { useAuth } from "@/app/context/AuthContext"
export default function LoginPage() {
  const {login} = useAuth();
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, rememberMe: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const loginData = {
      email: formData.email,
      password: formData.password
    }
    // Giả lập đăng nhập
    try {
      const isSuccess =
        fetch("http://localhost:5000/api/User/UserLogin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(loginData)
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.status === 1) {
              login(data.data.token,data.data.user);
              toast.success('Đăng nhập thành công', {
                position: "top-right",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
                onClose: () => router.push("/"),
              });
            }
            else {
              toast.error('Thông tin đăng nhập không chính xác', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
              });
            }
          })

    } catch (error) {
      console.error("Đăng nhập thất bại:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-200px)] py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Đăng nhập</CardTitle>
          <CardDescription className="text-center">
            Nhập thông tin đăng nhập của bạn để truy cập tài khoản
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  className="pl-10"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Mật khẩu</Label>
                <Link href="/auth/forgot-password" className="text-xs text-pink-500 hover:underline">
                  Quên mật khẩu?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1 h-8 w-8"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                  <span className="sr-only">{showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}</span>
                </Button>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="remember" checked={formData.rememberMe} onCheckedChange={handleCheckboxChange} />
              <Label htmlFor="remember" className="text-sm cursor-pointer">
                Ghi nhớ đăng nhập
              </Label>
            </div>
            <Button type="submit" className="w-full bg-pink-500 hover:bg-pink-600" disabled={isLoading}>
              {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>
          </form>

          {/* <div className="mt-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Hoặc đăng nhập với</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <Button variant="outline" className="w-full">
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Google
              </Button>
              <Button variant="outline" className="w-full">
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    d="M9.1 2.9c-1.1.1-2.2.6-3 1.3-.7.7-1.2 1.5-1.4 2.5-.1.3-.1.9-.1 1.2 0 .9.2 1.7.5 2.4.3.7.8 1.3 1.4 1.8.6.5 1.3.9 2.1 1 .3 0 .9 0 1.2-.1.9-.2 1.7-.6 2.3-1.2.7-.6 1.2-1.4 1.5-2.3.1-.3.1-.9.1-1.2 0-.9-.2-1.7-.5-2.4-.3-.7-.8-1.3-1.4-1.8-.6-.5-1.3-.9-2.1-1-.3 0-.5 0-.6-.1-.1-.1-.1-.1 0-.1.2 0 .7 0 1 .1 1.2.2 2.3.8 3.1 1.6.8.8 1.3 1.9 1.5 3 .1.4.1 1.2 0 1.6-.2 1.1-.7 2.1-1.5 3-.8.9-1.9 1.5-3.1 1.7-.4.1-1.2.1-1.6 0-1.1-.2-2.1-.7-3-1.5-.9-.8-1.5-1.9-1.7-3.1-.1-.4-.1-1.2 0-1.6.2-1.1.7-2.1 1.5-3 .8-.9 1.9-1.5 3.1-1.7.4-.1 1.2-.1 1.6 0h.1z"
                    fill="#1877F2"
                  />
                  <path
                    d="M16.6 8.1c-.1 0-.2.1-.3.1-.1.1-.1.2-.1.3v1.9h-1.3c-.1 0-.2 0-.3.1-.1.1-.1.2-.1.3v1.4c0 .1 0 .2.1.3.1.1.2.1.3.1h1.3v3.7c0 .1 0 .2.1.3.1.1.2.1.3.1h1.5c.1 0 .2 0 .3-.1.1-.1.1-.2.1-.3v-3.7h1.3c.1 0 .2 0 .3-.1.1-.1.1-.2.1-.3v-1.4c0-.1 0-.2-.1-.3-.1-.1-.2-.1-.3-.1h-1.3V8.5c0-.3.1-.5.4-.5h1c.1 0 .2 0 .3-.1.1-.1.1-.2.1-.3V6.2c0-.1 0-.2-.1-.3-.1-.1-.2-.1-.3-.1h-1.5c-1.2 0-2.1.9-2.1 2.1v.2z"
                    fill="#1877F2"
                  />
                </svg>
                Facebook
              </Button>
            </div>
          </div> */}
        </CardContent>
        <CardFooter className="flex flex-col">
          <p className="text-center text-sm text-gray-600">
            Chưa có tài khoản?{" "}
            <Link href="/auth/register" className="text-pink-500 hover:underline font-medium">
              Đăng ký ngay
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

