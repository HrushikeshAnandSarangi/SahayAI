"use client"

import { Button } from "@/components/ui/button"
import { Upload, ArrowRight, Shield, Zap, Clock } from "lucide-react"
import { motion } from "framer-motion"

export default function TryItOutSection() {
  return (
    <section className="py-24 bg-gradient-to-br from-[#334B3E]/5 via-white to-[#8B6B43]/5">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Card */}
        <motion.div
          className="relative bg-white rounded-3xl shadow-2xl border border-[#334B3E]/10 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#334B3E]/10 to-transparent rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-[#8B6B43]/10 to-transparent rounded-full blur-3xl"></div>
          </div>

          <div className="relative z-10 p-8 sm:p-12">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-[#334B3E]/10 to-[#647A6A]/10 border border-[#334B3E]/20 mb-4">
                <Zap className="w-4 h-4 text-[#334B3E] mr-2" />
                <span className="text-sm font-medium text-[#334B3E]">Ready to Get Started?</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-bold text-[#212529] mb-4 text-balance">
                Try Sahay AI
                <span className="block bg-gradient-to-r from-[#334B3E] to-[#647A6A] bg-clip-text text-transparent">
                  Risk-Free Today
                </span>
              </h2>

              <p className="text-lg text-[#343A40] max-w-2xl mx-auto text-pretty">
                Upload your first legal document and experience the power of AI-driven analysis in seconds.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid sm:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto bg-gradient-to-br from-[#334B3E] to-[#647A6A] rounded-xl flex items-center justify-center mb-3">
                  <Upload className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-[#212529] mb-1">Easy Upload</h3>
                <p className="text-sm text-[#343A40]">Drag & drop PDF files</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 mx-auto bg-gradient-to-br from-[#8B6B43] to-[#6F7A68] rounded-xl flex items-center justify-center mb-3">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-[#212529] mb-1">Instant Results</h3>
                <p className="text-sm text-[#343A40]">Analysis in seconds</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 mx-auto bg-gradient-to-br from-[#5A9C78] to-[#8B6B43] rounded-xl flex items-center justify-center mb-3">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-[#212529] mb-1">Secure & Private</h3>
                <p className="text-sm text-[#343A40]">Zero data retention</p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-[#334B3E] to-[#647A6A] hover:from-[#223129] hover:to-[#4E6456] text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                Start Free Analysis
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="border-2 border-[#8B6B43] text-[#8B6B43] hover:bg-[#8B6B43] hover:text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 bg-transparent"
              >
                View Demo
              </Button>
            </div>

            {/* Disclaimer */}
            <div className="mt-8 pt-6 border-t border-[#343A40]/10">
              <p className="text-xs text-[#343A40]/70 text-center max-w-2xl mx-auto">
                By using Sahay AI, you agree that this service provides informational analysis only and does not
                constitute legal advice. Always consult with qualified legal professionals for legal decisions.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
