"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useState, useEffect } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Truck, Calendar } from "lucide-react"
import Link from "next/link"

export default function OrderSuccessPage() {
  // const [order, setOrder] = useState<any>(null)

  // useEffect(() => {
  //   const fetchOrder = async () => {
  //     try {
  //       const res = await axios.get(`/api/orders/${orderId}`)
  //       setOrder(res.data)
  //     } catch (error) {
  //       console.error("Lỗi lấy đơn hàng:", error)
  //     }
  //   }
  //   fetchOrder()
  // }, [orderId])

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-white">
      <Header />
      <main className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-8">
              <div className="relative inline-flex items-center justify-center">
                <div className="absolute h-32 w-32 bg-emerald-500/10 rounded-full animate-pulse"></div>
                <CheckCircle className="h-24 w-24 text-emerald-500" />
              </div>
            </div>

            <h1 className="text-5xl font-bold mb-4 text-slate-900">Đặt hàng thành công</h1>
            <p className="text-lg text-slate-600 mb-6">Cảm ơn bạn đã tin tưởng TechStore</p>

            {/* <div className="inline-block bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-200 rounded-lg px-6 py-3 mb-12">
              <p className="text-sm text-slate-600">Mã đơn hàng</p>
              <p className="text-2xl font-mono font-bold text-emerald-600">{order?.orderCode}</p>
            </div> */}
          </div>

          {/* Useful Information */}
          <Card className="bg-gradient-to-r from-emerald-50 via-blue-50 to-emerald-50 border-emerald-200/50 mb-12">
            <CardContent className="p-8">
              <h3 className="text-xl font-semibold text-slate-900 mb-6">Thông tin cần biết</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h4 className="font-semibold text-slate-800 flex items-center gap-2">
                    <span className="h-5 w-5 rounded-full bg-emerald-500 flex items-center justify-center">
                      <span className="h-2 w-2 bg-white rounded-full"></span>
                    </span>
                    Chính sách đổi trả
                  </h4>
                  <p className="text-sm text-slate-600">Đổi trả miễn phí trong 30 ngày nếu có vấn đề</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-slate-800 flex items-center gap-2">
                    <span className="h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center">
                      <span className="h-2 w-2 bg-white rounded-full"></span>
                    </span>
                    Bảo hành chính hãng
                  </h4>
                  <p className="text-sm text-slate-600">Bảo hành 12 tháng cho tất cả sản phẩm</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-slate-800 flex items-center gap-2">
                    <span className="h-5 w-5 rounded-full bg-pink-500 flex items-center justify-center">
                      <span className="h-2 w-2 bg-white rounded-full"></span>
                    </span>
                    Theo dõi đơn hàng
                  </h4>
                  <p className="text-sm text-slate-600">Cập nhật real-time trong tài khoản của bạn</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-slate-800 flex items-center gap-2">
                    <span className="h-5 w-5 rounded-full bg-purple-500 flex items-center justify-center">
                      <span className="h-2 w-2 bg-white rounded-full"></span>
                    </span>
                    Hỗ trợ 24/7
                  </h4>
                  <p className="text-sm text-slate-600">Đội hỗ trợ sẵn sàng giúp bạn bất kỳ lúc nào</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-3">
            {/* <Button
              asChild
              className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 h-12 text-base font-medium text-white"
            >
              <Link href={`/order-details/${order?.orderCode}`}>Xem chi tiết đơn hàng</Link>
            </Button> */}
            <Button
              asChild
              variant="outline"
              className="w-full h-12 text-base font-medium bg-white border-slate-300 text-slate-900 hover:bg-slate-50"
            >
              <Link href="/">Tiếp tục mua sắm</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
