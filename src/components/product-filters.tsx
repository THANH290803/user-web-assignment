"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import axios from "axios"

interface FilterState {
  brands: string[]
  minPrice: number
  maxPrice: number
}

interface Brand {
  id: number
  name: string
}

interface ProductFiltersProps {
  brands: Brand[]
  onFilterChange: (filters: FilterState) => void
}

const ProductFilters = ({ brands, onFilterChange }: ProductFiltersProps) => {
  const [filters, setFilters] = useState<FilterState>({
    brands: [],
    minPrice: 0,
    maxPrice: 100000000,
  })
  const handleBrandChange = (brandName: string, checked: boolean) => {
    const newBrands = checked
      ? [...filters.brands, brandName]
      : filters.brands.filter((b) => b !== brandName)

    const newFilters = { ...filters, brands: newBrands }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handlePriceChange = (value: [number, number]) => {
    const newFilters = { ...filters, minPrice: value[0], maxPrice: value[1] }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const clearFilters = () => {
    const newFilters = { brands: [], minPrice: 0, maxPrice: 100000000 }
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
                <div key={brand.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={brand.id.toString()}
                    checked={filters.brands.includes(brand.name)}
                    onCheckedChange={(checked) => handleBrandChange(brand.name, checked as boolean)}
                  />
                  <label htmlFor={brand.id.toString()} className="text-sm font-medium">
                    {brand.name}
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
                value={[filters.minPrice || 0, filters.maxPrice || 100000000]}
                onValueChange={handlePriceChange}
                max={100000000}
                min={0}
                step={1000000}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>{((filters.minPrice || 0) / 1000000).toFixed(0)}M đ</span>
                <span>{((filters.maxPrice || 100000000) / 1000000).toFixed(0)}M đ</span>
              </div>
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
