"use client"

import { useState, useEffect } from "react"
import { CheckoutProgress } from "../../../components/ui/checkout-progress"
import { useRouter } from "next/navigation"
import { getCartItems, getCartTotal } from "../../../lib/cart"
import { createTransaction } from "../../../lib/supabase"
import { getUserId } from "../../../lib/user"
import Image from "next/image"

export default function PaymentPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [totalPrice, setTotalPrice] = useState(0)
  const [customerInfo, setCustomerInfo] = useState<{ name: string; phone: string } | null>(null)

  useEffect(() => {
    // Get customer info from localStorage
    const storedInfo = localStorage.getItem('customerInfo')
    if (storedInfo) {
      setCustomerInfo(JSON.parse(storedInfo))
    }
    setTotalPrice(getCartTotal())
  }, [])

  const handleFinishPayment = async () => {
    if (!customerInfo) {
      alert("Customer information not found")
      return
    }

    setIsSubmitting(true)

    try {
      const cartItems = getCartItems()
      const userId = getUserId()

      const foodOrders = cartItems.map(item => ({
        foodId: item.id,
        quantity: item.quantity
      }))

      const { success, error } = await createTransaction(
        customerInfo.name,
        customerInfo.phone,
        totalPrice,
        userId,
        foodOrders
      )

      if (success) {
        // Clear cart and customer info
        localStorage.removeItem('cart')
        localStorage.removeItem('customerInfo')
        router.push('/checkout/success')
      } else {
        alert(error || 'Failed to process payment')
      }
    } catch (error) {
      console.error('Payment error:', error)
      alert('An error occurred while processing your payment')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen p-4">
      <h1 className="text-3xl font-bold text-purple-700 mb-6">Payment</h1>

      <CheckoutProgress currentStep={3} />

      {/* QR Code Section */}
      <div className="bg-purple-400 rounded-3xl p-6 mb-6">
        <div className="bg-white rounded-2xl p-6 text-center">
          <h3 className="text-xl font-bold mb-4">Scan QR Code</h3>
          <div className="w-64 h-64 mx-auto mb-4 relative">
            <Image
              src="/assets/qrcode.png"
              alt="Payment QR Code"
              fill
              className="object-contain"
            />
          </div>
          <p className="text-gray-600 mb-2">Scan this QR code to complete your payment</p>
          <p className="text-purple-700 font-bold">Rp {totalPrice.toLocaleString()}</p>
        </div>
      </div>

      {/* Payment Details */}
      <div className="bg-white rounded-2xl p-6 mb-20 border">
        <h3 className="text-xl font-bold mb-4">Payment Details</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="font-medium">Total Amount</span>
            <span className="font-bold">Rp {totalPrice.toLocaleString()}</span>
          </div>
          {customerInfo && (
            <>
              <div className="border-t pt-3">
                <div className="flex justify-between">
                  <span className="font-medium">Name</span>
                  <span>{customerInfo.name}</span>
                </div>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between">
                  <span className="font-medium">Phone</span>
                  <span>{customerInfo.phone}</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Finish Button */}
      <div className="fixed bottom-4 left-0 right-0 max-w-md mx-auto px-4">
        <button
          onClick={handleFinishPayment}
          disabled={isSubmitting}
          className="w-full bg-purple-700 text-white font-bold py-4 rounded-full text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Processing..." : "Finish Payment"}
        </button>
      </div>
    </div>
  )
}
