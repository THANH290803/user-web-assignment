"use client"

import Link from "next/link"
import Image from "next/image"
import axios from "axios"
import { useEffect, useState } from "react"

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

                // ⚠️ API trả result
                const data = res.data.result || []

                // random sản phẩm
                const shuffled = [...data].sort(() => Math.random() - 0.5)

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
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                        Sản phẩm nổi bật
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Những sản phẩm được yêu thích nhất
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                    {products.map((item: any) => {

                        const product = item.product
                        const config = item.configuration

                        const mainImg =
                            item.images?.find((img: any) => img.isMain)?.imageUrl
                            || item.images?.[0]?.imageUrl
                            || "/placeholder.svg"

                        const specs = config?.specifications?.slice(0, 3) ?? []

                        return (

                            <Link key={item.productDetail.id} href={`/product/${product.id}`}>

                                <div className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">

                                    <div className="relative p-4 bg-gray-50">

                                        <Image
                                            src={mainImg}
                                            alt={product.name}
                                            width={300}
                                            height={200}
                                            className="w-full h-48 object-contain group-hover:scale-105 transition-transform"
                                        />

                                    </div>

                                    <div className="p-4">

                                        <div className="text-sm text-gray-500 mb-1">
                                            {item.brand?.name}
                                        </div>

                                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                                            {product.name}
                                        </h3>

                                        <div className="space-y-1 mb-3">
                                            {specs.map((spec: any) => (
                                                <div key={spec.id} className="text-xs text-gray-600">
                                                    • {spec.name}: {spec.value}
                                                </div>
                                            ))}
                                        </div>

                                        <div className="text-lg font-bold text-red-600">
                                            {formatPrice(item.productDetail.price)}
                                        </div>

                                    </div>

                                </div>

                            </Link>
                        )
                    })}

                </div>

            </div>
        </section>
    )
}