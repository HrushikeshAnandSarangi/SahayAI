"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card" // Corrected import path
import { Upload, FileText, ImageIcon, X, UserCheck } from "lucide-react"
import { useAppContext } from "@/context/stateContext" // Corrected import path

type UserRole = "Plaintiff" | "Defendant";

export function DocumentUpload() {
  const { dispatch } = useAppContext();
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null);
  // 1. Add state to manage the selected role, defaulting to null
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  const handleFileUpload = async (file: File, userRole: UserRole) => {
    if (!file) return;
    setError(null);

    const validTypes = ["application/pdf", "image/jpeg", "image/png", "image/jpg"]
    if (!validTypes.includes(file.type)) {
      setError("Please upload a PDF or image file (JPEG, PNG).");
      return;
    }

    setIsUploading(true);
    dispatch({ type: 'START_PROCESSING' });
    dispatch({ type: 'SET_USER_ROLE', payload: userRole });

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const formData = new FormData()
    formData.append("file", file)
    formData.append("user_role", userRole)

    try {
      const response = await fetch("/api/process", {
        method: "POST",
        body: formData,
        signal: controller.signal,
      })

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json()
      dispatch({ type: 'SET_ANALYSIS_SUCCESS', payload: result });

    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.log('Fetch aborted by user');
        setError("Upload cancelled.");
        dispatch({ type: 'SET_ERROR', payload: 'Upload cancelled by user.' });
      } else {
        console.error("Upload failed:", err);
        setError(err.message || "Upload failed. Please try again.");
        dispatch({ type: 'SET_ERROR', payload: err.message || "An unknown error occurred." });
      }
    } finally {
      setIsUploading(false)
      abortControllerRef.current = null;
    }
  }

  // 2. This function now triggers the upload only if a role is selected
  const triggerUpload = (file: File | undefined) => {
    if (!selectedRole) {
      setError("Please select your role (Plaintiff or Defendant) before uploading.");
      return;
    }
    if (file) {
      handleFileUpload(file, selectedRole);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    triggerUpload(e.dataTransfer.files?.[0])
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    triggerUpload(e.target.files?.[0])
  }

  const handleCancelUpload = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#2F58CD] mb-4">Upload Your Legal Document</h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            Get started by uploading a PDF or image. Our AI will analyze it and provide key
            insights, summaries, and actionable checklists.
          </p>
        </div>

        {/* 3. Add the Role Selection UI */}
        <Card className="mb-6 border-slate-300">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-slate-800 flex items-center mb-4">
              <UserCheck className="h-5 w-5 mr-2 text-[#2F58CD]" />
              Step 1: Identify Your Role
            </h3>
            <p className="text-sm text-slate-600 mb-4">Select your position in the legal matter. This helps the AI tailor the analysis to your perspective.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => setSelectedRole("Plaintiff")}
                className={`p-4 border-2 rounded-lg text-left transition-all ${
                  selectedRole === "Plaintiff"
                    ? "border-[#2F58CD] bg-blue-50 ring-2 ring-[#2F58CD]"
                    : "border-slate-300 hover:border-slate-400"
                }`}
              >
                <h4 className="font-semibold text-slate-900">Plaintiff</h4>
                <p className="text-xs text-slate-500">The party who brings the case to court.</p>
              </button>
              <button
                onClick={() => setSelectedRole("Defendant")}
                className={`p-4 border-2 rounded-lg text-left transition-all ${
                  selectedRole === "Defendant"
                    ? "border-[#2F58CD] bg-blue-50 ring-2 ring-[#2F58CD]"
                    : "border-slate-300 hover:border-slate-400"
                }`}
              >
                <h4 className="font-semibold text-slate-900">Defendant</h4>
                <p className="text-xs text-slate-500">The party against whom the case is brought.</p>
              </button>
            </div>
          </CardContent>
        </Card>

        <Card className={`border-2 border-dashed transition-colors ${!selectedRole ? 'opacity-50 cursor-not-allowed' : 'border-slate-300 hover:border-[#2F58CD]'}`}>
          <CardContent className="p-8">
            <div
              className={`relative border-2 border-dashed rounded-lg p-12 text-center transition-all ${
                isDragging && selectedRole ? "border-[#2F58CD] bg-blue-50" : "border-slate-300"
              } ${selectedRole ? 'hover:border-[#2F58CD] hover:bg-slate-50' : ''}`}
              onDragOver={(e) => {
                e.preventDefault();
                if (selectedRole) setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={isUploading || !selectedRole} // Disable if uploading or no role is selected
              />

              <div className="space-y-4">
                <div className="flex justify-center items-center h-12">
                  {isUploading ? (
                    <div className="flex items-center space-x-4">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2F58CD]"></div>
                      <button
                        onClick={handleCancelUpload}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg flex items-center transition-colors"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <Upload className={`h-12 w-12 ${!selectedRole ? 'text-slate-300' : 'text-slate-400'}`} />
                  )}
                </div>

                <div>
                  <p className="text-lg font-medium text-slate-700 mb-2">
                    {isUploading ? "Processing your document..." : (!selectedRole ? "Please select a role above" : "Step 2: Drop your document here")}
                  </p>
                  <p className="text-sm text-slate-500">Supports PDF, JPEG, and PNG files</p>
                  {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
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

