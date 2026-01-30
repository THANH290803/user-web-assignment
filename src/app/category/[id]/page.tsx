/* eslint-disable @typescript-eslint/no-explicit-any */

"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductFilters } from "@/components/product-filters"
import { ProductGrid } from "@/components/product-grid"
import axios from "axios"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"

interface FilterState {
    brands: string[]
    minPrice?: number
    maxPrice?: number
    sortBy?: string
    sortDir?: "asc" | "desc"
}

export default function PhonesPage() {
    const params = useParams()
    const categoryId = params.id

    const [products, setProducts] = useState<any[]>([])
    const [brands, setBrands] = useState<any[]>([])
    const [brandsLoaded, setBrandsLoaded] = useState(false)

    const [filters, setFilters] = useState<FilterState>({
        brands: [],
        minPrice: undefined,
        maxPrice: undefined,
        sortBy: undefined,
        sortDir: undefined,
    })

    // Load brands
    useEffect(() => {
        const fetchBrands = async () => {
            try {
                const res = await axios.get("http://localhost:8080/api/brands")
                setBrands(res.data)
                setBrandsLoaded(true)
            } catch (err) {
                console.error("Lỗi fetch brands:", err)
            }
        }
        fetchBrands()
    }, [])

    // Fetch products
    useEffect(() => {
        if (!brandsLoaded) return

        const fetchProducts = async () => {
            try {
                const paramsApi: any = { categoryId }

                if (filters.brands.length > 0) {
                    const brandIds = filters.brands
                        .map((name) => brands.find((b) => b.name === name)?.id)
                        .filter(Boolean)
                    if (brandIds.length > 0) paramsApi.brandId = brandIds.join(",")
                }

                if (filters.minPrice) paramsApi.minPrice = filters.minPrice
                if (filters.maxPrice) paramsApi.maxPrice = filters.maxPrice
                if (filters.sortBy) paramsApi.sortBy = filters.sortBy
                if (filters.sortDir) paramsApi.sortDir = filters.sortDir

                const res = await axios.get("http://localhost:8080/api/product-details", {
                    params: paramsApi,
                })
                setProducts(res.data)
            } catch (err) {
                console.error("Lỗi fetch products:", err)
            }
        }

        fetchProducts()
    }, [categoryId, filters, brandsLoaded])

    const handleFilterChange = (newFilters: FilterState) => {
        setFilters(newFilters)
    }

    const handleSortChange = (sortValue: string) => {
        let sortBy = ""
        let sortDir: "asc" | "desc" = "asc"

        switch (sortValue) {
            case "Giá thấp đến cao":
                sortBy = "price"
                sortDir = "asc"
                break
            case "Giá cao đến thấp":
                sortBy = "price"
                sortDir = "desc"
                break
            case "Mới nhất":
                sortBy = "createdAt"
                sortDir = "desc"
                break
            case "Bán chạy nhất":
                sortBy = "sold"
                sortDir = "desc"
                break
        }

        setFilters((prev) => ({ ...prev, sortBy, sortDir }))
    }

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
                        <ProductFilters onFilterChange={handleFilterChange} brands={brands} />
                    </aside>

                    <div className="flex-1">
                        <div className="flex justify-between items-center mb-6">
                            <select
                                className="border border-gray-300 rounded-lg px-3 py-2"
                                onChange={(e) => handleSortChange(e.target.value)}
                            >
                                <option>Sắp xếp theo giá</option>
                                <option>Giá thấp đến cao</option>
                                <option>Giá cao đến thấp</option>
                                <option>Mới nhất</option>
                                <option>Bán chạy nhất</option>
                            </select>
                        </div>

                        <ProductGrid
                            products={products.map((item: any) => ({
                                id: item.product.id,
                                name: item.product.name,
                                brand: item.product.brand?.name,
                                price: item.price,
                                originalPrice: item.originalPrice || item.price,
                                image:
                                    item.product.images?.find((img: any) => img.isMain)?.imageUrl ||
                                    "/placeholder.svg",
                                rating: 4.5,
                                reviews: 125,
                                specs:
                                    item.configuration?.specifications
                                        ?.slice(0, 3)
                                        .map((s: any) => `${s.name}: ${s.value}`) || [],
                                quantity: item.quantity,
                            }))}
                        />
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
