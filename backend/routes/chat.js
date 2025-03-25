const express = require('express');
const router = express.Router();
const { ChatOllama } = require('@langchain/community/chat_models/ollama');
const { OllamaEmbeddings } = require('@langchain/ollama');
const { PDFLoader } = require('@langchain/community/document_loaders/fs/pdf');
const { PromptTemplate } = require('@langchain/core/prompts');
const { MemoryVectorStore } = require('langchain/vectorstores/memory');
const { RecursiveCharacterTextSplitter } = require('langchain/text_splitter');
const path = require('path');
const fs = require('fs');

// Initialize LLM and embeddings
const llm = new ChatOllama({ model: 'llama2' });
const embeddings = new OllamaEmbeddings({ model: 'nomic-embed-text' });

// Job documents folder path
const jobDocumentsFolder = path.join(__dirname, '../job_documents');

// Job titles and corresponding PDF filenames
const jobFiles = {
  "ai and ml research engineer": "ai_and_ml_engineer.pdf",
  "cloud engineer": "cloud_engineer.pdf",
  "cybersecurity analyst": "cybersecurity_analyst.pdf",
  "data scientist": "data_scientist.pdf",
  "embedded systems engineer": "embedded_systems_engineer.pdf",
  "frontend web developer": "frontend_web_developer.pdf",
  "game designer": "game_designer.pdf",
  "mobile app developer": "mobile_app_developer.pdf",
  "ui/ux designer": "uiux_designer.pdf",
};

// Initialize chat sessions
const chatSessions = new Map();

// Template for the chat prompt
const template = `
You are an AI career assistant. Always respond concisely based on the provided job details.
Directly answer the user's question with a single sentence.
If the user asks about missing skills, provide them clearly.

**User Profile:**
- **Job:** {selected_job}
- **User Skills:** {user_skills}
- **Conversation History:** {chat_history}

**User Question:** {question}

**Response:**
Provide a complete and clear response in full sentences. Never end your response with a colon (":") or an unfinished phrase.
Make sure the answer is at least 10 words long and structured logically. Limit the response to 100 words.
{context}
`;

const prompt = PromptTemplate.fromTemplate(template);

// Function to format retrieved documents
const formatDocs = (docs) => {
  return docs[0]?.pageContent || "";
};

// Initialize chat session
router.post('/initialize', async (req, res) => {
  try {
    const { job, skills } = req.body;
    
    if (!job || !skills) {
      return res.status(400).json({ error: 'Job and skills are required' });
    }

    const jobInfoPdfPath = path.join(jobDocumentsFolder, jobFiles[job.toLowerCase()]);
    
    if (!fs.existsSync(jobInfoPdfPath)) {
      return res.status(404).json({ error: 'Job document not found' });
    }

    // Load and process the PDF
    const loader = new PDFLoader(jobInfoPdfPath);
    const documents = await loader.load();

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 500,
      chunkOverlap: 100,
      separators: ["\n\n", ".", "?", "!", " "],
      addStartIndex: true
    });

    const chunks = await textSplitter.splitDocuments(documents);
    const store = await MemoryVectorStore.fromDocuments(chunks, embeddings);
    const retriever = store.asRetriever();

    // Store the session data
    chatSessions.set(req.sessionID, {
      job,
      skills: skills.split(',').map(s => s.trim()),
      retriever,
      chatHistory: []
    });

    res.json({ 
      message: `Hello! I'm GigAI, your career assistant. You've selected **${job}**.\nYour current skills include **${skills}**. Ask me anything!`
    });
  } catch (error) {
    console.error('Error initializing chat:', error);
    res.status(500).json({ error: 'Failed to initialize chat' });
  }
});

// Handle chat messages
router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    const response = await llm.invoke(message);
    res.json({ response: response.content });
  } catch (error) {
    console.error('Error processing message:', error);
    res.status(500).json({ error: 'Error processing message' });
  }
});

module.exports = router; 