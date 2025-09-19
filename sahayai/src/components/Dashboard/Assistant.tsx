"use client"

import type React from "react"

import { useState } from "react"
import { Send, MessageCircle, User, Bot } from "lucide-react"

interface AssistantTabProps {
  chatId: string
}

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
}

export function AssistantTab({ chatId }: AssistantTabProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "assistant",
      content:
        "Hello! I've analyzed your employment contract. Feel free to ask me any questions about the document, specific clauses, or legal implications.",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: `Based on your employment contract, I can help clarify that point. The document contains specific provisions regarding "${inputValue.toLowerCase()}". Would you like me to explain the legal implications or suggest any actions you should consider?`,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const suggestedQuestions = [
    "What are my termination rights?",
    "Can I negotiate the non-compete clause?",
    "What happens to my intellectual property?",
    "Are there any red flags in this contract?",
  ]

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)]">
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm flex-1 flex flex-col">
        <div className="p-4 border-b border-slate-200">
          <h3 className="flex items-center text-lg font-semibold text-slate-900">
            <MessageCircle className="h-5 w-5 mr-2 text-[#2F58CD]" />
            Legal Assistant
          </h3>
        </div>

        <div className="flex-1 flex flex-col p-0">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start space-x-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.type === "assistant" && (
                  <div className="w-8 h-8 bg-[#2F58CD] rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                )}

                <div
                  className={`max-w-[70%] p-3 rounded-lg ${
                    message.type === "user" ? "bg-[#2F58CD] text-white" : "bg-slate-100 text-slate-900"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <p className={`text-xs mt-1 ${message.type === "user" ? "text-blue-100" : "text-slate-500"}`}>
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>

                {message.type === "user" && (
                  <div className="w-8 h-8 bg-slate-300 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="h-4 w-4 text-slate-600" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-[#2F58CD] rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="bg-slate-100 p-3 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {messages.length === 1 && (
            <div className="p-4 border-t border-slate-200">
              <p className="text-sm text-slate-600 mb-3">Try asking:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {suggestedQuestions.map((question, index) => (
                  <button
                    key={index}
                    className="text-left justify-start h-auto p-2 text-xs bg-transparent border border-slate-300 rounded-md hover:bg-slate-50 transition-colors"
                    onClick={() => setInputValue(question)}
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="p-4 border-t border-slate-200">
            <div className="flex space-x-2">
              <input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask a question about your document..."
                className="flex-1 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2F58CD] focus:border-transparent"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="bg-[#2F58CD] hover:bg-[#2347B8] disabled:opacity-50 disabled:cursor-not-allowed text-white px-3 py-2 rounded-md transition-colors"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
