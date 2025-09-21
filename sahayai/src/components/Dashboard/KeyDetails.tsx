"use client"

import { FileText, Calendar, User, ShieldCheck } from "lucide-react"
import { useAppContext } from "@/context/stateContext" // Corrected import path

// 1. Define a more specific type for the 'key_terms' array
interface IKeyTerm {
  term: string;
  definition: string;
}

// Update the main interface to use the new KeyTerm type
interface IKeyDetails {
  confidence_score: string;
  document_type: string;
  parties_involved: string[];
  effective_period: string;
  clauses_involved: string[];
  key_terms: IKeyTerm[]; // This is now an array of objects
}

export function KeyDetailsTab() {
  const { state } = useAppContext();
  const keyDetails = state.analysisResult?.key_details as IKeyDetails | undefined;

  if (!keyDetails) {
    return (
      <div className="flex items-center justify-center h-full text-slate-500">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-400 mr-3"></div>
        Loading key details...
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
          <div className="p-4 pb-3">
            <h3 className="text-sm font-medium text-slate-600 flex items-center">
              <ShieldCheck className="h-4 w-4 mr-2" />
              Confidence Score
            </h3>
          </div>
          <div className="px-4 pb-4">
            <p className="text-lg font-semibold text-slate-900">{keyDetails.confidence_score || 'N/A'}</p>
            <p className="text-xs text-slate-500">AI confidence in analysis.</p>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
          <div className="p-4 pb-3">
            <h3 className="text-sm font-medium text-slate-600 flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Document Type
            </h3>
          </div>
          <div className="px-4 pb-4">
            <p className="text-lg font-semibold text-slate-900">{keyDetails.document_type || 'N/A'}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
          <div className="p-4 pb-3">
            <h3 className="text-sm font-medium text-slate-600 flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Effective Period
            </h3>
          </div>
          <div className="px-4 pb-4">
            <p className="text-sm text-slate-700">{keyDetails.effective_period || 'Not specified'}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4">
          <h3 className="text-sm font-medium text-slate-600 flex items-center mb-3">
              <User className="h-4 w-4 mr-2" />
              Parties Involved
          </h3>
          <div className="space-y-1">
              {keyDetails.parties_involved?.map((party: string, index: number) => (
                  <p key={index} className="text-sm text-slate-700">{party}</p>
              ))}
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
          <div className="p-4">
            <h3 className="text-lg font-semibold text-slate-900">Key Terms</h3>
          </div>
          <div className="px-4 pb-4">
            <div className="space-y-4">
              {/* 2. Correctly render the 'term' and 'definition' from the object */}
              {keyDetails.key_terms?.map((item: IKeyTerm, index: number) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-[#2F58CD] rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="font-semibold text-slate-800">{item.term}</p>
                    <p className="text-slate-600 text-sm">{item.definition}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
          <div className="p-4">
            <h3 className="text-lg font-semibold text-slate-900">Important Clauses</h3>
          </div>
          <div className="px-4 pb-4">
            <div className="flex flex-wrap gap-2">
              {keyDetails.clauses_involved?.map((clause: string, index: number) => (
                <span
                  key={index}
                  className="inline-block bg-slate-100 text-slate-800 text-sm px-2.5 py-0.5 rounded-full border border-slate-200"
                >
                  {clause}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

