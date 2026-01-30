"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Package, Truck, CheckCircle, MapPin, User, Phone, Mail, Clock, Download, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
  const orderNumber = params.id
  const orderDate = new Date()
  const estimatedDelivery = new Date(orderDate.getTime() + 2 * 24 * 60 * 60 * 1000)

  const orderItems = [
    {
      id: 1,
      name: "MacBook Pro 14 inch",
      price: 52990000,
      quantity: 1,
      image: "/macbook-pro.jpg",
      specs: "512GB SSD, 16GB RAM",
    },
    {
      id: 2,
      name: "Apple Magic Keyboard",
      price: 4990000,
      quantity: 1,
      image: "/magic-keyboard.jpg",
      specs: "Wireless",
    },
  ]

  const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const vatRate = 0.1 // 10% VAT
  const vatAmount = subtotal * vatRate
  const shippingFee = 0 // Free shipping
  const totalAmount = subtotal + vatAmount + shippingFee

  const timelineSteps = [
    { label: "Chờ xác nhận", status: "completed", date: new Date(), icon: CheckCircle },
    {
      label: "Đang xử lý",
      status: "active",
      date: new Date(orderDate.getTime() + 2 * 60 * 60 * 1000),
      icon: Package,
    },
    { label: "Đang giao", status: "pending", date: estimatedDelivery, icon: Truck },
    {
      label: "Hoàn thành",
      status: "pending",
      date: new Date(estimatedDelivery.getTime() + 1 * 24 * 60 * 60 * 1000),
      icon: CheckCircle,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-white">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 text-sm mb-6 transition-colors font-medium"
            >
              <ArrowLeft className="h-4 w-4" />
              Quay lại
            </Link>

            <div className="flex justify-between items-start mb-6 bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-200/50 rounded-lg p-6">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Chi tiết đơn hàng</h1>
                <p className="text-slate-600">
                  Mã đơn: <span className="font-mono font-bold text-emerald-600">{orderNumber}</span>
                </p>
              </div>
              <Badge className="bg-emerald-500/20 text-emerald-700 border border-emerald-300 text-base px-4 py-2">
                ✓ Đã nhận
              </Badge>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="timeline" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-slate-100 border border-slate-200 p-1">
              <TabsTrigger
                value="timeline"
                className="data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:border-b-2 data-[state=active]:border-emerald-500"
              >
                Lịch sử
              </TabsTrigger>
              <TabsTrigger
                value="items"
                className="data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:border-b-2 data-[state=active]:border-emerald-500"
              >
                Sản phẩm
              </TabsTrigger>
              <TabsTrigger
                value="info"
                className="data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:border-b-2 data-[state=active]:border-emerald-500"
              >
                Thông tin
              </TabsTrigger>
            </TabsList>

            {/* Timeline Tab */}
            <TabsContent value="timeline" className="space-y-4">
              <Card className="bg-white border-slate-200">
                <CardHeader className="border-b border-slate-200">
                  <CardTitle className="text-slate-900">Trạng thái đơn hàng</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {timelineSteps.map((step, index) => {
                      const Icon = step.icon
                      const isCompleted = step.status === "completed"
                      const isActive = step.status === "active"

                      return (
                        <div key={index} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div
                              className={`h-10 w-10 rounded-full flex items-center justify-center ${
                                isCompleted ? "bg-emerald-500" : isActive ? "bg-blue-500" : "bg-slate-300"
                              }`}
                            >
                              <Icon className="h-5 w-5 text-white" />
                            </div>
                            {index < timelineSteps.length - 1 && (
                              <div
                                className={`h-12 w-0.5 my-2 ${isCompleted ? "bg-emerald-500" : "bg-slate-300"}`}
                              ></div>
                            )}
                          </div>
                          <div className="pt-2 flex-1">
                            <h4 className="font-semibold text-slate-900">{step.label}</h4>
                            <p className="text-sm text-slate-600 flex items-center gap-1 mt-1">
                              <Clock className="h-4 w-4" />
                              {step.date.toLocaleString("vi-VN")}
                            </p>
                            {isActive && <p className="text-sm text-blue-600 font-medium mt-2">Hiện tại</p>}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Items Tab */}
            <TabsContent value="items" className="space-y-4">
              <Card className="bg-white border-slate-200">
                <CardHeader className="border-b border-slate-200">
                  <CardTitle className="text-slate-900">Sản phẩm trong đơn hàng</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-6">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="border-b-2 border-slate-200">
                        <tr className="text-left">
                          <th className="pb-3 text-sm font-semibold text-slate-700">Sản phẩm</th>
                          <th className="pb-3 text-sm font-semibold text-slate-700 text-center">Đơn giá</th>
                          <th className="pb-3 text-sm font-semibold text-slate-700 text-center">Số lượng</th>
                          <th className="pb-3 text-sm font-semibold text-slate-700 text-right">Thành tiền</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orderItems.map((item) => (
                          <tr key={item.id} className="border-b border-slate-200 last:border-b-0">
                            <td className="py-4">
                              <div className="flex gap-3 items-center">
                                <img
                                  src={item.image || "/placeholder.svg"}
                                  alt={item.name}
                                  className="h-16 w-16 object-cover rounded bg-slate-200"
                                />
                                <div>
                                  <h4 className="font-semibold text-slate-900">{item.name}</h4>
                                  <p className="text-sm text-slate-600">{item.specs}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 text-center text-slate-900">{item.price.toLocaleString("vi-VN")}đ</td>
                            <td className="py-4 text-center">
                              <span className="inline-block bg-slate-100 px-3 py-1 rounded text-slate-900 font-medium">
                                {item.quantity}
                              </span>
                            </td>
                            <td className="py-4 text-right font-bold text-emerald-600">
                              {(item.price * item.quantity).toLocaleString("vi-VN")}đ
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg p-5 mt-6 space-y-3 border border-emerald-200/50">
                    <div className="flex justify-between text-slate-700">
                      <span>Tạm tính:</span>
                      <span className="font-medium">{subtotal.toLocaleString("vi-VN")}đ</span>
                    </div>
                    <div className="flex justify-between text-slate-700">
                      <span>VAT (10%):</span>
                      <span className="font-medium">{vatAmount.toLocaleString("vi-VN")}đ</span>
                    </div>
                    <div className="flex justify-between text-slate-700">
                      <span>Phí vận chuyển:</span>
                      <span className="font-medium text-emerald-600">Miễn phí</span>
                    </div>
                    <div className="border-t-2 border-emerald-300 pt-3 flex justify-between items-center">
                      <span className="text-lg font-bold text-slate-900">Tổng cộng:</span>
                      <span className="text-2xl font-bold text-emerald-600">
                        {totalAmount.toLocaleString("vi-VN")}đ
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Info Tab */}
            <TabsContent value="info" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Card className="bg-white border-slate-200">
                  <CardHeader className="border-b border-slate-200">
                    <CardTitle className="flex items-center gap-2 text-slate-900">
                      <MapPin className="h-5 w-5 text-emerald-600" />
                      Địa chỉ giao hàng
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-2">
                      <p className="font-medium text-slate-900">Nguyễn Văn A</p>
                      <p className="text-sm text-slate-600">123 Đường ABC, Quận 1, TP.HCM</p>
                      <p className="text-sm text-slate-600">
                        Giao dự kiến: {estimatedDelivery.toLocaleDateString("vi-VN")}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border-slate-200">
                  <CardHeader className="border-b border-slate-200">
                    <CardTitle className="flex items-center gap-2 text-slate-900">
                      <User className="h-5 w-5 text-blue-600" />
                      Thông tin liên hệ
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-slate-600" />
                        <span className="text-sm text-slate-700">0123 456 789</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-slate-600" />
                        <span className="text-sm text-slate-700">user@example.com</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-white border-slate-200">
                <CardHeader className="border-b border-slate-200">
                  <CardTitle className="text-slate-900">Thông tin đơn hàng</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Mã đơn hàng:</span>
                      <span className="font-mono font-medium text-slate-900">{orderNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Ngày đặt:</span>
                      <span className="font-medium text-slate-900">{orderDate.toLocaleDateString("vi-VN")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Phương thức thanh toán:</span>
                      <span className="font-medium text-slate-900">Chuyển khoản ngân hàng</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Trạng thái thanh toán:</span>
                      <Badge className="bg-emerald-500/20 text-emerald-700 border border-emerald-300">
                        ✓ Đã thanh toán
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="mt-8 flex gap-4">
            <Button asChild className="flex-1 bg-emerald-500 hover:bg-emerald-600 h-12 font-medium">
              <Link href="/">Tiếp tục mua sắm</Link>
            </Button>
            <Button
              variant="outline"
              className="flex-1 h-12 gap-2 bg-white border-slate-300 text-slate-900 hover:bg-slate-50 font-medium"
            >
              <Download className="h-4 w-4" />
              Tải hóa đơn
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
