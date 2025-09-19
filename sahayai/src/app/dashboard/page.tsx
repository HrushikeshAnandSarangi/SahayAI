"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/DashboardLayout"
import { DocumentUpload } from "@/components/DocumentUpload"

export default function DashboardPage() {
  const [chatId, setChatId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check localStorage for existing chatId
    const storedChatId = localStorage.getItem("chatid")
    setChatId(storedChatId)
    setIsLoading(false)
  }, [])

  const handleDocumentUpload = (uploadedChatId: string) => {
    setChatId(uploadedChatId)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2F58CD]"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {!chatId ? <DocumentUpload onUpload={handleDocumentUpload} /> : <DashboardLayout chatId={chatId} />}
    </div>
  )
}
