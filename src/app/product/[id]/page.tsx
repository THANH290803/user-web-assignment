"use client"

import React, { useState, useEffect } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import Image from "next/image"
import { Heart, Share2, Minus, Plus, ShoppingCart, Truck, CheckCircle, BookOpen, Zap, Eye } from "lucide-react"

interface ProductImage {
  id: number
  imageUrl: string
  isMain: boolean
}

interface Brand {
  id: number
  name: string
}

interface Category {
  id: number
  name: string
}

interface Specification {
  id: number
  name: string
  value: string
}

interface Configuration {
  id: number
  name: string
  price: number
  specifications: Specification[]
}

interface ProductData {
  id: number
  name: string
  brand: Brand
  description: string
  images: ProductImage[]
  totalQuality: number
  configurations: Configuration[]
}

interface ProductDetail {
  quantity: number
  price: number
  configuration: {
    id: number
    name: string
    specifications: Specification[]
  }
  product: {
    id: number
    name: string
    brand: Brand
    description: string
    images: { imageUrl: string }[]
  }
}


export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: paramId } = React.use(params) // unwrap
  const productId = Number(paramId)

  const [product, setProduct] = useState<ProductData | null>(null)
  const [selectedConfigId, setSelectedConfigId] = useState<number | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [totalPrice, setTotalPrice] = useState(0)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [configQuantities, setConfigQuantities] = useState<{ [key: number]: number }>({})

  useEffect(() => {
    fetch(`http://localhost:8080/api/product-details/product/${productId}`)
      .then(res => res.ok ? res.json() : [])
      .then((data: ProductDetail[]) => {
        if (!data || data.length === 0) return

        // Lưu số lượng từng cấu hình
        const quantitiesObj: { [key: number]: number } = {}
        data.forEach(item => {
          quantitiesObj[item.configuration.id] = item.quantity
        })
        setConfigQuantities(quantitiesObj)

        // Map product
        const images = data[0].product.images?.map(img => img.imageUrl) || ["/placeholder.svg"]
        const configurations = data.map(item => ({
          id: item.configuration.id,
          name: item.configuration.name,
          price: item.price,
          specifications: item.configuration.specifications
        }))

        const totalQuantity = data.reduce((sum, item) => sum + (item.quantity || 0), 0)

        setProduct({
          id: data[0].product.id,
          name: data[0].product.name,
          brand: data[0].product.brand,
          description: data[0].product.description,
          images: images.map((imgUrl, idx) => ({ id: idx, imageUrl: imgUrl, isMain: idx === 0 })),
          totalQuality: totalQuantity,
          configurations
        })

        const firstConfig = configurations[0]
        setSelectedConfigId(firstConfig.id)
        setTotalPrice(firstConfig.price)
      })
  }, [productId])

  if (!product) return null

  const handleConfigChange = (configId: number, price: number) => {
    setSelectedConfigId(configId)
    setTotalPrice(price)
  }

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(price)

  const selectedConfig = product.configurations.find(cfg => cfg.id === selectedConfigId)

  // ---- ADD THIS FUNCTION ----
  const addToCart = () => {
    if (!product) return;

    const selectedConfig = product.configurations.find(c => c.id === selectedConfigId);
    if (!selectedConfig) return;

    // object giỏ hàng
    const cartItem = {
      productId: product.id,
      configId: selectedConfig.id,
      name: product.name,
      configName: selectedConfig.name,
      brand: product.brand.name,
      price: totalPrice,
      quantity: quantity,
      image: product.images[0]?.imageUrl || "/placeholder.svg"
    };

    // lấy cart hiện tại
    let cart = JSON.parse(localStorage.getItem("cart") || "[]");

    // kiểm tra nếu sản phẩm + cấu hình đã có thì cộng số lượng
    const existing = cart.find(
      (item: any) =>
        item.productId === cartItem.productId &&
        item.configId === cartItem.configId
    );

    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push(cartItem);
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    alert("Đã thêm vào giỏ hàng");
  };


  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 py-8">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left: Image */}
            <div className="space-y-4">
              <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-white shadow-sm">
                <Image
                  src={product.images[selectedImageIndex]?.imageUrl || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              {product.images.length > 1 && (
                <div className="flex gap-3">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative w-20 h-20 rounded-md overflow-hidden border-2 transition-all ${selectedImageIndex === idx ? "border-blue-600" : "border-gray-300 hover:border-gray-400"}`}
                    >
                      <Image src={img.imageUrl} alt={`View ${idx}`} fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Info */}
            <div className="space-y-6">
              <div>
                <p className="text-sm font-semibold text-blue-600 mb-2">{product.brand.name}</p>
                <h1 className="text-4xl font-bold text-gray-900">{product.name}</h1>
              </div>

              <div className="space-y-3 p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">Giá bán</p>
                  <span className="text-4xl font-bold text-blue-600">{formatPrice(totalPrice)}</span>
                </div>
              </div>

              {/* Status */}
              <div className="flex flex-wrap gap-3">
                {product.totalQuality > 0 ? (
                  <>
                    <Badge className="bg-green-100 text-green-800 flex items-center gap-2 px-3 py-2">
                      <CheckCircle className="w-4 h-4" />
                      Còn hàng
                    </Badge>
                    <Badge className="bg-blue-100 text-blue-800 flex items-center gap-2 px-3 py-2">
                      <Truck className="w-4 h-4" />
                      Giao hàng nhanh
                    </Badge>
                  </>
                ) : (
                  <Badge className="bg-red-100 text-red-800 flex items-center gap-2 px-3 py-2">Hết hàng</Badge>
                )}
              </div>

              {/* Configuration Selection */}
              {product.configurations.length > 0 && (
                <Card className="border-blue-200 bg-blue-50">
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900">Chọn cấu hình</h3>
                    <div className="flex flex-wrap gap-3">
                      {product.configurations.map(cfg => {
                        // lấy số lượng của cấu hình hiện tại
                        const cfgQuantity = configQuantities[cfg.id] || 0

                        return (
                          <button
                            key={cfg.id}
                            onClick={() => handleConfigChange(cfg.id, cfg.price)}
                            disabled={cfgQuantity === 0} // disable nếu hết hàng
                            className={`px-4 py-2 rounded-lg border-2 font-medium transition-all 
                ${selectedConfigId === cfg.id ? "border-blue-600 bg-blue-600 text-white" : "border-gray-300 bg-white text-gray-900 hover:border-blue-300"}
                ${cfgQuantity === 0 ? "opacity-50 cursor-not-allowed" : ""}
              `}
                          >
                            {cfg.name}
                            {/* ({cfgQuantity}) */}
                          </button>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}
              {/* Quantity */}
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-gray-700">Số lượng:</label>
                <div className="flex items-center border border-gray-300 rounded-lg bg-white">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 hover:bg-gray-100">
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-6 py-2 font-medium">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="p-2 hover:bg-gray-100">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <Button size="lg" 
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                onClick={addToCart}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Thêm vào giỏ
                </Button>
                <Button size="lg" variant="outline" className="flex-none bg-white">
                  <Heart className="w-5 h-5" />
                </Button>
                <Button size="lg" variant="outline" className="flex-none bg-white">
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-16 bg-white rounded-lg border border-gray-200 p-6">
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="description" className="flex items-center gap-2">
                  <Eye className="w-4 h-4" /> Mô tả
                </TabsTrigger>
                <TabsTrigger value="specs" className="flex items-center gap-2">
                  <Zap className="w-4 h-4" /> Thông số
                </TabsTrigger>
                <TabsTrigger value="reviews" className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" /> Đánh giá
                </TabsTrigger>
              </TabsList>

              {/* Description */}
              <TabsContent value="description">
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-gray-900">Mô tả sản phẩm</h3>
                  <p className="text-gray-700 leading-relaxed">{product.description}</p>
                </div>
              </TabsContent>

              {/* Specs */}
              <TabsContent value="specs">
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Thông số kỹ thuật</h3>
                <div className="space-y-4">
                  {selectedConfig?.specifications.map(spec => (
                    <div key={spec.id} className="border border-gray-200 rounded-lg overflow-hidden px-4 py-3 flex items-center gap-3">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 text-xs font-bold">✓</span>
                      </div>
                      <p className="text-sm text-gray-700">
                        <strong>{spec.name}:</strong> {spec.value}
                      </p>
                    </div>
                  ))}
                </div>
              </TabsContent>

              {/* Reviews */}
              <TabsContent value="reviews">
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Đánh giá từ khách hàng</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="text-yellow-400">★</span>
                        ))}
                      </div>
                      <span className="font-semibold text-gray-900">Sản phẩm tuyệt vời</span>
                    </div>
                    <p className="text-gray-700 text-sm">
                      Chất lượng rất tốt, giao hàng nhanh chóng. Tôi rất hài lòng.
                    </p>
                    <p className="text-gray-500 text-xs mt-2">- Nguyễn Văn A</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
