"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { User, MapPin, Percent } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";

export function CheckoutForm() {
  const router = useRouter();

  const [paymentMethod, setPaymentMethod] = useState(1);
  const [note, setNote] = useState("");
  const [cart, setCart] = useState<any[]>([]);
  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const [accountId, setAccountId] = useState<number | null>(null);

  // State mới cho API Hành chính Việt Nam
  const [provinces, setProvinces] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);

  const [city, setCity] = useState(""); // Lưu theo format "code|name"
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");

    if (storedUser) {
      setAccountId(storedUser.id);
      setCustomer({
        name: storedUser.username || "",
        phone: storedUser.phoneNumber || "",
        address: storedUser.address || "",
      });
    }

    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(storedCart);

    // Lấy danh sách 63 Tỉnh/Thành phố khi vừa vào trang
    axios
      .get("https://provinces.open-api.vn/api/")
      .then((res) => setProvinces(res.data))
      .catch((err) => console.error("Lỗi lấy danh sách tỉnh thành:", err));
  }, []);

  // Xử lý khi chọn Tỉnh/Thành phố
  const handleCityChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setCity(val);
    setDistrict("");
    setWard("");
    setDistricts([]);
    setWards([]);

    if (val) {
      const code = val.split("|")[0]; // Tách lấy mã tỉnh
      try {
        const res = await axios.get(
          `https://provinces.open-api.vn/api/p/${code}?depth=2`,
        );
        setDistricts(res.data.districts);
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Xử lý khi chọn Quận/Huyện
  const handleDistrictChange = async (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const val = e.target.value;
    setDistrict(val);
    setWard("");
    setWards([]);

    if (val) {
      const code = val.split("|")[0]; // Tách lấy mã huyện
      try {
        const res = await axios.get(
          `https://provinces.open-api.vn/api/d/${code}?depth=2`,
        );
        setWards(res.data.wards);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;

    if (
      !customer.name ||
      !customer.phone ||
      !customer.address ||
      !city ||
      !district ||
      !ward
    ) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    const totalPrice = Number(form.totalPrice.value);
    const vat = Number(form.vat.value);

    // Tách lấy Tên (Index 1) để ghép chuỗi địa chỉ
    const cityName = city.split("|")[1];
    const districtName = district.split("|")[1];
    const wardName = ward.split("|")[1];
    const fullAddress = `${customer.address}, ${wardName}, ${districtName}, ${cityName}`;

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
    };

    console.log("Payload gửi đi:", orderPayload);

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:8080/api/orders", orderPayload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Đặt hàng thành công!");
      localStorage.removeItem("cart");
      router.push("/order-success");
    } catch (error) {
      console.error(error);
      alert("Đặt hàng thất bại!");
    }
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const vatValue = Math.round(total * 0.1);
  const totalWithVat = total + vatValue;

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Thanh toán</h1>
      <p className="text-muted-foreground mb-6">
        Hoàn tất thông tin để đặt hàng
      </p>

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
                    <Label>Họ và tên *</Label>
                    <Input
                      value={customer.name}
                      onChange={(e) =>
                        setCustomer({ ...customer, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label>Số điện thoại *</Label>
                    <Input
                      type="tel"
                      value={customer.phone}
                      onChange={(e) => {
                        const onlyNumbers = e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 10);
                        setCustomer({ ...customer, phone: onlyNumbers });
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
                  onChange={(e) =>
                    setCustomer({ ...customer, address: e.target.value })
                  }
                  placeholder="Số nhà, tên đường..."
                  required
                />
                <div className="grid md:grid-cols-3 gap-4">
                  <select
                    value={city}
                    onChange={handleCityChange}
                    required
                    className="border rounded-lg p-2 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="">Chọn Tỉnh/Thành phố</option>
                    {provinces.map((p) => (
                      <option key={p.code} value={`${p.code}|${p.name}`}>
                        {p.name}
                      </option>
                    ))}
                  </select>

                  <select
                    value={district}
                    onChange={handleDistrictChange}
                    required
                    disabled={!city}
                    className="border rounded-lg p-2 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-100"
                  >
                    <option value="">Chọn Quận/Huyện</option>
                    {districts.map((d) => (
                      <option key={d.code} value={`${d.code}|${d.name}`}>
                        {d.name}
                      </option>
                    ))}
                  </select>

                  <select
                    value={ward}
                    onChange={(e) => setWard(e.target.value)}
                    required
                    disabled={!district}
                    className="border rounded-lg p-2 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-100"
                  >
                    <option value="">Chọn Phường/Xã</option>
                    {wards.map((w) => (
                      <option key={w.code} value={`${w.code}|${w.name}`}>
                        {w.name}
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
            <RadioGroup
              value={String(paymentMethod)}
              onValueChange={(v) => setPaymentMethod(Number(v))}
            >
              <div className="flex flex-col p-4 border rounded-lg space-y-1 cursor-pointer hover:bg-slate-50 transition-colors">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="1" id="cod" />
                  <Label htmlFor="cod" className="font-semibold cursor-pointer">
                    Thanh toán khi nhận hàng (COD)
                  </Label>
                </div>
                <p className="text-sm text-gray-600 pl-6">
                  Bạn sẽ thanh toán trực tiếp cho nhân viên giao hàng khi nhận
                  đơn. Đây là phương thức an toàn, không cần chuyển khoản trước.
                </p>
              </div>

              <div className="flex flex-col p-4 border rounded-lg space-y-1 mt-2 cursor-pointer hover:bg-slate-50 transition-colors">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="2" id="bank" />
                  <Label
                    htmlFor="bank"
                    className="font-semibold cursor-pointer"
                  >
                    Chuyển khoản ngân hàng
                  </Label>
                </div>
                <p className="text-sm text-gray-600 pl-6">
                  Bạn chuyển tiền trước qua ngân hàng. Đơn hàng sẽ được gửi đi
                  ngay sau khi chúng tôi xác nhận thanh toán.
                </p>
              </div>
            </RadioGroup>
          </div>

          {/* RIGHT - Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 shadow-md border-t-4 border-t-blue-600">
              <CardHeader>
                <CardTitle>Đơn hàng của bạn</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cart.map((item, index) => (
                  <div
                    key={`${item.id}-${item.configId}-${index}`}
                    className="flex gap-3 items-center"
                  >
                    <div className="bg-slate-100 p-1 rounded-md">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        width={50}
                        height={50}
                        className="rounded object-cover"
                      />
                    </div>
                    <div className="flex-1 text-sm">
                      <p className="font-semibold line-clamp-1">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.brand}
                      </p>
                      <p className="font-medium text-blue-600">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                    <Badge variant="secondary" className="font-bold border">
                      x{item.quantity}
                    </Badge>
                  </div>
                ))}

                <Separator className="my-4" />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tạm tính</span>
                    <span className="font-medium">{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Phí vận chuyển
                    </span>
                    <span className="font-medium text-green-600">Miễn phí</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Percent className="w-4 h-4" /> VAT (10%)
                    </span>
                    <span className="font-medium">{formatPrice(vatValue)}</span>
                  </div>
                </div>

                <input type="hidden" name="vat" value={vatValue} />
                <input type="hidden" name="totalPrice" value={totalWithVat} />

                <Separator className="my-4" />

                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg font-bold">Tổng cộng</span>
                  <span className="text-xl font-bold text-red-600">
                    {formatPrice(totalWithVat)}
                  </span>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full font-bold text-md tracking-wide"
                >
                  ĐẶT HÀNG NGAY
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
