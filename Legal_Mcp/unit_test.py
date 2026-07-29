import io
import json
import pytest
from app import app as flask_app


@pytest.fixture
def app():
    flask_app.config.update({"TESTING": True})
    yield flask_app


@pytest.fixture
def client(app):
    return app.test_client()


@pytest.mark.parametrize(("filename", "role", "result"), [
    ("test.jpg", "plaintiff", {"summary": "Image analysis"}),
    ("document.pdf", "defendant", {"summary": "PDF analysis"}),
])
def test_process_document_success(client, mocker, filename, role, result):
    mocker.patch("app.process_document_pipeline", return_value=result)
    response = client.post(
        "/process-document",
        data={"file": (io.BytesIO(b"document bytes"), filename), "user_role": role},
        content_type="multipart/form-data",
    )
    assert response.status_code == 200
    assert json.loads(response.data) == result


def test_process_document_requires_file(client):
    response = client.post("/process-document", data={})
    assert response.status_code == 400
    assert "No file part" in json.loads(response.data)["error"]


def test_process_document_rejects_unsupported_type(client):
    response = client.post(
        "/process-document",
        data={"file": (io.BytesIO(b"text"), "unsupported.txt"), "user_role": "plaintiff"},
        content_type="multipart/form-data",
    )
    assert response.status_code == 400
    assert "File type not allowed" in json.loads(response.data)["error"]
