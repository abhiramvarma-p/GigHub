import os
import json
from langchain_ollama import OllamaLLM, OllamaEmbeddings
from langchain_community.document_loaders import PyPDFLoader
from langchain.prompts import PromptTemplate
from langchain_community.vectorstores import DocArrayInMemorySearch

# Use LLaMA 2 model
llm = OllamaLLM(model='llama2')

# Use an available embedding model
embeddings = OllamaEmbeddings(model='nomic-embed-text')

# PDF file path
pdf_path = "sample_resume.pdf"

# Ensure the file exists
if not os.path.exists(pdf_path):
    print(f"Error: The file '{pdf_path}' does not exist. Please check the path and try again.")
    exit()

print("Loading and processing resume...")

# Load and split the document
loader = PyPDFLoader(pdf_path)
pages = loader.load_and_split()
store = DocArrayInMemorySearch.from_documents(pages, embedding=embeddings)
retriever = store.as_retriever(search_kwargs={"k": 10})  # Fetch more chunks

# Stricter Prompt to Prevent Section Headings
template = """Extract only the individual skills listed in the resume.  
Do NOT include section headers like "Computational tools", "Other skills", or "Design software".  
Do NOT add explanations, bullet points, or extra text.  
Return ONLY a valid JSON object in this format:
{{
    "skills": ["skill1", "skill2", "skill3", ...]
}}

Context:
{context}

Return only the JSON object."""

prompt = PromptTemplate.from_template(template)

# Function to format retrieved documents
def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)

print("Extracting skills from resume...")

# Retrieve relevant document chunks
retrieved_docs = retriever.invoke("Extract all skills from the resume.")

# Format documents
context = format_docs(retrieved_docs)

# Create the full prompt
formatted_prompt = prompt.format(context=context)

# Generate response using LLaMA 2
print("Analyzing with LLaMA 2...")
skills_raw = llm.invoke(formatted_prompt)

try:
    # Extract JSON object using string manipulation (more reliable than regex for this case)
    skills_json_str = skills_raw.strip()
    if not skills_json_str.startswith('{'):
        skills_json_str = skills_json_str[skills_json_str.find('{'):]
    if not skills_json_str.endswith('}'):
        skills_json_str = skills_json_str[:skills_json_str.rfind('}')+1]
    
    skills_json = json.loads(skills_json_str)
    
    # Clean up skills (remove duplicates and empty strings)
    skills_json["skills"] = list(set(filter(None, skills_json["skills"])))
    
    # Sort skills alphabetically
    skills_json["skills"].sort()
    
    print("\nExtracted Skills:")
    print(json.dumps(skills_json, indent=2))
    
except (json.JSONDecodeError, AttributeError) as e:
    print("Error: Failed to parse skills JSON.")
    print(f"Raw output:\n{skills_raw}")
    print(f"Error details: {str(e)}") 