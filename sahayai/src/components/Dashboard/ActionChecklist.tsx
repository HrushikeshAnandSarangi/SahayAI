"use client"

import { useState } from "react"
import { CheckSquare, Clock, AlertTriangle, Star } from "lucide-react"

interface ChecklistTabProps {
  chatId: string
}

interface ChecklistItem {
  id: string
  title: string
  description: string
  priority: "high" | "medium" | "low"
  category: string
  completed: boolean
  dueDate?: string
}

export function ChecklistTab({ chatId }: ChecklistTabProps) {
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([
    {
      id: "1",
      title: "Review Non-Compete Clause",
      description:
        "Carefully examine the 12-month non-compete restriction and consider if it aligns with your career goals.",
      priority: "high",
      category: "Contract Review",
      completed: false,
      dueDate: "Before signing",
    },
    {
      id: "2",
      title: "Negotiate Intellectual Property Terms",
      description: "Discuss IP ownership for personal projects developed outside work hours.",
      priority: "high",
      category: "Negotiation",
      completed: false,
      dueDate: "Before signing",
    },
    {
      id: "3",
      title: "Clarify Benefits Package Details",
      description: "Request detailed information about health insurance, retirement plans, and other benefits.",
      priority: "medium",
      category: "Benefits",
      completed: false,
      dueDate: "Within 1 week",
    },
    {
      id: "4",
      title: "Understand Termination Procedures",
      description: "Review the 30-day notice period and termination conditions for both parties.",
      priority: "medium",
      category: "Contract Review",
      completed: true,
      dueDate: "Completed",
    },
    {
      id: "5",
      title: "Document Current Projects",
      description: "Create a record of any personal projects or IP you own before starting employment.",
      priority: "low",
      category: "Preparation",
      completed: false,
      dueDate: "Before start date",
    },
  ])

  const toggleItem = (id: string) => {
    setChecklistItems((prev) => prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item)))
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "medium":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "low":
        return <Star className="h-4 w-4 text-green-500" />
      default:
        return null
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-slate-100 text-slate-800 border-slate-200"
    }
  }

  const completedCount = checklistItems.filter((item) => item.completed).length
  const totalCount = checklistItems.length
  const completionPercentage = Math.round((completedCount / totalCount) * 100)

  const categories = [...new Set(checklistItems.map((item) => item.category))]

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <CheckSquare className="h-5 w-5 mr-2 text-[#2F58CD]" />
              Progress Overview
            </div>
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

      {categories.map((category) => (
        <div key={category} className="bg-white rounded-lg border border-slate-200 shadow-sm">
          <div className="p-4">
            <h3 className="text-lg font-semibold text-slate-900">{category}</h3>
          </div>
          <div className="px-4 pb-4">
            <div className="space-y-4">
              {checklistItems
                .filter((item) => item.category === category)
                .map((item) => (
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
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <h3
                            className={`font-medium ${
                              item.completed ? "text-green-700 line-through" : "text-slate-900"
                            }`}
                          >
                            {item.title}
                          </h3>
                          <div className="flex items-center space-x-2">
                            <span
                              className={`text-xs px-2 py-1 rounded-full border ${getPriorityColor(item.priority)}`}
                            >
                              <span className="flex items-center">
                                {getPriorityIcon(item.priority)}
                                <span className="ml-1 capitalize">{item.priority}</span>
                              </span>
                            </span>
                          </div>
                        </div>
                        <p className={`text-sm ${item.completed ? "text-green-600" : "text-slate-600"}`}>
                          {item.description}
                        </p>
                        {item.dueDate && (
                          <p className="text-xs text-slate-500 flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {item.dueDate}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
