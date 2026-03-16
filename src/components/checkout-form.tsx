"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { User, MapPin, Percent } from "lucide-react"
import { useRouter } from "next/navigation"
import axios from "axios"

export function CheckoutForm() {
  const router = useRouter()

  const [paymentMethod, setPaymentMethod] = useState(1)
  const [note, setNote] = useState("")
  const [cart, setCart] = useState<any[]>([])
  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    address: "",
  })

  const [accountId, setAccountId] = useState<number | null>(null)
  const [citiesData, setCitiesData] = useState<any>({})
  const [city, setCity] = useState("")
  const [district, setDistrict] = useState("")
  const [ward, setWard] = useState("")

  useEffect(() => {

    const storedUser = JSON.parse(localStorage.getItem("user") || "null")

    if (storedUser) {

      setAccountId(storedUser.id)

      setCustomer({
        name: storedUser.username || "",
        phone: storedUser.phoneNumber || "",
        address: storedUser.address || "",
      })
    }

    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]")
    setCart(storedCart)

    fetch("/hn_hcm_sample.json")
      .then((res) => res.json())
      .then((data) => setCitiesData(data))

  }, [])

  const districts = city ? citiesData[city] || [] : []
  const wards = district
    ? districts.find((d: any) => d.district === district)?.wards || []
    : []

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const form = e.target as HTMLFormElement

    if (!customer.name || !customer.phone || !customer.address || !city || !district || !ward) {
      alert("Vui lòng điền đầy đủ thông tin!")
      return
    }

    const totalPrice = Number(form.totalPrice.value)
    const vat = Number(form.vat.value)
    const fullAddress = `${customer.address}, ${ward}, ${district}, ${city}`

    const orderPayload = {
      status: 1,
      customerName: customer.name,
      customerPhone: customer.phone,
      customerAddress: fullAddress,
      paymentMethod,
      note,
      totalPrice,
      vat,
      accountId,
      orderDetails: cart.map((item) => ({
        quantity: item.quantity,
        unitPrice: item.price,
        productDetail: {
          configurationId: item.configId || 0,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        },
      })),
    }

    console.log(orderPayload)

    try {

      const token = localStorage.getItem("token")

      await axios.post(
        "http://localhost:8080/api/orders",
        orderPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      alert("Đặt hàng thành công!")
      localStorage.removeItem("cart")
      router.push("/order-success")

    } catch (error) {

      console.error(error)
      alert("Đặt hàng thất bại!")

    }
  }

  // Tính tổng trực tiếp từ cart
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const vatValue = Math.round(total * 0.1)
  const totalWithVat = total + vatValue

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Thanh toán</h1>
      <p className="text-muted-foreground mb-6">Hoàn tất thông tin để đặt hàng</p>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" /> Thông tin khách hàng
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Username *</Label>
                    <Input
                      value={customer.name}
                      onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>Số điện thoại *</Label>
                    <Input
                      type="tel"
                      value={customer.phone}
                      onChange={(e) => {
                        const onlyNumbers = e.target.value.replace(/\D/g, "").slice(0, 10)
                        setCustomer({ ...customer, phone: onlyNumbers })
                      }}
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" /> Địa chỉ giao hàng
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  value={customer.address}
                  onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                  placeholder="Địa chỉ"
                  required
                />
                <div className="grid md:grid-cols-3 gap-4">
                  <select
                    value={city}
                    onChange={(e) => { setCity(e.target.value); setDistrict(""); setWard(""); }}
                    required
                    className="border rounded-lg p-2 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="">Chọn thành phố</option>
                    <option value="HaNoi">Hà Nội</option>
                    <option value="HoChiMinh">TP. Hồ Chí Minh</option>
                  </select>

                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    required
                    className="border rounded-lg p-2 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="">Chọn quận/huyện</option>
                    {districts.map((d: any) => (
                      <option key={d.district} value={d.district}>
                        {d.district}
                      </option>
                    ))}
                  </select>

                  <select
                    value={ward}
                    onChange={(e) => setWard(e.target.value)}
                    required
                    className="border rounded-lg p-2 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="">Chọn phường/xã</option>
                    {wards.map((w: string) => (
                      <option key={w} value={w}>
                        {w}
                      </option>
                    ))}
                  </select>
                </div>

                <Textarea
                  placeholder="Ghi chú cho đơn hàng..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </CardContent>
            </Card>

            {/* Payment */}
            <RadioGroup value={String(paymentMethod)} onValueChange={(v) => setPaymentMethod(Number(v))}>
              <div className="flex flex-col p-4 border rounded-lg space-y-1">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="1" id="cod" />
                  <Label htmlFor="cod">Thanh toán khi nhận hàng (COD)</Label>
                </div>
                <p className="text-sm text-gray-600">
                  Bạn sẽ thanh toán trực tiếp cho nhân viên giao hàng khi nhận đơn. Đây là phương thức an toàn,
                  không cần chuyển khoản trước và thuận tiện cho những khách hàng muốn kiểm tra hàng trước khi thanh toán.
                </p>
              </div>

              <div className="flex flex-col p-4 border rounded-lg space-y-1 mt-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="2" id="bank" />
                  <Label htmlFor="bank">Chuyển khoản</Label>
                </div>
                <p className="text-sm text-gray-600">
                  Bạn chuyển tiền trước qua ngân hàng. Đơn hàng sẽ được xử lý và gửi đi ngay sau khi chúng tôi xác nhận thanh toán.
                  Phương thức này phù hợp với khách hàng muốn đảm bảo thanh toán an toàn và có biên lai chuyển tiền.
                </p>
              </div>
            </RadioGroup>
          </div>

          {/* RIGHT - Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Đơn hàng của bạn</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cart.map((item, index) => (
                  <div key={`${item.id}-${item.configId}-${index}`} className="flex gap-3">
                    <Image src={item.image || "/placeholder.svg"} alt={item.name} width={64} height={64} className="rounded-lg" />
                    <div className="flex-1">
                      <p>{item.name}</p>
                      <p>{item.brand}</p>
                      <p>{formatPrice(item.price * item.quantity)}</p>
                    </div>
                    <Badge>{item.quantity}</Badge>
                  </div>
                ))}

                <Separator />
                <div className="flex justify-between">
                  <span>Tạm tính</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Phí vận chuyển</span>
                  <span className="text-green-600">Miễn phí</span>
                </div>
                <div className="flex justify-between">
                  <span className="flex items-center gap-1"><Percent /> VAT (10%)</span>
                  <span>{formatPrice(vatValue)}</span>
                </div>
                {/* input hidden */}
                <input type="hidden" name="vat" value={vatValue} />
                <input type="hidden" name="totalPrice" value={totalWithVat} />
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Tổng cộng</span>
                  <span>{formatPrice(totalWithVat)}</span>
                </div>

                <Button type="submit" className="w-full bg-blue-600">Đặt hàng</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
