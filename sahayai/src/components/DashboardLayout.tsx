"use client"

import { useState } from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { FileText, BarChart3, MessageCircle, CheckSquare, Upload } from "lucide-react"
import { KeyDetailsTab } from "@/components/Dashboard/KeyDetails"
import { AnalysisTab } from "@/components/Dashboard/Analysis"
import { AssistantTab } from "@/components/Dashboard/Assistant"
import { ChecklistTab } from "@/components/Dashboard/ActionChecklist"
import { useAppContext } from "@/context/stateContext" // 1. Import the context hook

// The component no longer needs to accept any props directly.
export function DashboardLayout() {
  // 2. Access the global state and dispatch from the context
  const { state, dispatch } = useAppContext();
  const [activeTab, setActiveTab] = useState<TabType>("key-details")

  // 3. Update the handleNewDocument function to use the context's dispatch
  const handleNewDocument = () => {
    // This action will clear the state in the context, and because the state is
    // persisted to localStorage, it effectively clears the session.
    // The UI will automatically re-render to show the DocumentUpload component.
    dispatch({ type: 'CLEAR_STATE' });
  }

  const tabs = [
    {
      id: "key-details" as TabType,
      label: "Key Details",
      icon: FileText,
      description: "Essential information extracted from your document",
    },
    {
      id: "analysis" as TabType,
      label: "Analysis",
      icon: BarChart3,
      description: "AI-powered analysis and insights",
    },
    {
      id: "assistant" as TabType,
      label: "Assistant",
      icon: MessageCircle,
      description: "Ask questions about your document",
    },
    {
      id: "checklist" as TabType,
      label: "Actionable Checklist",
      icon: CheckSquare,
      description: "Personalized action items and next steps",
    },
  ]

  type TabType = "key-details" | "analysis" | "assistant" | "checklist"

  // 4. Remove prop drilling from the rendered tabs
  // Each of these child components should now use the useAppContext hook
  // to get the `analysisResult` they need directly.
  const renderTabContent = () => {
    switch (activeTab) {
      case "key-details":
        return <KeyDetailsTab />
      case "analysis":
        return <AnalysisTab />
      case "assistant":
        return <AssistantTab />
      case "checklist":
        return <ChecklistTab />
      default:
        return <KeyDetailsTab />
    }
  }

  // Use a placeholder if the result is somehow null
  const documentType = state.analysisResult?.key_details?.document_type || "Document";

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar className="border-r border-slate-200">
          <SidebarHeader className="border-b border-slate-200 p-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-[#2F58CD] to-[#4A90E2] rounded-lg flex items-center justify-center">
                <FileText className="h-4 w-4 text-white" />
              </div>
              <div>
                <h2 className="font-semibold text-slate-900">Sahay AI</h2>
                <p className="text-xs text-slate-500">Document Analysis</p>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent className="p-4">
            <SidebarMenu>
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <SidebarMenuItem key={tab.id}>
                    <SidebarMenuButton
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full justify-start p-3 rounded-lg transition-all ${
                        activeTab === tab.id ? "bg-[#2F58CD] text-white shadow-md" : "hover:bg-slate-100 text-slate-700"
                      }`}
                    >
                      <Icon className="h-5 w-5 mr-3" />
                      <div className="text-left">
                        <div className="font-medium">{tab.label}</div>
                        <div className={`text-xs ${activeTab === tab.id ? "text-blue-100" : "text-slate-500"}`}>
                          {tab.description}
                        </div>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>

            <div className="mt-8 pt-4 border-t border-slate-200">
              <Button
                onClick={handleNewDocument}
                variant="outline"
                className="w-full justify-start text-slate-600 hover:text-slate-900 bg-transparent"
              >
                <Upload className="h-4 w-4 mr-2" />
                New Document
              </Button>
            </div>
          </SidebarContent>
        </Sidebar>

        <div className="flex-1 flex flex-col">
          <header className="border-b border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <SidebarTrigger />
                <div>
                  <h1 className="text-xl font-semibold text-slate-900">
                    {tabs.find((tab) => tab.id === activeTab)?.label}
                  </h1>
                  <p className="text-sm text-slate-500">
                    Analysis of: <span className="font-medium text-slate-600">{documentType}</span>
                  </p>
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 p-6 bg-gradient-to-br from-slate-50 to-blue-50">{renderTabContent()}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}

