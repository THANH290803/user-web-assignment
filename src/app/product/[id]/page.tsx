import { notFound } from "next/navigation"
import Image from "next/image"
import { Star, ShoppingCart, Heart, Share2, Truck, Shield, RotateCcw } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"

// Mock product data - trong thực tế sẽ lấy từ database
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
    description:
      "MacBook Pro M3 14 inch mang đến hiệu suất vượt trội với chip M3 Pro mới nhất của Apple. Thiết kế sang trọng, màn hình Liquid Retina XDR sắc nét và thời lượng pin ấn tượng lên đến 18 giờ.",
    features: [
      "Chip Apple M3 Pro với CPU 11-core và GPU 14-core",
      "18GB bộ nhớ thống nhất siêu nhanh",
      "SSD 512GB tốc độ cao",
      "Màn hình Liquid Retina XDR 14.2 inch",
      "Camera FaceTime HD 1080p",
      "Hệ thống âm thanh 6 loa với Spatial Audio",
      "Thời lượng pin lên đến 18 giờ",
      "3 cổng Thunderbolt 4, cổng HDMI, khe thẻ SDXC",
    ],
    images: ["/macbook-pro-laptop.png", "/macbook-pro-laptop.png", "/macbook-pro-laptop.png"],
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
    description:
      "iPhone 15 Pro Max với thiết kế Titanium cao cấp, chip A17 Pro mạnh mẽ và hệ thống camera Pro tiên tiến. Trải nghiệm smartphone đỉnh cao với màn hình Super Retina XDR 6.7 inch.",
    features: [
      "Chip A17 Pro với GPU 6-core",
      "Bộ nhớ trong 256GB",
      "Khung viền Titanium siêu bền",
      "Màn hình Super Retina XDR 6.7 inch",
      "Hệ thống camera Pro 48MP",
      "Camera telephoto 5x",
      "Action Button có thể tùy chỉnh",
      "Cổng USB-C với USB 3",
    ],
    images: ["/iphone-15-pro-max-display.png", "/iphone-15-pro-max-display.png", "/iphone-15-pro-max-display.png"],
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
    description:
      "Samsung Galaxy S24 Ultra với S Pen tích hợp, chip Snapdragon 8 Gen 3 mạnh mẽ và hệ thống camera AI tiên tiến. Màn hình Dynamic AMOLED 2X 6.8 inch cùng pin 5000mAh.",
    features: [
      "Chip Snapdragon 8 Gen 3 for Galaxy",
      "RAM 12GB LPDDR5X",
      "S Pen tích hợp với độ trễ thấp",
      "Màn hình Dynamic AMOLED 2X 6.8 inch",
      "Camera chính 200MP với OIS",
      "Camera telephoto periscope 50MP zoom 5x",
      "Pin 5000mAh sạc nhanh 45W",
      "Khung viền Titanium bền bỉ",
    ],
    images: ["/samsung-galaxy-s24-ultra.png", "/samsung-galaxy-s24-ultra.png", "/samsung-galaxy-s24-ultra.png"],
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
    description:
      "Dell XPS 13 với thiết kế siêu mỏng, chip Intel Core i7 thế hệ 13 và màn hình InfinityEdge sắc nét. Laptop cao cấp hoàn hảo cho công việc và giải trí.",
    features: [
      "Chip Intel Core i7-1360P thế hệ 13",
      "RAM 16GB LPDDR5",
      "SSD 512GB PCIe NVMe",
      "Màn hình 13.4 inch FHD+ InfinityEdge",
      "Thiết kế siêu mỏng chỉ 14.8mm",
      "Thời lượng pin lên đến 12 giờ",
      "Cổng Thunderbolt 4",
      "Webcam FHD với Windows Hello",
    ],
    images: ["/dell-xps-13-laptop.png", "/dell-xps-13-laptop.png", "/dell-xps-13-laptop.png"],
  },
]

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const productId = Number.parseInt(params.id)
  const product = products.find((p) => p.id === productId)

  if (!product) {
    notFound()
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price)
  }

  const discountPercent = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-50 rounded-xl p-8 relative">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {product.images.map((img, index) => (
                <div
                  key={index}
                  className="aspect-square bg-gray-50 rounded-lg p-4 cursor-pointer hover:bg-gray-100 transition-colors relative"
                >
                  <Image
                    src={img || "/placeholder.svg"}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-contain"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="text-sm text-gray-500 mb-2">{product.brand}</div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>

              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-600">
                  {product.rating} ({product.reviews} đánh giá)
                </span>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-bold text-red-600">{formatPrice(product.price)}</span>
                <span className="text-xl text-gray-500 line-through">{formatPrice(product.originalPrice)}</span>
                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  -{discountPercent}%
                </span>
              </div>

              <p className="text-gray-700 leading-relaxed mb-6">{product.description}</p>

              <div className="space-y-4 mb-8">
                <h3 className="font-semibold text-gray-900">Thông số kỹ thuật nổi bật:</h3>
                <div className="grid grid-cols-1 gap-2">
                  {product.specs.map((spec, index) => (
                    <div key={index} className="flex items-center gap-2 text-gray-700">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      {spec}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 mb-8">
                <button className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Thêm vào giỏ hàng
                </button>
                <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Heart className="w-5 h-5" />
                </button>
                <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Truck className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="font-semibold text-sm">Miễn phí vận chuyển</div>
                    <div className="text-xs text-gray-600">Đơn hàng từ 500k</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-green-600" />
                  <div>
                    <div className="font-semibold text-sm">Bảo hành chính hãng</div>
                    <div className="text-xs text-gray-600">12 tháng</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <RotateCcw className="w-5 h-5 text-orange-600" />
                  <div>
                    <div className="font-semibold text-sm">Đổi trả dễ dàng</div>
                    <div className="text-xs text-gray-600">Trong 7 ngày</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Features */}
        <div className="bg-gray-50 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Tính năng nổi bật</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {product.features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
