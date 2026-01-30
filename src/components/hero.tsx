import Image from "next/image"

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl lg:text-6xl font-bold leading-tight text-balance">
              Công nghệ hàng đầu
              <span className="block text-yellow-300">Giá tốt nhất</span>
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed">
              Khám phá bộ sưu tập laptop, điện thoại và phụ kiện công nghệ mới nhất với chất lượng đảm bảo và giá cả
              cạnh tranh nhất thị trường.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-yellow-400 text-blue-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-yellow-300 transition-colors">
                Mua ngay
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-900 transition-colors">
                Xem sản phẩm
              </button>
            </div>
          </div>
          <div className="relative">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
              <Image src="/macbook-pro-laptop.png" alt="MacBook Pro" width={500} height={100} className="w-full h-auto rounded-lg shadow-2xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
