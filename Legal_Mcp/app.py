import os
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from dotenv import load_dotenv
from werkzeug.utils import secure_filename
# Import both processing functions from tasks
from tasks import process_document_pipeline, chat_with_document
import logging

# Load environment variables from .env file
load_dotenv()

# Set up basic logging
logging.basicConfig(level=logging.INFO)

app = Flask(__name__, template_folder='templates')
CORS(app, resources={r"/*": {"origins": "*"}}) # Enable CORS for all routes

# Define allowed file extensions
ALLOWED_EXTENSIONS = {'pdf', 'png', 'jpg', 'jpeg', 'gif', 'bmp', 'tiff'}

def allowed_file(filename):
    """Check if the uploaded file has an allowed extension."""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
def index():
    """Serve the main HTML page."""
    return render_template('index.html')

@app.route('/process-document', methods=['POST'])
def process_document_endpoint():
    """Endpoint to receive and process an uploaded document."""
    if 'file' not in request.files:
        return jsonify({"error": "No file part in the request"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400

    if 'user_role' not in request.form:
        return jsonify({"error": "No user role specified"}), 400
        
    user_role = request.form['user_role'].lower()
    if user_role not in ['plaintiff', 'defendant']:
        return jsonify({"error": "Invalid user role specified"}), 400

    if file and allowed_file(file.filename):
        try:
            filename = secure_filename(file.filename)
            file_content = file.read()
            results = process_document_pipeline(file_content, filename, user_role)
            return jsonify(results), 200
        except ValueError as ve:
            logging.warning(f"Unsupported file type submitted: {ve}")
            return jsonify({"error": str(ve)}), 415
        except Exception as e:
            logging.error(f"An error occurred during document processing: {e}", exc_info=True)
            return jsonify({"error": "An internal error occurred during processing."}), 500
    else:
        return jsonify({"error": "File type not allowed"}), 400

@app.route('/chat', methods=['POST'])
def chat_endpoint():
    """Answer a question using only the indexed chunks for one document."""
    data = request.get_json()
    if not data or not data.get('question') or not data.get('document_id'):
        return jsonify({"error": "Invalid request. 'question' and 'document_id' are required."}), 400
    try:
        return jsonify(chat_with_document(data['question'], data['document_id'], data.get('user_role', 'user')))
    except Exception as e:
        logging.error(f"An error occurred during RAG chat: {e}", exc_info=True)
        return jsonify({"error": "An error occurred while getting a response from the assistant."}), 500



@app.route('/internal/purge-expired', methods=['POST'])
def purge_expired_documents():
    """Scheduled endpoint; protect with CLEANUP_TOKEN in production."""
    expected = os.getenv('CLEANUP_TOKEN')
    if expected and request.headers.get('Authorization') != f'Bearer {expected}':
        return jsonify({"error": "Unauthorized"}), 401
    from rag import LegalRAG
    LegalRAG().purge_expired()
    return jsonify({"status": "ok"})

if __name__ == '__main__':
    app.run(debug=True)
