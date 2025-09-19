"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, FileText, ImageIcon } from "lucide-react"

interface DocumentUploadProps {
  onUpload: (chatId: string) => void
}

export function DocumentUpload({ onUpload }: DocumentUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const generateChatId = () => {
    return "chat_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9)
  }

  const handleFileUpload = async (file: File) => {
    if (!file) return

    // Validate file type
    const validTypes = ["application/pdf", "image/jpeg", "image/png", "image/jpg"]
    if (!validTypes.includes(file.type)) {
      alert("Please upload a PDF or image file (JPEG, PNG)")
      return
    }

    setIsUploading(true)

    try {
      // Generate unique chat ID
      const newChatId = generateChatId()

      // Store in localStorage
      localStorage.setItem("chatid", newChatId)
      localStorage.setItem(
        `document_${newChatId}`,
        JSON.stringify({
          fileName: file.name,
          fileType: file.type,
          uploadDate: new Date().toISOString(),
          fileSize: file.size,
        }),
      )

      // Simulate upload delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      onUpload(newChatId)
    } catch (error) {
      console.error("Upload failed:", error)
      alert("Upload failed. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFileUpload(file)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFileUpload(file)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#2F58CD] mb-4">Upload Your Legal Document</h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            Get started by uploading a PDF or image of your legal document. Our AI will analyze it and provide key
            insights, summaries, and actionable checklists.
          </p>
        </div>

        <Card className="border-2 border-dashed border-slate-300 hover:border-[#2F58CD] transition-colors">
          <CardContent className="p-8">
            <div
              className={`relative border-2 border-dashed rounded-lg p-12 text-center transition-all ${
                isDragging ? "border-[#2F58CD] bg-blue-50" : "border-slate-300 hover:border-[#2F58CD] hover:bg-slate-50"
              }`}
              onDragOver={(e) => {
                e.preventDefault()
                setIsDragging(true)
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={isUploading}
              />

              <div className="space-y-4">
                <div className="flex justify-center">
                  {isUploading ? (
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2F58CD]"></div>
                  ) : (
                    <Upload className="h-12 w-12 text-slate-400" />
                  )}
                </div>

                <div>
                  <p className="text-lg font-medium text-slate-700 mb-2">
                    {isUploading ? "Processing your document..." : "Drop your document here or click to browse"}
                  </p>
                  <p className="text-sm text-slate-500">Supports PDF, JPEG, and PNG files</p>
                </div>

                <div className="flex justify-center space-x-6 pt-4">
                  <div className="flex items-center space-x-2 text-slate-600">
                    <FileText className="h-5 w-5" />
                    <span className="text-sm">PDF</span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-600">
                    <ImageIcon className="h-5 w-5" />
                    <span className="text-sm">Images</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
