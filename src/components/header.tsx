"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/auth-context";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface CartItem {
  configId: number;
  quantity: number;
  [key: string]: any;
}

function Header() {
  // 🛑 ĐÃ SỬA: Lấy authState và hàm logout
  const { state: authState, logout: authLogout } = useAuth();
  const [categories, setCategories] = useState<any[]>([]);
  const [cartCount, setCartCount] = useState(0);

  // Load danh mục từ API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/categories");
        if (res.data?.result) {
          setCategories(res.data.result);
        }
      } catch (error) {
        console.error("Lỗi load categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const calculateCartCount = () => {
    const storedCart: CartItem[] = JSON.parse(
      localStorage.getItem("cart") || "[]",
    );
    const totalQuantity = storedCart.reduce(
      (sum, item) => sum + item.quantity,
      0,
    );
    setCartCount(totalQuantity);
  };

  useEffect(() => {
    calculateCartCount();
    const handleCartUpdated = () => calculateCartCount();
    window.addEventListener("cartUpdated", handleCartUpdated);
    return () => window.removeEventListener("cartUpdated", handleCartUpdated);
  }, []);

  // 🛑 ĐÃ SỬA: Hàm logout dọn sạch giỏ hàng
  const handleLogout = () => {
    localStorage.removeItem("cart");
    authLogout(); // Gọi hàm logout từ auth-context
    window.location.href = "/";
  };

  return (
    <header className="bg-white shadow-sm">
      {/* Top bar */}
      <div className="bg-slate-900 text-white py-2">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span>Hotline: 1900-1234</span>
            </div>
            <div className="flex items-center gap-2">
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
            <form
              className="relative w-full"
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const keyword = (
                  form.elements.namedItem("search") as HTMLInputElement
                ).value;
                if (keyword.trim()) {
                  window.location.href = `/search?q=${encodeURIComponent(keyword)}`;
                }
              }}
            >
              <Input
                name="search"
                type="text"
                placeholder="Tìm kiếm sản phẩm (Ví dụ: iPhone)..."
                className="w-full pl-4 pr-12 py-2 border-2 border-slate-200 rounded-lg focus:border-blue-500"
              />
              <Button
                type="submit"
                size="sm"
                className="absolute right-1 top-1 bg-blue-600 hover:bg-blue-700"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <circle cx="11" cy="11" r="8" strokeWidth="2" />
                  <path d="m21 21-4.35-4.35" strokeWidth="2" />
                </svg>
              </Button>
            </form>
          </div>

          <div className="flex items-center space-x-4">
            {authState.isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hidden md:flex items-center gap-2"
                  >
                    <Avatar className="h-6 w-6">
                      <AvatarImage
                        src={authState.user?.avatar || "/placeholder.svg"}
                      />
                      <AvatarFallback className="text-xs">
                        {/* 🛑 ĐÃ SỬA: Dùng username thay vì name */}
                        {authState.user?.username?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span>{authState.user?.username}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center gap-2">
                      Thông tin cá nhân
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-red-600"
                  >
                    Đăng xuất
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="hidden md:flex items-center gap-2"
                asChild
              >
                <Link href="/login">
                  <span>Đăng nhập</span>
                </Link>
              </Button>
            )}

            <Button variant="ghost" size="sm" className="relative" asChild>
              <Link href="/cart">
                <div className="relative">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                  >
                    <path d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                  </svg>
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium shadow-lg animate-pulse">
                      {cartCount}
                    </span>
                  )}
                </div>
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-slate-50 border-t">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-8 py-3">
            {/* 🛑 ĐÃ SỬA: Chỉ map từ API, xóa các Link Gaming/Deals fix cứng */}
            {categories.map((cat: any) => (
              <Link
                key={cat.id}
                href={`/category/${cat.id}`}
                className="text-slate-700 hover:text-blue-600 font-medium"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}

export { Header };
export default Header;
