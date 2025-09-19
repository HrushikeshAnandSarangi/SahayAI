"use client"

import {
  Upload,
  Brain,
  BarChart3,
  Shield,
  Lock,
  Zap,
  ArrowRight,
  Sparkles,
  Play,
  Pause,
  ChevronDown,
  ChevronUp,
  FileText,
  Users,
  Clock,
  CheckCircle,
  LucideProps,
} from "lucide-react"
import React, { useState, useEffect, useRef, FC, ReactNode } from "react"

// --- TYPE DEFINITIONS for improved type safety ---

// Defines the structure for each step in the "How it Works" timeline
interface Step {
  icon: FC<LucideProps>
  title: string
  subtitle: string
  description: string
  detail: string
  story: string
  features: string[]
  metrics: Record<string, string>
  color: "primary" | "accent" // Added color property for type safety
}

// Defines the structure for each security feature card
interface SecurityFeature {
  icon: ReactNode
  title: string
  description: string
  color: string
  details: string
  benefits: string[]
}

// Defines the structure for the statistic cards in the hero section
interface Stat {
  icon: FC<LucideProps>
  label: string
  value: string
  color: string
}

// --- MAIN COMPONENT ---

export default function HowItWorks() {
  const [isVisible, setIsVisible] = useState(false)
  const [activeStep, setActiveStep] = useState(0)
  const [expandedFeature, setExpandedFeature] = useState<number | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)

  const heroRef = useRef<HTMLDivElement>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // --- HOOKS for animations and interactions ---

  // Intersection Observer to trigger hero animation on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect() // Disconnect after animation is triggered
        }
      },
      { threshold: 0.1 },
    )

    if (heroRef.current) {
      observer.observe(heroRef.current)
    }

    return () => {
      if (heroRef.current) {
        observer.unobserve(heroRef.current)
      }
    }
  }, [])

  // Effect to handle the auto-play functionality for the story timeline
  useEffect(() => {
    if (isPlaying) {
      // Smoother progress interval
      intervalRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setActiveStep((current) => (current + 1) % steps.length)
            return 0 // Reset progress for the next step
          }
          return prev + 1 // Slower increment for a smoother bar
        })
      }, 50) // Faster interval for a smoother animation
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isPlaying, activeStep]) // Rerun effect when activeStep changes

  // --- HANDLERS ---

  const togglePlayback = () => {
    setIsPlaying(!isPlaying)
    if (!isPlaying) {
      setProgress(0) // Reset progress when play is clicked
    }
  }

  const handleStepClick = (index: number) => {
    setActiveStep(index)
    setProgress(0) // Reset progress on manual step selection
    setIsPlaying(false) // Pause playback when a step is manually selected
  }

  const handleFeatureClick = (index: number) => {
    setExpandedFeature(expandedFeature === index ? null : index)
  }

  // --- CONTENT & DATA ---
  // Improved narrative and more realistic metrics

  const steps: Step[] = [
    {
      icon: Upload,
      title: "Secure Document Upload",
      subtitle: "The Starting Point",
      description: "Simply drag and drop your document. Our system secures it instantly with end-to-end TLS 1.3 encryption.",
      detail: "Military-Grade Encryption",
      story:
        "Meet Sarah, a paralegal facing a tight deadline on a complex merger agreement. She uploads the 100-page document, feeling confident as she sees the real-time encryption status.",
      features: [
        "Drag & Drop Simplicity",
        "Support for PDF, DOCX, TXT",
        "Real-time Encryption",
        "File Integrity Check",
      ],
      metrics: { "Upload Time": "< 15 seconds", Security: "TLS 1.3 Protocol", "File Formats": "15+ Supported" },
      color: "primary",
    },
    {
      icon: Brain,
      title: "Intelligent AI Analysis",
      subtitle: "Uncovering Insights",
      description:
        "Gemini AI reads, understands, and structures your document's content. Our in-memory RAG pipeline allows for precise, context-aware Q&A without storing your data.",
      detail: "Ephemeral In-Memory Processing",
      story:
        "Within seconds, the AI flags a critical non-compete clause that was buried on page 74. Sarah uses the AI chat to ask, 'What are the liabilities associated with this clause?' and gets an instant, accurate summary.",
      features: [
        "Context-Aware Q&A",
        "Key Clause Identification",
        "Risk & Obligation Flagging",
        "Automated Data Extraction",
      ],
      metrics: { "Analysis Speed": "~90 Seconds", Accuracy: ">97% Extraction", "Data Policy": "Zero Retention" },
      color: "accent",
    },
    {
      icon: BarChart3,
      title: "Actionable Intelligence Dashboard",
      subtitle: "From Data to Decision",
      description: "Your document is transformed into an interactive dashboard with summaries, a risk matrix, an AI assistant, and a shareable checklist.",
      detail: "Instant Clarity",
      story:
        "Sarah presents the dashboard in a team meeting. The visual risk matrix immediately focuses the conversation. She exports the AI-generated checklist, saving her team over 3 hours of manual work and ensuring no detail is missed.",
      features: [
        "Interactive Risk Matrix",
        "AI-Powered Q&A Chat",
        "One-Click Summaries",
        "Export to PDF & CSV",
      ],
      metrics: { "Efficiency Gain": "4x Faster Review", "Actionable Items": "25+ Generated", "User Rating": "4.9/5.0" },
      color: "primary",
    },
  ]

  const securityFeatures: SecurityFeature[] = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Serverless & Ephemeral",
      description: "Analysis occurs in isolated, temporary environments that are destroyed after use.",
      color: "text-[#4B8C8C]",
      details:
        "Each analysis spins up a new, clean compute instance. This 'just-in-time' infrastructure drastically reduces the attack surface and ensures zero data cross-contamination between tasks.",
      benefits: ["Maximum Isolation", "Infinite Scalability", "Cost-Efficient", "Reduced Attack Surface"],
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: "Zero-Retention by Design",
      description: "We don't store your documents. Data is automatically purged post-analysis.",
      color: "text-[#5A9C78]",
      details:
        "Our entire architecture is built on a 'forget-first' principle. Your documents and their analyses are automatically and permanently deleted within 24 hours, guaranteeing privacy and compliance.",
      benefits: ["GDPR & CCPA Compliant", "No Long-Term Data Risk", "Automatic & Irreversible", "True User Privacy"],
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: "In-Memory RAG Pipeline",
      description: "Q&A is powered by temporary in-memory indexing, not a persistent database.",
      color: "text-[#2F58CD]",
      details:
        "Our Retrieval-Augmented Generation (RAG) system processes documents entirely in volatile memory (RAM). This means faster, more secure queries because the data ceases to exist once the session ends.",
      benefits: ["Blazing-Fast Q&A", "No Data Footprint", "Enhanced Context", "Uncompromised Privacy"],
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "End-to-End Encryption",
      description: "Data is protected with TLS 1.3 and AES-256 encryption at every stage.",
      color: "text-[#4B8C8C]",
      details:
        "From the moment you upload to the moment you receive results, your data is wrapped in multiple layers of industry-leading encryption, both in transit (TLS 1.3) and at rest (AES-256).",
      benefits: ["Protects Data in Transit", "Secures Data at Rest", "Perfect Forward Secrecy", "Prevents Eavesdropping"],
    },
  ]

  // --- RENDER ---

  return (
    <div className="min-h-screen bg-[#FCFBF8] text-[#212529] font-sans">
      {/* Hero Section */}
      <div
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#2F58CD]/10 via-[#FCFBF8] to-[#5A9C78]/10 overflow-hidden"
      >
        <div
          className={`relative max-w-7xl mx-auto px-6 text-center transition-opacity duration-1000 ease-in-out ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="inline-flex items-center gap-2 bg-[#2F58CD]/10 px-4 py-2 rounded-full text-[#2F58CD] font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            AI-Powered Document Intelligence
          </div>

          <h1 className="text-6xl md:text-7xl font-bold text-[#212529] mb-6 text-balance">
            How It <span className="text-[#2F58CD]">Works</span>
          </h1>

          <p className="text-xl md:text-2xl text-[#343A40] max-w-4xl mx-auto text-pretty mb-12 leading-relaxed">
            From dense documents to decisive action. Our secure AI platform transforms your files into interactive,
            actionable intelligence in moments.
          </p>

        </div>
      </div>

      {/* Steps/Timeline Section */}
      <div className="max-w-4xl mx-auto px-6 py-24 sm:py-32 border-t border-gray-200/80">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-[#212529] mb-4">
            Your Journey to <span className="text-[#2F58CD]">Clarity</span>
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-[#2F58CD] to-[#5A9C78] mx-auto rounded-full mb-6"></div>
          <p className="text-lg text-[#343A40] max-w-2xl mx-auto">
            Follow Sarah's path from being buried in paperwork to leading with data-driven confidence.
          </p>

          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={togglePlayback}
              className="flex items-center gap-2 bg-[#2F58CD] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#2F58CD]/90 transition-transform duration-300 ease-in-out shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              {isPlaying ? "Pause Story" : "Play Story"}
            </button>
            <div className="text-sm text-[#343A40] font-medium">
              Step {activeStep + 1} of {steps.length}
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#2F58CD]/20 via-[#5A9C78]/20 to-[#2F58CD]/20"></div>

          <div className="space-y-16">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isActive = index === activeStep

              return (
                <div
                  key={index}
                  className="relative flex items-start gap-6 sm:gap-8 group cursor-pointer"
                  onClick={() => handleStepClick(index)}
                >
                  <div className="relative z-10 flex-shrink-0">
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center transition-[transform,box-shadow,background-color,border-color] duration-300 ease-in-out border-2 ${
                        isActive
                          ? `scale-110 shadow-lg ${
                              step.color === "primary" ? "bg-[#2F58CD]/20 border-[#2F58CD]" : "bg-[#5A9C78]/20 border-[#5A9C78]"
                            }`
                          : "bg-white border-gray-200/50 group-hover:scale-105 group-hover:border-[#2F58CD]/50"
                      }`}
                    >
                      <Icon
                        className={`w-8 h-8 transition-colors duration-300 ${
                          isActive
                            ? step.color === "primary"
                              ? "text-[#2F58CD]"
                              : "text-[#5A9C78]"
                            : "text-[#343A40] group-hover:text-[#2F58CD]"
                        }`}
                      />
                    </div>
                    <div
                      className={`absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-transform duration-300 ${
                        isActive
                          ? `${
                              step.color === "primary"
                                ? "bg-[#2F58CD] text-white"
                                : "bg-[#5A9C78] text-white"
                            } scale-100`
                          : "bg-gray-200 text-[#343A40] scale-90 group-hover:scale-100"
                      }`}
                    >
                      {index + 1}
                    </div>
                  </div>

                  <div
                    className={`flex-1 transition-opacity duration-500 ease-in-out ${
                      isActive ? "opacity-100" : "opacity-60 group-hover:opacity-100"
                    }`}
                  >
                    <div
                      className={`bg-white rounded-2xl p-6 sm:p-8 shadow-sm border transition-[box-shadow,border-color] duration-300 ease-in-out ${
                        isActive
                          ? `shadow-xl ${
                              step.color === "primary" ? "border-[#2F58CD]/50" : "border-[#5A9C78]/50"
                            } bg-[#2F58CD]/5`
                          : "border-gray-200/50 group-hover:shadow-md group-hover:border-[#2F58CD]/20"
                      }`}
                    >
                      <div className="text-sm text-[#343A40] font-medium uppercase tracking-wider mb-2">
                        {step.subtitle}
                      </div>
                      <h3 className="text-2xl font-bold text-[#212529] mb-4">{step.title}</h3>
                      <p className="text-card-foreground text-pretty leading-relaxed mb-6">{step.description}</p>
                      
                      {isActive && (
                        <div className="bg-gray-100/50 rounded-xl p-4 mb-6 border-l-4 border-[#2F58CD]/80">
                          <p className="text-sm text-[#343A40] italic leading-relaxed">"{step.story}"</p>
                        </div>
                      )}

                      <div className="grid md:grid-cols-2 gap-x-8 gap-y-4 mb-6">
                        <div>
                          <h4 className="font-semibold text-[#212529] mb-2">Key Features</h4>
                          <ul className="space-y-1.5">
                            {step.features.map((feature, idx) => (
                              <li key={idx} className="flex items-center gap-2 text-sm text-[#343A40]">
                                <CheckCircle className="w-4 h-4 text-[#5A9C78] flex-shrink-0" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-[#212529] mb-2">Performance Metrics</h4>
                          <div className="space-y-1">
                            {Object.entries(step.metrics).map(([key, value]) => (
                              <div key={key} className="flex justify-between text-sm">
                                <span className="text-[#343A40]">{key}:</span>
                                <span className="font-medium text-[#212529]">{value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center text-sm font-medium text-[#2F58CD]">
                        <div className="w-2 h-2 rounded-full mr-3 bg-[#2F58CD]" />
                        {step.detail}
                      </div>
                    </div>
                    {isActive && isPlaying && (
                       <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden mt-4">
                         <div
                           className={`h-full bg-gradient-to-r transition-[width] duration-150 ease-linear ${
                             step.color === "primary" ? "from-[#2F58CD] to-[#5A9C78]" : "from-[#5A9C78] to-[#2F58CD]"
                           }`}
                           style={{ width: `${progress}%` }}
                         />
                       </div>
                     )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Security Section */}
      <div className="bg-white border-t border-gray-200/80">
        <div className="max-w-7xl mx-auto px-6 py-24 sm:py-32">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-[#2F58CD]/10 px-4 py-2 rounded-full text-[#2F58CD] font-medium mb-6">
              <Shield className="w-4 h-4" />
              Enterprise-Grade Security
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#212529] mb-4">
              <span className="text-[#2F58CD]">Secure</span> by Design
            </h2>
            <p className="text-lg text-[#343A40] max-w-2xl mx-auto text-pretty">
              Your trust is our priority. Our architecture is engineered to protect your privacy at every layer.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {securityFeatures.map((feature, index) => (
              <div
                key={index}
                className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-200/50 transition-[transform,box-shadow,ring] duration-300 ease-in-out cursor-pointer hover:shadow-lg hover:-translate-y-1 ${
                  expandedFeature === index ? "ring-2 ring-[#2F58CD]/50 bg-[#2F58CD]/5" : ""
                }`}
                onClick={() => handleFeatureClick(index)}
              >
                <div className="w-14 h-14 bg-[#2F58CD]/10 rounded-2xl flex items-center justify-center mb-4">
                  <div className={feature.color}>{feature.icon}</div>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-[#212529] text-base">{feature.title}</h3>
                  {expandedFeature === index ? (
                    <ChevronUp className="w-5 h-5 text-[#343A40]" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-[#343A40]" />
                  )}
                </div>
                <p className="text-sm text-[#343A40] text-pretty leading-relaxed mb-3">{feature.description}</p>
                <div
                  className={`transition-[max-height,opacity] duration-500 ease-in-out overflow-hidden ${
                    expandedFeature === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="border-t border-gray-200/50 pt-4 mt-4">
                    <p className="text-sm text-[#343A40] mb-3 leading-relaxed">{feature.details}</p>
                    <div>
                      <h4 className="text-xs font-semibold text-[#212529] mb-2 uppercase tracking-wider">Benefits</h4>
                      <ul className="space-y-1.5">
                        {feature.benefits.map((benefit, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-xs text-[#343A40]">
                            <CheckCircle className="w-3.5 h-3.5 text-[#5A9C78] flex-shrink-0" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-6 py-24 sm:py-32 border-t border-gray-200/80">
        <div className="bg-gradient-to-br from-[#2F58CD] via-[#5A9C78] to-[#2F58CD] rounded-3xl p-12 text-center text-[#FCFBF8]">
          <h2 className="text-4xl font-bold mb-4">Ready to Unlock Your Document's Potential?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto text-pretty">
            Stop searching, start knowing. Experience the future of document analysis today.
          </p>
          <button className="bg-[#FCFBF8] text-[#2F58CD] px-8 py-4 rounded-xl font-semibold hover:bg-[#FCFBF8]/90 transition-transform duration-300 ease-in-out shadow-lg hover:shadow-xl inline-flex items-center gap-2 transform hover:scale-105">
            Get Started for Free
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

