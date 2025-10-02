"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"

interface FilterState {
  brands: string[]
  priceRange: [number, number]
  processors: string[]
  ram: string[]
}

interface ProductFiltersProps {
  onFilterChange: (filters: FilterState) => void
}

const ProductFilters = ({ onFilterChange }: ProductFiltersProps) => {
  const [filters, setFilters] = useState<FilterState>({
    brands: [],
    priceRange: [0, 100000000],
    processors: [],
    ram: [],
  })

  const brands = ["Apple", "Samsung", "Xiaomi", "Google", "OnePlus"]
  const processors = ["A17 Pro", "M3", "Snapdragon 8 Gen 3", "Tensor G3", "Snapdragon 8 Gen 2"]
  const ramOptions = ["6GB", "8GB", "12GB", "16GB"]

  const handleBrandChange = (brand: string, checked: boolean) => {
    const newBrands = checked ? [...filters.brands, brand] : filters.brands.filter((b) => b !== brand)

    const newFilters = { ...filters, brands: newBrands }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handlePriceChange = (value: [number, number]) => {
    const newFilters = { ...filters, priceRange: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleProcessorChange = (processor: string, checked: boolean) => {
    const newProcessors = checked
      ? [...filters.processors, processor]
      : filters.processors.filter((p) => p !== processor)

    const newFilters = { ...filters, processors: newProcessors }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleRamChange = (ram: string, checked: boolean) => {
    const newRam = checked ? [...filters.ram, ram] : filters.ram.filter((r) => r !== ram)

    const newFilters = { ...filters, ram: newRam }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const clearFilters = () => {
    const newFilters = {
      brands: [],
      priceRange: [0, 100000000] as [number, number],
      processors: [],
      ram: [],
    }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Bộ lọc</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Brands */}
          <div>
            <h3 className="font-medium mb-3">Thương hiệu</h3>
            <div className="space-y-2">
              {brands.map((brand) => (
                <div key={brand} className="flex items-center space-x-2">
                  <Checkbox
                    id={brand}
                    checked={filters.brands.includes(brand)}
                    onCheckedChange={(checked) => handleBrandChange(brand, checked as boolean)}
                  />
                  <label
                    htmlFor={brand}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {brand}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h3 className="font-medium mb-3">Khoảng giá</h3>
            <div className="px-2">
              <Slider
                value={filters.priceRange}
                onValueChange={handlePriceChange}
                max={100000000}
                min={0}
                step={1000000}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>{(filters.priceRange[0] / 1000000).toFixed(0)}M đ</span>
                <span>{(filters.priceRange[1] / 1000000).toFixed(0)}M đ</span>
              </div>
            </div>
          </div>

          {/* Processors */}
          <div>
            <h3 className="font-medium mb-3">Bộ xử lý</h3>
            <div className="space-y-2">
              {processors.map((processor) => (
                <div key={processor} className="flex items-center space-x-2">
                  <Checkbox
                    id={processor}
                    checked={filters.processors.includes(processor)}
                    onCheckedChange={(checked) => handleProcessorChange(processor, checked as boolean)}
                  />
                  <label
                    htmlFor={processor}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {processor}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* RAM */}
          <div>
            <h3 className="font-medium mb-3">RAM</h3>
            <div className="space-y-2">
              {ramOptions.map((ram) => (
                <div key={ram} className="flex items-center space-x-2">
                  <Checkbox
                    id={ram}
                    checked={filters.ram.includes(ram)}
                    onCheckedChange={(checked) => handleRamChange(ram, checked as boolean)}
                  />
                  <label
                    htmlFor={ram}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {ram}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <Button onClick={clearFilters} variant="outline" className="w-full bg-transparent">
            Xóa bộ lọc
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export { ProductFilters }
export default ProductFilters
