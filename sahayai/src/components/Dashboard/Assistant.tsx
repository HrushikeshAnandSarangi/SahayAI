"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Send, MessageCircle, User, Bot } from "lucide-react"
import { useAppContext } from "@/context/stateContext"

export function AssistantTab() {
  const { state, dispatch } = useAppContext()
  const { chatHistory, analysisResult, userRole } = state

  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !analysisResult) return

    const userMessage = {
      role: "user" as const,
      parts: [{ text: inputValue }],
    }
    
    dispatch({ type: 'ADD_CHAT_MESSAGE', payload: userMessage });
    setInputValue("")
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: inputValue,
          context: analysisResult.scraped_text,
          user_role: userRole,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Handle the nested answer structure: data.answer.answer
      let assistantText = "";
      
      if (typeof data === 'string') {
        assistantText = data;
      } else if (data && typeof data === 'object') {
        // Check for nested answer structure first
        if (data.answer && typeof data.answer === 'object' && typeof data.answer.answer === 'string') {
          assistantText = data.answer.answer;
        } else if (typeof data.answer === 'string') {
          assistantText = data.answer;
        } else if (typeof data.response === 'string') {
          assistantText = data.response;
        } else if (typeof data.message === 'string') {
          assistantText = data.message;
        } else if (typeof data.text === 'string') {
          assistantText = data.text;
        } else if (typeof data.content === 'string') {
          assistantText = data.content;
        } else if (typeof data.result === 'string') {
          assistantText = data.result;
        } else {
          assistantText = "Sorry, I received an unexpected response format. Please try again.";
        }
      } else {
        assistantText = "Sorry, I received an invalid response. Please try again.";
      }

      const assistantMessage = {
        role: "model" as const,
        parts: [{ text: assistantText }],
      };
      
      dispatch({ type: 'ADD_CHAT_MESSAGE', payload: assistantMessage });

    } catch (error) {
      console.error("Failed to get response from assistant:", error);
      const errorMessage = {
        role: "model" as const,
        parts: [{ text: "Sorry, I encountered an error. Please try again." }],
      };
      dispatch({ type: 'ADD_CHAT_MESSAGE', payload: errorMessage });
    } finally {
      setIsLoading(false)
    }
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
        {/* Header */}
        <div className="p-4 border-b border-slate-200 bg-gradient-to-r from-[#2F58CD]/5 to-[#2347B8]/5">
          <h3 className="flex items-center text-lg font-semibold text-slate-900">
            <div className="w-8 h-8 bg-[#2F58CD] rounded-full flex items-center justify-center mr-3">
              <MessageCircle className="h-4 w-4 text-white" />
            </div>
            Legal Assistant
          </h3>
          <p className="text-sm text-slate-600 mt-1 ml-11">
            Ask me anything about your document analysis
          </p>
        </div>

        <div className="flex-1 flex flex-col">
          {/* Chat Messages */}
          <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-6 space-y-4">
            {chatHistory && Array.isArray(chatHistory) && chatHistory.map((message, index) => {
              if (!message || !message.parts || !Array.isArray(message.parts) || message.parts.length === 0) {
                return null;
              }

              const messageText = message.parts[0]?.text;
              if (typeof messageText !== 'string') {
                return null;
              }

              return (
                <div
                  key={index}
                  className={`flex items-start space-x-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.role === "model" && (
                    <div className="w-8 h-8 bg-gradient-to-br from-[#2F58CD] to-[#2347B8] rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                  )}

                  <div
                    className={`max-w-[75%] p-4 rounded-2xl shadow-sm ${
                      message.role === "user" 
                        ? "bg-gradient-to-br from-[#2F58CD] to-[#2347B8] text-white rounded-br-md" 
                        : "bg-slate-50 text-slate-900 border border-slate-200 rounded-bl-md"
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{messageText}</p>
                  </div>

                  {message.role === "user" && (
                    <div className="w-8 h-8 bg-gradient-to-br from-slate-300 to-slate-400 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                      <User className="h-4 w-4 text-slate-700" />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Loading Animation */}
            {isLoading && (
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-[#2F58CD] to-[#2347B8] rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl rounded-bl-md shadow-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-[#2F58CD] rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-[#2F58CD] rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-[#2F58CD] rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            {/* Empty State */}
            {(!chatHistory || chatHistory.length === 0) && (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center max-w-md">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#2F58CD]/10 to-[#2347B8]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="h-8 w-8 text-[#2F58CD]" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    Ready to help!
                  </h3>
                  <p className="text-slate-600 mb-6">
                    I've analyzed your document. Ask me anything about the terms, clauses, or your rights.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Suggested Questions */}
          {(!chatHistory || chatHistory.length === 0) && (
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50/50">
              <p className="text-sm font-medium text-slate-700 mb-3">Suggested questions:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {suggestedQuestions.map((question, index) => (
                  <button
                    key={index}
                    className="text-left p-3 text-sm bg-white border border-slate-200 rounded-lg hover:border-[#2F58CD] hover:bg-[#2F58CD]/5 transition-all duration-200 group"
                    onClick={() => setInputValue(question)}
                  >
                    <span className="group-hover:text-[#2F58CD]">{question}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 border-t border-slate-200 bg-white">
            <div className="flex space-x-3">
              <div className="flex-1 relative">
                <input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask a question about your document..."
                  className="w-full px-4 py-3 pr-12 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2F58CD]/20 focus:border-[#2F58CD] transition-all duration-200 text-sm"
                  disabled={isLoading}
                />
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading || !analysisResult}
                className="bg-gradient-to-r from-[#2F58CD] to-[#2347B8] hover:from-[#2347B8] hover:to-[#1e3a8a] disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center min-w-[50px]"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            {!analysisResult && (
              <p className="text-xs text-amber-600 mt-2 flex items-center">
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-2"></span>
                Please upload and analyze a document first
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}