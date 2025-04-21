"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { Toast } from "./toast"
import React from "react"

type ToastType = "success" | "error" | "info"

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [type, setType] = useState<ToastType>("success")

  const showToast = (message: string, type: ToastType = "success") => {
    setMessage(message)
    setType(type)
    setIsOpen(true)
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toast message={message} isOpen={isOpen} onClose={handleClose} type={type} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}
