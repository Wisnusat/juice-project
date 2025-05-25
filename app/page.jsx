"use client"

import Image from "next/image"
import { Search, ShoppingCart, Bell, Menu } from "lucide-react"
import { PromoCarousel } from "../components/ui/promo-carousel"
import { MenuItem } from "../components/ui/menu-item"
import { FloatingCart } from "../components/ui/floating-cart"
import { useState, useEffect } from "react"
import { getFoods } from "../lib/supabase"

function Home() {
  const [foods, setFoods] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const data = await getFoods()
        setFoods(data)
      } catch (error) {
        console.error('Error fetching foods:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFoods()
  }, [])

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen pb-20">
      {/* Header */}
      <div
        className="relative h-64 bg-cover bg-center"
        style={{
          backgroundImage: "url('/assets/hero.svg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Menu button with higher z-index to appear above overlay */}
        <div className="absolute top-4 left-4 z-10">
          <button className="p-2 bg-white rounded-md shadow-sm">
            <Menu className="w-6 h-6 text-purple-700" />
          </button>
        </div>

        {/* Main content with higher z-index */}
        <div className="pt-20 text-center relative z-10">
          <h1 className="text-3xl font-bold text-white drop-shadow-md">Welcome</h1>
          <div className="relative mx-auto mt-4 w-4/5">
            <div className="absolute inset-y-0 left-3 flex items-center">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="w-full py-2 pl-10 pr-4 bg-white rounded-full shadow-md focus:outline-none"
              placeholder="Search for food..."
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex space-x-3">
              <button className="p-1">
                <ShoppingCart className="w-5 h-5 text-purple-700" />
              </button>
              <button className="p-1">
                <Bell className="w-5 h-5 text-purple-700" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="px-4 py-6">
        <h2 className="text-2xl font-bold text-purple-700">Categories</h2>
        <div className="grid grid-cols-4 gap-2 mt-4">
          <CategoryItem image="/assets/vegetable.svg" name="Vegetable Salad" />
          <CategoryItem image="/assets/fruit.svg" name="Fruit Salad" />
          <CategoryItem image="/assets/chicken.svg" name="Chicken Salad" />
          <CategoryItem image="/assets/pasta.svg" name="Pasta Salad" />
        </div>
      </div>

      {/* Promo Carousel */}
      <div className="py-2">
        <PromoCarousel />
      </div>

      {/* Menu Recommendations */}
      <div className="px-4 py-6">
        <h2 className="text-2xl font-bold text-purple-700 mb-4">Menu Recommendation</h2>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-700"></div>
          </div>
        ) : (
          foods.map((item) => (
            <MenuItem
              key={item.id}
              id={item.id}
              name={item.name}
              description={item.description}
              weight={item.weight || "300g"}
              calories={item.calories || "250 kcal"}
              price={`Rp ${item.price.toLocaleString()}`}
              vitamins={item.vitamins || "Vitamin C"}
              image={item.image}
            />
          ))
        )}
      </div>

      {/* Floating Cart */}
      <FloatingCart />
    </div>
  )
}

function CategoryItem({ image, name }) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-16 h-16 rounded-full flex items-center justify-center overflow-hidden">
        <Image src={image || "/placeholder.svg"} alt={name} width={100} height={100} className="object-cover" />
      </div>
      <p className="mt-2 text-xs text-center font-medium">{name}</p>
    </div>
  )
}

export default Home
