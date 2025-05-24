"use client"

import { CheckoutProgress } from "../../../components/ui/checkout-progress"
import { useRouter } from "next/navigation"
import { Check } from "lucide-react"
import { clearCart } from "../../../lib/cart"

export default function PaymentSuccessPage() {
  const router = useRouter()

  const backToHome = () => {
    clearCart();
    router.push("/")
  }

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen p-4">
      <h1 className="text-3xl font-bold text-purple-700 mb-6">Payment</h1>

      <CheckoutProgress currentStep={3} />

      {/* Success Message */}
      <div className="bg-purple-400 rounded-3xl p-8 flex flex-col items-center justify-center min-h-[500px]">
        <div className="bg-white rounded-3xl p-8 flex flex-col items-center text-center max-w-sm">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-purple-700 rounded-full flex items-center justify-center mb-6">
            <Check className="w-10 h-10 text-white" />
          </div>

          {/* Success Title */}
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            You Place the Order
            <br />
            Successfully
          </h2>

          {/* Success Message */}
          <p className="text-gray-600 text-lg mb-8 leading-relaxed">
            You placed the order successfully. You will get your food within 25 minutes. Thanks for using our services.
            Enjoy your food :)
          </p>
        </div>
      </div>

      {/* Bottom Buttons */}
      <div className="space-y-4 mt-6">
        <button
          onClick={backToHome}
          className="w-full bg-white border-2 border-purple-700 text-purple-700 font-bold py-4 rounded-full text-lg"
        >
          Back To Home
        </button>
      </div>
    </div>
  )
}
