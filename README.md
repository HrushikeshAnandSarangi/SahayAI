# SahayAI 🇮🇳

Demystifying complex legal documents with the power of AI. SahayAI transforms dense legal jargon into clear, actionable insights, empowering you to make informed decisions with confidence.

[![Watch Demo](https://img.shields.io/badge/▶️-Watch_Demo-red?style=for-the-badge&logo=youtube)](https://youtu.be/DHpzeMq-yb8) [![Try Live App](https://img.shields.io/badge/🚀-Try_Live_App-blue?style=for-the-badge)](https://sahayai-23401246568.europe-west1.run.app/)

## 🌟 About The Project

Navigating legal documents can be an intimidating and confusing process for anyone without a law degree. The complex language, critical deadlines, and hidden obligations can lead to misunderstandings and costly mistakes.

SahayAI was built to solve this problem. It's an intelligent legal analysis tool that acts as your personal guide. Simply upload a document, and SahayAI instantly breaks it down, providing you with a clear summary, answers to your questions, and a personalized checklist of actions.

## 🎥 Demo

**Watch the full walkthrough:** [SahayAI Demo Video](https://youtu.be/DHpzeMq-yb8)

**Try it yourself:** [Live Application](https://sahayai-23401246568.europe-west1.run.app/)

## ✨ Key Features

SahayAI offers a multi-faceted analysis through a clean, intuitive interface:

### 📄 Key Details
Instantly extracts the most critical information from your document—parties involved, key dates, notice periods, and important terms—and presents it in a simple, structured format.

### 🧠 In-depth Analysis
Delivers plain-English summaries and clear explanations of key clauses, helping you understand the implications of each section without getting lost in jargon.

### ❓ Ask a Question
An interactive Q&A feature powered by the document's content. Get direct answers to your specific questions, with guided prompts to help you explore the text.

### ✅ Your Personalized Checklist
Generates a custom action plan based on the document's content, with categorized tasks and responsibilities so you know exactly what you need to do next.

## 🛠️ Technical Architecture

### Main Components

| Component | Purpose | Key Files |
|-----------|---------|-----------|
| **Backend (Legal_Mcp)** | Receives uploaded files, extracts text, runs a processing pipeline, and provides a chat-based Q&A interface over the document. | `app.py`, `tasks.py`, `requirements.txt`, `DockerFile` |
| **Frontend (sahayai)** | A modern Next.js (React) UI that lets users upload documents, view analysis results, and chat with the AI. | `src/app/**`, `src/components/**`, `next.config.ts`, `DockerFile` |
| **Infrastructure** | Docker-compose and Cloud Build configs to containerise and deploy both services. | `docker-compose.yml`, `cloudbuild.yaml` |
| **Assets** | Sample legal notice images used for testing or UI illustration. | `Legal Documents/*` |

### Backend Highlights

- **Flask API** exposing two main routes:
  - `POST /process-document` – accepts a file + user role, validates, and runs process_document_pipeline
  - `POST /chat` – forwards a question/context pair to chat_with_document

- **Technology Stack:**
  - Google Cloud Vision for OCR
  - Google Generative AI for LLM interaction
  - LangChain for document processing
  - PyMuPDF and Pillow for PDF handling
  - Containerised with Python 3.9 and Gunicorn for production

### Frontend Highlights

- **Built with:**
  - Next.js 15 (standalone output mode)
  - TypeScript
  - Tailwind CSS
  - shadcn/ui components
  - lucide-react icons

- **Features:**
  - Global state management via React context (`stateContext.tsx`)
  - API routes (`/api/process`, `/api/chat`) proxy requests to Flask backend
  - Responsive design with modern UI components

## 🚀 Getting Started

### Prerequisites

Ensure you have Docker and Docker Compose installed on your system:
- [Docker Installation Guide](https://docs.docker.com/get-docker/)
- [Docker Compose Installation Guide](https://docs.docker.com/compose/install/)

### Running Locally with Docker

1. **Clone the repository**
   ```bash
   git clone https://github.com/HrushikeshAnandSarangi/SahayAI.git
   ```

2. **Navigate to the project directory**
   ```bash
   cd SahayAI
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   # .env example
   API_KEY="YOUR_API_KEY"
   ```

4. **Build and run the application**
   ```bash
   docker-compose up --build
   ```

5. **Access the application**
   
   The application will be available at `http://localhost:3000`

### Cloud Deployment

A Google Cloud Build script (`cloudbuild.yaml`) is included to build and push both the frontend and backend images to Google Artifact Registry, preparing them for deployment on services like Cloud Run.

## 📂 Project Structure

```
.
├── Legal_Mcp/              # Flask backend
│   ├── app.py
│   ├── tasks.py
│   ├── DockerFile
│   └── requirements.txt
├── sahayai/                # Next.js frontend
│   ├── src/app/            # Pages and API routes
│   ├── src/components/     # UI components
│   ├── src/context/        # Global state
│   ├── DockerFile
│   └── package.json
├── Legal Documents/        # Sample legal notice images
├── docker-compose.yml
├── cloudbuild.yaml
└── README.md
```

## 👥 Who It's For

SahayAI is designed for a wide range of users who need to navigate the complexities of legal language:

### 🏠 Individuals & Consumers
Anyone dealing with personal contracts like rental agreements, employment offers, or terms of service who wants to understand their rights and obligations.

### 💼 Business Owners & Entrepreneurs
For quickly reviewing contracts, NDAs, partnership agreements, and other legal documents, especially when they don't have an in-house legal team.

### ⚖️ Legal Professionals
Paralegals, law clerks, and even lawyers can use it to get a quick first-pass analysis of documents, saving time and highlighting key areas for deeper review.

### 🎓 Students & Researchers
A useful tool for law students or academics who need to analyze and summarize large volumes of legal text.

### 👨‍💻 Developers
Those looking for a practical, end-to-end example of a modern AI application combining a Python backend with a Next.js frontend, ready for containerized deployment.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

For questions or support, please reach out through the GitHub repository issues.

---

**SahayAI** - Empowering everyone to understand legal documents with AI 🚀
