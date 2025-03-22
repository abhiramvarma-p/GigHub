const { OllamaLLM, OllamaEmbeddings } = require('@langchain/ollama');
const { PDFLoader } = require('@langchain/community/document_loaders/fs/pdf');
const { PromptTemplate } = require('@langchain/core/prompts');
const { MemoryVectorStore } = require('@langchain/community/vectorstores/memory');

async function parse_resume(pdf_path) {
    try {
        // Initialize models
        const llm = new OllamaLLM({ model: 'llama2' });
        const embeddings = new OllamaEmbeddings({ model: 'nomic-embed-text' });
        
        // Load and split the document
        const loader = new PDFLoader(pdf_path);
        const pages = await loader.load();
        const store = await MemoryVectorStore.fromDocuments(pages, embeddings);
        const retriever = store.asRetriever({ k: 10 });
        
        // Define the prompt template
        const template = `Extract only the individual skills listed in the resume.  
        Do NOT include section headers like "Computational tools", "Other skills", or "Design software".  
        Do NOT add explanations, bullet points, or extra text.  
        Return ONLY a valid JSON object in this format:
        {
            "skills": ["skill1", "skill2", "skill3", ...]
        }

        Context:
        {context}

        Return only the JSON object.`;
        
        const prompt = new PromptTemplate({ template, inputVariables: ['context'] });
        
        // Retrieve and format documents
        const retrievedDocs = await retriever.invoke("Extract all skills from the resume.");
        const context = retrievedDocs.map(doc => doc.pageContent).join('\n\n');
        
        // Generate and parse response
        const formattedPrompt = await prompt.format({ context });
        const skillsRaw = await llm.invoke(formattedPrompt);
        
        // Clean up the response
        let skillsJsonStr = skillsRaw.trim();
        if (!skillsJsonStr.startsWith('{')) {
            skillsJsonStr = skillsJsonStr.slice(skillsJsonStr.indexOf('{'));
        }
        if (!skillsJsonStr.endsWith('}')) {
            skillsJsonStr = skillsJsonStr.slice(0, skillsJsonStr.lastIndexOf('}') + 1);
        }
        
        const skillsJson = JSON.parse(skillsJsonStr);
        
        // Clean up skills (remove duplicates and empty strings)
        const cleanedSkills = [...new Set(skillsJson.skills.filter(Boolean))].sort();
        
        return cleanedSkills;
    } catch (error) {
        console.error('Error parsing resume:', error);
        throw new Error('Failed to parse resume: ' + error.message);
    }
}

module.exports = {
    parse_resume
}; 