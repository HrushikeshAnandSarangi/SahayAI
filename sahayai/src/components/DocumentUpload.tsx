"use client"

import type React from "react"
import { useRef, useState } from "react"
import { CheckCircle2, Eye, FileText, ScanText, ShieldCheck, Upload, X } from "lucide-react"
import { useAppContext } from "@/context/stateContext"

type UserRole = "Plaintiff" | "Defendant"

const sampleStages = ["OCR and page extraction", "Clause-aware semantic chunking", "Hybrid retrieval index", "Citation-ready analysis"]

export function DocumentUpload() {
  const { dispatch } = useAppContext()
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const abortControllerRef = useRef<AbortController | null>(null)

  const upload = async (file?: File) => {
    if (!file || !selectedRole) return
    if (!["application/pdf", "image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
      setError("Upload a PDF, JPEG, or PNG document.")
      return
    }
    setError(null); setIsUploading(true); dispatch({ type: "START_PROCESSING" }); dispatch({ type: "SET_USER_ROLE", payload: selectedRole })
    const controller = new AbortController(); abortControllerRef.current = controller
    const formData = new FormData(); formData.append("file", file); formData.append("user_role", selectedRole)
    try {
      const response = await fetch("/api/process", { method: "POST", body: formData, signal: controller.signal })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || "Unable to process the document.")
      dispatch({ type: "SET_ANALYSIS_SUCCESS", payload: result })
    } catch (err: any) {
      const message = err.name === "AbortError" ? "Upload cancelled." : err.message || "Upload failed. Please try again."
      setError(message); dispatch({ type: "SET_ERROR", payload: message })
    } finally { setIsUploading(false); abortControllerRef.current = null }
  }

  return (
    <main className="min-h-screen bg-[#f5f3ee] px-4 py-10 text-[#27342b] sm:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 flex flex-col gap-4 border-b border-[#d8d5cc] pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#8b6b43]">Secure document workspace</p>
            <h1 className="font-serif text-4xl tracking-tight text-[#263b31] sm:text-5xl">Review the record. Understand the terms.</h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-[#5d665e]">Upload a legal document for a structured, source-grounded review. Your document index expires automatically after 24 hours.</p>
          </div>
          <button onClick={() => setShowPreview(!showPreview)} className="inline-flex items-center justify-center gap-2 rounded-md border border-[#a9afa4] bg-transparent px-4 py-2.5 text-sm font-semibold text-[#334b3e] hover:border-[#334b3e]">
            <Eye className="h-4 w-4" /> {showPreview ? "Close sample preview" : "Preview a processed document"}
          </button>
        </header>

        {showPreview && <section className="mb-8 grid overflow-hidden rounded-xl border border-[#d8d5cc] bg-white shadow-sm lg:grid-cols-[1.1fr_.9fr]">
          <div className="border-b border-[#e5e2da] p-6 lg:border-b-0 lg:border-r">
            <div className="mb-5 flex items-center justify-between"><div className="flex items-center gap-3"><div className="rounded-md bg-[#e8ede8] p-2"><FileText className="h-5 w-5 text-[#334b3e]" /></div><div><p className="font-semibold">Property_Notice.pdf</p><p className="text-xs text-[#6b746d]">6 pages · uploaded moments ago</p></div></div><span className="rounded-full bg-[#edf2eb] px-3 py-1 text-xs font-semibold text-[#526656]">Indexed</span></div>
            <div className="rounded-md border border-[#dfddd5] bg-[#fcfbf8] p-6 font-serif text-sm leading-7 text-[#424a43]"><p className="mb-4 text-right text-xs text-[#8a8f88]">Page 2 of 6</p><h2 className="mb-4 text-lg font-semibold">3. Notice and termination</h2><p>Either party may terminate this agreement by providing written notice no fewer than thirty days before the intended termination date.</p><p className="mt-5">All obligations accrued before termination remain enforceable in accordance with this agreement.</p></div>
          </div>
          <div className="p-6"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8b6b43]">Pipeline preview</p><h2 className="mt-2 font-serif text-2xl text-[#263b31]">Prepared for grounded answers</h2><div className="mt-6 space-y-4">{sampleStages.map((stage, index) => <div key={stage} className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-[#526656]" /><div><p className="text-sm font-semibold">{stage}</p><p className="text-xs text-[#727970]">{index === 1 ? "Clause preserved as a semantic unit" : "Completed"}</p></div></div>)}</div><div className="mt-7 rounded-md bg-[#263b31] p-4 text-sm text-[#f5f3ee]"><p className="font-semibold">Sample answer evidence</p><p className="mt-2 text-[#d9e2d6]">“... written notice no fewer than thirty days ...”</p><p className="mt-2 text-xs text-[#b9c7b5]">Page 2 · Notice and termination</p></div></div>
        </section>}

        <section className="grid gap-8 lg:grid-cols-[.8fr_1.2fr]">
          <aside className="rounded-xl border border-[#d8d5cc] bg-[#eeece5] p-6"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8b6b43]">Step 1</p><h2 className="mt-2 font-serif text-2xl text-[#263b31]">Your position</h2><p className="mt-2 text-sm leading-6 text-[#606960]">This gives the review the right perspective. It does not provide legal advice.</p><div className="mt-6 space-y-3">{(["Plaintiff", "Defendant"] as UserRole[]).map((role) => <button key={role} onClick={() => setSelectedRole(role)} className={`w-full rounded-md border p-4 text-left transition ${selectedRole === role ? "border-[#334b3e] bg-white shadow-sm" : "border-[#cfcbbf] bg-transparent hover:border-[#7d897e]"}`}><p className="font-semibold text-[#263b31]">{role}</p><p className="mt-1 text-xs text-[#687168]">{role === "Plaintiff" ? "The party bringing the claim." : "The party responding to the claim."}</p></button>)}</div></aside>
          <section className="rounded-xl border border-[#d8d5cc] bg-white p-6 sm:p-8"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8b6b43]">Step 2</p><h2 className="mt-2 font-serif text-2xl text-[#263b31]">Add the document</h2><p className="mt-2 text-sm text-[#606960]">PDF, JPEG, or PNG. The document is isolated to this review and expires in 24 hours.</p><label className={`mt-7 flex min-h-56 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center transition ${selectedRole ? "border-[#8d988c] bg-[#faf9f6] hover:border-[#334b3e]" : "border-[#d8d5cc] bg-[#f7f5f0] opacity-60"}`}><input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" disabled={!selectedRole || isUploading} onChange={(event) => upload(event.target.files?.[0])} />{isUploading ? <ScanText className="h-10 w-10 animate-pulse text-[#526656]" /> : <Upload className="h-10 w-10 text-[#526656]" />}<p className="mt-4 font-semibold">{isUploading ? "Preparing document evidence…" : "Choose a file or drop it here"}</p><p className="mt-1 text-xs text-[#717970]">Source text never needs to be pasted into chat.</p></label>{isUploading && <button onClick={() => abortControllerRef.current?.abort()} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#8a4a3b]"><X className="h-4 w-4" /> Cancel upload</button>}{error && <p className="mt-4 text-sm text-[#9c3f32]">{error}</p>}<div className="mt-7 flex gap-3 border-t border-[#e7e4dc] pt-5 text-xs text-[#687168]"><ShieldCheck className="h-4 w-4 shrink-0 text-[#526656]" />Chunked and indexed for retrieval; automatically removed after 24 hours.</div></section>
        </section>
      </div>
    </main>
  )
}
