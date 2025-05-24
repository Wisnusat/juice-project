"use client"

import Image from "next/image"
import { ArrowLeft, Heart, Star, Plus, Minus } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { menuItems } from "../../../data/menu-items"
import React from "react"
import { getCartItems, addToCart, removeFromCart, CartItem } from "../../../lib/cart"

export default function FoodDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [isFavorite, setIsFavorite] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const resolvedParams = React.use(params)

  useEffect(() => {
    setCartItems(getCartItems())
  }, [])

  // Get the food item based on the ID from the URL
  const foodItem = menuItems[resolvedParams.id]

  // Get current item quantity in cart
  const cartItem = cartItems.find(item => item.id.startsWith(foodItem?.id))
  const quantity = cartItem?.quantity || 0

  // If the food item doesn't exist, show a message
  if (!foodItem) {
    return (
      <div className="max-w-md mx-auto bg-white min-h-screen flex items-center justify-center">
        <div className="text-center p-4">
          <h1 className="text-2xl font-bold text-purple-700 mb-4">Food Not Found</h1>
          <p className="text-gray-600 mb-6">The food item you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push("/")}
            className="bg-purple-700 text-white font-medium py-2 px-4 rounded-full"
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  // Handle adding to cart
  const handleAddToCart = () => {
    const updatedItems = addToCart({
      id: foodItem.id,
      name: foodItem.name,
      price: `Rp ${foodItem.price.toLocaleString()}`,
      image: foodItem.image,
    })
    setCartItems(updatedItems)
    // Dispatch a custom event to notify other components
    window.dispatchEvent(new Event('cartUpdated'))
  }

  const handleRemoveFromCart = () => {
    if (cartItem) {
      const updatedItems = removeFromCart(cartItem.id)
      setCartItems(updatedItems)
      // Dispatch a custom event to notify other components
      window.dispatchEvent(new Event('cartUpdated'))
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      {/* Food Image */}
      <div className="relative w-full h-80">
        <Image src={foodItem.image || "/placeholder.svg"} alt={foodItem.name} fill className="object-cover" />
  
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="absolute top-4 left-4 bg-white p-3 rounded-full text-purple-700 shadow-md z-10 hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
  
        {/* Favorite Button */}
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-4 right-4 bg-white p-3 rounded-full text-purple-700 shadow-md z-10 hover:bg-gray-50 transition-colors"
        >
          <Heart className={`w-6 h-6 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
        </button>
      </div>
  
      {/* Food Details */}
      <div className="bg-white p-6 rounded-t-3xl shadow-md pb-32"> {/* ← added pb-32 for bottom space */}
        <div>
          {/* Name and Rating */}
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-purple-700">{foodItem.name}</h1>
            <div className="flex items-center bg-purple-50 px-3 py-1 rounded-full">
              <span className="mr-1 font-bold text-purple-700">{foodItem.rating}</span>
              <Star className="w-4 h-4 fill-yellow-300 text-yellow-300" />
            </div>
          </div>
  
          {/* Description */}
          <div className="mb-6">
            <p className="text-gray-600">
              {isExpanded ? foodItem.fullDescription : `${foodItem.fullDescription.substring(0, 100)}...`}
              <button onClick={() => setIsExpanded(!isExpanded)} className="text-purple-700 font-medium ml-1">
                {isExpanded ? "Baca lebih sedikit" : "Baca lebih lanjut"}
              </button>
            </p>
          </div>
  
          {/* Nutrition Info */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-orange-50 rounded-xl p-3 flex items-center">
              <div>
                <p className="text-xs text-gray-500">Vitamins</p>
                <p className="text-sm font-medium text-gray-700">{foodItem.vitamins}</p>
              </div>
            </div>
            <div className="bg-red-50 rounded-xl p-3 flex items-center">
              <div>
                <p className="text-xs text-gray-500">Weight</p>
                <p className="text-sm font-medium text-gray-700">{foodItem.weight}</p>
              </div>
            </div>
            <div className="bg-green-50 rounded-xl p-3 flex items-center">
              <div>
                <p className="text-xs text-gray-500">Calories</p>
                <p className="text-sm font-medium text-gray-700">{foodItem.calories}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 max-w-md mx-auto flex items-center gap-x-4">
        <div className="bg-purple-700 rounded-full py-2 px-4 w-full flex items-center gap-x-2">
          <p className="text-xs text-white opacity-80">Total</p>
          <p className="text-lg font-bold text-white">Rp {(foodItem.price * quantity).toLocaleString()}</p>
        </div>
        {quantity > 0 ? (
          <div className="flex items-center space-x-2 bg-purple-700 text-white rounded-full px-4 py-2">
            <button
              onClick={handleRemoveFromCart}
              className="p-1 hover:bg-purple-600 rounded-full"
              aria-label="Decrease quantity"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-lg font-bold">{quantity}</span>
            <button
              onClick={handleAddToCart}
              className="p-1 hover:bg-purple-600 rounded-full"
              aria-label="Increase quantity"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button onClick={handleAddToCart}>
            <Plus className="w-8 h-8 text-bold text-purple-700" />
          </button>
        )}
      </div>
    </div>
  )  
} 