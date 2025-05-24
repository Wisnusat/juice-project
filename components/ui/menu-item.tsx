"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Heart, Plus, Star, Minus } from "lucide-react"
import { useToast } from "./toast-context"
import { useRouter } from "next/navigation"
import React from "react"
import { getCartItems, addToCart, removeFromCart, CartItem } from "../../lib/cart"

interface MenuItemProps {
  id: string
  name: string
  description: string
  weight: string
  calories: string
  price: string
  vitamins: string
  image: string
}

export function MenuItem({ id, name, description, weight, calories, price, vitamins, image }: MenuItemProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const { showToast } = useToast()
  const router = useRouter()

  useEffect(() => {
    setCartItems(getCartItems())
  }, [])

  const cartItem = cartItems.find(item => item.id.startsWith(id))
  const quantity = cartItem?.quantity || 0

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent navigation when clicking favorite
    setIsFavorite(!isFavorite)
    // Only trigger animation when favoriting, not when unfavoriting
    if (!isFavorite) {
      setIsAnimating(true)
      // Reset animation state after animation completes
      setTimeout(() => {
        setIsAnimating(false)
      }, 700) // Animation duration
    }

    showToast(
      isFavorite ? `Removed ${name} from favorites` : `Added ${name} to favorites`,
      isFavorite ? "info" : "success",
    )
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent navigation when clicking add to cart
    const updatedItems = addToCart({
      id,
      name,
      price,
      image,
    })
    setCartItems(updatedItems)
    // Dispatch a custom event to notify other components
    window.dispatchEvent(new Event('cartUpdated'))
  }

  const handleRemoveFromCart = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent navigation when clicking remove from cart
    const updatedItems = removeFromCart(id)
    setCartItems(updatedItems)
    // Dispatch a custom event to notify other components
    window.dispatchEvent(new Event('cartUpdated'))
  }

  const handleItemClick = () => {
    router.push(`/food/${id}`)
  }

  return (
    <div 
      className="bg-gray-50 rounded-xl p-4 mb-4 cursor-pointer hover:bg-gray-100 transition-colors"
      onClick={handleItemClick}
    >
      <div className="flex">
        <div className="w-1/3">
          <Image src={image || "/placeholder.svg"} alt={name} width={100} height={100} className="rounded-lg" />
        </div>
        <div className="flex-1 pl-4">
          <div className="flex justify-between">
            <h3 className="text-xl font-bold">{name}</h3>
            <button
              onClick={toggleFavorite}
              className="relative focus:outline-none group"
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart
                className={`w-5 h-5 transition-all duration-300 ease-in-out ${
                  isFavorite ? "text-red-500 fill-red-500 scale-110" : "text-gray-300 hover:text-gray-400"
                }`}
              />
              {/* Heart pulse animation when clicked - only show during animation */}
              {isAnimating && (
                <span
                  className="absolute inset-0 rounded-full animate-ping bg-red-400 opacity-75"
                  style={{ animationDuration: "0.7s" }}
                ></span>
              )}
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-1">{description}</p>
          <div className="flex items-center mt-2 text-sm text-gray-500">
            <span>{weight}</span>
            <span className="mx-2">•</span>
            <span>{calories}</span>
            <Star className="w-4 h-4 text-yellow-400 ml-2" />
          </div>
          <div className="flex justify-between items-center mt-2">
            <div className="flex flex-col items-start gap-y-1">
              <div className="font-bold">{price}</div>
              <span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded-full mr-2">{vitamins}</span>
            </div>
            {quantity > 0 ? (
              <div 
                className="flex items-center space-x-2 bg-black text-white rounded-full px-2 py-1"
                onClick={(e) => e.stopPropagation()} // Prevent navigation when clicking counter
              >
                <button
                  onClick={handleRemoveFromCart}
                  className="p-1 hover:bg-gray-800 rounded-full"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="text-sm font-medium">{quantity}</span>
                <button
                  onClick={handleAddToCart}
                  className="p-1 hover:bg-gray-800 rounded-full"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleAddToCart}
                className="p-1 bg-black text-white rounded-full transform transition-transform duration-200 hover:scale-110 active:scale-95"
                aria-label="Add to cart"
              >
                <Plus className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
