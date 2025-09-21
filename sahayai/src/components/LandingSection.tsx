"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, FileText } from "lucide-react"
import LottiePlayer from "./LottiePlayer"

export default function LandingSection() {
  return (
    <section className="h-screen bg-gradient-to-br from-[#FCFBF8] via-[#FCFBF8] to-[#F8F9FA] pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        {/* Hero Content */}
        <div className="flex flex-col lg:flex-row items-center justify-between h-full">
          {/* Left Content */}
          <div className="flex-1 lg:pr-12 text-center lg:text-left">
            <div className="space-y-8">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-[#2F58CD]/10 to-[#4A90E2]/10 border border-[#2F58CD]/20">
                <span className="text-sm font-medium text-[#2F58CD]">AI-Powered Legal Analysis</span>
              </div>

              {/* Main Heading */}
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#212529] leading-tight text-balance">
                  Demystify Legal
                  <span className="block bg-gradient-to-r from-[#2F58CD] to-[#4A90E2] bg-clip-text text-transparent">
                    Documents with AI
                  </span>
                </h1>
                <p className="text-lg sm:text-xl text-[#343A40] leading-relaxed max-w-2xl text-pretty">
                  Transform complex legal jargon into clear, understandable language. Make informed decisions with
                  confidence using our advanced AI analysis.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-[#2F58CD] to-[#4A90E2] hover:from-[#1E3A8A] hover:to-[#2563EB] text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  How it Works
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-[#17A2B8] text-[#17A2B8] hover:bg-[#17A2B8] hover:text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 bg-transparent"
                >
                  Dashboard
                </Button>
              </div>

              <div className="pt-8">
                <p className="text-sm text-[#343A40]/70 text-center lg:text-left">
                  Trusted by legal professionals • Bank-level security • GDPR compliant
                </p>
              </div>
            </div>
          </div>

          {/* Right Content - Animation Space */}
          <div className="flex-1 lg:pl-12 mt-12 lg:mt-0">
            <div className="relative">
              {/* Placeholder for custom animation */}
              <div className="w-full h-96 lg:h-[500px] bg-gradient-to-br from-[#2F58CD]/5 to-[#4A90E2]/10 rounded-3xl border border-[#2F58CD]/10 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <LottiePlayer src="https://lottie.host/19c99b38-c32e-49bf-b265-2df923530692/VOjD4VWUAn.lottie" className=" h-full w-full"></LottiePlayer>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -left-4 w-20 h-20 bg-gradient-to-br from-[#17A2B8]/20 to-[#17A2B8]/10 rounded-full blur-xl animate-pulse"></div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-br from-[#2F58CD]/20 to-[#4A90E2]/10 rounded-full blur-xl animate-pulse delay-1000"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
