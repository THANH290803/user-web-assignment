"use client"

import Link from "next/link"
import Image from "next/image"
import axios from "axios"
import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"

export default function FeaturedProducts() {
    const [products, setProducts] = useState<any[]>([])

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(price)
    }

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get("http://localhost:8080/api/product-details")

                const data = res.data

                // 🔀 Random 4 sản phẩm
                const shuffled = data.sort(() => Math.random() - 0.5)
                const selected = shuffled.slice(0, 4)

                setProducts(selected)
            } catch (error) {
                console.error("Lỗi fetch sản phẩm:", error)
            }
        }

        fetchProducts()
    }, [])

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
                    {products.map((item: any) => {
                        const product = item.product
                        const config = item.configuration

                        const mainImg = product?.images?.find((img: any) => img.isMain)?.imageUrl || "/placeholder.svg"
                        const specs = config?.specifications?.slice(0, 3) ?? []

                        return (
                            <Link key={`${product.id}-${config?.id}`} href={`/product/${product.id}`}>
                                <div className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                                    <div className="relative p-4 bg-gray-50">
                                        <Image
                                            src={mainImg || "/placeholder.svg"}
                                            alt={product.name}
                                            width={300}
                                            height={200}
                                            className="w-full h-48 object-contain group-hover:scale-105 transition-transform duration-300"
                                        />
                                        {/* <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                                            -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                                        </div> */}
                                    </div>

                                    <div className="p-4">
                                        <div className="text-sm text-gray-500 mb-1">{product.brand?.name}</div>
                                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>

                                        <div className="flex items-center gap-1 mb-2">
                                            <div className="flex items-center gap-1 mb-2">
                                                <div className="flex items-center">
                                                    {[...Array(5)].map((_, i) => (
                                                        <span
                                                            key={i}
                                                            className={`text-sm ${i < 4 ? "text-yellow-400" : "text-yellow-400/50"
                                                                }`}
                                                        >
                                                            ★
                                                        </span>
                                                    ))}
                                                </div>

                                                <span className="text-sm text-gray-600">
                                                    4.5 (128)
                                                </span>
                                            </div>
                                            {/* <span className="text-sm text-gray-600">
                                                {product.rating} ({product.reviews})
                                            </span> */}
                                        </div>

                                        <div className="space-y-1 mb-3">
                                            {specs.map((spec: any, idx: number) => (
                                                <div key={idx} className="text-xs text-gray-600">
                                                    • {spec.name}: {spec.value}
                                                </div>
                                            ))}
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <span className="text-lg font-bold text-red-600">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-lg font-bold text-red-600">
                                                            {formatPrice(item.price)}
                                                        </span>

                                                        {item.originalPrice && (
                                                            <span className="text-sm line-through text-gray-500">
                                                                {formatPrice(item.originalPrice)}
                                                            </span>
                                                        )}
                                                    </div>
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                                                <div className="text-xs text-gray-600">📦 Đã bán 1.2K+</div>
                                                <button
                                                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                                    onClick={(e) => e.preventDefault()}
                                                >
                                                    <span className="text-xl">♡</span>
                                                </button>
                                            </div>

                                            <div className="flex gap-2 pt-2">
                                                <span className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded font-semibold">🔥 Hot</span>
                                                <span className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded font-semibold">
                                                    ✓ Uy tín
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        )
                    })}
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
