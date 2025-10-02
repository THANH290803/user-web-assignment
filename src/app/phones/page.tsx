"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, ShoppingCart } from "lucide-react"
import ProductFilters from "@/components/product-filters"
import Header from "@/components/header"
import Footer from "@/components/footer"

type Filters = {
  brands: string[]
  priceRange: [number, number]
  processors: string[]
  ram: string[]
}

const phones = [
  {
    id: 1,
    name: 'MacBook Pro 14" M3',
    brand: "Apple",
    price: 52990000,
    originalPrice: 55990000,
    image: "/macbook-pro-14-inch-silver.jpg",
    rating: 4.5,
    reviews: 124,
    specs: ["Chip M3", "16GB RAM", "512GB SSD", 'Màn hình 14.2"'],
    processor: "M3",
    ram: "16GB",
    inStock: true,
  },
  {
    id: 2,
    name: "iPhone 15 Pro Max",
    brand: "Apple",
    price: 34990000,
    originalPrice: 36990000,
    image: "/iphone-15-pro-max-titanium.png",
    rating: 4.8,
    reviews: 256,
    specs: ["A17 Pro", "8GB RAM", "256GB", "Titanium"],
    processor: "A17 Pro",
    ram: "8GB",
    inStock: true,
  },
  {
    id: 3,
    name: "Samsung Galaxy S24 Ultra",
    brand: "Samsung",
    price: 29990000,
    originalPrice: 31990000,
    image: "/samsung-galaxy-s24-ultra-black.jpg",
    rating: 4.6,
    reviews: 189,
    specs: ["Snapdragon 8 Gen 3", "12GB RAM", "256GB", "S Pen"],
    processor: "Snapdragon 8 Gen 3",
    ram: "12GB",
    inStock: true,
  },
]

export default function PhonesPage() {
  const [filteredPhones, setFilteredPhones] = useState(phones)

  const handleFilterChange = (filters: Filters) => {
    let filtered = phones

    if (filters.brands.length > 0) {
      filtered = filtered.filter((phone) => filters.brands.includes(phone.brand))
    }

    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 100000000) {
      filtered = filtered.filter(
        (phone) =>
          phone.price >= filters.priceRange[0] && phone.price <= filters.priceRange[1],
      )
    }

    if (filters.processors.length > 0) {
      filtered = filtered.filter((phone) =>
        filters.processors.includes(phone.processor),
      )
    }

    if (filters.ram.length > 0) {
      filtered = filtered.filter((phone) => filters.ram.includes(phone.ram))
    }

    setFilteredPhones(filtered)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-64 flex-shrink-0">
            <ProductFilters onFilterChange={handleFilterChange} />
          </aside>

          <main className="flex-1">
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2">Điện thoại</h1>
              <p className="text-muted-foreground">
                Tìm thấy {filteredPhones.length} sản phẩm
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPhones.map((phone) => (
                <Card
                  key={phone.id}
                  className="group hover:shadow-lg transition-shadow duration-200 overflow-hidden"
                >
                  <div className="relative">
                    <Image
                      src={phone.image || "/placeholder.svg"}
                      alt={phone.name}
                      width={400}
                      height={300}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    {!phone.inStock && (
                      <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
                        Hết hàng
                      </Badge>
                    )}
                  </div>

                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2 min-h-[3.5rem]">
                      {phone.name}
                    </h3>

                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(phone.rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span className="text-sm text-muted-foreground ml-1">
                        ({phone.reviews} đánh giá)
                      </span>
                    </div>

                    <div className="space-y-1 mb-3">
                      {phone.specs.slice(0, 2).map((spec, index) => (
                        <div key={index} className="text-sm text-muted-foreground">
                          {spec}
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xl font-bold text-red-600 break-words">
                          {phone.price.toLocaleString("vi-VN")} đ
                        </span>
                        {phone.originalPrice && (
                          <span className="text-sm text-muted-foreground line-through break-words">
                            {phone.originalPrice.toLocaleString("vi-VN")} đ
                          </span>
                        )}
                      </div>
                    </div>

                    <Button
                      className="w-full"
                      size="sm"
                      disabled={!phone.inStock}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      {phone.inStock ? "Thêm vào giỏ" : "Hết hàng"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  )
}
