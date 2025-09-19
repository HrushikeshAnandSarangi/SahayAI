import { FileText, Calendar, User } from "lucide-react"

interface KeyDetailsTabProps {
  chatId: string
}

export function KeyDetailsTab({ chatId }: KeyDetailsTabProps) {
  // Mock data - in real implementation, this would come from your AI analysis
  const keyDetails = {
    documentType: "Employment Contract",
    parties: ["John Doe", "TechCorp Inc."],
    effectiveDate: "2024-01-15",
    expirationDate: "2025-01-15",
    keyTerms: [
      "Annual Salary: $85,000",
      "Probation Period: 90 days",
      "Notice Period: 30 days",
      "Non-compete: 12 months",
    ],
    importantClauses: [
      "Confidentiality Agreement",
      "Intellectual Property Rights",
      "Termination Conditions",
      "Benefits Package",
    ],
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
          <div className="p-4 pb-3">
            <h3 className="text-sm font-medium text-slate-600 flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Document Type
            </h3>
          </div>
          <div className="px-4 pb-4">
            <p className="text-lg font-semibold text-slate-900">{keyDetails.documentType}</p>
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
            <p className="text-sm text-slate-700">{keyDetails.effectiveDate}</p>
            <p className="text-sm text-slate-500">to {keyDetails.expirationDate}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
          <div className="p-4 pb-3">
            <h3 className="text-sm font-medium text-slate-600 flex items-center">
              <User className="h-4 w-4 mr-2" />
              Parties Involved
            </h3>
          </div>
          <div className="px-4 pb-4">
            <div className="space-y-1">
              {keyDetails.parties.map((party, index) => (
                <p key={index} className="text-sm text-slate-700">
                  {party}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
          <div className="p-4">
            <h3 className="text-lg font-semibold text-slate-900">Key Terms</h3>
          </div>
          <div className="px-4 pb-4">
            <div className="space-y-3">
              {keyDetails.keyTerms.map((term, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-[#2F58CD] rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-slate-700">{term}</p>
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
            <div className="space-y-2">
              {keyDetails.importantClauses.map((clause, index) => (
                <span
                  key={index}
                  className="inline-block bg-slate-100 text-slate-800 text-sm px-2.5 py-0.5 rounded-full mr-2 mb-2 border border-slate-200"
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
