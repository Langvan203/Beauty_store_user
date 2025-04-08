
import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { ThemeProvider } from "@/components/theme-provider"
import { FilterDataProvider } from "@/app/context/FilterDataContext";
import { AuthProvider } from "@/app/context/AuthContext"
import { CartProvider } from "./context/CartContext"
import {PaymentProvider} from "./context/PaymentMethod"
// import { CartProvider } from "./context/CartContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Cocolux - Mỹ phẩm chính hãng",
  description: "Cocolux - Thương hiệu mỹ phẩm Việt Nam chất lượng cao, an toàn và hiệu quả",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <OrderProvider>
          <CartProvider>
            <PaymentProvider>
            <FilterDataProvider>
              <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
                <Header />
                <main>{children}</main>
                <Footer />
              </ThemeProvider>
            </FilterDataProvider>
            </PaymentProvider>
          </CartProvider>
          </OrderProvider>
        </AuthProvider>
        <ToastContainer />
      </body>
    </html>
  )
}



import './globals.css'
import { ToastContainer } from "react-toastify"
import { OrderProvider } from "./context/OrderContext"

