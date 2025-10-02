"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductFilters } from "@/components/product-filters"
import { ProductGrid } from "@/components/product-grid"

const laptops = [
    {
        id: 1,
        name: 'MacBook Pro 14" M3',
        brand: "Apple",
        price: 52990000,
        originalPrice: 55990000,
        image: "/macbook-pro-laptop.png",
        rating: 4.8,
        reviews: 124,
        specs: ["Chip M3", "16GB RAM", "512GB SSD", '14" Retina'],
        inStock: true,
    },
    {
        id: 2,
        name: "Dell XPS 13 Plus",
        brand: "Dell",
        price: 35990000,
        originalPrice: 39990000,
        image: "/dell-xps-13-laptop.png",
        rating: 4.6,
        reviews: 89,
        specs: ["Intel i7", "16GB RAM", "512GB SSD", '13.4" OLED'],
        inStock: true,
    },
    {
        id: 3,
        name: "ASUS ROG Strix G15",
        brand: "ASUS",
        price: 28990000,
        originalPrice: 32990000,
        image: "/asus-rog-gaming-laptop.jpg",
        rating: 4.7,
        reviews: 156,
        specs: ["AMD Ryzen 7", "16GB RAM", "1TB SSD", "RTX 4060"],
        inStock: true,
    },
    {
        id: 4,
        name: "HP Spectre x360",
        brand: "HP",
        price: 31990000,
        originalPrice: 34990000,
        image: "/hp-spectre-x360.png",
        rating: 4.5,
        reviews: 73,
        specs: ["Intel i7", "16GB RAM", "512GB SSD", '13.5" Touch'],
        inStock: true,
    },
    {
        id: 5,
        name: "Lenovo ThinkPad X1 Carbon",
        brand: "Lenovo",
        price: 42990000,
        originalPrice: 45990000,
        image: "/lenovo-thinkpad-x1-carbon-business-laptop.jpg",
        rating: 4.6,
        reviews: 98,
        specs: ["Intel i7", "16GB RAM", "1TB SSD", '14" 2K'],
        inStock: true,
    },
    {
        id: 6,
        name: "MSI Gaming GF63",
        brand: "MSI",
        price: 19990000,
        originalPrice: 22990000,
        image: "/msi-gaming-laptop.jpg",
        rating: 4.4,
        reviews: 67,
        specs: ["Intel i5", "8GB RAM", "512GB SSD", "GTX 1650"],
        inStock: true,
    },
]

export default function LaptopsPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Laptop</h1>
                    <p className="text-gray-600">Khám phá bộ sưu tập laptop cao cấp với hiệu năng vượt trội</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    <aside className="lg:w-64 flex-shrink-0">
                        <ProductFilters onFilterChange={() => {}} />

                    </aside>

                    <div className="flex-1">
                        <div className="flex justify-between items-center mb-6">
                            <p className="text-gray-600">Hiển thị {laptops.length} sản phẩm</p>
                            <select className="border border-gray-300 rounded-lg px-3 py-2">
                                <option>Sắp xếp theo giá</option>
                                <option>Giá thấp đến cao</option>
                                <option>Giá cao đến thấp</option>
                                <option>Mới nhất</option>
                                <option>Bán chạy nhất</option>
                            </select>
                        </div>

                        <ProductGrid products={laptops} />
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
