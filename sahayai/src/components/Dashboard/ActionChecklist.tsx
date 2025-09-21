"use client"

import { useState, useEffect } from "react"
import { CheckSquare, Clock } from "lucide-react"
import { useAppContext } from "@/context/stateContext" // 1. Import the context hook (Corrected Path)

// Simplified interface to match the data from the context
interface ChecklistItem {
  id: string
  text: string
  completed: boolean
}

// The component no longer needs props
export function ChecklistTab() {
  // 2. Access global state
  const { state } = useAppContext()
  const checklistData = state.analysisResult?.actionable_checklist

  // 3. Use local state to manage the checklist items derived from the context
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([])

  useEffect(() => {
    // Populate the local state when the data from the context is available
    if (checklistData) {
      const formattedItems = checklistData.map((itemText: string, index: number) => ({
        id: `task-${index}`,
        text: itemText,
        completed: false, // All items start as not completed
      }))
      setChecklistItems(formattedItems)
    }
  }, [checklistData]) // This effect runs when the checklistData from the context changes

  // Function to toggle the completion status of an item
  const toggleItem = (id: string) => {
    setChecklistItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    )
  }

  // Calculate progress
  const completedCount = checklistItems.filter((item) => item.completed).length
  const totalCount = checklistItems.length
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  // 4. Handle loading state
  if (!checklistData) {
    return (
      <div className="flex items-center justify-center h-full text-slate-500">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-400 mr-3"></div>
        Loading checklist...
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Progress Overview Card */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center text-lg font-semibold text-slate-900">
              <CheckSquare className="h-5 w-5 mr-2 text-[#2F58CD]" />
              Actionable Checklist
            </h3>
            <span className="bg-slate-100 text-slate-800 text-sm px-2.5 py-0.5 rounded-full border border-slate-200">
              {completedCount}/{totalCount} Complete ({completionPercentage}%)
            </span>
          </div>
        </div>
        <div className="px-4 pb-4">
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div
              className="bg-[#2F58CD] h-2 rounded-full transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Checklist Items Card */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
        <div className="p-4">
          <div className="space-y-4">
            {checklistItems.length > 0 ? (
              checklistItems.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 rounded-lg border transition-all ${
                    item.completed
                      ? "bg-green-50 border-green-200"
                      : "bg-white border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => toggleItem(item.id)}
                      className="mt-1 h-4 w-4 text-[#2F58CD] focus:ring-[#2F58CD] border-slate-300 rounded"
                    />
                    <div className="flex-1">
                      <p
                        className={`font-medium ${
                          item.completed ? "text-green-700 line-through" : "text-slate-900"
                        }`}
                      >
                        {item.text}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500 text-center py-4">
                No actionable items were identified in this document.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

