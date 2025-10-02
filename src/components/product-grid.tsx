import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

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
  inStock: boolean
  isNew?: boolean
  isSale?: boolean
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
      {products.map((product) => (
        <Card key={product.id} className="group hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-4">
            <div className="relative mb-4">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                width={300}
                height={300}
                className="w-full h-48 object-cover rounded-lg"
              />
              {product.isNew && <Badge className="absolute top-2 left-2 bg-green-500">Mới</Badge>}
              {product.isSale && <Badge className="absolute top-2 right-2 bg-red-500">Giảm giá</Badge>}
              {!product.inStock && (
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
                {product.originalPrice && (
                  <span className="text-sm text-gray-500 line-through break-words">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>
            </div>
          </CardContent>

          <CardFooter className="p-4 pt-0">
            <Button className="w-full" disabled={!product.inStock} variant={product.inStock ? "default" : "secondary"}>
              <span className="mr-2">□</span> {/* replaced ShoppingCart icon with simple square */}
              {product.inStock ? "Thêm vào giỏ" : "Hết hàng"}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

export { ProductGrid }
