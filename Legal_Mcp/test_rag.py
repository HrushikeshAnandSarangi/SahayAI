from rag import semantic_chunks, split_long_block


def test_semantic_chunks_keep_clause_metadata_and_page_number():
    chunks = semantic_chunks([
        "1. PAYMENT TERMS\nTenant must pay rent on the first day of every month.\n\n2. NOTICE\nEither party must give 30 days notice."
    ], "lease.pdf")
    assert len(chunks) == 2
    assert chunks[0]["section"] == "1. PAYMENT TERMS"
    assert chunks[1]["page_start"] == 1
    assert "30 days" in chunks[1]["text"]


def test_long_blocks_are_split_only_on_sentence_boundaries():
    text = " ".join(["word"] * 790) + ". " + " ".join(["next"] * 30) + "."
    parts = split_long_block(text, limit=800)
    assert len(parts) == 2
    assert all(part.endswith(".") for part in parts)


def test_body_sentences_starting_with_a_single_capital_letter_are_not_treated_as_headings():
    chunks = semantic_chunks([
        "4. LATE PAYMENT PENALTY\nA missed or delayed instalment attracts a penalty of 2% per month.\n\n5. PREPAYMENT\nBorrower may prepay at any time."
    ], "loan.pdf")
    assert len(chunks) == 2
    assert chunks[0]["section"] == "4. LATE PAYMENT PENALTY"
    assert "A missed or delayed instalment" in chunks[0]["text"]
    assert chunks[1]["section"] == "5. PREPAYMENT"
