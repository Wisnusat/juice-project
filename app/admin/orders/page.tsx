"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Bell, ChevronDown, Filter, LogOut, Search, User, CheckCircle, XCircle, Clock, TruckIcon } from "lucide-react"
import { getAllTransactionsWithFoods, updateTransactionStatus } from "../../../lib/supabase"
import { useToast } from "../../../components/ui/toast-context"

// Define the order status type
type OrderStatus = "processing" | "completed" | "cancelled"

// Define the food item in an order
interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
}

// Define the order type
interface Order {
  id: string
  customer: {
    name: string
    phone: string
  }
  date: string
  time: string
  status: OrderStatus
  items: OrderItem[]
  totalPrice: number
  deliveryFee?: number
  paymentMethod: string
  address?: string
  notes?: string
}

export default function AdminOrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({})
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all")
  const [showFilters, setShowFilters] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const { showToast } = useToast()

  // Check authentication on component mount
  useEffect(() => {
    const adminAuth = localStorage.getItem("adminAuthenticated")
    if (adminAuth !== "true") {
      router.push("/admin")
    } else {
      setIsAuthenticated(true)
      getAllTransactionsWithFoods().then((data) => {
        setOrders(data)
        setLoading(false)
      })
    }
  }, [router])

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("adminAuthenticated")
    router.push("/admin")
  }

  // Toggle order expansion
  const toggleOrder = (id: string) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  // Update order status
  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    const success = await updateTransactionStatus(orderId, newStatus)
    if (success) {
      showToast("Status Updated", "success")
      setOrders((prevOrders) =>
        prevOrders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order))
      )
    } else {
      alert("Failed to update status")
    }
  }

  // Filter orders based on search query and status
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      searchQuery === "" ||
      order.id.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesStatus = statusFilter === "all" || order.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Get status badge color and text
  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "processing":
        return { color: "bg-blue-100 text-blue-800", text: "Processing", icon: <Clock className="w-4 h-4 mr-1" /> }
      case "completed":
        return {
          color: "bg-green-100 text-green-800",
          text: "Completed",
          icon: <CheckCircle className="w-4 h-4 mr-1" />,
        }
      case "cancelled":
        return { color: "bg-red-100 text-red-800", text: "Cancelled", icon: <XCircle className="w-4 h-4 mr-1" /> }
      default:
        return { color: "bg-gray-100 text-gray-800", text: "Unknown", icon: null }
    }
  }

  if (!isAuthenticated || loading) {
    return <div className="p-8 text-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Header */}
      <header className="bg-purple-700 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-xl font-bold">Food Service Admin</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-1 rounded-full hover:bg-purple-600">
                <Bell className="h-6 w-6" />
              </button>
              <div className="flex items-center">
                <div className="bg-purple-600 p-1 rounded-full">
                  <User className="h-6 w-6" />
                </div>
                <span className="ml-2 font-medium hidden sm:block">Admin</span>
              </div>
              <button onClick={handleLogout} className="flex items-center text-sm hover:bg-purple-600 p-2 rounded">
                <LogOut className="h-5 w-5 mr-1" />
                <span className="hidden sm:block">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
        </div>

        {/* Search and Filter */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-3 flex items-center">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="w-full py-2 pl-10 pr-4 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-700"
                placeholder="Search orders by ID, customer name, or items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              <Filter className="w-5 h-5 mr-2" />
              Filters
              <ChevronDown className="w-4 h-4 ml-1" />
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t">
              <h3 className="font-medium mb-2">Filter by Status</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setStatusFilter("all")}
                  className={`px-3 py-1 rounded-md text-sm ${
                    statusFilter === "all" ? "bg-purple-700 text-white" : "bg-gray-200 text-gray-700"
                  }`}
                >
                  All Orders
                </button>
                <button
                  onClick={() => setStatusFilter("processing")}
                  className={`px-3 py-1 rounded-md text-sm ${
                    statusFilter === "processing" ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-800"
                  }`}
                >
                  Processing
                </button>
                <button
                  onClick={() => setStatusFilter("completed")}
                  className={`px-3 py-1 rounded-md text-sm ${
                    statusFilter === "completed" ? "bg-green-600 text-white" : "bg-green-100 text-green-800"
                  }`}
                >
                  Completed
                </button>
                <button
                  onClick={() => setStatusFilter("cancelled")}
                  className={`px-3 py-1 rounded-md text-sm ${
                    statusFilter === "cancelled" ? "bg-red-600 text-white" : "bg-red-100 text-red-800"
                  }`}
                >
                  Cancelled
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow text-center">
              <p className="text-gray-500">No orders found matching your criteria</p>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const isExpanded = expandedOrders[order.id] || false
              const statusBadge = getStatusBadge(order.status)

              return (
                <div key={order.id} className="bg-white rounded-lg shadow overflow-hidden">
                  {/* Order Header */}
                  <div
                    className="p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center cursor-pointer border-b border-gray-100"
                    onClick={() => toggleOrder(order.id)}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2 sm:mb-0">
                      <h3 className="font-bold text-lg">Order #{order.id}</h3>
                      <div className={`px-3 py-1 rounded-full text-xs flex items-center ${statusBadge.color}`}>
                        {statusBadge.icon}
                        {statusBadge.text}
                      </div>
                      <span className="text-sm text-gray-500">
                        {order.date} • {order.time}
                      </span>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
                      <div>
                        <p className="font-bold">Rp {order.totalPrice.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">{order.items.length} items</p>
                      </div>
                      <ChevronDown
                        className={`w-5 h-5 text-gray-500 transform transition-transform ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </div>

                  {/* Order Details (Expanded) */}
                  {isExpanded && (
                    <div className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Customer Information */}
                        <div>
                          <h4 className="font-medium text-sm text-gray-500 mb-2">CUSTOMER INFORMATION</h4>
                          <div className="bg-gray-50 p-3 rounded-md">
                            <p className="font-medium">{order.customer.name}</p>
                            <p className="text-sm text-gray-600">{order.customer.phone}</p>
                            {order.address && <p className="text-sm text-gray-600 mt-1">{order.address}</p>}
                            {order.notes && (
                              <div className="mt-2 pt-2 border-t border-gray-200">
                                <p className="text-sm text-gray-500">Notes:</p>
                                <p className="text-sm">{order.notes}</p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Order Status */}
                        <div>
                          <h4 className="font-medium text-sm text-gray-500 mb-2">UPDATE STATUS</h4>
                          <div className="bg-gray-50 p-3 rounded-md">
                            <p className="text-sm mb-2">Current Status: {statusBadge.text}</p>
                            <div className="grid grid-cols-2 gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  updateOrderStatus(order.id, "processing")
                                }}
                                className={`px-3 py-2 rounded text-sm font-medium ${
                                  order.status === "processing"
                                    ? "bg-blue-600 text-white"
                                    : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                                }`}
                                disabled={order.status === "cancelled"}
                              >
                                Processing
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  updateOrderStatus(order.id, "completed")
                                }}
                                className={`px-3 py-2 rounded text-sm font-medium ${
                                  order.status === "completed"
                                    ? "bg-green-600 text-white"
                                    : "bg-green-100 text-green-800 hover:bg-green-200"
                                }`}
                                disabled={order.status === "cancelled"}
                              >
                                Completed
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  updateOrderStatus(order.id, "cancelled")
                                }}
                                className={`px-3 py-2 rounded text-sm font-medium ${
                                  order.status === "cancelled"
                                    ? "bg-red-600 text-white"
                                    : "bg-red-100 text-red-800 hover:bg-red-200"
                                }`}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="mt-6">
                        <h4 className="font-medium text-sm text-gray-500 mb-3">ORDER ITEMS</h4>
                        <div className="bg-gray-50 rounded-md overflow-hidden">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-100">
                              <tr>
                                <th
                                  scope="col"
                                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                  Item
                                </th>
                                <th
                                  scope="col"
                                  className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                  Quantity
                                </th>
                                <th
                                  scope="col"
                                  className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                  Price
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {order.items.map((item) => (
                                <tr key={item.id}>
                                  <td className="px-4 py-3 whitespace-nowrap">
                                    <div className="flex items-center">
                                      <div className="h-10 w-10 flex-shrink-0 rounded overflow-hidden">
                                        <Image
                                          src={item.image || "/placeholder.svg"}
                                          alt={item.name}
                                          width={40}
                                          height={40}
                                          className="h-10 w-10 object-cover"
                                        />
                                      </div>
                                      <div className="ml-4">
                                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap text-center">
                                    <div className="text-sm text-gray-900">{item.quantity}</div>
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap text-right">
                                    <div className="text-sm text-gray-900">
                                      Rp {(item.price * item.quantity).toLocaleString()}
                                    </div>
                                  </td>
                                </tr>
                              ))}
                              {/* Subtotal, Delivery Fee, and Total */}
                              <tr className="bg-gray-50">
                                <td colSpan={2} className="px-4 py-2 text-right text-sm font-medium">
                                  Subtotal
                                </td>
                                <td className="px-4 py-2 text-right text-sm">
                                  Rp {(order.totalPrice - (order.deliveryFee || 0)).toLocaleString()}
                                </td>
                              </tr>
                              {order.deliveryFee && (
                                <tr className="bg-gray-50">
                                  <td colSpan={2} className="px-4 py-2 text-right text-sm font-medium">
                                    Delivery Fee
                                  </td>
                                  <td className="px-4 py-2 text-right text-sm">
                                    Rp {order.deliveryFee.toLocaleString()}
                                  </td>
                                </tr>
                              )}
                              <tr className="bg-gray-50">
                                <td colSpan={2} className="px-4 py-2 text-right text-sm font-bold">
                                  Total
                                </td>
                                <td className="px-4 py-2 text-right text-sm font-bold">
                                  Rp {order.totalPrice.toLocaleString()}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Payment Information */}
                      <div className="mt-4 text-sm text-gray-600">
                        <span className="font-medium">Payment Method:</span> {order.paymentMethod}
                      </div>
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>
      </main>
    </div>
  )
}
