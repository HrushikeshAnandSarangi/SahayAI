import pytest
import io
import json
from app import app as flask_app  # Import the Flask app instance

@pytest.fixture
def app():
    """Create and configure a new app instance for each test."""
    flask_app.config.update({
        "TESTING": True,
    })
    yield flask_app

@pytest.fixture
def client(app):
    """A test client for the app."""
    return app.test_client()

def test_process_document_success_image(client, mocker):
    """
    Test successful processing of an image file.
    Mocks the processing pipeline to avoid actual API calls.
    """
    # 1. Mock the backend processing function WHERE IT IS USED (in the 'app' module)
    mock_pipeline_result = {
        "summary": "This is a summary from a mock image.",
        "key_points": ["Mock point 1"],
        "checklist": ["Mock checklist item 1"]
    }
    mocker.patch(
        'app.process_document_pipeline',  # <--- CORRECTED MOCK TARGET
        return_value=mock_pipeline_result
    )

    # 2. Prepare mock file data
    mock_file_data = {
        'file': (io.BytesIO(b"dummy image data"), 'test.jpg')
    }

    # 3. Send a POST request to the endpoint
    response = client.post(
        '/process-document', 
        data=mock_file_data, 
        content_type='multipart/form-data'
    )

    # 4. Assert the response is correct
    assert response.status_code == 200
    response_data = json.loads(response.data)
    assert response_data == mock_pipeline_result

def test_process_document_success_pdf(client, mocker):
    """
    Test successful processing of a PDF file.
    """
    # 1. Mock the backend processing function WHERE IT IS USED (in the 'app' module)
    mock_pipeline_result = {
        "summary": "This is a summary from a mock PDF.",
        "key_points": ["PDF point A"],
        "checklist": ["PDF action item B"]
    }
    mocker.patch(
        'app.process_document_pipeline',  # <--- CORRECTED MOCK TARGET
        return_value=mock_pipeline_result
    )

    # 2. Prepare mock file data
    mock_file_data = {
        'file': (io.BytesIO(b"dummy pdf data"), 'document.pdf')
    }

    # 3. Send a POST request
    response = client.post(
        '/process-document',
        data=mock_file_data,
        content_type='multipart/form-data'
    )

    # 4. Assert the response
    assert response.status_code == 200
    assert json.loads(response.data) == mock_pipeline_result

def test_process_document_no_file(client):
    """
    Test the endpoint's response when no file is provided in the request.
    """
    response = client.post('/process-document', data={})
    assert response.status_code == 400
    response_data = json.loads(response.data)
    assert "error" in response_data
    assert "No file part" in response_data["error"]

def test_process_document_unsupported_file_type(client, mocker):
    """
    Test the endpoint's response for an unsupported file type.
    We mock the pipeline to simulate the ValueError it would raise.
    """
    # 1. Mock the pipeline to raise a ValueError
    mocker.patch(
        'app.process_document_pipeline', # <--- CORRECTED MOCK TARGET
        side_effect=ValueError("Unsupported file type: .txt")
    )
    
    # 2. Prepare mock file data
    mock_file_data = {
        'file': (io.BytesIO(b"some text data"), 'unsupported.txt')
    }

    # 3. Send request
    response = client.post(
        '/process-document',
        data=mock_file_data,
        content_type='multipart/form-data'
    )

    # 4. Assert the response
    assert response.status_code == 415  # Unsupported Media Type
    response_data = json.loads(response.data)
    assert "error" in response_data
    assert "Unsupported file type: .txt" in response_data["error"]
