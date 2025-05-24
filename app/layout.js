import { Inter } from "next/font/google";
import "./globals.css";
import React from "react";
import { ToastProvider } from "../components/ui/toast-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Food Order App",
  description: "Order healthy food online",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} antialiased`}
      >
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
