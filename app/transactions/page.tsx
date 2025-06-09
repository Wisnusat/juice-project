"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ArrowLeft, ChevronDown, ChevronUp, Filter, Search } from "lucide-react"
import { getUserTransactionsWithFoods } from "../../lib/supabase"
import { getUserId } from "../../lib/user"

// Define the transaction status type
type TransactionStatus = "completed" | "processing" | "cancelled" | "delivered"

// Define the food item in a transaction
interface TransactionItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
}

// Define the transaction type
interface Transaction {
  id: string
  date: string
  time: string
  status: TransactionStatus
  items: TransactionItem[]
  totalPrice: number
  deliveryFee?: number
  paymentMethod: string
}

export default function TransactionsPage() {
  const router = useRouter()
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedTransactions, setExpandedTransactions] = useState<Record<string, boolean>>({})
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<TransactionStatus | "all">("all")
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const userId = getUserId()
        const txs = await getUserTransactionsWithFoods(userId)
        setTransactions(txs)
      } catch (e) {
        console.error(e)
      }
      setLoading(false)
    }
    fetchData()
  }, [])

  // Toggle transaction expansion
  const toggleTransaction = (id: string) => {
    setExpandedTransactions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  // Filter transactions based on search query and status
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      searchQuery === "" ||
      transaction?.id?.toString()?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
      transaction?.items?.some((item) => item?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()))

    const matchesStatus = statusFilter === "all" || transaction.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Get status badge color and text
  const getStatusBadge = (status: TransactionStatus) => {
    switch (status) {
      case "completed":
        return { color: "bg-green-100 text-green-800", text: "Completed" }
      case "processing":
        return { color: "bg-yellow-100 text-yellow-800", text: "Processing" }
      case "cancelled":
        return { color: "bg-red-100 text-red-800", text: "Cancelled" }
      default:
        return { color: "bg-gray-100 text-gray-800", text: "Unknown" }
    }
  }

  if (loading) return <div className="p-4">Loading...</div>

  if (!transactions.length)
    return <div className="p-4">No transactions found.</div>

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen pb-20 border border-solid border-gray-200">
      {/* Header */}
      <div className="bg-purple-700 text-white p-4 flex items-center">
        <button onClick={() => router.back()} className="mr-4">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold">Transaction History</h1>
      </div>

      {/* Search and Filter */}
      <div className="p-4 bg-white sticky top-0 z-10 shadow-sm">
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-3 flex items-center">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="w-full py-2 pl-10 pr-4 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-700"
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button onClick={() => setShowFilters(!showFilters)} className="absolute inset-y-0 right-3 flex items-center">
            <Filter className="w-5 h-5 text-purple-700" />
          </button>
        </div>

        {showFilters && (
          <div className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-200">
            <h3 className="font-medium mb-2">Filter by Status</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setStatusFilter("all")}
                className={`px-3 py-1 rounded-full text-sm ${
                  statusFilter === "all" ? "bg-purple-700 text-white" : "bg-gray-200 text-gray-700"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setStatusFilter("completed")}
                className={`px-3 py-1 rounded-full text-sm ${
                  statusFilter === "completed" ? "bg-green-600 text-white" : "bg-green-100 text-green-800"
                }`}
              >
                Completed
              </button>
              <button
                onClick={() => setStatusFilter("processing")}
                className={`px-3 py-1 rounded-full text-sm ${
                  statusFilter === "processing" ? "bg-yellow-600 text-white" : "bg-yellow-100 text-yellow-800"
                }`}
              >
                Processing
              </button>
              <button
                onClick={() => setStatusFilter("cancelled")}
                className={`px-3 py-1 rounded-full text-sm ${
                  statusFilter === "cancelled" ? "bg-red-600 text-white" : "bg-red-100 text-red-800"
                }`}
              >
                Cancelled
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Transaction List */}
      <div className="p-4">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500">No transactions found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTransactions.map((transaction) => {
              const isExpanded = expandedTransactions[transaction.id] || false
              const statusBadge = getStatusBadge(transaction.status)

              return (
                <div key={transaction.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  {/* Transaction Header */}
                  <div
                    className="p-4 flex justify-between items-center cursor-pointer"
                    onClick={() => toggleTransaction(transaction.id)}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold">Order #{transaction.id}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${statusBadge.color}`}>
                          {statusBadge.text}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        {transaction.date} • {transaction.time}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="font-bold">Rp {transaction.totalPrice.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">{transaction.items.length} items</p>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      )}
                    </div>
                  </div>

                  {/* Transaction Details (Expanded) */}
                  {isExpanded && (
                    <div className="border-t border-gray-200">
                      {/* Items */}
                      <div className="p-4">
                        <h4 className="font-medium text-sm text-gray-500 mb-3">ORDER ITEMS</h4>
                        <div className="space-y-3">
                          {transaction.items.map((item) => (
                            <div key={item.id} className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-lg overflow-hidden">
                                <Image
                                  src={item.image || "/placeholder.svg"}
                                  alt={item.name}
                                  width={48}
                                  height={48}
                                  className="object-cover w-full h-full"
                                />
                              </div>
                              <div className="flex-1">
                                <p className="font-medium">{item.name}</p>
                                <p className="text-sm text-gray-500">x{item.quantity}</p>
                              </div>
                              <p className="font-medium">Rp {(item.price * item.quantity).toLocaleString()}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Payment Details */}
                      <div className="bg-gray-50 p-4 border-t border-gray-200">
                        <h4 className="font-medium text-sm text-gray-500 mb-3">PAYMENT DETAILS</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Subtotal</span>
                            <span>Rp {(transaction.totalPrice - (transaction.deliveryFee || 0)).toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between font-bold pt-2 border-t border-gray-200">
                            <span>Total</span>
                            <span>Rp {transaction.totalPrice.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Payment Method</span>
                            <span>{transaction.paymentMethod}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      {/* <div className="p-4 flex gap-3">
                        <button className="flex-1 bg-purple-700 text-white py-2 rounded-full font-medium">
                          Order Again
                        </button>
                        <button className="flex-1 border border-purple-700 text-purple-700 py-2 rounded-full font-medium">
                          Get Help
                        </button>
                      </div> */}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-1.5 right-1.5 max-w-md mx-auto bg-white md:border border-gray-200 p-4">
        <button
          onClick={() => router.push("/")}
          className="w-full bg-purple-700 text-white font-medium py-3 rounded-full"
        >
          Back to Home
        </button>
      </div>
    </div>
  )
}
