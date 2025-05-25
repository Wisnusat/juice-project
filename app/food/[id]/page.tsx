"use client"

import Image from "next/image"
import { ArrowLeft, Heart, Star, Plus, Minus } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { getFoodById, Food } from "../../../lib/supabase"
import { getCartItems, addToCart, removeFromCart, CartItem } from "../../../lib/cart"

export default function FoodDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isFavorite, setIsFavorite] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [food, setFood] = useState<Food | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFood = async () => {
      try {
        const data = await getFoodById(params.id)
        setFood(data)
      } catch (error) {
        console.error('Error fetching food:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFood()
    setCartItems(getCartItems())
  }, [params.id])

  // Get current item quantity in cart
  const cartItem = cartItems.find(item => item.id === food?.id)
  const quantity = cartItem?.quantity || 0

  if (loading) {
    return (
      <div className="max-w-md mx-auto bg-white min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-700"></div>
      </div>
    )
  }

  // If the food item doesn't exist, show a message
  if (!food) {
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
      id: food.id,
      name: food.name,
      price: `Rp ${food.price.toLocaleString()}`,
      image: food.image,
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
        <Image src={food.image || "/placeholder.svg"} alt={food.name} fill className="object-cover" />
  
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
      <div className="bg-white p-6 rounded-t-3xl pb-32">
        <div>
          {/* Name and Rating */}
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-purple-700">{food.name}</h1>
            <div className="flex items-center bg-purple-50 px-3 py-1 rounded-full">
              <span className="mr-1 font-bold text-purple-700">4.5</span>
              <Star className="w-4 h-4 fill-yellow-300 text-yellow-300" />
            </div>
          </div>
  
          {/* Description */}
          <div className="mb-6">
            <p className="text-gray-600">
              {isExpanded ? food.description : `${food.description.substring(0, 100)}...`}
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
                <p className="text-sm font-medium text-gray-700">{food.vitamins || "Vitamin C"}</p>
              </div>
            </div>
            <div className="bg-red-50 rounded-xl p-3 flex items-center">
              <div>
                <p className="text-xs text-gray-500">Weight</p>
                <p className="text-sm font-medium text-gray-700">{food.weight || "300g"}</p>
              </div>
            </div>
            <div className="bg-green-50 rounded-xl p-3 flex items-center">
              <div>
                <p className="text-xs text-gray-500">Calories</p>
                <p className="text-sm font-medium text-gray-700">{food.calories || "250 kcal"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 max-w-md mx-auto flex items-center gap-x-4">
        <div className="bg-purple-700 rounded-full py-2 px-4 w-full flex items-center gap-x-2">
          <p className="text-xs text-white opacity-80">Total</p>
          <p className="text-lg font-bold text-white">Rp {(food.price * quantity).toLocaleString()}</p>
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