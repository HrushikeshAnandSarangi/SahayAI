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
    """Endpoint to handle chatbot conversations."""
    data = request.get_json()
    if not data or 'question' not in data or 'context' not in data:
        return jsonify({"error": "Invalid request. 'question' and 'context' are required."}), 400

    question = data['question']
    context = data['context']
    user_role = data.get('user_role', 'user') # Get user role, default to 'user'

    try:
        answer = chat_with_document(question, context, user_role)
        return jsonify({"answer": answer})
    except Exception as e:
        logging.error(f"An error occurred during chat processing: {e}", exc_info=True)
        return jsonify({"error": "An error occurred while getting a response from the assistant."}), 500

if __name__ == '__main__':
    app.run(debug=True)

