import importlib
import sys

def check_package(package_name):
    try:
        importlib.import_module(package_name)
        print(f"✅ {package_name} is installed")
        return True
    except ImportError:
        print(f"❌ {package_name} is NOT installed")
        return False

# List of packages to check
packages = [
    'langchain_ollama',
    'langchain',
    'langchain_community',
    'pypdf',
    'docarray'
]

# Check each package
all_installed = all(check_package(package) for package in packages)

# Check Ollama models
try:
    from langchain_ollama import OllamaLLM, OllamaEmbeddings
    
    # Try to initialize the models
    llm = OllamaLLM(model='llama2')
    embeddings = OllamaEmbeddings(model='nomic-embed-text')
    
    # Test LLM
    test_response = llm.invoke("Say 'test successful'")
    print("\n✅ LLaMA 2 model is working")
    
    # Test embeddings
    test_embedding = embeddings.embed_query("test")
    print("✅ nomic-embed-text model is working")
    
except Exception as e:
    print(f"\n❌ Error testing Ollama models: {str(e)}")
    all_installed = False

print("\nOverall status:", "✅ All components are installed and working" if all_installed else "❌ Some components are missing or not working") 