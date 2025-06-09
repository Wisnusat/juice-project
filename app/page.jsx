"use client"

import { History, Search } from "lucide-react"
import { PromoCarousel } from "../components/ui/promo-carousel"
import { MenuItem } from "../components/ui/menu-item"
import { FloatingCart } from "../components/ui/floating-cart"
import { useState, useEffect } from "react"
import { getFoods, getUserTransactionHistory, searchFoods } from "../lib/supabase"
import { getUserId } from "../lib/user"
import { useRouter } from "next/navigation"

function Home() {
  const router = useRouter();
  const [foods, setFoods] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [allFoods, userHistory] = await Promise.all([
          getFoods(),
          getUserTransactionHistory(getUserId())
        ])

        // Calculate tag frequencies from user history
        const tagFrequencies = userHistory.reduce((acc, order) => {
          order.tags.forEach(tag => {
            acc[tag] = (acc[tag] || 0) + 1 // Count each tag occurrence once
          })
          return acc
        }, {})

        // Sort foods by tag frequency
        const sortedFoods = allFoods.sort((a, b) => {
          const aTags = a.tag.split(',').map(tag => tag.trim())
          const bTags = b.tag.split(',').map(tag => tag.trim())
          
          const aScore = aTags.reduce((sum, tag) => sum + (tagFrequencies[tag] || 0), 0)
          const bScore = bTags.reduce((sum, tag) => sum + (tagFrequencies[tag] || 0), 0)
          return bScore - aScore
        })

        setFoods(allFoods)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleSearch = async (query) => {
    setSearchQuery(query)
    if (query.trim()) {
      setLoading(true)
      try {
        const results = await searchFoods(query)
        setFoods(results)
      } catch (error) {
        console.error('Error searching foods:', error)
      } finally {
        setLoading(false)
      }
    } else {
      // Reset to all foods if search is cleared
      const allFoods = await getFoods()
      setFoods(allFoods)
    }
  }

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
        <div className="w-full flex justify-end p-2">
          <button className="p-2 bg-white rounded-md shadow-sm cursor-pointer" onClick={() => router.push('/transactions')}>
            <History className="w-6 h-6 text-purple-700" />
          </button>
        </div>

        {/* Main content with higher z-index */}
        <div className="pt-10 text-center relative z-10">
          <h1 className="text-3xl font-bold text-white drop-shadow-md">Welcome</h1>
          <div className="relative mx-auto mt-4 w-4/5">
            <div className="absolute inset-y-0 left-3 flex items-center">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full py-2 pl-10 pr-4 bg-white rounded-full shadow-md focus:outline-none"
              placeholder="Search for food..."
            />
          </div>
        </div>
      </div>

      {/* Promo Carousel */}
      <div className="py-2 mt-4">
        <PromoCarousel />
      </div>

      {/* Menu Recommendations */}
      <div className="px-4 py-6">
        <h2 className="text-2xl font-bold text-purple-700 mb-4">
          {searchQuery ? "Search Results" : "Menu Recommendation"}
        </h2>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-700"></div>
          </div>
        ) : foods.length > 0 ? (
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
        ) : (
          <p className="text-center text-gray-500 py-8">No foods found</p>
        )}
      </div>

      {/* Floating Cart */}
      <FloatingCart />
    </div>
  )
}

export default Home
