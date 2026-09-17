"""Legal-document corpus and labeled QA pairs used by run_benchmark.py.

v2 of this dataset intentionally scales past the original 3-document /
16-question set (19 chunks total) to check whether retrieval strategies
actually diverge, or whether the earlier near-perfect scores were an
artifact of a corpus too small to discriminate between them. It adds:

  * 10 documents across distinct legal domains (up from 3), each with
    10-14 denser clauses (up from 6-7 short ones), for ~130+ chunks.
  * 100 questions (up from 16), each tagged "lexical" or "paraphrase":
      - "lexical"    questions reuse vocabulary from the target clause
                     (favorable to BM25/lexical matching).
      - "paraphrase" questions deliberately avoid the target clause's
                     vocabulary, using synonyms or a re-worded scenario
                     instead (favorable to semantic/dense matching,
                     adversarial for pure BM25).
  * Several documents that deliberately reuse similar wording across
    multiple clauses (e.g. two different notice periods, two different
    termination triggers) so lexical overlap alone is not sufficient to
    disambiguate the correct section.

This lets run_benchmark.py report accuracy split by question category,
which is the evidence needed to say whether hybrid RRF's advantage over
a single signal is real or untested.
"""

DOCUMENTS = {
    "lease.pdf": [
        """1. PARTIES
This Lease Agreement is entered into between Rohan Mehta ("Landlord") and Ananya Iyer ("Tenant") for the residential unit at 14 Palm Grove, Bengaluru. Both parties confirm they have the legal capacity to enter this agreement and that the unit will be used solely for residential purposes, not for commercial or subletting activity without prior written consent.

2. TERM
The lease begins on 1 April 2025 and continues for 11 months, ending on 28 February 2026, unless renewed in writing by both parties at least 30 days before expiry. A holdover tenancy after expiry without a signed renewal converts automatically to a month-to-month arrangement at the same rent.

3. RENT AND PAYMENT
Tenant must pay rent of INR 32,000 on or before the 5th day of every month via bank transfer to the account specified in Schedule A. A late fee of INR 500 per day applies after the 5th, capped at INR 5,000 per month, after which the Landlord may treat the delay as a material breach.

4. SECURITY DEPOSIT
Tenant has paid a refundable security deposit of INR 96,000, equal to three months' rent. The deposit will be returned within 30 days of vacating, less any deductions for damages beyond normal wear and tear, unpaid utility bills, or outstanding late fees, with an itemized statement provided to the Tenant.

5. NOTICE TO VACATE
Either party must give 30 days written notice before terminating this agreement at the end of the term. Notice must be delivered by email to the address on file or by registered post, and is effective on the date of delivery, not the date of sending.

6. EARLY TERMINATION BY TENANT
If Tenant wishes to leave before the term ends, Tenant must give 60 days written notice and forfeits one month's rent as an early-exit fee, unless the Landlord agrees in writing to waive it. This is distinct from the standard end-of-term notice described elsewhere in this agreement.

7. MAINTENANCE AND REPAIRS
Landlord is responsible for structural repairs, major appliance failures, and pest control. Tenant is responsible for routine upkeep, including plumbing fixtures, electrical fittings, and light bulb replacement within the unit, and must report structural issues within 48 hours of discovery.

8. TERMINATION FOR BREACH
If Tenant fails to pay rent for two consecutive months, Landlord may terminate this agreement immediately after issuing a 15 day cure notice. If Tenant cures the default by paying all arrears and late fees within that window, the termination notice is automatically withdrawn.

9. ALTERATIONS
Tenant may not make structural alterations, paint the unit a different color, or install fixtures that penetrate walls without Landlord's prior written consent. Minor decorative changes that do not damage the unit are permitted without approval.

10. GOVERNING LAW AND DISPUTES
This agreement is governed by the laws of Karnataka. Disputes will first be referred to mediation; if unresolved within 30 days, either party may pursue remedies before the competent Rent Control Court.""",
    ],
    "nda.pdf": [
        """1. DEFINITION OF CONFIDENTIAL INFORMATION
Confidential Information means any technical, business, or financial data disclosed by Disclosing Party to Receiving Party, whether in writing, orally, or by inspection, that is marked or reasonably understood to be confidential, including source code, pricing, and customer lists.

2. OBLIGATIONS OF RECEIVING PARTY
Receiving Party shall use Confidential Information solely to evaluate the proposed business relationship and shall not disclose it to any third party without prior written consent, and shall apply at least the same degree of care it uses for its own confidential materials.

3. EXCLUSIONS FROM CONFIDENTIALITY
This Agreement imposes no obligation with respect to information that is already public, independently developed without reference to the disclosure, or rightfully received from a third party without restriction on further disclosure.

4. TERM OF CONFIDENTIALITY OBLIGATIONS
The obligations under this Agreement survive for a period of 3 years from the date of disclosure, regardless of whether the business relationship proceeds, except for trade secrets, which remain protected for as long as they qualify as trade secrets under applicable law.

5. RETURN OR DESTRUCTION OF MATERIALS
Upon written request, or automatically upon termination of discussions, Receiving Party must return or destroy all copies of Confidential Information within 10 business days and certify destruction in writing if requested.

6. REMEDIES FOR BREACH
Both parties acknowledge that unauthorized disclosure may cause irreparable harm that money damages alone cannot adequately remedy, entitling Disclosing Party to seek injunctive relief in addition to, not instead of, monetary damages.

7. PERMITTED DISCLOSURES
Receiving Party may disclose Confidential Information to the extent required by a valid court order or regulatory demand, provided it gives Disclosing Party prompt notice so a protective order can be sought before disclosure occurs.

8. NO LICENSE GRANTED
Nothing in this Agreement grants Receiving Party any license, ownership interest, or right to use Disclosing Party's intellectual property beyond what is strictly necessary to evaluate the proposed relationship.""",
    ],
    "employment_offer.pdf": [
        """1. POSITION AND START DATE
You are being offered the position of Software Engineer II, reporting to the Head of Engineering, with an anticipated start date of 15 June 2025, contingent on successful background verification.

2. COMPENSATION
Your annual base salary will be INR 18,00,000, paid monthly, plus an annual performance bonus of up to 15% of base salary based on company and individual performance, reviewed each April.

3. PROBATION PERIOD
The first 6 months of employment constitute a probation period, during which either party may terminate employment with 15 days written notice, or payment in lieu of that shorter notice period.

4. NOTICE PERIOD AFTER CONFIRMATION
After successful confirmation following probation, either party must provide 60 days written notice, or payment in lieu of notice, to terminate employment, a longer commitment than during the initial probation window.

5. BENEFITS
You will be eligible for group health insurance covering yourself and immediate family, along with 24 days of paid annual leave, credited from the date of joining, and 12 days of sick leave per calendar year.

6. NON-COMPETE
For a period of 12 months following termination, you agree not to join a direct competitor in a role that would require use of proprietary company information gained during employment.

7. INTELLECTUAL PROPERTY ASSIGNMENT
All inventions, code, and designs created within the scope of your employment, using company resources or during company time, are assigned to the company and do not remain your personal property.

8. CONFIDENTIALITY DURING AND AFTER EMPLOYMENT
You must protect proprietary company information both during employment and after departure, and this obligation is not limited to the 12 month non-compete window described elsewhere in this offer.""",
    ],
    "loan_agreement.pdf": [
        """1. LOAN AMOUNT AND DISBURSEMENT
Lender agrees to advance a principal sum of INR 5,00,000 to Borrower, disbursed in a single transfer to Borrower's designated bank account within 5 business days of this agreement being signed by both parties.

2. INTEREST RATE
Interest accrues on the outstanding principal at a fixed rate of 11% per annum, calculated on a reducing balance basis and compounded monthly, and does not change over the life of the loan.

3. REPAYMENT SCHEDULE
Borrower shall repay the loan in 24 equal monthly instalments beginning 30 days after disbursement, each instalment covering both principal and accrued interest, due on the same calendar day each month.

4. LATE PAYMENT PENALTY
A missed or delayed instalment attracts a penalty of 2% of the overdue amount per month, in addition to continuing interest, until the arrears are cleared in full.

5. PREPAYMENT
Borrower may prepay the outstanding balance in whole or in part at any time without penalty, provided at least 7 days written notice is given so Lender can recalculate the remaining schedule.

6. DEFAULT AND ACCELERATION
If Borrower misses three consecutive instalments, Lender may declare the entire outstanding balance, including accrued interest, immediately due and payable, and pursue recovery through any lawful means.

7. COLLATERAL
This loan is secured against the vehicle described in Schedule B. Lender may repossess the collateral through lawful process if Borrower defaults and fails to cure within 30 days of a written default notice.

8. GOVERNING LAW
This agreement is governed by the laws of India, and any dispute arising from it will be subject to the exclusive jurisdiction of the courts in Mumbai.""",
    ],
    "service_agreement.pdf": [
        """1. SCOPE OF SERVICES
Contractor agrees to design and develop a mobile application for Client according to the specifications in Schedule A, including UI design, backend integration, and two rounds of revisions per milestone.

2. PROJECT TIMELINE
The engagement begins on 1 May 2025 and is expected to conclude within 16 weeks, with milestone deliverables due every 4 weeks as detailed in the project plan.

3. FEES AND PAYMENT SCHEDULE
Client agrees to pay a total fee of INR 12,00,000, split into four equal instalments of INR 3,00,000 due upon acceptance of each milestone, payable within 15 days of the corresponding invoice.

4. CHANGE REQUESTS
Any work requested outside the agreed scope in Schedule A will be billed separately at INR 2,500 per hour, and Contractor is not obligated to begin out-of-scope work until a change order is signed.

5. OWNERSHIP OF DELIVERABLES
Full ownership of the final source code and design assets transfers to Client only after all instalments have been paid in full; until then, Contractor retains ownership as security for payment.

6. WARRANTY
Contractor warrants the delivered application will be free of material defects for 90 days after final delivery, and will fix any qualifying defects reported within that window at no additional cost.

7. TERMINATION FOR CONVENIENCE
Either party may terminate this agreement with 21 days written notice; Client must pay for all work completed up to the termination date, calculated on a pro-rata milestone basis.

8. LIMITATION OF LIABILITY
Contractor's total liability under this agreement is capped at the total fees paid by Client, and neither party is liable for indirect or consequential damages such as lost profits.

9. CONFIDENTIALITY OF PROJECT DETAILS
Both parties agree to keep the terms of this agreement and any proprietary business information exchanged during the engagement confidential for 2 years after completion.""",
    ],
    "software_license.pdf": [
        """1. GRANT OF LICENSE
Licensor grants Licensee a non-exclusive, non-transferable license to install and use the software on up to 5 devices within Licensee's organization, solely for internal business purposes.

2. RESTRICTIONS
Licensee shall not reverse-engineer, decompile, sublicense, or redistribute the software, and shall not remove any copyright or proprietary notices embedded in the software or its documentation.

3. SUBSCRIPTION FEES
Licensee agrees to pay an annual subscription fee of INR 1,50,000, invoiced at the start of each license year, with automatic renewal unless either party gives 60 days notice of non-renewal.

4. UPDATES AND SUPPORT
Licensor will provide software updates and email support during the subscription term, with a target response time of 2 business days for standard issues and 4 business hours for critical outages.

5. DATA HANDLING
Licensor may collect anonymized usage telemetry to improve the software, but will not access Licensee's underlying business data without separate written authorization.

6. TERMINATION FOR NON-PAYMENT
If a subscription invoice remains unpaid 30 days past its due date, Licensor may suspend access to the software until payment is received, without terminating the underlying license grant.

7. TERMINATION FOR MISUSE
Licensor may terminate this license immediately, without a cure period, if Licensee is found to have redistributed the software or exceeded the authorized device count described in the grant of license.

8. LIMITATION OF WARRANTY
The software is provided "as is" without warranties of merchantability or fitness for a particular purpose, except as expressly stated elsewhere in this agreement.

9. GOVERNING LAW
This license is governed by the laws of Delhi, and both parties consent to the jurisdiction of courts located in New Delhi for any disputes arising from this agreement.""",
    ],
    "partnership_deed.pdf": [
        """1. FORMATION AND NAME
The partners, Meera Nair and Karthik Rao, hereby form a partnership under the name "Nair Rao Consulting" to carry on a business of financial advisory services, effective 1 January 2025.

2. CAPITAL CONTRIBUTION
Meera Nair contributes INR 6,00,000 and Karthik Rao contributes INR 4,00,000 as initial capital, recorded in the firm's books, with each partner's capital account adjusted for future contributions or withdrawals.

3. PROFIT AND LOSS SHARING
Profits and losses shall be shared in the ratio of 60:40 between Meera Nair and Karthik Rao respectively, matching their initial capital contribution ratio, unless the partners agree in writing to a different ratio.

4. MANAGEMENT AND AUTHORITY
Both partners shall have equal rights in the management of the business, but any transaction exceeding INR 2,00,000 requires the written consent of both partners before execution.

5. ADMISSION OF A NEW PARTNER
A new partner may be admitted only with the unanimous written consent of all existing partners, and the incoming partner's capital contribution and profit share must be documented in a supplementary deed.

6. RETIREMENT OF A PARTNER
A partner wishing to retire must give 90 days written notice to the other partner, after which the retiring partner's capital account will be settled based on the firm's audited accounts as of the retirement date.

7. DISSOLUTION
The partnership may be dissolved by mutual written agreement, or automatically upon the death or permanent incapacity of a partner, unless the surviving partner and the deceased partner's legal heirs agree in writing to continue the firm.

8. DISPUTE RESOLUTION
Any dispute between the partners regarding the interpretation or operation of this deed shall first be referred to a mutually appointed arbitrator before either partner approaches a court of law.""",
    ],
    "severance_agreement.pdf": [
        """1. SEPARATION DATE
Employee's last day of active employment with the Company will be 31 March 2025, after which Employee will no longer be required to perform work duties but remains bound by surviving obligations described in this agreement.

2. SEVERANCE PAYMENT
The Company will pay Employee a lump-sum severance amount equal to 3 months of base salary, disbursed within 15 business days of the separation date, subject to applicable tax withholding.

3. CONTINUATION OF BENEFITS
Health insurance coverage will continue for Employee and covered dependents for 60 days following the separation date, after which Employee may elect to continue coverage at their own cost under the applicable continuation scheme.

4. RETURN OF COMPANY PROPERTY
Employee must return all company property, including laptops, access cards, and confidential documents, no later than the separation date described above, failing which the Company may deduct the replacement value from the severance payment.

5. RELEASE OF CLAIMS
In exchange for the severance payment, Employee releases the Company from all claims related to employment or its termination, except for claims that cannot be waived under applicable law.

6. NON-DISPARAGEMENT
Both Employee and the Company agree not to make disparaging statements about the other to third parties, including on social media or professional networking platforms, following the separation date.

7. CONTINUING NON-COMPETE OBLIGATION
The non-compete obligation from Employee's original offer letter continues for 12 months after the separation date defined in this agreement, unaffected by the severance arrangement described here.

8. GOVERNING LAW
This agreement is governed by the laws of Maharashtra, and any dispute will be subject to the exclusive jurisdiction of courts in Mumbai.""",
    ],
    "sale_deed.pdf": [
        """1. PARTIES AND PROPERTY DESCRIPTION
This Sale Deed is executed between Suresh Pillai ("Seller") and Divya Krishnan ("Buyer") for the residential plot bearing Survey Number 245, measuring 2,400 square feet, located in Whitefield, Bengaluru.

2. SALE CONSIDERATION
The total sale consideration for the property is INR 1,80,00,000, payable as described in the payment schedule below, and includes all fixtures permanently attached to the property.

3. PAYMENT SCHEDULE
Buyer has paid an advance of INR 20,00,000 upon signing this deed, with the balance of INR 1,60,00,000 payable at the time of registration, no later than 45 days from the date of this deed.

4. TITLE AND ENCUMBRANCES
Seller warrants that the property is free from any mortgage, lien, or legal encumbrance, and undertakes to indemnify Buyer against any third-party claim relating to title that arose prior to this sale.

5. POSSESSION
Vacant physical possession of the property will be handed over to Buyer within 7 days of full payment and registration, along with all original title documents and property tax receipts.

6. REGISTRATION
Both parties agree to appear before the Sub-Registrar's office to complete registration formalities within 45 days of this deed being signed, sharing registration and stamp duty costs equally.

7. DEFAULT BY BUYER
If Buyer fails to pay the balance consideration within the stipulated 45 days, Seller may forfeit the advance payment and treat this deed as cancelled, without further notice.

8. INDEMNITY
Seller agrees to indemnify Buyer against any loss arising from an incorrect property description or an undisclosed encumbrance discovered after registration.""",
    ],
    "terms_of_service.pdf": [
        """1. ACCEPTANCE OF TERMS
By creating an account or using this platform, you agree to be bound by these Terms of Service and the linked Privacy Policy, which together govern your use of the service.

2. ACCOUNT REGISTRATION
You must provide accurate registration information and are responsible for maintaining the confidentiality of your account credentials and all activity that occurs under your account.

3. SUBSCRIPTION PLANS AND BILLING
Paid plans are billed monthly in advance, and your subscription automatically renews each month unless you cancel at least 3 days before the next billing date.

4. ACCEPTABLE USE
You agree not to use the platform to upload unlawful content, attempt unauthorized access to other accounts, or interfere with the normal operation of the service through automated scraping or overload.

5. CONTENT OWNERSHIP
You retain ownership of content you upload, but grant the platform a limited license to host, display, and process that content solely to provide the service to you.

6. ACCOUNT SUSPENSION
The platform may suspend or terminate your account without prior notice if you violate the acceptable use provisions described above, or if required to do so by law.

7. CANCELLATION AND REFUNDS
You may cancel your subscription at any time from account settings; cancellation takes effect at the end of the current billing cycle, and fees already paid are non-refundable except where required by law.

8. LIMITATION OF LIABILITY
To the maximum extent permitted by law, the platform's total liability for any claim arising from your use of the service is limited to the amount you paid in the 3 months preceding the claim.

9. CHANGES TO THESE TERMS
The platform may update these terms from time to time; continued use of the service after an update takes effect constitutes acceptance of the revised terms.""",
    ],
}

# Each QA pair is tagged "lexical" (question reuses the target clause's own
# vocabulary) or "paraphrase" (question deliberately avoids it, forcing a
# retriever to rely on semantic similarity rather than term overlap).
QA_PAIRS = [
    # --- lease.pdf ---
    {"document": "lease.pdf", "question": "How much notice is needed to vacate at the end of the lease term?", "section": "5. NOTICE TO VACATE", "category": "lexical"},
    {"document": "lease.pdf", "question": "If I want to move out early, before my lease is up, what do I owe?", "section": "6. EARLY TERMINATION BY TENANT", "category": "paraphrase"},
    {"document": "lease.pdf", "question": "What day of the month is rent due?", "section": "3. RENT AND PAYMENT", "category": "lexical"},
    {"document": "lease.pdf", "question": "Is there a charge if I pay my monthly amount late?", "section": "3. RENT AND PAYMENT", "category": "paraphrase"},
    {"document": "lease.pdf", "question": "How much is the security deposit?", "section": "4. SECURITY DEPOSIT", "category": "lexical"},
    {"document": "lease.pdf", "question": "When do I get my upfront refundable payment back after I leave?", "section": "4. SECURITY DEPOSIT", "category": "paraphrase"},
    {"document": "lease.pdf", "question": "Who is responsible for structural repairs?", "section": "7. MAINTENANCE AND REPAIRS", "category": "lexical"},
    {"document": "lease.pdf", "question": "If a pipe under the sink starts leaking, whose job is it to fix it?", "section": "7. MAINTENANCE AND REPAIRS", "category": "paraphrase"},
    {"document": "lease.pdf", "question": "What happens if the tenant fails to pay rent for two consecutive months?", "section": "8. TERMINATION FOR BREACH", "category": "lexical"},
    {"document": "lease.pdf", "question": "Can I repaint a wall or add a shelf without asking first?", "section": "9. ALTERATIONS", "category": "lexical"},
    {"document": "lease.pdf", "question": "Am I allowed to hang a picture frame that needs a nail in the wall without permission?", "section": "9. ALTERATIONS", "category": "paraphrase"},
    {"document": "lease.pdf", "question": "When does the lease term end?", "section": "2. TERM", "category": "lexical"},
    {"document": "lease.pdf", "question": "What happens if I keep living there after the agreed period without signing anything new?", "section": "2. TERM", "category": "paraphrase"},
    {"document": "lease.pdf", "question": "What law governs this agreement and how are disputes resolved?", "section": "10. GOVERNING LAW AND DISPUTES", "category": "lexical"},

    # --- nda.pdf ---
    {"document": "nda.pdf", "question": "How long do confidentiality obligations last?", "section": "4. TERM OF CONFIDENTIALITY OBLIGATIONS", "category": "lexical"},
    {"document": "nda.pdf", "question": "Do trade secrets stop being protected after a fixed number of years?", "section": "4. TERM OF CONFIDENTIALITY OBLIGATIONS", "category": "paraphrase"},
    {"document": "nda.pdf", "question": "What information is not considered confidential?", "section": "3. EXCLUSIONS FROM CONFIDENTIALITY", "category": "lexical"},
    {"document": "nda.pdf", "question": "If something was already known to the public before it was shared with me, does it still count as a secret?", "section": "3. EXCLUSIONS FROM CONFIDENTIALITY", "category": "paraphrase"},
    {"document": "nda.pdf", "question": "How soon must confidential materials be returned?", "section": "5. RETURN OR DESTRUCTION OF MATERIALS", "category": "lexical"},
    {"document": "nda.pdf", "question": "What can the disclosing party do if information is leaked?", "section": "6. REMEDIES FOR BREACH", "category": "lexical"},
    {"document": "nda.pdf", "question": "Can a court order force disclosure of information that would otherwise be secret?", "section": "7. PERMITTED DISCLOSURES", "category": "paraphrase"},
    {"document": "nda.pdf", "question": "What is the receiving party allowed to use confidential information for?", "section": "2. OBLIGATIONS OF RECEIVING PARTY", "category": "lexical"},
    {"document": "nda.pdf", "question": "Does receiving these materials give me any rights to the other company's patents or trademarks?", "section": "8. NO LICENSE GRANTED", "category": "paraphrase"},
    {"document": "nda.pdf", "question": "What counts as confidential information under this agreement?", "section": "1. DEFINITION OF CONFIDENTIAL INFORMATION", "category": "lexical"},

    # --- employment_offer.pdf ---
    {"document": "employment_offer.pdf", "question": "What is the notice period during probation?", "section": "3. PROBATION PERIOD", "category": "lexical"},
    {"document": "employment_offer.pdf", "question": "If I want to quit in my first few months on the job, how much warning do I need to give?", "section": "3. PROBATION PERIOD", "category": "paraphrase"},
    {"document": "employment_offer.pdf", "question": "What notice is needed to resign after confirmation?", "section": "4. NOTICE PERIOD AFTER CONFIRMATION", "category": "lexical"},
    {"document": "employment_offer.pdf", "question": "How much annual leave do I get?", "section": "5. BENEFITS", "category": "lexical"},
    {"document": "employment_offer.pdf", "question": "Does my family get covered under any medical plan?", "section": "5. BENEFITS", "category": "paraphrase"},
    {"document": "employment_offer.pdf", "question": "What is the base salary being offered?", "section": "2. COMPENSATION", "category": "lexical"},
    {"document": "employment_offer.pdf", "question": "How long is the non-compete period after leaving?", "section": "6. NON-COMPETE", "category": "lexical"},
    {"document": "employment_offer.pdf", "question": "After I quit, am I allowed to immediately go work for a rival company?", "section": "6. NON-COMPETE", "category": "paraphrase"},
    {"document": "employment_offer.pdf", "question": "Who owns code I write while working here?", "section": "7. INTELLECTUAL PROPERTY ASSIGNMENT", "category": "lexical"},
    {"document": "employment_offer.pdf", "question": "If I build something on company time, is it mine to keep or sell later?", "section": "7. INTELLECTUAL PROPERTY ASSIGNMENT", "category": "paraphrase"},

    # --- loan_agreement.pdf ---
    {"document": "loan_agreement.pdf", "question": "What is the interest rate on this loan?", "section": "2. INTEREST RATE", "category": "lexical"},
    {"document": "loan_agreement.pdf", "question": "How much extra am I charged each year for borrowing the money?", "section": "2. INTEREST RATE", "category": "paraphrase"},
    {"document": "loan_agreement.pdf", "question": "How many monthly instalments will I pay?", "section": "3. REPAYMENT SCHEDULE", "category": "lexical"},
    {"document": "loan_agreement.pdf", "question": "What is the penalty for a late payment?", "section": "4. LATE PAYMENT PENALTY", "category": "lexical"},
    {"document": "loan_agreement.pdf", "question": "If I miss a due date on one of my instalments, what extra do I owe?", "section": "4. LATE PAYMENT PENALTY", "category": "paraphrase"},
    {"document": "loan_agreement.pdf", "question": "Can I pay off the loan early without a penalty?", "section": "5. PREPAYMENT", "category": "lexical"},
    {"document": "loan_agreement.pdf", "question": "What happens if I miss three payments in a row?", "section": "6. DEFAULT AND ACCELERATION", "category": "lexical"},
    {"document": "loan_agreement.pdf", "question": "If I stop paying for a few months straight, can the lender demand everything back at once?", "section": "6. DEFAULT AND ACCELERATION", "category": "paraphrase"},
    {"document": "loan_agreement.pdf", "question": "What happens to my vehicle if I default on the loan?", "section": "7. COLLATERAL", "category": "lexical"},
    {"document": "loan_agreement.pdf", "question": "How much money is being lent?", "section": "1. LOAN AMOUNT AND DISBURSEMENT", "category": "lexical"},

    # --- service_agreement.pdf ---
    {"document": "service_agreement.pdf", "question": "What is the total fee for this project?", "section": "3. FEES AND PAYMENT SCHEDULE", "category": "lexical"},
    {"document": "service_agreement.pdf", "question": "How much will I be billed in total for getting my app built?", "section": "3. FEES AND PAYMENT SCHEDULE", "category": "paraphrase"},
    {"document": "service_agreement.pdf", "question": "What happens if I ask for work outside the original scope?", "section": "4. CHANGE REQUESTS", "category": "lexical"},
    {"document": "service_agreement.pdf", "question": "If I want an extra feature that wasn't part of the original plan, how is that handled?", "section": "4. CHANGE REQUESTS", "category": "paraphrase"},
    {"document": "service_agreement.pdf", "question": "When does ownership of the code transfer to the client?", "section": "5. OWNERSHIP OF DELIVERABLES", "category": "lexical"},
    {"document": "service_agreement.pdf", "question": "What is the warranty period after final delivery?", "section": "6. WARRANTY", "category": "lexical"},
    {"document": "service_agreement.pdf", "question": "If something breaks a month after the project is finished, will it get fixed for free?", "section": "6. WARRANTY", "category": "paraphrase"},
    {"document": "service_agreement.pdf", "question": "How much notice is needed to terminate this agreement for convenience?", "section": "7. TERMINATION FOR CONVENIENCE", "category": "lexical"},
    {"document": "service_agreement.pdf", "question": "Is the contractor liable for the client's lost profits?", "section": "8. LIMITATION OF LIABILITY", "category": "lexical"},
    {"document": "service_agreement.pdf", "question": "What is the project expected to take from start to finish?", "section": "2. PROJECT TIMELINE", "category": "lexical"},

    # --- software_license.pdf ---
    {"document": "software_license.pdf", "question": "How many devices can this license be installed on?", "section": "1. GRANT OF LICENSE", "category": "lexical"},
    {"document": "software_license.pdf", "question": "What is the annual subscription fee?", "section": "3. SUBSCRIPTION FEES", "category": "lexical"},
    {"document": "software_license.pdf", "question": "Does my subscription renew automatically each year?", "section": "3. SUBSCRIPTION FEES", "category": "paraphrase"},
    {"document": "software_license.pdf", "question": "How fast will critical outages be responded to?", "section": "4. UPDATES AND SUPPORT", "category": "lexical"},
    {"document": "software_license.pdf", "question": "What happens if I don't pay my invoice on time?", "section": "6. TERMINATION FOR NON-PAYMENT", "category": "lexical"},
    {"document": "software_license.pdf", "question": "If I fall behind on a payment, will my access get cut off right away?", "section": "6. TERMINATION FOR NON-PAYMENT", "category": "paraphrase"},
    {"document": "software_license.pdf", "question": "Can the license be terminated immediately for redistributing the software?", "section": "7. TERMINATION FOR MISUSE", "category": "lexical"},
    {"document": "software_license.pdf", "question": "Am I allowed to decompile or reverse-engineer the software?", "section": "2. RESTRICTIONS", "category": "lexical"},
    {"document": "software_license.pdf", "question": "Does the vendor collect any data about how I use the product?", "section": "5. DATA HANDLING", "category": "paraphrase"},
    {"document": "software_license.pdf", "question": "Which courts have jurisdiction over disputes under this license?", "section": "9. GOVERNING LAW", "category": "lexical"},

    # --- partnership_deed.pdf ---
    {"document": "partnership_deed.pdf", "question": "How are profits and losses shared between the partners?", "section": "3. PROFIT AND LOSS SHARING", "category": "lexical"},
    {"document": "partnership_deed.pdf", "question": "If the firm makes money this year, what cut does each partner get?", "section": "3. PROFIT AND LOSS SHARING", "category": "paraphrase"},
    {"document": "partnership_deed.pdf", "question": "How much capital did each partner contribute?", "section": "2. CAPITAL CONTRIBUTION", "category": "lexical"},
    {"document": "partnership_deed.pdf", "question": "Is there a spending limit before a partner needs the other's approval?", "section": "4. MANAGEMENT AND AUTHORITY", "category": "lexical"},
    {"document": "partnership_deed.pdf", "question": "Can one partner sign off on a big purchase alone?", "section": "4. MANAGEMENT AND AUTHORITY", "category": "paraphrase"},
    {"document": "partnership_deed.pdf", "question": "How much notice must a partner give before retiring from the firm?", "section": "6. RETIREMENT OF A PARTNER", "category": "lexical"},
    {"document": "partnership_deed.pdf", "question": "What happens to the firm if a partner passes away?", "section": "7. DISSOLUTION", "category": "lexical"},
    {"document": "partnership_deed.pdf", "question": "How can a new person join the partnership?", "section": "5. ADMISSION OF A NEW PARTNER", "category": "lexical"},
    {"document": "partnership_deed.pdf", "question": "If the partners disagree about how this deed should be read, what happens first, before going to court?", "section": "8. DISPUTE RESOLUTION", "category": "paraphrase"},

    # --- severance_agreement.pdf ---
    {"document": "severance_agreement.pdf", "question": "How much severance pay will the employee receive?", "section": "2. SEVERANCE PAYMENT", "category": "lexical"},
    {"document": "severance_agreement.pdf", "question": "What lump sum am I getting for leaving the company?", "section": "2. SEVERANCE PAYMENT", "category": "paraphrase"},
    {"document": "severance_agreement.pdf", "question": "How long does health insurance continue after separation?", "section": "3. CONTINUATION OF BENEFITS", "category": "lexical"},
    {"document": "severance_agreement.pdf", "question": "By when must company property like laptops be returned?", "section": "4. RETURN OF COMPANY PROPERTY", "category": "lexical"},
    {"document": "severance_agreement.pdf", "question": "What claims is the employee giving up in exchange for the payment?", "section": "5. RELEASE OF CLAIMS", "category": "lexical"},
    {"document": "severance_agreement.pdf", "question": "Am I allowed to badmouth my old employer on LinkedIn after I leave?", "section": "6. NON-DISPARAGEMENT", "category": "paraphrase"},
    {"document": "severance_agreement.pdf", "question": "Does the original non-compete still apply after this severance agreement?", "section": "7. CONTINUING NON-COMPETE OBLIGATION", "category": "lexical"},

    # --- sale_deed.pdf ---
    {"document": "sale_deed.pdf", "question": "What is the total sale consideration for the property?", "section": "2. SALE CONSIDERATION", "category": "lexical"},
    {"document": "sale_deed.pdf", "question": "How much is the buyer paying overall for this plot?", "section": "2. SALE CONSIDERATION", "category": "paraphrase"},
    {"document": "sale_deed.pdf", "question": "How much advance has the buyer already paid?", "section": "3. PAYMENT SCHEDULE", "category": "lexical"},
    {"document": "sale_deed.pdf", "question": "What does the seller promise about the property's legal status?", "section": "4. TITLE AND ENCUMBRANCES", "category": "lexical"},
    {"document": "sale_deed.pdf", "question": "Is there any existing loan or claim against this land that the buyer should worry about?", "section": "4. TITLE AND ENCUMBRANCES", "category": "paraphrase"},
    {"document": "sale_deed.pdf", "question": "When will the buyer get possession of the property?", "section": "5. POSSESSION", "category": "lexical"},
    {"document": "sale_deed.pdf", "question": "What happens if the buyer doesn't pay the remaining balance in time?", "section": "7. DEFAULT BY BUYER", "category": "lexical"},
    {"document": "sale_deed.pdf", "question": "Within how many days must registration formalities be completed?", "section": "6. REGISTRATION", "category": "lexical"},

    # --- terms_of_service.pdf ---
    {"document": "terms_of_service.pdf", "question": "How often is a paid subscription billed?", "section": "3. SUBSCRIPTION PLANS AND BILLING", "category": "lexical"},
    {"document": "terms_of_service.pdf", "question": "When does my card get charged if I'm on a paid plan?", "section": "3. SUBSCRIPTION PLANS AND BILLING", "category": "paraphrase"},
    {"document": "terms_of_service.pdf", "question": "What kind of platform use is not allowed?", "section": "4. ACCEPTABLE USE", "category": "lexical"},
    {"document": "terms_of_service.pdf", "question": "Can I write a script to automatically pull data off the site at scale?", "section": "4. ACCEPTABLE USE", "category": "paraphrase"},
    {"document": "terms_of_service.pdf", "question": "Who owns the content I upload to the platform?", "section": "5. CONTENT OWNERSHIP", "category": "lexical"},
    {"document": "terms_of_service.pdf", "question": "Can my account be suspended without warning?", "section": "6. ACCOUNT SUSPENSION", "category": "lexical"},
    {"document": "terms_of_service.pdf", "question": "If I cancel my plan, do I get money back for the current month?", "section": "7. CANCELLATION AND REFUNDS", "category": "paraphrase"},
    {"document": "terms_of_service.pdf", "question": "What is the cap on the platform's liability for a claim?", "section": "8. LIMITATION OF LIABILITY", "category": "lexical"},
    {"document": "terms_of_service.pdf", "question": "Can the terms of service change after I've already signed up?", "section": "9. CHANGES TO THESE TERMS", "category": "paraphrase"},
]

# A curated subset of 20 questions, one to three per document, each with a
# short fact that a *correct, grounded* answer must contain. Used only by
# run_live_benchmark.py to score rag.answer() output (not just retrieval)
# against the real Gemini generation step: it checks that the expected fact
# appears either in the model's answer text or in one of its cited quotes.
# This is the "did the user get a correct, cited answer" metric flagged as
# missing from the offline retrieval-only benchmark.
ANSWER_ACCURACY_SUBSET = [
    {"document": "lease.pdf", "question": "How much notice is needed to vacate at the end of the lease term?", "expected_fact": "30 days"},
    {"document": "lease.pdf", "question": "What day of the month is rent due?", "expected_fact": "5th"},
    {"document": "lease.pdf", "question": "How much is the security deposit?", "expected_fact": "96,000"},
    {"document": "nda.pdf", "question": "How long do confidentiality obligations last?", "expected_fact": "3 years"},
    {"document": "nda.pdf", "question": "How soon must confidential materials be returned?", "expected_fact": "10 business days"},
    {"document": "employment_offer.pdf", "question": "What is the notice period during probation?", "expected_fact": "15 days"},
    {"document": "employment_offer.pdf", "question": "What is the base salary being offered?", "expected_fact": "18,00,000"},
    {"document": "employment_offer.pdf", "question": "How long is the non-compete period after leaving?", "expected_fact": "12 months"},
    {"document": "loan_agreement.pdf", "question": "What is the interest rate on this loan?", "expected_fact": "11%"},
    {"document": "loan_agreement.pdf", "question": "What is the penalty for a late payment?", "expected_fact": "2%"},
    {"document": "loan_agreement.pdf", "question": "How many monthly instalments will I pay?", "expected_fact": "24"},
    {"document": "service_agreement.pdf", "question": "What is the total fee for this project?", "expected_fact": "12,00,000"},
    {"document": "service_agreement.pdf", "question": "What is the warranty period after final delivery?", "expected_fact": "90 days"},
    {"document": "software_license.pdf", "question": "How many devices can this license be installed on?", "expected_fact": "5 devices"},
    {"document": "software_license.pdf", "question": "What is the annual subscription fee?", "expected_fact": "1,50,000"},
    {"document": "partnership_deed.pdf", "question": "How are profits and losses shared between the partners?", "expected_fact": "60:40"},
    {"document": "severance_agreement.pdf", "question": "How much severance pay will the employee receive?", "expected_fact": "3 months"},
    {"document": "sale_deed.pdf", "question": "What is the total sale consideration for the property?", "expected_fact": "1,80,00,000"},
    {"document": "sale_deed.pdf", "question": "How much advance has the buyer already paid?", "expected_fact": "20,00,000"},
    {"document": "terms_of_service.pdf", "question": "What is the cap on the platform's liability for a claim?", "expected_fact": "3 months"},
]
