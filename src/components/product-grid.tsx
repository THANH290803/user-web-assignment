import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { ShoppingCartIcon } from '@heroicons/react/24/outline'
import Link from "next/link"

interface Product {
  id: number
  name: string
  brand: string
  price: number
  originalPrice?: number
  image: string
  rating: number
  reviews: number
  specs: string[] | string // Handle both array and string types for specs
  quantity: number
  description?: string
}

interface ProductGridProps {
  products: Product[]
}

export default function ProductGrid({ products }: ProductGridProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product, index) => (
        <Card key={`${product.id}-${index}`} className="group hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-4">
            <Link key={product.id} href={`/product/${product.id}`}>
              <div className="relative mb-4">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  width={300}
                  height={300}
                  className="w-full h-48 object-cover rounded-lg"
                />
                {/* {product.isNew && <Badge className="absolute top-2 left-2 bg-green-500">Mới</Badge>}
              {product.isSale && <Badge className="absolute top-2 right-2 bg-red-500">Giảm giá</Badge>} */}
                {product.quantity === 0 && (
                  <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                    <Badge variant="secondary">Hết hàng</Badge>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {product.name}
                </h3>

                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-sm ${i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-300"}`}
                      >
                        ★ {/* replaced Star icon with simple ★ symbol */}
                      </span>
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">({product.reviews} đánh giá)</span>
                </div>

                <div className="space-y-1">
                  {Array.isArray(product.specs)
                    ? product.specs.slice(0, 2).map((spec, index) => (
                      <p key={index} className="text-sm text-gray-600 truncate">
                        {spec}
                      </p>
                    ))
                    : typeof product.specs === "string" && (
                      <p className="text-sm text-gray-600 truncate">{product.specs}</p>
                    )}
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-xl font-bold text-red-600 break-words">{formatPrice(product.price)}</span>
                </div>
              </div>
            </Link>
          </CardContent>

          <CardFooter className="p-4 pt-0">
            <div className="w-full">
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="text-xs">📦 Đã bán {Math.floor(Math.random() * 1000)}</span>
                </div>
                <button
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  onClick={(e) => e.preventDefault()}
                >
                  <span className="text-xl">♡</span>
                </button>
              </div>
              <div className="flex gap-2">
                <Badge className="bg-orange-100 text-orange-700 text-xs flex-1 text-center">🔥 Hot</Badge>
                <Badge className="bg-green-100 text-green-700 text-xs flex-1 text-center">✓ Uy tín</Badge>
              </div>
            </div>
          </CardFooter>

        </Card>
      ))}
    </div>
  )
}

export { ProductGrid }
