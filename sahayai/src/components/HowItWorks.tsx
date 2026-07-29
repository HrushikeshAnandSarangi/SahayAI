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
  MessageSquare,
  Languages,
} from "lucide-react"
import React, { useState, useEffect, useRef, FC, ReactNode } from "react"

// --- TYPE DEFINITIONS for improved type safety ---

interface Step {
  icon: FC<LucideProps>
  title: string
  subtitle: string
  description: string
  detail: string
  story: string
  features: string[]
  metrics: Record<string, string>
  color: "primary" | "accent"
}

interface SecurityFeature {
  icon: ReactNode
  title: string
  description: string
  color: string
  details: string
  benefits: string[]
}

interface ChatMessage {
  sender: 'user' | 'ai' | 'system';
  text: string;
  translation?: string;
}


// --- MAIN COMPONENT ---

export default function HowItWorks() {
  const [isVisible, setIsVisible] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null)

  // --- State for Priya's Journey ---
  const [priyaStep, setPriyaStep] = useState(0);
  const [perspective, setPerspective] = useState<'tenant' | 'landlord' | null>(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisText, setAnalysisText] = useState("Analyzing from a Tenant's perspective...");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [highlightedText, setHighlightedText] = useState('');
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const chatEndRef = useRef<HTMLDivElement>(null);


  // --- HOOKS for animations and interactions ---

  // Intersection Observer to trigger hero animation on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
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

  // Effect for analysis progress bar and cycling text
  useEffect(() => {
    if (priyaStep === 2) {
      const progressInterval = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            setTimeout(() => setPriyaStep(3), 500);
            return 100;
          }
          return prev + 1;
        });
      }, 50);

      const analysisTexts = [
        "Analyzing from a Tenant's perspective...",
        "Extracting key financial commitments...",
        "Identifying complex clauses and potential ambiguities...",
        "Building your personalized Clarity Dashboard...",
      ];
      let textIndex = 0;
      const textInterval = setInterval(() => {
        textIndex = (textIndex + 1) % analysisTexts.length;
        setAnalysisText(analysisTexts[textIndex]);
      }, 1500);

      return () => {
        clearInterval(progressInterval);
        clearInterval(textInterval);
      };
    }
  }, [priyaStep]);
  
  // Effect to scroll chat to the bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);


  // --- HANDLERS ---
  const handlePerspectiveSelect = (role: 'tenant' | 'landlord') => {
    setPerspective(role);
    setPriyaStep(2);
  };
  
  const handleHighlight = (text: string) => {
    setHighlightedText(text);
    setShowQuickActions(true);
    setChatHistory(prev => [...prev, { sender: 'system', text: `Selected text: "${text}"`, translation: `à¤šà¤¯à¤¨à¤¿à¤¤ à¤ªà¤¾à¤ : "${text}"`}]);
  };
  
  const handleQuickAction = (action: string) => {
    setShowQuickActions(false);
    let question = '';
    if (action === 'explain') question = "Explain this in simple terms";
    if (action === 'require') question = "What does this require me to do?";
    if (action === 'standard') question = "Is this a standard clause?";
    
    setChatHistory(prev => [...prev, { sender: 'user', text: question, translation: 'à¤¯à¤¹ à¤¸à¤°à¤² à¤¶à¤¬à¥à¤¦à¥‹à¤‚ à¤®à¥‡à¤‚ à¤¸à¤®à¤à¤¾à¤à¤‚' }]);
    
    setTimeout(() => {
      if(action === 'explain'){
         setChatHistory(prev => [...prev, { sender: 'ai', text: "In simple terms, this means that as the tenant, you are responsible for paying for small repairs yourself, as long as the cost for a single issue is â‚¹2,500 or less. This could include things like a leaking tap or a broken light switch.", translation: "à¤¸à¤°à¤² à¤¶à¤¬à¥à¤¦à¥‹à¤‚ à¤®à¥‡à¤‚, à¤‡à¤¸à¤•à¤¾ à¤®à¤¤à¤²à¤¬ à¤¹à¥ˆ à¤•à¤¿ à¤•à¤¿à¤°à¤¾à¤¯à¥‡à¤¦à¤¾à¤° à¤•à¥‡ à¤°à¥‚à¤ª à¤®à¥‡à¤‚, à¤†à¤ª à¤›à¥‹à¤Ÿà¥€ à¤®à¤°à¤®à¥à¤®à¤¤ à¤•à¥‡ à¤²à¤¿à¤ à¤­à¥à¤—à¤¤à¤¾à¤¨ à¤•à¤°à¤¨à¥‡ à¤•à¥‡ à¤²à¤¿à¤ à¤œà¤¿à¤®à¥à¤®à¥‡à¤¦à¤¾à¤° à¤¹à¥ˆà¤‚, à¤œà¤¬ à¤¤à¤• à¤•à¤¿ à¤•à¤¿à¤¸à¥€ à¤à¤• à¤®à¥à¤¦à¥à¤¦à¥‡ à¤•à¥€ à¤²à¤¾à¤—à¤¤ â‚¹2,500 à¤¯à¤¾ à¤‰à¤¸à¤¸à¥‡ à¤•à¤® à¤¹à¥‹à¥¤ à¤‡à¤¸à¤®à¥‡à¤‚ à¤Ÿà¤ªà¤•à¤¤à¤¾ à¤¹à¥à¤† à¤¨à¤² à¤¯à¤¾ à¤Ÿà¥‚à¤Ÿà¤¾ à¤¹à¥à¤† à¤²à¤¾à¤‡à¤Ÿ à¤¸à¥à¤µà¤¿à¤š à¤œà¥ˆà¤¸à¥€ à¤šà¥€à¤œà¥‡à¤‚ à¤¶à¤¾à¤®à¤¿à¤² à¤¹à¥‹ à¤¸à¤•à¤¤à¥€ à¤¹à¥ˆà¤‚à¥¤"}]);
      }
    }, 1000);
  };

  const handleCustomQuestion = () => {
     setChatHistory(prev => [...prev, { sender: 'user', text: "Okay, but what if the geyser in the bathroom stops working? That's a big expense.", translation: "à¤ à¥€à¤• à¤¹à¥ˆ, à¤²à¥‡à¤•à¤¿à¤¨ à¤…à¤—à¤° à¤¬à¤¾à¤¥à¤°à¥‚à¤® à¤®à¥‡à¤‚ à¤—à¥€à¤œà¤° à¤•à¤¾à¤® à¤•à¤°à¤¨à¤¾ à¤¬à¤‚à¤¦ à¤•à¤° à¤¦à¥‡ à¤¤à¥‹ à¤•à¥à¤¯à¤¾ à¤¹à¥‹à¤—à¤¾? à¤¯à¤¹ à¤à¤• à¤¬à¤¡à¤¼à¤¾ à¤–à¤°à¥à¤š à¤¹à¥ˆà¥¤"}]);
     setTimeout(() => {
        setChatHistory(prev => [...prev, { sender: 'ai', text: "That's a great question. Since a geyser repair would likely cost more than â‚¹2,500, this clause indicates the landlord would be responsible for it. However, the agreement doesn't specify how quickly they must fix major issues. This would be an excellent point to clarify with your landlord.", translation: "à¤¯à¤¹ à¤à¤• à¤¬à¥‡à¤¹à¤¤à¤°à¥€à¤¨ à¤¸à¤µà¤¾à¤² à¤¹à¥ˆà¥¤ à¤šà¥‚à¤‚à¤•à¤¿ à¤—à¥€à¤œà¤° à¤•à¥€ à¤®à¤°à¤®à¥à¤®à¤¤ à¤®à¥‡à¤‚ â‚¹2,500 à¤¸à¥‡ à¤…à¤§à¤¿à¤• à¤•à¥€ à¤²à¤¾à¤—à¤¤ à¤†à¤¨à¥‡ à¤•à¥€ à¤¸à¤‚à¤­à¤¾à¤µà¤¨à¤¾ à¤¹à¥ˆ, à¤¯à¤¹ à¤–à¤‚à¤¡ à¤‡à¤‚à¤—à¤¿à¤¤ à¤•à¤°à¤¤à¤¾ à¤¹à¥ˆ à¤•à¤¿ à¤®à¤•à¤¾à¤¨ à¤®à¤¾à¤²à¤¿à¤• à¤‡à¤¸à¤•à¥‡ à¤²à¤¿à¤ à¤œà¤¿à¤®à¥à¤®à¥‡à¤¦à¤¾à¤° à¤¹à¥‹à¤—à¤¾à¥¤ à¤¹à¤¾à¤²à¤¾à¤‚à¤•à¤¿, à¤¸à¤®à¤à¥Œà¤¤à¥‡ à¤®à¥‡à¤‚ à¤¯à¤¹ à¤¨à¤¿à¤°à¥à¤¦à¤¿à¤·à¥à¤Ÿ à¤¨à¤¹à¥€à¤‚ à¤¹à¥ˆ à¤•à¤¿ à¤‰à¤¨à¥à¤¹à¥‡à¤‚ à¤¬à¤¡à¤¼à¥€ à¤¸à¤®à¤¸à¥à¤¯à¤¾à¤“à¤‚ à¤•à¥‹ à¤•à¤¿à¤¤à¤¨à¥€ à¤œà¤²à¥à¤¦à¥€ à¤ à¥€à¤• à¤•à¤°à¤¨à¤¾ à¤šà¤¾à¤¹à¤¿à¤à¥¤ à¤¯à¤¹ à¤†à¤ªà¤•à¥‡ à¤®à¤•à¤¾à¤¨ à¤®à¤¾à¤²à¤¿à¤• à¤•à¥‡ à¤¸à¤¾à¤¥ à¤¸à¥à¤ªà¤·à¥à¤Ÿ à¤•à¤°à¤¨à¥‡ à¤•à¥‡ à¤²à¤¿à¤ à¤à¤• à¤‰à¤¤à¥à¤•à¥ƒà¤·à¥à¤Ÿ à¤¬à¤¿à¤‚à¤¦à¥ à¤¹à¥‹à¤—à¤¾à¥¤"}]);
        setTimeout(() => setPriyaStep(6), 1500);
     }, 1000);
  }

  const handleSummarize = () => {
    setChatHistory(prev => [...prev, { sender: 'user', text: "Summarize the most important questions I should ask my landlord.", translation: "à¤®à¥‡à¤°à¥‡ à¤®à¤•à¤¾à¤¨ à¤®à¤¾à¤²à¤¿à¤• à¤¸à¥‡ à¤ªà¥‚à¤›à¤¨à¥‡ à¤•à¥‡ à¤²à¤¿à¤ à¤¸à¤¬à¤¸à¥‡ à¤®à¤¹à¤¤à¥à¤µà¤ªà¥‚à¤°à¥à¤£ à¤ªà¥à¤°à¤¶à¥à¤¨à¥‹à¤‚ à¤•à¤¾ à¤¸à¤¾à¤°à¤¾à¤‚à¤¶ à¤¦à¥‡à¤‚à¥¤" }]);
    setTimeout(() => {
      setChatHistory(prev => [...prev, { sender: 'ai', text: "Of course. Here is a summary of key questions to discuss with your landlord:\n1. Regarding Minor Repairs (Clause 7.2): Could you clarify the process for reporting major issues, like a broken geyser, and what the expected timeframe for a fix is?\n2. Regarding the Notice Period (Clause 11): Is there any flexibility on the 60-day notice period in case of a sudden job relocation?\n3. Regarding Guests: The agreement doesn't mention a policy for overnight guests. Could you please clarify the rules?\n4. Regarding Painting: The contract requires me to pay for whitewashing when I leave. Does this apply even if I stay for just one year?", translation: "à¤¬à¥‡à¤¶à¤•à¥¤ à¤…à¤ªà¤¨à¥‡ à¤®à¤•à¤¾à¤¨ à¤®à¤¾à¤²à¤¿à¤• à¤•à¥‡ à¤¸à¤¾à¤¥ à¤šà¤°à¥à¤šà¤¾ à¤•à¤°à¤¨à¥‡ à¤•à¥‡ à¤²à¤¿à¤ à¤ªà¥à¤°à¤®à¥à¤– à¤ªà¥à¤°à¤¶à¥à¤¨à¥‹à¤‚ à¤•à¤¾ à¤¸à¤¾à¤°à¤¾à¤‚à¤¶ à¤¯à¤¹à¤¾à¤‚ à¤¦à¤¿à¤¯à¤¾ à¤—à¤¯à¤¾ à¤¹à¥ˆ:\n1. à¤›à¥‹à¤Ÿà¥€ à¤®à¤°à¤®à¥à¤®à¤¤ à¤•à¥‡ à¤¸à¤‚à¤¬à¤‚à¤§ à¤®à¥‡à¤‚ (à¤–à¤‚à¤¡ 7.2): à¤•à¥à¤¯à¤¾ à¤†à¤ª à¤Ÿà¥‚à¤Ÿà¥‡ à¤¹à¥à¤ à¤—à¥€à¤œà¤° à¤œà¥ˆà¤¸à¥€ à¤¬à¤¡à¤¼à¥€ à¤¸à¤®à¤¸à¥à¤¯à¤¾à¤“à¤‚ à¤•à¥€ à¤°à¤¿à¤ªà¥‹à¤°à¥à¤Ÿ à¤•à¤°à¤¨à¥‡ à¤•à¥€ à¤ªà¥à¤°à¤•à¥à¤°à¤¿à¤¯à¤¾ à¤”à¤° à¤¸à¤®à¤¾à¤§à¤¾à¤¨ à¤•à¥‡ à¤²à¤¿à¤ à¤…à¤ªà¥‡à¤•à¥à¤·à¤¿à¤¤ à¤¸à¤®à¤¯-à¤¸à¥€à¤®à¤¾ à¤¸à¥à¤ªà¤·à¥à¤Ÿ à¤•à¤° à¤¸à¤•à¤¤à¥‡ à¤¹à¥ˆà¤‚?\n2. à¤¨à¥‹à¤Ÿà¤¿à¤¸ à¤…à¤µà¤§à¤¿ à¤•à¥‡ à¤¸à¤‚à¤¬à¤‚à¤§ à¤®à¥‡à¤‚ (à¤–à¤‚à¤¡ 11): à¤…à¤šà¤¾à¤¨à¤• à¤¨à¥Œà¤•à¤°à¥€ à¤¬à¤¦à¤²à¤¨à¥‡ à¤•à¥€ à¤¸à¥à¤¥à¤¿à¤¤à¤¿ à¤®à¥‡à¤‚ 60-à¤¦à¤¿à¤¨ à¤•à¥€ à¤¨à¥‹à¤Ÿà¤¿à¤¸ à¤…à¤µà¤§à¤¿ à¤®à¥‡à¤‚ à¤•à¥‹à¤ˆ à¤²à¤šà¥€à¤²à¤¾à¤ªà¤¨ à¤¹à¥ˆ?\n3. à¤®à¥‡à¤¹à¤®à¤¾à¤¨à¥‹à¤‚ à¤•à¥‡ à¤¸à¤‚à¤¬à¤‚à¤§ à¤®à¥‡à¤‚: à¤¸à¤®à¤à¥Œà¤¤à¥‡ à¤®à¥‡à¤‚ à¤°à¤¾à¤¤ à¤­à¤° à¤•à¥‡ à¤®à¥‡à¤¹à¤®à¤¾à¤¨à¥‹à¤‚ à¤•à¥‡ à¤²à¤¿à¤ à¤•à¤¿à¤¸à¥€ à¤¨à¥€à¤¤à¤¿ à¤•à¤¾ à¤‰à¤²à¥à¤²à¥‡à¤– à¤¨à¤¹à¥€à¤‚ à¤¹à¥ˆà¥¤ à¤•à¥à¤¯à¤¾ à¤†à¤ª à¤•à¥ƒà¤ªà¤¯à¤¾ à¤¨à¤¿à¤¯à¤®à¥‹à¤‚ à¤•à¥‹ à¤¸à¥à¤ªà¤·à¥à¤Ÿ à¤•à¤° à¤¸à¤•à¤¤à¥‡ à¤¹à¥ˆà¤‚?\n4. à¤ªà¥‡à¤‚à¤Ÿà¤¿à¤‚à¤— à¤•à¥‡ à¤¸à¤‚à¤¬à¤‚à¤§ à¤®à¥‡à¤‚: à¤…à¤¨à¥à¤¬à¤‚à¤§ à¤•à¥‡ à¤…à¤¨à¥à¤¸à¤¾à¤° à¤®à¥à¤à¥‡ à¤œà¤¾à¤¤à¥‡ à¤¸à¤®à¤¯ à¤¸à¤«à¥‡à¤¦à¥€ à¤•à¥‡ à¤²à¤¿à¤ à¤­à¥à¤—à¤¤à¤¾à¤¨ à¤•à¤°à¤¨à¤¾ à¤¹à¥‹à¤—à¤¾à¥¤ à¤•à¥à¤¯à¤¾ à¤¯à¤¹ à¤¤à¤¬ à¤­à¥€ à¤²à¤¾à¤—à¥‚ à¤¹à¥‹à¤¤à¤¾ à¤¹à¥ˆ à¤œà¤¬ à¤®à¥ˆà¤‚ à¤¸à¤¿à¤°à¥à¤« à¤à¤• à¤¸à¤¾à¤² à¤•à¥‡ à¤²à¤¿à¤ à¤°à¤¹à¤¤à¤¾ à¤¹à¥‚à¤‚?"}]);
      setTimeout(() => setPriyaStep(8), 1500);
    }, 1000)
  }
  
  const handleFeatureClick = (index: number) => {
    setExpandedFeature(expandedFeature === index ? null : index)
  }

  // --- CONTENT & DATA ---
  const [expandedFeature, setExpandedFeature] = useState<number | null>(null)
  
  const securityFeatures: SecurityFeature[] = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Serverless & Ephemeral",
      description: "Analysis occurs in isolated, temporary environments that are destroyed after use.",
      color: "text-[#6F7A68]",
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
      color: "text-[#334B3E]",
      details:
        "Our Retrieval-Augmented Generation (RAG) system processes documents entirely in volatile memory (RAM). This means faster, more secure queries because the data ceases to exist once the session ends.",
      benefits: ["Blazing-Fast Q&A", "No Data Footprint", "Enhanced Context", "Uncompromised Privacy"],
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "End-to-End Encryption",
      description: "Data is protected with TLS 1.3 and AES-265 encryption at every stage.",
      color: "text-[#6F7A68]",
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
        className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#334B3E]/10 via-[#FCFBF8] to-[#5A9C78]/10 overflow-hidden"
      >
        <div
          className={`relative max-w-7xl mx-auto px-6 text-center transition-opacity duration-1000 ease-in-out ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="inline-flex items-center gap-2 bg-[#334B3E]/10 px-4 py-2 rounded-full text-[#334B3E] font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            AI-Powered Document Intelligence
          </div>

          <h1 className="text-6xl md:text-7xl font-bold text-[#212529] mb-6 text-balance">
            How It <span className="text-[#334B3E]">Works</span>
          </h1>

          <p className="text-xl md:text-2xl text-[#343A40] max-w-4xl mx-auto text-pretty mb-12 leading-relaxed">
            From dense documents to decisive action. Our secure AI platform transforms your files into interactive,
            actionable intelligence in moments.
          </p>

        </div>
      </div>

      {/* Priya's Journey Section */}
       <div className="bg-white py-24 sm:py-32 border-t border-gray-200/80">
        <div className="text-center mb-16 max-w-3xl mx-auto px-6">
            <h2 className="text-4xl md:text-5xl font-bold text-[#212529] mb-4">
                The User Journey: <span className="text-[#334B3E]">From Confusion to Confidence</span>
            </h2>
            <div className="w-32 h-1 bg-gradient-to-r from-[#334B3E] to-[#5A9C78] mx-auto rounded-full mb-6"></div>
            <p className="text-lg text-[#343A40]">
                Follow Priya, a young software developer in Rourkela, as she uses AI to understand her first rental agreement.
            </p>
        </div>
        
        <div className="max-w-6xl mx-auto px-6">
          <div className="relative w-full h-auto min-h-[600px] bg-gray-100/60 rounded-2xl shadow-lg border border-gray-200/80 p-4 sm:p-8 flex items-center justify-center transition-all duration-500 ease-in-out">
            
            {/* Step 1: Upload */}
            <div className={`text-center transition-opacity duration-500 w-full ${priyaStep === 0 ? 'opacity-100' : 'opacity-0 absolute pointer-events-none'}`}>
               <h3 className="text-2xl font-bold text-[#212529] mb-2">Step 1: The First Step</h3>
               <p className="text-[#343A40] mb-6">Priya finds the site and uploads her 12-page rental agreement.</p>
               <div className="max-w-md mx-auto border-2 border-dashed border-gray-300 rounded-xl p-8 cursor-pointer hover:border-[#334B3E] hover:bg-[#334B3E]/5 transition-colors">
                  <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4"/>
                  <p className="font-semibold text-[#212529]">rental_agreement_rkl.pdf</p>
                  <p className="text-sm text-gray-500">Drag & drop or click to upload</p>
               </div>
               <button onClick={() => setPriyaStep(1)} className="mt-8 bg-[#334B3E] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#334B3E]/90 transition-transform hover:scale-105">Continue</button>
            </div>
            
            {/* Step 2: Perspective Engine */}
            <div className={`text-center transition-opacity duration-500 w-full ${priyaStep === 1 ? 'opacity-100' : 'opacity-0 absolute pointer-events-none'}`}>
               <h3 className="text-2xl font-bold text-[#212529] mb-2">Step 2: The Perspective Engine</h3>
               <p className="text-[#343A40] mb-6">To give you the most accurate analysis, please tell us your role in this agreement.</p>
               <div className="flex gap-4 justify-center">
                  <button onClick={() => handlePerspectiveSelect('tenant')} className="text-lg font-semibold border-2 border-[#334B3E] text-[#334B3E] px-12 py-6 rounded-xl hover:bg-[#334B3E] hover:text-white transition-all duration-300 transform hover:scale-105">I am the Tenant</button>
                  <button onClick={() => handlePerspectiveSelect('landlord')} className="text-lg font-semibold border-2 border-gray-300 text-gray-500 px-12 py-6 rounded-xl hover:border-[#5A9C78] hover:text-white hover:bg-[#5A9C78] transition-all duration-300 transform hover:scale-105">I am the Landlord</button>
               </div>
            </div>

             {/* Step 3: Analysis */}
            <div className={`text-center transition-opacity duration-500 w-full max-w-lg ${priyaStep === 2 ? 'opacity-100' : 'opacity-0 absolute pointer-events-none'}`}>
               <h3 className="text-2xl font-bold text-[#212529] mb-2">Step 3: The AI at Work</h3>
               <p className="text-[#343A40] mb-8">Digitizing and analyzing every clause from a Tenant's perspective...</p>
               <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                  <div className="bg-gradient-to-r from-[#334B3E] to-[#5A9C78] h-2.5 rounded-full transition-width duration-300 ease-linear" style={{width: `${analysisProgress}%`}}></div>
               </div>
               <p className="text-sm text-[#343A40] font-medium h-5">{analysisText}</p>
            </div>

            {/* Step 4: Clarity Dashboard */}
            <div className={`transition-opacity duration-500 w-full ${priyaStep === 3 ? 'opacity-100' : 'opacity-0 absolute pointer-events-none'}`}>
                <h3 className="text-2xl font-bold text-center text-[#212529] mb-2">Step 4: The "Aha!" Moment - Clarity Dashboard</h3>
                <p className="text-[#343A40] text-center mb-6">An at-a-glance summary of the most critical information.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-xl border border-gray-200/80">
                        <h4 className="font-bold text-lg mb-2">Clarity Score</h4>
                        <p className="text-5xl font-bold text-[#334B3E]">58<span className="text-3xl text-gray-400">/100</span></p>
                        <p className="text-sm text-gray-600 mt-2">Moderately complex with significant legal jargon.</p>
                    </div>
                     <div className="bg-white p-6 rounded-xl border border-gray-200/80 lg:col-span-2">
                        <h4 className="font-bold text-lg mb-3">Your Key Obligations</h4>
                        <ul className="space-y-2 text-left">
                          <li className="flex items-start gap-3"><CheckCircle className="w-5 h-5 text-[#5A9C78] mt-0.5 flex-shrink-0"/><span>Pay <strong>â‚¹12,000 rent</strong> by the 5th of each month.</span></li>
                          <li className="flex items-start gap-3"><CheckCircle className="w-5 h-5 text-[#5A9C78] mt-0.5 flex-shrink-0"/><span>Responsible for paying all <strong>electricity and water bills</strong> separately.</span></li>
                          <li className="flex items-start gap-3"><CheckCircle className="w-5 h-5 text-[#5A9C78] mt-0.5 flex-shrink-0"/><span>Must provide a <strong>60-day notice</strong> before vacating the premises.</span></li>
                        </ul>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-gray-200/80">
                        <h4 className="font-bold text-lg mb-3">Financial Summary</h4>
                        <ul className="space-y-1.5 text-left text-sm">
                            <li className="flex justify-between"><span>Monthly Rent:</span><span className="font-bold">â‚¹12,000</span></li>
                            <li className="flex justify-between"><span>Security Deposit:</span><span className="font-bold">â‚¹24,000</span></li>
                            <li className="flex justify-between"><span>Late Fee:</span><span className="font-bold">â‚¹200 / day</span></li>
                        </ul>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-gray-200/80">
                        <h4 className="font-bold text-lg mb-3">Important Dates</h4>
                         <ul className="space-y-1.5 text-left text-sm">
                            <li className="flex justify-between"><span>Lease Start:</span><span className="font-bold">01-Oct-2025</span></li>
                            <li className="flex justify-between"><span>Lease End:</span><span className="font-bold">30-Sep-2026</span></li>
                        </ul>
                    </div>
                </div>
                <div className="text-center mt-6">
                  <button onClick={() => {setPriyaStep(4); setChatHistory([{sender: 'ai', text: "Ask me anything about your rental agreement.", translation: "à¤…à¤ªà¤¨à¥‡ à¤•à¤¿à¤°à¤¾à¤¯à¥‡ à¤•à¥‡ à¤¸à¤®à¤à¥Œà¤¤à¥‡ à¤•à¥‡ à¤¬à¤¾à¤°à¥‡ à¤®à¥‡à¤‚ à¤®à¥à¤à¤¸à¥‡ à¤•à¥à¤› à¤­à¥€ à¤ªà¥‚à¤›à¥‡à¤‚à¥¤"}])}} className="bg-[#5A9C78] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#5A9C78]/90 transition-transform hover:scale-105">Explore the Full Document <ArrowRight className="inline w-4 h-4 ml-1"/></button>
                </div>
            </div>

            {/* Steps 5-8: Interactive Document Explorer */}
            <div className={`transition-opacity duration-500 w-full h-full ${priyaStep >= 4 ? 'opacity-100' : 'opacity-0 absolute pointer-events-none'}`}>
              <div className="flex flex-col md:flex-row gap-4 h-[600px]">
                {/* Left Panel: PDF Viewer */}
                <div className="w-full md:w-1/2 bg-white rounded-lg border border-gray-200/80 p-4 overflow-y-auto">
                    <h4 className="font-bold text-lg mb-2 text-center">rental_agreement_rkl.pdf</h4>
                    <p className="text-sm text-gray-500 leading-relaxed">
                        ... a long, complicated sentence about maintenance is colored in a light yellow, drawing her attention to its non-standard nature.
                        <br/><br/>
                        <span 
                           className={`p-1 rounded cursor-pointer transition-colors ${highlightedText ? 'bg-yellow-300' : 'bg-yellow-200/70 hover:bg-yellow-300/80'}`}
                           onClick={() => handleHighlight("The Lessee shall be solely responsible for the day-to-day maintenance and minor repairs of the premises and fittings therein, not exceeding a sum of â‚¹2,500 for any single repair.")}
                        >
                           "The Lessee shall be solely responsible for the day-to-day maintenance and minor repairs of the premises and fittings therein, not exceeding a sum of â‚¹2,500 for any single repair."
                        </span>
                        <br/><br/>
                        ... other clauses continue ...
                    </p>
                </div>
                {/* Right Panel: Chat */}
                <div className="w-full md:w-1/2 bg-white rounded-lg border border-gray-200/80 flex flex-col">
                    <div className="flex justify-between items-center p-3 border-b border-gray-200/80">
                      <h4 className="font-bold text-lg">AI Assistant</h4>
                       <div className={`flex items-center gap-2 p-1 rounded-md border text-sm transition-colors cursor-pointer ${priyaStep >= 6 ? 'border-gray-300' : 'border-transparent'}`} onClick={() => { if(priyaStep >=6) { setLanguage(lang => lang === 'en' ? 'hi' : 'en'); setPriyaStep(7); } }}>
                          <Languages className={`w-4 h-4 ${priyaStep >= 6 ? 'text-gray-600' : 'text-gray-300'}`}/>
                          <span className={`font-medium ${language === 'en' ? 'text-[#334B3E]' : 'text-gray-500'}  ${priyaStep < 6 ? 'text-gray-300' : ''}`}>EN</span>
                          <span className={`font-medium ${language === 'hi' ? 'text-[#334B3E]' : 'text-gray-500'} ${priyaStep < 6 ? 'text-gray-300' : ''}`}>à¤¹à¤¿</span>
                       </div>
                    </div>
                    <div className="flex-1 p-4 overflow-y-auto space-y-4">
                       {chatHistory.map((msg, index) => (
                          <div key={index} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.sender === 'ai' && <div className="w-8 h-8 rounded-full bg-[#5A9C78] flex items-center justify-center text-white flex-shrink-0"><Brain className="w-5 h-5"/></div>}
                             <div className={`rounded-xl p-3 max-w-sm whitespace-pre-wrap ${msg.sender === 'user' ? 'bg-[#334B3E] text-white' : (msg.sender === 'system' ? 'bg-yellow-100 text-yellow-800 text-xs italic' : 'bg-gray-200 text-[#212529]')}`}>
                                {language === 'en' ? msg.text : (msg.translation || msg.text)}
                             </div>
                          </div>
                       ))}
                       <div ref={chatEndRef} />
                    </div>
                    <div className="p-3 border-t border-gray-200/80">
                      {showQuickActions && (
                        <div className="mb-2 space-x-2">
                           <button onClick={() => handleQuickAction('explain')} className="text-xs font-semibold bg-gray-200 hover:bg-gray-300 p-2 rounded-lg">Explain this in simple terms</button>
                           <button onClick={() => {handleQuickAction('require'); setTimeout(handleCustomQuestion, 1500)}} className="text-xs font-semibold bg-gray-200 hover:bg-gray-300 p-2 rounded-lg">What does this require?</button>
                           <button onClick={() => handleQuickAction('standard')} className="text-xs font-semibold bg-gray-200 hover:bg-gray-300 p-2 rounded-lg">Is this standard?</button>
                        </div>
                      )}
                      {priyaStep === 7 && (
                        <button onClick={handleSummarize} className="w-full text-center font-semibold bg-[#5A9C78] text-white p-2 rounded-lg hover:bg-[#5A9C78]/90 transition-colors">Summarize important questions</button>
                      )}
                      {priyaStep === 8 && <p className="text-center text-sm font-semibold text-green-700">âœ“ Outcome: Empowered and Confident</p>}
                    </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>


      {/* Security Section */}
      <div className="bg-white border-t border-gray-200/80">
        <div className="max-w-7xl mx-auto px-6 py-24 sm:py-32">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-[#334B3E]/10 px-4 py-2 rounded-full text-[#334B3E] font-medium mb-6">
              <Shield className="w-4 h-4" />
              Enterprise-Grade Security
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#212529] mb-4">
              <span className="text-[#334B3E]">Secure</span> by Design
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
                  expandedFeature === index ? "ring-2 ring-[#334B3E]/50 bg-[#334B3E]/5" : ""
                }`}
                onClick={() => handleFeatureClick(index)}
              >
                <div className="w-14 h-14 bg-[#334B3E]/10 rounded-2xl flex items-center justify-center mb-4">
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
        <div className="bg-gradient-to-br from-[#334B3E] via-[#5A9C78] to-[#334B3E] rounded-3xl p-12 text-center text-[#FCFBF8]">
          <h2 className="text-4xl font-bold mb-4">Ready to Unlock Your Document's Potential?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto text-pretty">
            Stop searching, start knowing. Experience the future of document analysis today.
          </p>
          <button className="bg-[#FCFBF8] text-[#334B3E] px-8 py-4 rounded-xl font-semibold hover:bg-[#FCFBF8]/90 transition-transform duration-300 ease-in-out shadow-lg hover:shadow-xl inline-flex items-center gap-2 transform hover:scale-105">
            Get Started for Free
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

