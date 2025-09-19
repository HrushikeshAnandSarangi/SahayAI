"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="absolute top-0 left-0 right-0 z-50 bg-[#FCFBF8]/95 backdrop-blur-md border-b border-[#343A40]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            <div className="relative w-10 h-10">
              <Image src="/legal.png" alt="Sahay AI Logo" fill className="object-contain" />
            </div>
            <span className="text-xl font-bold text-[#212529] tracking-tight">Sahay Ai.</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="/"><Button
              variant="ghost"
              className="text-[#212529] hover:text-[#17A2B8] hover:bg-[#17A2B8]/10 font-medium transition-colors"
            >
              Home
            </Button></a>
            <a href="/working"><Button
              variant="ghost"
              className="text-[#212529] hover:text-[#17A2B8] hover:bg-[#17A2B8]/10 font-medium transition-colors"
            >
              How it Works
            </Button></a>
            <a href="/dashboard"><Button className="bg-gradient-to-r from-[#2F58CD] to-[#4A90E2] hover:from-[#1E3A8A] hover:to-[#2563EB] text-white font-medium px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
              Dashboard
            </Button></a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-[#212529]">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-[#FCFBF8] border-t border-[#343A40]/10">
              <Button
                variant="ghost"
                className="w-full justify-start text-[#212529] hover:text-[#17A2B8] hover:bg-[#17A2B8]/10"
              >
                Home
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-[#212529] hover:text-[#17A2B8] hover:bg-[#17A2B8]/10"
              >
                How it Works
              </Button>
              <Button className="w-full justify-start bg-gradient-to-r from-[#2F58CD] to-[#4A90E2] hover:from-[#1E3A8A] hover:to-[#2563EB] text-white mt-2">
                Dashboard
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
