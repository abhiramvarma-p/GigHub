import os
import sys
import json
from langchain_ollama import OllamaLLM, OllamaEmbeddings
from langchain_community.document_loaders import PyPDFLoader
from langchain.prompts import PromptTemplate
from langchain_community.vectorstores import DocArrayInMemorySearch

def parse_resume(pdf_path):
    """Parse a resume PDF and extract skills."""
    
    # Initialize models
    llm = OllamaLLM(model='llama2')
    embeddings = OllamaEmbeddings(model='nomic-embed-text')
    
    # Load and split the document
    loader = PyPDFLoader(pdf_path)
    pages = loader.load_and_split()
    store = DocArrayInMemorySearch.from_documents(pages, embedding=embeddings)
    retriever = store.as_retriever(search_kwargs={"k": 10})
    
    # Define the prompt template
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
    
    # Retrieve and format documents
    retrieved_docs = retriever.invoke("Extract all skills from the resume.")
    context = "\n\n".join(doc.page_content for doc in retrieved_docs)
    
    # Generate and parse response
    formatted_prompt = prompt.format(context=context)
    skills_raw = llm.invoke(formatted_prompt)
    
    # Clean up the response
    skills_json_str = skills_raw.strip()
    if not skills_json_str.startswith('{'):
        skills_json_str = skills_json_str[skills_json_str.find('{'):]
    if not skills_json_str.endswith('}'):
        skills_json_str = skills_json_str[:skills_json_str.rfind('}')+1]
    
    skills_json = json.loads(skills_json_str)
    
    # Clean up skills (remove duplicates and empty strings)
    skills_json["skills"] = list(set(filter(None, skills_json["skills"])))
    skills_json["skills"].sort()
    
    return skills_json["skills"]

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python resume_parser.py <pdf_path>")
        sys.exit(1)
    
    pdf_path = sys.argv[1]
    try:
        skills = parse_resume(pdf_path)
        print(json.dumps(skills))
    except Exception as e:
        print(f"Error: {str(e)}", file=sys.stderr)
        sys.exit(1) 