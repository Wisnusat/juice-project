"use client"

import { useState, useEffect } from "react"
import { CheckoutProgress } from "../../../components/ui/checkout-progress"
import { useRouter } from "next/navigation"
import { Smartphone } from "lucide-react"

export default function PaymentPage() {
  const router = useRouter()
  const [showQR, setShowQR] = useState(true)

  // Simulate payment processing after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/checkout/success")
    }, 5000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen p-4">
      <h1 className="text-3xl font-bold text-purple-700 mb-6">Payment</h1>

      <CheckoutProgress currentStep={3} />

      {/* QR Code Section */}
      <div className="bg-purple-400 rounded-3xl p-8 flex flex-col items-center justify-center min-h-[500px]">
        {showQR && (
          <div className="bg-white rounded-3xl p-8 flex flex-col items-center">
            {/* QR Code */}
            <div className="w-64 h-64 bg-white border-4 border-black rounded-2xl flex items-center justify-center mb-4">
              <div className="w-56 h-56 bg-black relative">
                {/* Simple QR code pattern */}
                <div className="absolute inset-0 grid grid-cols-8 gap-1 p-2">
                  {Array.from({ length: 64 }).map((_, i) => (
                    <div
                      key={i}
                      className={`${Math.random() > 0.5 ? "bg-white" : "bg-black"} ${
                        i < 8 || i >= 56 || i % 8 === 0 || i % 8 === 7 ? "bg-black" : ""
                      }`}
                    />
                  ))}
                </div>
                {/* Corner squares */}
                <div className="absolute top-2 left-2 w-8 h-8 border-2 border-white">
                  <div className="w-4 h-4 bg-white m-1"></div>
                </div>
                <div className="absolute top-2 right-2 w-8 h-8 border-2 border-white">
                  <div className="w-4 h-4 bg-white m-1"></div>
                </div>
                <div className="absolute bottom-2 left-2 w-8 h-8 border-2 border-white">
                  <div className="w-4 h-4 bg-white m-1"></div>
                </div>
              </div>
            </div>

            {/* Scan Me Button */}
            <div className="bg-black text-white px-6 py-3 rounded-full flex items-center">
              <Smartphone className="w-5 h-5 mr-2" />
              <span className="font-bold">SCAN ME</span>
            </div>
          </div>
        )}

        <p className="text-white text-center text-lg mt-6 font-medium">
          Scan QR diatas untuk
          <br />
          melakukan
          <br />
          pembayaran
        </p>
      </div>
    </div>
  )
}
