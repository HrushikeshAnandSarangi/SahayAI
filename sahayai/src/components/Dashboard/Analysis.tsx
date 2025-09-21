"use client"

import { BookText, Gavel, Scale } from "lucide-react"
import { useAppContext } from "@/context/stateContext" // 1. Import the context hook (Corrected Path)

// Define a clear type for the analysis object to ensure type safety
interface ClauseAnalysis {
  clause: string;
  meaning: string;
  citation: string;
}

// The component no longer needs props
export function AnalysisTab() {
  // 2. Access the global state
  const { state } = useAppContext();
  const analysis = state.analysisResult?.analysis;

  // 3. Handle the loading state if data is not yet available
  if (!analysis) {
    return (
      <div className="flex items-center justify-center h-full text-slate-500">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-400 mr-3"></div>
        Loading analysis...
      </div>
    );
  }

  // 4. Render the UI with live data from the context
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Summary Card */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
        <div className="p-4">
          <h3 className="text-lg font-semibold text-slate-900 flex items-center">
            <BookText className="h-5 w-5 mr-2 text-[#2F58CD]" />
            Document Summary
          </h3>
        </div>
        <div className="px-4 pb-4">
          <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
            {analysis.summary || "No summary was generated."}
          </p>
        </div>
      </div>

      {/* Clauses Analysis Section */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
        <div className="p-4">
          <h3 className="text-lg font-semibold text-slate-900 flex items-center">
            <Scale className="h-5 w-5 mr-2 text-[#2F58CD]" />
            Clauses Analysis
          </h3>
        </div>
        <div className="px-4 pb-4 space-y-4">
          {analysis.clauses_analysis && analysis.clauses_analysis.length > 0 ? (
            analysis.clauses_analysis.map((item: ClauseAnalysis, index: number) => (
              <div key={index} className="border-t border-slate-200 pt-4">
                <h4 className="font-semibold text-slate-800">{item.clause}</h4>
                <p className="text-sm text-slate-600 mt-1">{item.meaning}</p>
                <p className="text-xs text-slate-500 mt-2 italic">
                  Citation: "{item.citation}"
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-500">No specific clauses were analyzed.</p>
          )}
        </div>
      </div>

      {/* References Section */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
        <div className="p-4">
          <h3 className="text-lg font-semibold text-slate-900 flex items-center">
            <Gavel className="h-5 w-5 mr-2 text-[#2F58CD]" />
            Legal References
          </h3>
        </div>
        <div className="px-4 pb-4">
          {analysis.references && analysis.references.length > 0 ? (
            <ul className="list-disc list-inside space-y-1">
              {analysis.references.map((ref: string, index: number) => (
                <li key={index} className="text-sm text-slate-700">
                  {ref}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500">No legal references were cited in the document.</p>
          )}
        </div>
      </div>
    </div>
  );
}

