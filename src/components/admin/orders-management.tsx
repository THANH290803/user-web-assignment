"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  Package,
  DollarSign,
  ShoppingCart,
} from "lucide-react"

// Mock orders data
const orders = [
  {
    id: "#ORD-001",
    customer: {
      name: "Nguyễn Văn A",
      email: "nguyenvana@email.com",
      phone: "0123456789",
    },
    products: [{ name: 'MacBook Pro 14"', quantity: 1, price: 52990000 }],
    total: 52990000,
    status: "completed",
    paymentMethod: "cod",
    shippingAddress: "123 Nguyễn Văn Linh, Q.7, TP.HCM",
    createdAt: "2024-01-15T10:30:00",
    updatedAt: "2024-01-16T14:20:00",
  },
  {
    id: "#ORD-002",
    customer: {
      name: "Trần Thị B",
      email: "tranthib@email.com",
      phone: "0987654321",
    },
    products: [
      { name: "iPhone 15 Pro Max", quantity: 1, price: 34990000 },
      { name: "AirPods Pro", quantity: 1, price: 6990000 },
    ],
    total: 41980000,
    status: "processing",
    paymentMethod: "bank",
    shippingAddress: "456 Lê Văn Việt, Q.9, TP.HCM",
    createdAt: "2024-01-15T09:15:00",
    updatedAt: "2024-01-15T09:15:00",
  },
  {
    id: "#ORD-003",
    customer: {
      name: "Lê Văn C",
      email: "levanc@email.com",
      phone: "0369852147",
    },
    products: [{ name: "Dell XPS 13", quantity: 1, price: 28990000 }],
    total: 28990000,
    status: "shipped",
    paymentMethod: "cod",
    shippingAddress: "789 Võ Văn Tần, Q.3, TP.HCM",
    createdAt: "2024-01-14T16:45:00",
    updatedAt: "2024-01-15T08:30:00",
  },
  {
    id: "#ORD-004",
    customer: {
      name: "Phạm Thị D",
      email: "phamthid@email.com",
      phone: "0741852963",
    },
    products: [{ name: "Samsung Galaxy S24", quantity: 2, price: 31990000 }],
    total: 63980000,
    status: "pending",
    paymentMethod: "bank",
    shippingAddress: "321 Cách Mạng Tháng 8, Q.10, TP.HCM",
    createdAt: "2024-01-14T11:20:00",
    updatedAt: "2024-01-14T11:20:00",
  },
]

const stats = [
  {
    title: "Tổng đơn hàng",
    value: "1,234",
    change: "+12%",
    icon: ShoppingCart,
    color: "text-blue-600",
  },
  {
    title: "Doanh thu",
    value: "2.4B VNĐ",
    change: "+8.5%",
    icon: DollarSign,
    color: "text-green-600",
  },
  {
    title: "Chờ xử lý",
    value: "23",
    change: "+5",
    icon: Clock,
    color: "text-orange-600",
  },
  {
    title: "Hoàn thành",
    value: "1,156",
    change: "+15%",
    icon: CheckCircle,
    color: "text-purple-600",
  },
]

export function OrdersManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: {
        label: "Chờ xử lý",
        variant: "destructive" as const,
        icon: Clock,
      },
      processing: {
        label: "Đang xử lý",
        variant: "secondary" as const,
        icon: Package,
      },
      shipped: {
        label: "Đã giao",
        variant: "outline" as const,
        icon: Truck,
      },
      completed: {
        label: "Hoàn thành",
        variant: "default" as const,
        icon: CheckCircle,
      },
      cancelled: {
        label: "Đã hủy",
        variant: "destructive" as const,
        icon: XCircle,
      },
    }

    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.pending
    const Icon = statusInfo.icon

    return (
      <Badge variant={statusInfo.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {statusInfo.label}
      </Badge>
    )
  }

  const getPaymentMethodLabel = (method: string) => {
    return method === "cod" ? "COD" : "Chuyển khoản"
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === "all" || order.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Quản lý đơn hàng</h1>
        <p className="text-muted-foreground">Theo dõi và xử lý các đơn hàng của khách hàng</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">{stat.change}</span> so với tháng trước
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Danh sách đơn hàng</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Tìm kiếm đơn hàng..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="pending">Chờ xử lý</SelectItem>
                  <SelectItem value="processing">Đang xử lý</SelectItem>
                  <SelectItem value="shipped">Đã giao</SelectItem>
                  <SelectItem value="completed">Hoàn thành</SelectItem>
                  <SelectItem value="cancelled">Đã hủy</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã đơn hàng</TableHead>
                <TableHead>Khách hàng</TableHead>
                <TableHead>Sản phẩm</TableHead>
                <TableHead>Tổng tiền</TableHead>
                <TableHead>Thanh toán</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{order.customer.name}</div>
                      <div className="text-sm text-muted-foreground">{order.customer.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {order.products.map((product, index) => (
                        <div key={index} className="text-sm">
                          {product.name} x{product.quantity}
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{formatPrice(order.total)}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{getPaymentMethodLabel(order.paymentMethod)}</Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          Xem chi tiết
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Package className="mr-2 h-4 w-4" />
                          Cập nhật trạng thái
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Truck className="mr-2 h-4 w-4" />
                          Thông tin vận chuyển
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
