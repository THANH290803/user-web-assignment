"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ProductFilters } from "@/components/product-filters";
import { ProductGrid } from "@/components/product-grid";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation"; // 👈 Dùng cái này để lấy chữ iPhone trên URL

interface FilterState {
  brands: string[];
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  sortDir?: "asc" | "desc";
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || ""; // 👈 Lấy chữ "iphone" từ URL ?q=iphone

  const [products, setProducts] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [brandsLoaded, setBrandsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [filters, setFilters] = useState<FilterState>({
    brands: [],
    minPrice: undefined,
    maxPrice: undefined,
    sortBy: undefined,
    sortDir: undefined,
  });

  // Load brands
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/brands");
        setBrands(res.data.result);
        setBrandsLoaded(true);
      } catch (err) {
        console.error("Lỗi fetch brands:", err);
      }
    };
    fetchBrands();
  }, []);

  // Fetch & Filter products
  useEffect(() => {
    if (!brandsLoaded) return;

    const fetchSearchedProducts = async () => {
      setIsLoading(true);
      try {
        // 1. Nhét cái searchKey của ông vào đây
        const paramsApi: any = { searchKey: query };

        // 2. Kẹp thêm mấy cái filter ở cột trái (nếu user có chọn)
        if (filters.brands.length > 0) {
          const brandIds = filters.brands
            .map((name) => brands.find((b) => b.name === name)?.id)
            .filter(Boolean);
          if (brandIds.length > 0) paramsApi.brandId = brandIds.join(",");
        }

        if (filters.minPrice) paramsApi.minPrice = filters.minPrice;
        if (filters.maxPrice) paramsApi.maxPrice = filters.maxPrice;
        if (filters.sortBy) paramsApi.sortBy = filters.sortBy;
        if (filters.sortDir) paramsApi.sortDir = filters.sortDir;

        const res = await axios.get(
          "http://localhost:8080/api/product-details",
          {
            params: paramsApi,
          },
        );

        setProducts(res.data.result || []);
      } catch (err) {
        console.error("Lỗi fetch products:", err);
      } finally {
        setIsLoading(false);
      }
    };

    // Chỉ gọi API khi có từ khóa search
    if (query) {
      fetchSearchedProducts();
    } else {
      setProducts([]);
      setIsLoading(false);
    }
  }, [query, filters, brandsLoaded]);

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const handleSortChange = (sortValue: string) => {
    let sortBy = "";
    let sortDir: "asc" | "desc" = "asc";

    switch (sortValue) {
      case "Giá thấp đến cao":
        sortBy = "price";
        sortDir = "asc";
        break;
      case "Giá cao đến thấp":
        sortBy = "price";
        sortDir = "desc";
        break;
      case "Mới nhất":
        sortBy = "createdAt";
        sortDir = "desc";
        break;
    }
    setFilters((prev) => ({ ...prev, sortBy, sortDir }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          {/* Hiển thị từ khóa tìm kiếm */}
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Kết quả tìm kiếm cho: "{query}"
          </h1>
          <p className="text-gray-600">
            Tìm thấy {products.length} sản phẩm phù hợp
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-64 flex-shrink-0">
            <ProductFilters
              onFilterChange={handleFilterChange}
              brands={brands}
            />
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
              </select>
            </div>

            {isLoading ? (
              <div className="text-center py-10 text-gray-500">
                Đang tìm kiếm...
              </div>
            ) : products.length > 0 ? (
              <ProductGrid
                products={products.map((item: any) => ({
                  id: item.product.id,
                  name: item.product.name,
                  brand: item.brand?.name,

                  price: item.productDetail?.price,
                  originalPrice: item.productDetail?.price,

                  image:
                    item.images?.find((img: any) => img.isMain)?.imageUrl ||
                    item.images?.[0]?.imageUrl ||
                    "/placeholder.svg",
                  rating: 5.0,
                  reviews: 99,
                  specs:
                    item.specifications
                      ?.slice(0, 3)
                      .map((s: any) => `${s.name}: ${s.value}`) || [],
                  quantity: item.productDetail?.quantity,
                }))}
              />
            ) : (
              <div className="text-center py-20 bg-white rounded-lg border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-700">
                  Rất tiếc, không tìm thấy sản phẩm nào!
                </h3>
                <p className="text-gray-500 mt-2">
                  Vui lòng thử lại với từ khóa khác (vd: Samsung, iPhone...)
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
