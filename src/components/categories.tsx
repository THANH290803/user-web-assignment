"use client"

import { useEffect, useState, ReactNode } from "react"
import axios from "axios"


// Type cho FE template
type CategoryInfo = {
  description: string
  icon: ReactNode // ⚡ dùng ReactNode thay cho JSX.Element
  href: string
}

// Type cho API trả về
type ApiCategory = {
  id: number
  name: string
  description?: string | null
  deletedAt?: string | null
}

// Kết hợp API + FE template
type Category = ApiCategory & CategoryInfo

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([])

  // ⚡ FIX JSX gạch đỏ bằng ReactNode
  const categoryTemplate: Record<string, CategoryInfo> = {
    Laptop: {
      description: "Gaming, văn phòng, đồ họa",
      icon: (
        <div className="bg-blue-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" strokeWidth="2" />
            <line x1="8" y1="21" x2="16" y2="21" strokeWidth="2" />
            <line x1="12" y1="17" x2="12" y2="21" strokeWidth="2" />
          </svg>
        </div>
      ),
      href: "/laptops",
    },
    "Điện thoại": {
      description: "iPhone, Samsung, Xiaomi",
      icon: (
        <div className="bg-purple-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <rect x="5" y="2" width="14" height="20" rx="2" ry="2" strokeWidth="2" />
            <line x1="12" y1="18" x2="12.01" y2="18" strokeWidth="2" />
          </svg>
        </div>
      ),
      href: "/phones",
    },
    "Phụ kiện": {
      description: "Tai nghe, chuột, bàn phím",
      icon: (
        <div className="bg-green-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M3 18v-6a9 9 0 0 1 18 0v6" strokeWidth="2" />
            <path
              d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"
              strokeWidth="2"
            />
          </svg>
        </div>
      ),
      href: "/accessories",
    },
    "Đồng hồ thông minh": {
      description: "Apple Watch, Samsung Galaxy",
      icon: (
        <div className="bg-orange-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" strokeWidth="2" />
            <path d="M5 21c0-7 0-9 9-9" strokeWidth="2" />
          </svg>
        </div>
      ),
      href: "/watches",
    },
  }

  useEffect(() => {
    axios
      .get<ApiCategory[]>("http://localhost:8080/api/categories")
      .then((res) => {
        const apiData = res.data || []

        const merged: Category[] = apiData
          .filter((c) => categoryTemplate[c.name])
          .map((c) => ({
            ...c,
            ...categoryTemplate[c.name],
          }))

        setCategories(merged)
      })
      .catch((err) => {
        console.error("Error fetching categories:", err)
      })
  }, [])

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 text-balance">Danh mục sản phẩm</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Tìm kiếm sản phẩm công nghệ phù hợp với nhu cầu của bạn
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <a
              key={category.name}
              href={category.href}
              className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              {category.icon}
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.name}</h3>
              <p className="text-gray-600 text-sm">{category.description}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
