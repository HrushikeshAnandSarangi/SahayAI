"use client"

import { useEffect } from "react"
import { DashboardLayout } from "@/components/DashboardLayout"
import { DocumentUpload } from "@/components/DocumentUpload"
import { useAppContext } from "@/context/stateContext" // 1. Import the context hook

export default function DashboardPage() {
  // 2. Access the global state and dispatch function from the context
  const { state, dispatch } = useAppContext();

  // The local `chatId` and `isLoading` states are no longer needed,
  // as they are now managed globally by the AppContext.

  // The useEffect to check localStorage is also no longer needed,
  // as the AppProvider handles this automatically on initial load.

  // This function is no longer needed here. The DocumentUpload component
  // will now dispatch the 'SET_ANALYSIS_SUCCESS' action directly.
  // const handleDocumentUpload = (uploadedChatId: string) => {
  //   setChatId(uploadedChatId)
  // }

  // 3. Render based on the global state
  // We check if `state.analysisResult` exists to decide which component to show.
  // This is more robust than checking for a simple ID.
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {state.analysisResult ? (
        // Pass the entire analysis result to the layout if needed, or just a part of it.
        // For this example, we assume DashboardLayout can access the context itself
        // or you can pass props like this:
        <DashboardLayout />
      ) : (
        // The DocumentUpload component will be responsible for calling the API
        // and dispatching the result to the context.
        <DocumentUpload />
      )}
    </div>
  )
}

