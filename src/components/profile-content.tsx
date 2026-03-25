"use client";

import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import axios from "axios"; // 👈 Dùng axios cho chuẩn bài
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Package,
  Heart,
  Settings,
  User,
  MapPin,
  Phone,
  Mail,
  Eye,
  X,
  ShoppingCart,
  AlertTriangle,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "react-hot-toast"; // 👈 Thêm thông báo
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type Order = {
  id: number;
  orderCode: string;
  status: string;
  totalPrice: number;
  createdDate: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
};

interface User {
  id: number;
  username: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  avatar?: string;
}

export function ProfileContent() {
  const { state, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: state.user?.username || "",
    email: state.user?.email || "",
    phoneNumber: state.user?.phoneNumber || "",
    address: state.user?.address || "",
  });

  // 🛑 STATE QUẢN LÝ POPUP HỦY ĐƠN
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState<number | null>(null);

  useEffect(() => {
    if (state.user) {
      setFormData({
        username: state.user.username || "",
        email: state.user.email || "",
        phoneNumber: state.user.phoneNumber || "",
        address: state.user.address || "",
      });
    }
  }, [state.user]);

  const statusTextMap: Record<string, string> = {
    PENDING: "Chờ xác nhận",
    PROCESSING: "Đang xử lý",
    SHIPPING: "Đang giao",
    COMPLETED: "Hoàn thành",
    CANCELED: "Đã hủy",
  };

  const [orderStatusFilter, setOrderStatusFilter] = useState<string | "all">(
    "all",
  );
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  const handleSave = async () => {
    await updateProfile({
      username: formData.username,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      address: formData.address,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      username: state.user?.username || "",
      email: state.user?.email || "",
      phoneNumber: state.user?.phoneNumber || "",
      address: state.user?.address || "",
    });
    setIsEditing(false);
  };

  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    if (!state.user?.id) return;

    const token = localStorage.getItem("token");
    fetch(`http://localhost:8080/api/orders/account/${state.user.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setOrders(data.result || []);
      })
      .catch((err) => console.error("Lỗi lấy đơn hàng:", err));
  }, [state.user?.id]);

  const filteredOrders =
    orderStatusFilter === "all"
      ? orders
      : orders.filter((o) => o.status === orderStatusFilter);

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const startIndex = (currentPage - 1) * ordersPerPage;
  const endIndex = startIndex + ordersPerPage;
  const currentOrders = filteredOrders.slice(startIndex, endIndex);

  const handleFilterChange = (status: string | "all") => {
    setOrderStatusFilter(status);
    setCurrentPage(1);
  };

  // 🛑 MỞ POPUP XÁC NHẬN HỦY
  const openCancelModal = (orderId: number) => {
    setOrderToCancel(orderId);
    setIsCancelModalOpen(true);
  };

  // 🛑 GỌI API CHUẨN ĐỂ HỦY ĐƠN CHO USER
  const executeCancelOrder = async () => {
    if (!orderToCancel) return;
    try {
      const token = localStorage.getItem("token");

      await axios.patch(
        `http://localhost:8080/api/orders/${orderToCancel}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );

      // Cập nhật lại UI sau khi hủy thành công (Trạng thái trả về chữ CANCELED)
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderToCancel ? { ...o, status: "CANCELED" } : o,
        ),
      );

      toast.success("Hủy đơn hàng thành công!");
      setIsCancelModalOpen(false);
      setOrderToCancel(null);
    } catch (error: any) {
      console.error("Hủy đơn thất bại", error);
      toast.error(
        error.response?.data?.message || "Không thể hủy đơn hàng này!",
      );
    }
  };

  const mockWishlist = [
    {
      id: 1,
      name: "iPhone 15 Pro Max 256GB",
      brand: "Apple",
      price: 29990000,
      originalPrice: 34990000,
      image:
        "https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=600",
      rating: 4.9,
      inStock: true,
    },
    {
      id: 4,
      name: "Samsung Galaxy S24 Ultra",
      brand: "Samsung",
      price: 26990000,
      originalPrice: 33990000,
      image:
        "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600",
      rating: 4.8,
      inStock: true,
    },
    {
      id: 9,
      name: "Xiaomi Redmi Note 13 Pro",
      brand: "Xiaomi",
      price: 7990000,
      originalPrice: null, // Không có giá gốc
      image:
        "https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=600",
      rating: 4.7,
      inStock: false, // Demo trạng thái hết hàng luôn
    },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Thông tin cá nhân</h1>
        <p className="text-muted-foreground">
          Quản lý thông tin tài khoản của bạn
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Hồ sơ</TabsTrigger>
          <TabsTrigger value="orders">Đơn hàng</TabsTrigger>
          <TabsTrigger value="wishlist">Yêu thích</TabsTrigger>
          <TabsTrigger value="settings">Cài đặt</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Profile Picture */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <Avatar className="h-24 w-24">
                      <AvatarImage
                        src={state.user?.avatar || "/placeholder.svg"}
                        alt={state.user?.username}
                      />
                      <AvatarFallback className="text-2xl">
                        {state.user?.username?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
                    >
                      <User className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="text-center">
                    <h3 className="font-semibold text-lg">
                      {state.user?.username}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {state.user?.email}
                    </p>
                    <Badge variant="secondary" className="mt-2">
                      Khách hàng thân thiết
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Profile Information */}
            <div className="md:col-span-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Thông tin cá nhân</CardTitle>
                  {!isEditing ? (
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(true)}
                    >
                      Chỉnh sửa
                    </Button>
                  ) : (
                    <div className="space-x-2">
                      <Button variant="outline" onClick={handleCancel}>
                        Hủy
                      </Button>
                      <Button onClick={handleSave}>Lưu</Button>
                    </div>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="username">Tên người dùng</Label>
                      <Input
                        id="username"
                        value={formData.username}
                        onChange={(e) =>
                          setFormData({ ...formData, username: e.target.value })
                        }
                        className="pl-10"
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          id="email"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          className="pl-10"
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phone">Số điện thoại</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="phone"
                        value={formData.phoneNumber}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            phoneNumber: e.target.value,
                          })
                        }
                        className="pl-10"
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="address">Địa chỉ</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 text-muted-foreground h-4 w-4" />
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) =>
                          setFormData({ ...formData, address: e.target.value })
                        }
                        className="pl-10 min-h-[80px]"
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" /> Đơn hàng của tôi
              </CardTitle>
              <div className="flex flex-wrap gap-2 mt-4">
                <Button
                  variant={orderStatusFilter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFilterChange("all")}
                >
                  Tất cả ({orders.length})
                </Button>
                <Button
                  variant={
                    orderStatusFilter === "PENDING" ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => handleFilterChange("PENDING")}
                >
                  Chờ xác nhận (
                  {orders.filter((o) => o.status === "PENDING").length})
                </Button>
                <Button
                  variant={
                    orderStatusFilter === "PROCESSING" ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => handleFilterChange("PROCESSING")}
                >
                  Đang xử lý (
                  {orders.filter((o) => o.status === "PROCESSING").length})
                </Button>
                <Button
                  variant={
                    orderStatusFilter === "SHIPPING" ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => handleFilterChange("SHIPPING")}
                >
                  Đang giao (
                  {orders.filter((o) => o.status === "SHIPPING").length})
                </Button>
                <Button
                  variant={
                    orderStatusFilter === "COMPLETED" ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => handleFilterChange("COMPLETED")}
                >
                  Hoàn thành (
                  {orders.filter((o) => o.status === "COMPLETED").length})
                </Button>
                <Button
                  variant={
                    orderStatusFilter === "CANCELED" ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => handleFilterChange("CANCELED")}
                >
                  Đã hủy ({orders.filter((o) => o.status === "CANCELED").length}
                  )
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {currentOrders.map((order) => (
                  <Card
                    key={order.id}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-start gap-4">
                            <h3 className="font-semibold text-lg">
                              Mã đơn: {order.orderCode}
                            </h3>
                            <Badge
                              className={
                                order.status === "PENDING"
                                  ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                                  : order.status === "PROCESSING"
                                    ? "bg-blue-100 text-blue-800 border-blue-300"
                                    : order.status === "SHIPPING"
                                      ? "bg-purple-100 text-purple-800 border-purple-300"
                                      : order.status === "COMPLETED"
                                        ? "bg-green-100 text-green-800 border-green-300"
                                        : "bg-red-100 text-red-800 border-red-300"
                              }
                            >
                              {statusTextMap[order.status] || order.status}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                            <div>
                              <p className="text-muted-foreground mb-1">
                                Ngày đặt hàng
                              </p>
                              <p className="font-medium">
                                {new Date(order.createdDate).toLocaleDateString(
                                  "vi-VN",
                                )}
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground mb-1">
                                Tổng tiền
                              </p>
                              <p className="font-bold text-lg text-red-600">
                                {order.totalPrice.toLocaleString("vi-VN")} đ
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground mb-1">
                                Người nhận
                              </p>
                              <p className="font-medium">
                                {order.customerName}
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground mb-1">
                                Số điện thoại
                              </p>
                              <p className="font-medium">
                                {order.customerPhone}
                              </p>
                            </div>
                            <div className="md:col-span-2">
                              <p className="text-muted-foreground mb-1">
                                Địa chỉ giao hàng
                              </p>
                              <p className="font-medium flex items-start gap-1">
                                <MapPin className="h-4 w-4 mt-0.5 text-blue-600 flex-shrink-0" />
                                {order.customerAddress}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Right side: Actions */}
                        <div className="flex flex-col items-end gap-2 md:min-w-[150px]">
                          <Button
                            variant="default"
                            size="sm"
                            asChild
                            className="h-8 px-2 text-xs"
                          >
                            <a
                              href={`/order-details/${order.id}`}
                              className="flex items-center gap-1 w-[120px]"
                            >
                              <Eye className="h-3 w-3" /> Chi tiết
                            </a>
                          </Button>

                          {/* 🛑 GỌI POPUP HỦY ĐƠN THAY VÌ GỌI THẲNG API */}
                          {order.status === "PENDING" && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 px-2 text-xs text-red-600 hover:text-red-700 bg-transparent w-[120px]"
                              onClick={() => openCancelModal(order.id)}
                            >
                              <X className="h-3 w-3 mr-1" /> Hủy đơn
                            </Button>
                          )}

                          {order.status === "COMPLETED" && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 px-2 text-xs bg-transparent w-[120px]"
                            >
                              <ShoppingCart className="h-3 w-3 mr-1" /> Mua lại
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-6 pt-4 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(1, prev - 1))
                      }
                      disabled={currentPage === 1}
                    >
                      Trước
                    </Button>
                    <div className="flex gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                          <Button
                            key={page}
                            variant={
                              currentPage === page ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => setCurrentPage(page)}
                            className="w-10"
                          >
                            {page}
                          </Button>
                        ),
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                      }
                      disabled={currentPage === totalPages}
                    >
                      Sau
                    </Button>
                  </div>
                )}

                {currentOrders.length === 0 && (
                  <div className="text-center py-12">
                    <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      Không có đơn hàng
                    </h3>
                    <p className="text-muted-foreground">
                      {orderStatusFilter === "all"
                        ? "Bạn chưa có đơn hàng nào"
                        : `Không có đơn hàng ở trạng thái "${orderStatusFilter}"`}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wishlist">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" /> Sản phẩm yêu thích (
                {mockWishlist.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockWishlist.map((product) => (
                  <div
                    key={product.id}
                    className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow group"
                  >
                    <div className="relative">
                      <a href={`/product/${product.id}`}>
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          className="w-full h-48 object-cover"
                        />
                      </a>
                      <Button
                        size="icon"
                        variant="destructive"
                        className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Heart className="h-4 w-4 fill-current" />
                      </Button>
                    </div>
                    <div className="p-4">
                      <p className="text-xs text-muted-foreground mb-1">
                        {product.brand}
                      </p>
                      <a href={`/product/${product.id}`}>
                        <h3 className="font-semibold mb-2 hover:text-blue-600 transition-colors">
                          {product.name}
                        </h3>
                      </a>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center">
                          <span className="text-yellow-500 text-sm">★</span>
                          <span className="text-sm ml-1">{product.rating}</span>
                        </div>
                        <Badge
                          variant={product.inStock ? "default" : "secondary"}
                        >
                          {product.inStock ? "Còn hàng" : "Hết hàng"}
                        </Badge>
                      </div>
                      <div className="flex items-baseline gap-2 mb-3">
                        <span className="text-lg font-bold text-red-600">
                          {product.price.toLocaleString("vi-VN")} đ
                        </span>
                        {product.originalPrice && (
                          <span className="text-sm text-muted-foreground line-through">
                            {product.originalPrice.toLocaleString("vi-VN")} đ
                          </span>
                        )}
                      </div>
                      <Button className="w-full" disabled={!product.inStock}>
                        {product.inStock ? "Thêm vào giỏ" : "Hết hàng"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" /> Cài đặt tài khoản
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Thông báo email</h4>
                    <p className="text-sm text-muted-foreground">
                      Nhận thông báo về đơn hàng và khuyến mãi
                    </p>
                  </div>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Thông báo SMS</h4>
                    <p className="text-sm text-muted-foreground">
                      Nhận SMS về trạng thái đơn hàng
                    </p>
                  </div>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Chế độ tối</h4>
                    <p className="text-sm text-muted-foreground">
                      Sử dụng giao diện tối
                    </p>
                  </div>
                  <input type="checkbox" className="rounded" />
                </div>
              </div>
              <div className="pt-4 border-t">
                <Button variant="destructive">Xóa tài khoản</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 🛑 POPUP XÁC NHẬN HỦY ĐƠN CỦA USER */}
      <AlertDialog open={isCancelModalOpen} onOpenChange={setIsCancelModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" /> Xác nhận hủy đơn hàng
            </AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn hủy đơn hàng này không? Số lượng sản phẩm sẽ
              được trả lại vào kho.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Suy nghĩ lại</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={(e) => {
                e.preventDefault();
                executeCancelOrder();
              }}
            >
              Chắc chắn hủy
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
