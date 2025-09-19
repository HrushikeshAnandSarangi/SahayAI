"use client"

import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FileText, MessageSquare, CheckSquare, BarChart3 } from "lucide-react"

interface Feature {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  details: string[]
}

const features: Feature[] = [
  {
    id: "1",
    title: "Key Details",
    description: "Instant access to the most critical information from your legal documents",
    icon: <FileText className="w-6 h-6 text-white" />,
    details: [
      "Document Type & Parties identification",
      "Key Dates & Numbers extraction",
      "Notice Periods & Critical Terms",
      "Structured Key: Value format",
    ],
  },
  {
    id: "2",
    title: "Analysis",
    description: "Plain-English summaries and key clause explanations for better understanding",
    icon: <BarChart3 className="w-6 h-6 text-white" />,
    details: [
      "Concise bullet-point summaries",
      "Critical clause identification",
      "Plain English explanations",
      "Document purpose & scope analysis",
    ],
  },
  {
    id: "3",
    title: "Ask a Question",
    description: "Interactive Q&A powered by your document content with guided prompts",
    icon: <MessageSquare className="w-6 h-6 text-white" />,
    details: [
      "Context-aware chat interface",
      "Document-only source of truth",
      "Guided starter questions",
      "AI safety guardrails included",
    ],
  },
  {
    id: "4",
    title: "Your Checklist",
    description: "Personalized action plans with categorized tasks and responsibilities",
    icon: <CheckSquare className="w-6 h-6 text-white" />,
    details: [
      "One-time tasks identification",
      "Monthly obligations tracking",
      "Rules & responsibilities breakdown",
      "Personalized to-do lists",
    ],
  },
]

export default function FeaturesSection() {
  const [activeFeature, setActiveFeature] = useState<string>(features[0].id)
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null)

  const currentFeature = features.find((f) => f.id === activeFeature) || features[0]

  return (
    <section className="py-24 bg-gradient-to-b from-[#FCFBF8] to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#212529] mb-6 text-balance">
            Powerful Features for
            <span className="block bg-gradient-to-r from-[#2F58CD] to-[#4A90E2] bg-clip-text text-transparent">
              Legal Document Analysis
            </span>
          </h2>
          <p className="text-lg text-[#343A40] max-w-3xl mx-auto text-pretty">
            Experience our 4-tab interface that transforms complex legal documents into actionable insights
          </p>
        </div>

        {/* Interactive Features Layout */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Feature List */}
          <div className="space-y-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.id}
                className={`relative p-6 rounded-2xl cursor-pointer transition-all duration-300 ${
                  activeFeature === feature.id
                    ? "bg-gradient-to-r from-[#2F58CD]/10 to-[#4A90E2]/10 border-2 border-[#2F58CD]/30"
                    : "bg-white/50 border-2 border-transparent hover:border-[#17A2B8]/30 hover:bg-[#17A2B8]/5"
                }`}
                onClick={() => setActiveFeature(feature.id)}
                onMouseEnter={() => setHoveredFeature(feature.id)}
                onMouseLeave={() => setHoveredFeature(null)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-start space-x-4">
                  <div
                    className={`flex-shrink-0 p-3 rounded-xl transition-all duration-300 ${
                      activeFeature === feature.id
                        ? "bg-gradient-to-br from-[#2F58CD] to-[#4A90E2] shadow-lg"
                        : "bg-gradient-to-br from-[#17A2B8]/20 to-[#4B8C8C]/20"
                    }`}
                  >
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <h3
                      className={`text-xl font-semibold mb-2 transition-colors duration-300 ${
                        activeFeature === feature.id ? "text-[#2F58CD]" : "text-[#212529]"
                      }`}
                    >
                      {feature.title}
                    </h3>
                    <p className="text-[#343A40] leading-relaxed">{feature.description}</p>
                  </div>
                </div>

                {/* Active indicator */}
                {activeFeature === feature.id && (
                  <motion.div
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 bg-gradient-to-b from-[#2F58CD] to-[#4A90E2] rounded-r-full"
                    layoutId="activeIndicator"
                  />
                )}
              </motion.div>
            ))}
          </div>

          {/* Right Side - Feature Showcase */}
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFeature}
                className="relative h-96 bg-gradient-to-br from-[#2F58CD]/5 to-[#4A90E2]/10 rounded-3xl border border-[#2F58CD]/10 overflow-hidden"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                {/* Dynamic background pattern */}
                <div className="absolute inset-0">
                  <div className="absolute top-8 left-8 w-32 h-32 bg-gradient-to-br from-[#2F58CD]/20 to-transparent rounded-full blur-2xl"></div>
                  <div className="absolute bottom-8 right-8 w-40 h-40 bg-gradient-to-br from-[#17A2B8]/20 to-transparent rounded-full blur-2xl"></div>
                </div>

                {/* Feature content showcase */}
                <div className="relative z-10 h-full flex items-center justify-center p-8">
                  <div className="text-center space-y-6">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-[#2F58CD] to-[#4A90E2] rounded-2xl flex items-center justify-center shadow-xl">
                      {currentFeature.icon}
                    </div>
                    <div>
                      <h4 className="text-2xl font-bold text-[#212529] mb-4">{currentFeature.title}</h4>
                      <div className="space-y-2">
                        {currentFeature.details.map((detail, index) => (
                          <div key={index} className="flex items-center justify-center text-sm text-[#343A40]">
                            <div className="w-1.5 h-1.5 bg-[#2F58CD] rounded-full mr-2"></div>
                            {detail}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating elements */}
                <motion.div
                  className="absolute top-4 right-4 w-3 h-3 bg-[#17A2B8] rounded-full"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                />
                <motion.div
                  className="absolute bottom-6 left-6 w-2 h-2 bg-[#2F58CD] rounded-full"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 0.8, 0.3],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                    delay: 1,
                  }}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
