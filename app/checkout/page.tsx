"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Minus, Plus } from "lucide-react"
import { CheckoutProgress } from "../../components/ui/checkout-progress"
import { useRouter } from "next/navigation"
import { getCartItems, getCartTotal, CartItem, addToCart, removeFromCart } from "../../lib/cart"

interface RecommendationItem {
  id: string
  name: string
  description: string
  price: number
  image: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [totalPrice, setTotalPrice] = useState(0)

  useEffect(() => {
    const items = getCartItems()
    setCartItems(items)
    setTotalPrice(getCartTotal())
  }, [])

  const recommendations: RecommendationItem[] = [
    {
      id: "4",
      name: "Chicken Caesar Salad",
      description: "Dada ayam panggang, selada romaine, keju parmesan, crouton, caesar dressing",
      price: 99999,
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "5",
      name: "Tuna Pasta Salad",
      description: "Pasta fusilli, tuna kalengan, jagung manis, paprika, bawang, mayones",
      price: 99999,
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "6",
      name: "Fruit Cocktail Salad",
      description: "Nanas, anggur, ceri, peach, pir, sirup ringan atau yogurt",
      price: 99999,
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "7",
      name: "Garden Salad",
      description: "Selada hijau, tomat, mentimun, wortel, jagung manis, dressing vinaigrette ringan",
      price: 99999,
      image: "/placeholder.svg?height=100&width=100",
    },
  ]

  const updateQuantity = (id: string, change: number) => {
    if (change > 0) {
      // Add to cart
      const item = cartItems.find(item => item.id === id)
      if (item) {
        const updatedItems = addToCart(item)
        setCartItems(updatedItems)
        setTotalPrice(getCartTotal())
      }
    } else {
      // Remove from cart
      const updatedItems = removeFromCart(id)
      setCartItems(updatedItems)
      setTotalPrice(getCartTotal())
    }
  }

  const addRecommendation = (recommendation: RecommendationItem) => {
    const existingItem = cartItems.find((item) => item.id === recommendation.id)
    if (existingItem) {
      updateQuantity(recommendation.id, 1)
    } else {
      const newItem: CartItem = {
        id: recommendation.id,
        name: recommendation.name,
        price: `Rp ${recommendation.price.toLocaleString()}`,
        image: recommendation.image,
        quantity: 1
      }
      setCartItems([...cartItems, newItem])
      setTotalPrice(getCartTotal())
    }
  }

  const handlePayment = () => {
    router.push("/checkout/details")
  }

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen p-4">
      <h1 className="text-3xl font-bold text-purple-700 mb-6">My Order</h1>

      <CheckoutProgress currentStep={1} />

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Order</h2>
      </div>

      {/* Order Items */}
      <div className="bg-purple-400 rounded-3xl p-4 mb-6">
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    width={64}
                    height={64}
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">{item.name}</h3>
                  <p className="text-red-400 font-medium">{item.price}</p>
                </div>
              </div>
              <div className="flex items-center">
                <button onClick={() => updateQuantity(item.id, -1)} className="bg-gray-200 p-2 rounded-full mr-3">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-bold text-lg mx-2">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, 1)}
                  className="bg-purple-700 text-white p-2 rounded-full ml-3"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-purple-700 mb-4">Recomendation</h2>
        <div className="grid grid-cols-2 gap-4">
          {recommendations.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl p-4 shadow-sm border">
              <div className="w-full h-24 rounded-lg overflow-hidden mb-3">
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  width={120}
                  height={96}
                  className="object-cover w-full h-full"
                />
              </div>
              <h3 className="font-bold text-sm mb-1">{item.name}</h3>
              <p className="text-xs text-gray-600 mb-2 line-clamp-2">{item.description}</p>
              <p className="text-purple-700 font-bold text-sm mb-3">Rp {item.price.toLocaleString()}</p>
              <button
                onClick={() => addRecommendation(item)}
                className="w-full bg-purple-100 text-purple-700 py-2 rounded-full text-sm font-medium"
              >
                Add
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Button */}
      <div className="fixed bottom-4 left-0 right-0 max-w-md mx-auto px-4">
        <button onClick={handlePayment} className="w-full bg-purple-700 text-white font-bold py-4 rounded-full text-lg">
          Continue Rp. {totalPrice.toLocaleString()}
        </button>
      </div>
    </div>
  )
}
