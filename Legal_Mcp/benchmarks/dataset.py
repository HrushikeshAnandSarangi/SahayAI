"""Synthetic legal-document corpus and labeled QA pairs used by run_benchmark.py.

Three representative document types (lease, NDA, employment offer) with
numbered clauses, each paired with questions whose ground-truth answer is
known to live in one specific section. This lets retrieval be scored with
standard IR metrics without requiring a live Gemini/Qdrant deployment.
"""

DOCUMENTS = {
    "lease.pdf": [
        """1. PARTIES
This Lease Agreement is entered into between Rohan Mehta ("Landlord") and Ananya Iyer ("Tenant") for the residential unit at 14 Palm Grove, Bengaluru.

2. TERM
The lease begins on 1 April 2025 and continues for 11 months, ending on 28 February 2026, unless renewed in writing by both parties.

3. RENT AND PAYMENT
Tenant must pay rent of INR 32,000 on or before the 5th day of every month via bank transfer. A late fee of INR 500 per day applies after the 5th.

4. SECURITY DEPOSIT
Tenant has paid a refundable security deposit of INR 96,000. The deposit will be returned within 30 days of vacating, less any deductions for damages beyond normal wear and tear.

5. NOTICE PERIOD
Either party must give 30 days written notice before terminating this agreement. Notice must be delivered by email or registered post to the address on file.

6. MAINTENANCE
Landlord is responsible for structural repairs. Tenant is responsible for routine upkeep, including plumbing fixtures and electrical fittings within the unit.

7. TERMINATION FOR BREACH
If Tenant fails to pay rent for two consecutive months, Landlord may terminate this agreement immediately after issuing a 15 day cure notice.""",
    ],
    "nda.pdf": [
        """1. DEFINITION OF CONFIDENTIAL INFORMATION
Confidential Information means any technical, business, or financial data disclosed by Disclosing Party to Receiving Party, whether in writing, orally, or by inspection, that is marked or reasonably understood to be confidential.

2. OBLIGATIONS OF RECEIVING PARTY
Receiving Party shall use Confidential Information solely to evaluate the proposed business relationship and shall not disclose it to any third party without prior written consent.

3. EXCLUSIONS
This Agreement imposes no obligation with respect to information that is already public, independently developed, or rightfully received from a third party without restriction.

4. TERM OF CONFIDENTIALITY
The obligations under this Agreement survive for a period of 3 years from the date of disclosure, regardless of whether the business relationship proceeds.

5. RETURN OF MATERIALS
Upon written request, Receiving Party must return or destroy all copies of Confidential Information within 10 business days.

6. REMEDIES
Both parties acknowledge that unauthorized disclosure may cause irreparable harm, entitling Disclosing Party to seek injunctive relief in addition to damages.""",
    ],
    "employment_offer.pdf": [
        """1. POSITION AND START DATE
You are being offered the position of Software Engineer II, reporting to the Head of Engineering, with an anticipated start date of 15 June 2025.

2. COMPENSATION
Your annual base salary will be INR 18,00,000, paid monthly, plus an annual performance bonus of up to 15% of base salary based on company and individual performance.

3. PROBATION PERIOD
The first 6 months of employment constitute a probation period, during which either party may terminate employment with 15 days written notice.

4. NOTICE PERIOD AFTER CONFIRMATION
After successful confirmation, either party must provide 60 days written notice, or payment in lieu of notice, to terminate employment.

5. BENEFITS
You will be eligible for group health insurance covering yourself and immediate family, along with 24 days of paid annual leave, credited from the date of joining.

6. NON-COMPETE
For a period of 12 months following termination, you agree not to join a direct competitor in a role that would require use of proprietary company information.""",
    ],
}

QA_PAIRS = [
    {"document": "lease.pdf", "question": "How much notice is required to end the lease?", "section": "5. NOTICE PERIOD"},
    {"document": "lease.pdf", "question": "What day of the month is rent due?", "section": "3. RENT AND PAYMENT"},
    {"document": "lease.pdf", "question": "How much is the security deposit?", "section": "4. SECURITY DEPOSIT"},
    {"document": "lease.pdf", "question": "Who fixes structural problems in the apartment?", "section": "6. MAINTENANCE"},
    {"document": "lease.pdf", "question": "What happens if the tenant misses two months of rent?", "section": "7. TERMINATION FOR BREACH"},
    {"document": "lease.pdf", "question": "When does the lease term end?", "section": "2. TERM"},
    {"document": "nda.pdf", "question": "How long do confidentiality obligations last?", "section": "4. TERM OF CONFIDENTIALITY"},
    {"document": "nda.pdf", "question": "What information is not considered confidential?", "section": "3. EXCLUSIONS"},
    {"document": "nda.pdf", "question": "How soon must confidential materials be returned?", "section": "5. RETURN OF MATERIALS"},
    {"document": "nda.pdf", "question": "What can the disclosing party do if information is leaked?", "section": "6. REMEDIES"},
    {"document": "nda.pdf", "question": "What is the receiving party allowed to use confidential information for?", "section": "2. OBLIGATIONS OF RECEIVING PARTY"},
    {"document": "employment_offer.pdf", "question": "What is the notice period during probation?", "section": "3. PROBATION PERIOD"},
    {"document": "employment_offer.pdf", "question": "How much annual leave do I get?", "section": "5. BENEFITS"},
    {"document": "employment_offer.pdf", "question": "What is the base salary being offered?", "section": "2. COMPENSATION"},
    {"document": "employment_offer.pdf", "question": "How long is the non-compete period after leaving?", "section": "6. NON-COMPETE"},
    {"document": "employment_offer.pdf", "question": "What notice is needed to resign after confirmation?", "section": "4. NOTICE PERIOD AFTER CONFIRMATION"},
]
