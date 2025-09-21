import os
import io
import fitz  # PyMuPDF
from PIL import Image
import google.generativeai as genai
from google.cloud import vision
from google.oauth2 import service_account
from langchain.text_splitter import RecursiveCharacterTextSplitter
import json
import re

# Configure Gemini AI
genai.configure()

def get_vision_client():
    """
    Create and return a Google Cloud Vision client using service account JSON
    stored as an environment variable.
    """
    # Check if running in a GCP environment (like Cloud Run, App Engine, etc.)
    # In such environments, default credentials are automatically available
    try:
        # Try using default credentials first (works in GCP environments)
        client = vision.ImageAnnotatorClient()
        return client
    except Exception:
        # If default credentials fail, use service account JSON from environment variable
        try:
            # Get the service account JSON from environment variable
            service_account_json = os.getenv("GOOGLE_APPLICATION_CREDENTIALS_JSON")
            
            if not service_account_json:
                raise ValueError("GOOGLE_APPLICATION_CREDENTIALS_JSON environment variable not found")
            
            # Parse the JSON string
            service_account_info = json.loads(service_account_json)
            
            # Validate required fields
            required_fields = ["project_id", "private_key", "client_email"]
            missing_fields = [field for field in required_fields if not service_account_info.get(field)]
            
            if missing_fields:
                raise ValueError(f"Missing required fields in service account JSON: {', '.join(missing_fields)}")
            
            # Create credentials from service account info
            credentials = service_account.Credentials.from_service_account_info(
                service_account_info,
                scopes=['https://www.googleapis.com/auth/cloud-platform']
            )
            
            # Create client with credentials
            client = vision.ImageAnnotatorClient(credentials=credentials)
            return client
            
        except json.JSONDecodeError as e:
            raise Exception(f"Failed to parse service account JSON: {str(e)}. Please ensure GOOGLE_APPLICATION_CREDENTIALS_JSON contains valid JSON.")
        except Exception as e:
            raise Exception(f"Failed to create Vision client: {str(e)}. Please ensure GOOGLE_APPLICATION_CREDENTIALS_JSON environment variable is properly set.")

def ocr_image_with_vision(image_content):
    """
    Extract text from image using Google Cloud Vision API
    """
    client = get_vision_client()
    image = vision.Image(content=image_content)
    response = client.document_text_detection(image=image)
    
    if response.error.message:
        raise Exception(f'Vision API error: {response.error.message}')
    
    return response.full_text_annotation.text

def extract_text_from_pdf(pdf_content):
    """
    Extract text from PDF including OCR for images within the PDF
    """
    all_text_parts = []
    doc = fitz.open(stream=pdf_content, filetype="pdf")
    
    # Extract regular text from each page
    for page in doc.pages():
        all_text_parts.append(page.get_text())
    
    # Extract text from images in the PDF using OCR
    for page_num in range(len(doc)):
        page = doc.load_page(page_num)
        image_list = page.get_images(full=True)
        
        for img_index, img in enumerate(image_list):
            xref = img[0]
            base_image = doc.extract_image(xref)
            image_bytes = base_image["image"]
            
            try:
                image_ocr_text = ocr_image_with_vision(image_bytes)
                if image_ocr_text:
                    all_text_parts.append(f"\n--- OCR Text from Image on Page {page_num + 1} ---\n")
                    all_text_parts.append(image_ocr_text)
            except Exception as e:
                print(f"Could not process image on page {page_num + 1}: {e}")
    
    doc.close()
    return "\n".join(all_text_parts)

def analyze_legal_document(document_text, user_role):
    """
    Analyze legal document using Gemini AI
    """
    model = genai.GenerativeModel('gemini-1.5-flash')

    prompt = f"""
    Analyze the following legal document text from the perspective of the **{user_role}**.
    Your entire response must be ONLY the raw JSON object, starting with `{{` and ending with `}}`.
    Do not include any explanatory text, markdown formatting like ```json, or any words before or after the JSON object.

    The JSON object must strictly adhere to this structure:
    {{
      "scraped_text": "The full text of the document...",
      "key_details": {{
        "confidence_score": "A percentage (e.g., '95%') representing your confidence in the analysis.",
        "document_type": "The specific type of legal document (e.g., 'Employment Agreement', 'Lease Agreement').",
        "parties_involved": ["An array of strings with the names of the parties involved."],
        "effective_period": "A string describing the effective date, term, or duration (e.g., 'January 1, 2024 to December 31, 2024').",
        "clauses_involved": ["An array of strings listing the key clause titles found."],
        "key_terms": [
            {{ "term": "Term Name", "definition": "A concise definition of the term from the document." }}
        ]
      }},
      "analysis": {{
        "summary": "A detailed, multi-paragraph summary of the document, tailored to the {user_role}'s perspective.",
        "clauses_analysis": [
            {{
              "clause": "The exact title of the clause (e.g., 'Clause 5: Confidentiality').",
              "meaning": "A clear, simple explanation of what this clause means for the {user_role}.",
              "citation": "A direct, brief quote from the clause in the document that supports the meaning."
            }}
        ],
        "references": ["An array of strings listing any laws, statutes, or other documents referenced."]
      }},
      "actionable_checklist": ["An array of strings with clear, actionable next steps for the {user_role}."]
    }}

    Document Text:
    ---
    {document_text}
    ---
    """

    generation_config = genai.types.GenerationConfig(
        response_mime_type="application/json",
    )
    
    response = model.generate_content(prompt, generation_config=generation_config)
    
    try:
        # First, try to load the text directly
        return json.loads(response.text)
    except json.JSONDecodeError as e:
        print(f"Initial JSON decoding failed: {e}. Attempting to clean the response.")
        # If direct parsing fails, implement a more robust method to extract the first complete JSON object.
        try:
            text = response.text
            start_index = text.find('{')
            if start_index == -1:
                raise ValueError("No opening brace found in the response.")
            
            open_braces = 0
            end_index = -1
            
            # Iterate through the string to find the matching closing brace for the first opening brace
            for i in range(start_index, len(text)):
                if text[i] == '{':
                    open_braces += 1
                elif text[i] == '}':
                    open_braces -= 1
                
                if open_braces == 0:
                    end_index = i
                    break # Found the end of the first complete object
            
            if end_index == -1:
                raise ValueError("No matching closing brace for the initial object.")
                
            json_str = text[start_index : end_index + 1]
            return json.loads(json_str)
            
        except (ValueError, json.JSONDecodeError) as clean_e:
            print(f"Failed to clean and parse JSON: {clean_e}")
            return {
                "error": "Failed to parse AI response.",
                "details": "The data from the AI was not in a valid JSON format, even after robust cleaning."
            }
    except AttributeError as e:
        print(f"AttributeError from Gemini response: {e}")
        return {
            "error": "Invalid response from AI.",
            "details": "The AI response object was missing expected attributes."
        }

def process_document_pipeline(file_content, filename, user_role):
    """
    Main pipeline to process legal documents
    """
    file_ext = os.path.splitext(filename)[1].lower()
    
    extracted_text = ""
    if file_ext == '.pdf':
        extracted_text = extract_text_from_pdf(file_content)
    elif file_ext in ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff']:
        extracted_text = ocr_image_with_vision(file_content)
    else:
        raise ValueError(f"Unsupported file type: {file_ext}")

    if not extracted_text.strip():
        return {"error": "No text could be extracted from the document."}

    insights = analyze_legal_document(extracted_text, user_role)
    
    if "error" not in insights and "scraped_text" not in insights:
        insights["scraped_text"] = extracted_text

    return insights

def chat_with_document(question, context, user_role):
    """
    Chat functionality for asking questions about the document
    """
    model = genai.GenerativeModel('gemini-2.5-flash-lite')
    prompt = f"""
    **Persona**: You are a helpful AI assistant for 'Sahay AI'. Your goal is to demystify legal documents. Your tone should be clear, professional, and supportive. You are NOT a lawyer and you MUST NOT give legal advice.

    **Task**: Answer the user's question based *only* on the provided 'Document Context'. You are acting as an assistant for the **{user_role}**.

    **Rules for Citing**:
    1.  When you answer, you MUST cite the specific part of the document that supports your answer.
    2.  Use direct quotes for citations, like this: "... a direct quote from the text ..."
    3.  If possible, refer to the clause or section number, for example: "(see Clause 5.1)".

    **Formatting**:
    - Use markdown for clarity (bolding, bullet points).
    - Keep answers concise and easy to understand.
    - If the answer is not in the document, you MUST state: "I could not find information about that in the provided document."

    ---
    **Document Context**:
    {context}
    ---

    **User's Question**:
    {question}
    """
    
    response = model.generate_content(prompt)
    return {"answer": response.text}

