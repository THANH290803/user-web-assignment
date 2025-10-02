"use client"

import Link from "next/link"
import Image from "next/image"

export default function FeaturedProducts() {
    const products = [
        {
            id: 1,
            name: 'MacBook Pro M3 14"',
            brand: "Apple",
            price: 52990000,
            originalPrice: 55990000,
            image: "/macbook-pro-laptop.png",
            rating: 4.9,
            reviews: 128,
            specs: ["M3 Pro chip", "18GB RAM", "512GB SSD"],
        },
        {
            id: 2,
            name: "iPhone 15 Pro Max",
            brand: "Apple",
            price: 34990000,
            originalPrice: 36990000,
            image: "/iphone-15-pro-max-display.png",
            rating: 4.8,
            reviews: 256,
            specs: ["A17 Pro chip", "256GB", "Titanium"],
        },
        {
            id: 3,
            name: "Samsung Galaxy S24 Ultra",
            brand: "Samsung",
            price: 31990000,
            originalPrice: 33990000,
            image: "/samsung-galaxy-s24-ultra.png",
            rating: 4.7,
            reviews: 189,
            specs: ["Snapdragon 8 Gen 3", "12GB RAM", "S Pen"],
        },
        {
            id: 4,
            name: "Dell XPS 13",
            brand: "Dell",
            price: 28990000,
            originalPrice: 30990000,
            image: "/dell-xps-13-laptop.png",
            rating: 4.6,
            reviews: 94,
            specs: ["Intel i7-1360P", "16GB RAM", "512GB SSD"],
        },
    ]

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(price)
    }

    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 text-balance">Sản phẩm nổi bật</h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Những sản phẩm được yêu thích nhất với giá ưu đãi đặc biệt
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <Link key={product.id} href={`/product/${product.id}`}>
                            <div className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                                <div className="relative p-4 bg-gray-50">
                                    <Image
                                        src={product.image || "/placeholder.svg"}
                                        alt={product.name}
                                        width={300}
                                        height={200}
                                        className="w-full h-48 object-contain group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                                        -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                                    </div>
                                </div>

                                <div className="p-4">
                                    <div className="text-sm text-gray-500 mb-1">{product.brand}</div>
                                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>

                                    <div className="flex items-center gap-1 mb-2">
                                        <div className="flex items-center">
                                            {[...Array(5)].map((_, i) => (
                                                <span
                                                    key={i}
                                                    className={`text-sm ${i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-300"}`}
                                                >
                                                    ★
                                                </span>
                                            ))}
                                        </div>
                                        <span className="text-sm text-gray-600">
                                            {product.rating} ({product.reviews})
                                        </span>
                                    </div>

                                    <div className="space-y-1 mb-3">
                                        {product.specs.map((spec, index) => (
                                            <div key={index} className="text-xs text-gray-600">
                                                • {spec}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg font-bold text-red-600">{formatPrice(product.price)}</span>
                                            <span className="text-sm text-gray-500 line-through">{formatPrice(product.originalPrice)}</span>
                                        </div>

                                        <button
                                            onClick={(e) => e.preventDefault()}
                                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <span>🛒</span>
                                            Thêm vào giỏ
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <button className="bg-gray-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
                        Xem tất cả sản phẩm
                    </button>
                </div>
            </div>
        </section>
    )
}
