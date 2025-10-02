"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/contexts/auth-context"
import { useCart } from "@/contexts/cart-context"

function Header() {
  const { state: authState, logout } = useAuth()
  const { state: cartState } = useCart()

  return (
    <header className="bg-white shadow-sm">
      {/* Top bar */}
      <div className="bg-slate-900 text-white py-2">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
                  strokeWidth="2"
                />
              </svg>
              <span>Hotline: 1900-1234</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" strokeWidth="2" />
                <polyline points="22,6 12,13 2,6" strokeWidth="2" />
              </svg>
              <span>support@techstore.vn</span>
            </div>
          </div>
          <div className="hidden md:block">
            <span>Miễn phí vận chuyển cho đơn hàng trên 2 triệu đồng</span>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 rounded-lg">
              <span className="font-bold text-xl">TS</span>
            </div>
            <div>
              <h1 className="font-bold text-xl text-slate-900">TechStore</h1>
              <p className="text-xs text-slate-600">Công nghệ cho mọi nhà</p>
            </div>
          </Link>

          {/* Search bar */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <Input
                type="text"
                placeholder="Tìm kiếm laptop, điện thoại, phụ kiện..."
                className="w-full pl-4 pr-12 py-2 border-2 border-slate-200 rounded-lg focus:border-blue-500"
              />
              <Button size="sm" className="absolute right-1 top-1 bg-blue-600 hover:bg-blue-700">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" strokeWidth="2" />
                  <path d="m21 21-4.35-4.35" strokeWidth="2" />
                </svg>
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {authState.isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="hidden md:flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={authState.user?.avatar || "/placeholder.svg"} alt={authState.user?.name} />
                      <AvatarFallback className="text-xs">{authState.user?.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span>{authState.user?.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeWidth="2" />
                        <circle cx="12" cy="7" r="4" strokeWidth="2" />
                      </svg>
                      Thông tin cá nhân
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="flex items-center gap-2 text-red-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" strokeWidth="2" />
                      <polyline points="16,17 21,12 16,7" strokeWidth="2" />
                      <line x1="21" y1="12" x2="9" y2="12" strokeWidth="2" />
                    </svg>
                    Đăng xuất
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" size="sm" className="hidden md:flex items-center gap-2" asChild>
                <Link href="/login">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeWidth="2" />
                    <circle cx="12" cy="7" r="4" strokeWidth="2" />
                  </svg>
                  <span>Đăng nhập</span>
                </Link>
              </Button>
            )}

            <Button variant="ghost" size="sm" className="relative" asChild>
              <Link href="/cart">
                <div className="relative">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                    <path d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                  </svg>
                  {cartState.itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium shadow-lg animate-pulse">
                      {cartState.itemCount}
                    </span>
                  )}
                </div>
              </Link>
            </Button>

            <Button variant="ghost" size="sm" className="md:hidden">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <line x1="3" y1="6" x2="21" y2="6" strokeWidth="2" />
                <line x1="3" y1="12" x2="21" y2="12" strokeWidth="2" />
                <line x1="3" y1="18" x2="21" y2="18" strokeWidth="2" />
              </svg>
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-slate-50 border-t">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-8 py-3">
            <Link href="/laptops" className="text-slate-700 hover:text-blue-600 font-medium">
              Laptop
            </Link>
            <Link href="/phones" className="text-slate-700 hover:text-blue-600 font-medium">
              Điện thoại
            </Link>
            <Link href="/accessories" className="text-slate-700 hover:text-blue-600 font-medium">
              Phụ kiện
            </Link>
            <Link href="/gaming" className="text-slate-700 hover:text-blue-600 font-medium">
              Gaming
            </Link>
            <Link href="/deals" className="text-slate-700 hover:text-blue-600 font-medium text-red-600">
              Khuyến mãi
            </Link>
          </div>
        </div>
      </nav>
    </header>
  )
}

// Export both named and default exports for compatibility
export { Header }
export default Header
