"use client"

import { Button } from "@/components/ui/button"
import { useCart } from "@/contexts/cart-context"
import { useState } from "react"

interface Product {
  id: number
  name: string
  brand: string
  price: number
  image: string
  specifications: string[]
}

interface AddToCartButtonProps {
  product: Product
  className?: string
}

export function AddToCartButton({ product, className }: AddToCartButtonProps) {
  const { dispatch } = useCart()
  const [isAdded, setIsAdded] = useState(false)

  const handleAddToCart = () => {
    dispatch({
      type: "ADD_ITEM",
      payload: {
        id: product.id,
        name: product.name,
        brand: product.brand,
        price: product.price,
        image: product.image,
        specifications: product.specifications,
      },
    })

    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  return (
    <Button
      onClick={handleAddToCart}
      className={`w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 ${className}`}
      disabled={isAdded}
    >
      {isAdded ? (
        <>
          <span className="mr-2">✓</span>
          Đã thêm vào giỏ
        </>
      ) : (
        <>
          <span className="mr-2">🛒</span>
          Thêm vào giỏ
        </>
      )}
    </Button>
  )
}
