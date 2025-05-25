"use client"

import { useEffect, useState } from "react"
import { CheckoutProgress } from "../../../components/ui/checkout-progress"
import { useRouter } from "next/navigation"
import { User, Phone } from "lucide-react"
import { getCartTotal, getCartItems } from "../../../lib/cart"
import { createTransaction } from "../../../lib/supabase"
import { getUserId } from "../../../lib/user"

export default function CheckoutDetailsPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  })
  // const [diningOption, setDiningOption] = useState<string>("dine-in")
  // const [voucherOption, setVoucherOption] = useState<"use" | "no">("no")
  const [totalPrice, setTotalPrice] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleOrderNow = async () => {
    if (!formData.name || !formData.phone) {
      alert("Please fill in your name and phone number")
      return
    }

    // Store customer info in localStorage
    localStorage.setItem('customerInfo', JSON.stringify({
      name: formData.name,
      phone: formData.phone
    }))

    // Redirect to payment page
    router.push('/checkout/payment')
  }

  useEffect(() => {
    setTotalPrice(getCartTotal())
  }, [])

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen p-4">
      <h1 className="text-3xl font-bold text-purple-700 mb-6">Detail My Order</h1>

      <CheckoutProgress currentStep={2} />

      {/* Customer Information */}
      <div className="bg-purple-400 rounded-3xl p-6 mb-6">
        <div className="bg-white rounded-2xl p-6">
          <h3 className="text-xl font-bold mb-4">Customer Information</h3>

          <div className="space-y-4">
            <div className="flex items-center">
              <User className="w-5 h-5 mr-3 text-gray-600" />
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="w-full p-3 bg-gray-100 rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-purple-700"
                  placeholder="Enter your name"
                />
              </div>
            </div>

            <div className="flex items-center">
              <Phone className="w-5 h-5 mr-3 text-gray-600" />
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="w-full p-3 bg-gray-100 rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-purple-700"
                  placeholder="Enter your phone number"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dining Options */}
      {/* <div className="bg-white rounded-2xl p-6 mb-6 border">
        <div className="space-y-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={diningOption === "dine-in"}
              onChange={() => setDiningOption("dine-in")}
              className="w-5 h-5 text-purple-700 rounded border-gray-300 focus:ring-purple-700"
            />
            <span className="ml-3 text-lg font-medium">Dine in</span>
          </label>
        </div>

        <div className="mt-6 space-y-3">
          <label className="flex items-center justify-between">
            <span className="text-lg font-medium">Use Voucher</span>
            <input
              type="radio"
              name="voucher"
              checked={voucherOption === "use"}
              onChange={() => setVoucherOption("use")}
              className="w-5 h-5 text-purple-700"
            />
          </label>

          <label className="flex items-center justify-between">
            <span className="text-lg font-medium">No Voucher</span>
            <input
              type="radio"
              name="voucher"
              checked={voucherOption === "no"}
              onChange={() => setVoucherOption("no")}
              className="w-5 h-5 text-purple-700"
            />
          </label>
        </div>
      </div> */}

      {/* Payment Details */}
      <div className="bg-white rounded-2xl p-6 mb-20 border">
        <h3 className="text-xl font-bold mb-4">Payment Details</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="font-medium">Food Prices</span>
            <span className="font-bold">Rp {totalPrice.toLocaleString()}</span>
          </div>
          <div className="border-t pt-3">
            <div className="flex justify-between">
              <span className="font-bold text-lg">Total Payment</span>
              <span className="font-bold text-lg">Rp {totalPrice.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Order Now Button */}
      <div className="fixed bottom-4 left-0 right-0 max-w-md mx-auto px-4">
        <button
          onClick={handleOrderNow}
          disabled={isSubmitting}
          className="w-full bg-purple-700 text-white font-bold py-4 rounded-full text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Processing..." : `Order Now Rp.${totalPrice.toLocaleString()}`}
        </button>
      </div>
    </div>
  )
}
