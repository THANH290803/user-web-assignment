import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Package, Truck, Phone } from "lucide-react"
import Link from "next/link"

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <CheckCircle className="h-24 w-24 mx-auto text-green-500 mb-6" />
            <h1 className="text-3xl font-bold mb-4">Đặt hàng thành công!</h1>
            <p className="text-muted-foreground text-lg">
              Cảm ơn bạn đã mua sắm tại TechStore. Đơn hàng của bạn đã được tiếp nhận và đang được xử lý.
            </p>
          </div>

          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <Package className="h-12 w-12 mx-auto text-blue-500 mb-3" />
                  <h3 className="font-semibold mb-2">Đang chuẩn bị</h3>
                  <p className="text-sm text-muted-foreground">Đơn hàng đang được chuẩn bị</p>
                </div>
                <div>
                  <Truck className="h-12 w-12 mx-auto text-orange-500 mb-3" />
                  <h3 className="font-semibold mb-2">Giao hàng</h3>
                  <p className="text-sm text-muted-foreground">Giao hàng trong 1-2 ngày</p>
                </div>
                <div>
                  <Phone className="h-12 w-12 mx-auto text-green-500 mb-3" />
                  <h3 className="font-semibold mb-2">Hỗ trợ</h3>
                  <p className="text-sm text-muted-foreground">Hotline: 1900 1234</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Button
              asChild
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Link href="/">Tiếp tục mua sắm</Link>
            </Button>
            <p className="text-sm text-muted-foreground">Thông tin chi tiết đơn hàng đã được gửi đến email của bạn.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
