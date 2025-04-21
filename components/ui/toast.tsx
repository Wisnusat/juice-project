"use client"

import { useEffect, useState } from "react"
import { X } from "lucide-react"
import { createPortal } from "react-dom"
import React from "react"

export interface ToastProps {
  message: string
  isOpen: boolean
  onClose: () => void
  duration?: number
  type?: "success" | "error" | "info"
}

export function Toast({ message, isOpen, onClose, duration = 3000, type = "success" }: ToastProps) {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [isOpen, duration, onClose])

  // Only render on client
  const [isMounted, setIsMounted] = useState(false)
  useEffect(() => {
    setIsMounted(true)
    return () => setIsMounted(false)
  }, [])

  if (!isMounted) return null

  // Use portal to render at the root level
  return createPortal(
    isOpen ? (
      <div className="fixed inset-x-0 bottom-0 z-50 flex justify-center items-center p-4 pointer-events-none">
        <div
          className={`
            flex items-center justify-between w-full max-w-sm p-4 mb-4 rounded-lg shadow-lg pointer-events-auto
            ${type === "success" ? "bg-green-500" : type === "error" ? "bg-red-500" : "bg-purple-500"} 
            text-white
            animate-in slide-in-from-bottom-5 duration-300
          `}
        >
          <div className="flex items-center">
            <div className="ml-3 text-sm font-normal">{message}</div>
          </div>
          <button
            type="button"
            className="ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 inline-flex h-8 w-8 text-white hover:bg-white/20 focus:ring-2 focus:ring-white"
            onClick={onClose}
          >
            <span className="sr-only">Close</span>
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    ) : null,
    document.body,
  )
}
