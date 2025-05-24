"use client"

import { ShoppingCart } from "lucide-react"
import { useRouter } from "next/navigation"
import React, { useState, useEffect } from "react"
import { getCartItemCount, getCartTotal } from "../../lib/cart"

export function FloatingCart() {
  const router = useRouter()
  const [itemCount, setItemCount] = useState(0)
  const [totalPrice, setTotalPrice] = useState(0)

  const updateCartData = () => {
    setItemCount(getCartItemCount())
    setTotalPrice(getCartTotal())
  }

  useEffect(() => {
    // Update cart data when component mounts
    updateCartData()

    // Listen for storage changes to update cart data (for other tabs)
    const handleStorageChange = () => {
      updateCartData()
    }

    // Listen for cart updates in the current tab
    const handleCartUpdate = () => {
      updateCartData()
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('cartUpdated', handleCartUpdate)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('cartUpdated', handleCartUpdate)
    }
  }, [])

  if (itemCount === 0) return null

  return (
    <div className="fixed bottom-4 left-0 right-0 mx-auto max-w-md px-4 z-50">
      <div className="bg-purple-700 text-white rounded-full py-3 px-6 shadow-lg flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-purple-600 p-2 rounded-full">
            <ShoppingCart className="w-5 h-5" />
          </div>
          <div>
            <p className="font-medium">{itemCount} items</p>
            <p className="text-sm text-purple-200">Rp {totalPrice.toLocaleString()}</p>
          </div>
        </div>
        <button
          onClick={() => router.push("/checkout")}
          className="bg-white text-purple-700 font-medium py-2 px-4 rounded-full text-sm"
        >
          Checkout
        </button>
      </div>
    </div>
  )
}
