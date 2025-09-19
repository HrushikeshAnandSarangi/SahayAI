import { AlertTriangle, CheckCircle, Info } from "lucide-react"

interface AnalysisTabProps {
  chatId: string
}

export function AnalysisTab({ chatId }: AnalysisTabProps) {
  const analysis = {
    overallScore: 78,
    riskLevel: "Medium",
    strengths: ["Clear termination clauses", "Well-defined compensation structure", "Comprehensive benefits package"],
    concerns: [
      "Non-compete clause may be too restrictive",
      "Intellectual property terms favor employer heavily",
      "Limited dispute resolution options",
    ],
    recommendations: [
      "Consider negotiating the non-compete duration",
      "Request clarification on IP ownership for personal projects",
      "Add mediation clause before litigation",
    ],
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
          <div className="p-4 pb-3">
            <h3 className="text-sm font-medium text-slate-600">Overall Score</h3>
          </div>
          <div className="px-4 pb-4">
            <div className="space-y-2">
              <div className="text-2xl font-bold text-slate-900">{analysis.overallScore}/100</div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-[#2F58CD] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${analysis.overallScore}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
          <div className="p-4 pb-3">
            <h3 className="text-sm font-medium text-slate-600">Risk Level</h3>
          </div>
          <div className="px-4 pb-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <span className="text-lg font-semibold text-slate-900">{analysis.riskLevel}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
          <div className="p-4 pb-3">
            <h3 className="text-sm font-medium text-slate-600">Status</h3>
          </div>
          <div className="px-4 pb-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-lg font-semibold text-slate-900">Analysis Complete</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
          <div className="p-4">
            <h3 className="text-lg font-semibold text-green-700 flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              Strengths
            </h3>
          </div>
          <div className="px-4 pb-4">
            <div className="space-y-3">
              {analysis.strengths.map((strength, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-slate-700 text-sm">{strength}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
          <div className="p-4">
            <h3 className="text-lg font-semibold text-yellow-700 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Concerns
            </h3>
          </div>
          <div className="px-4 pb-4">
            <div className="space-y-3">
              {analysis.concerns.map((concern, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-slate-700 text-sm">{concern}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
          <div className="p-4">
            <h3 className="text-lg font-semibold text-[#2F58CD] flex items-center">
              <Info className="h-5 w-5 mr-2" />
              Recommendations
            </h3>
          </div>
          <div className="px-4 pb-4">
            <div className="space-y-3">
              {analysis.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-[#2F58CD] rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-slate-700 text-sm">{recommendation}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
