import os
import fitz  # PyMuPDF
import requests
import chromadb
from sentence_transformers import SentenceTransformer
from typing import List, Dict
import re
from pathlib import Path
    
print("1...")

class PDFRAGSystem:
    def __init__(self, pdf_directory: str, ollama_model: str = "llama3.1", collection_name: str = "school_docs"):
        self.pdf_directory = pdf_directory
        self.ollama_model = ollama_model
        self.collection_name = collection_name
        
        # Initialize ChromaDB (local vector database)
        self.chroma_client = chromadb.PersistentClient(path="./chroma_db")
        
        # Initialize sentence transformer for embeddings
        self.embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
        
        # Create or get collection
        try:
            self.collection = self.chroma_client.create_collection(
                name=collection_name,
                metadata={"description": "School PDFs for RAG system"}
            )
        except Exception:
            # Collection already exists
            self.collection = self.chroma_client.get_collection(name=collection_name)
    
    def pdf_to_text(self, pdf_path: str) -> str:
        """Extract text from PDF using PyMuPDF"""

        try:
            doc = fitz.open(pdf_path)
            text = ""
            for page in doc:
                text += page.get_text()
            doc.close()
            return text
        except Exception as e:
            print(f"Error reading PDF {pdf_path}: {e}")
            return ""
    
    def chunk_text(self, text: str, chunk_size: int = 500, overlap: int = 50) -> List[str]:
        """Split text into overlapping chunks"""
        # Clean text
        text = re.sub(r'\s+', ' ', text.strip())
        
        # Split into sentences roughly
        sentences = re.split(r'[.!?]+', text)
        
        chunks = []
        current_chunk = ""
        
        for sentence in sentences:
            sentence = sentence.strip()
            if not sentence:
                continue
                
            # If adding this sentence would exceed chunk_size, save current chunk
            if len(current_chunk) + len(sentence) > chunk_size and current_chunk:
                chunks.append(current_chunk.strip())
                # Start new chunk with overlap
                words = current_chunk.split()
                overlap_words = words[-overlap:] if len(words) > overlap else words
                current_chunk = ' '.join(overlap_words) + ' ' + sentence
            else:
                current_chunk += ' ' + sentence
        
        # Add the last chunk
        if current_chunk.strip():
            chunks.append(current_chunk.strip())
        
        return chunks
    
    def process_pdfs(self):
        """Process all PDFs in the directory and store in vector database"""
        pdf_files = list(Path(self.pdf_directory).glob("*.pdf"))
        
        if not pdf_files:
            print(f"No PDF files found in {self.pdf_directory}")
            return
        
        print(f"Processing {len(pdf_files)} PDF files...")
        
        all_chunks = []
        all_metadata = []
        all_ids = []
        
        for pdf_file in pdf_files:
            print(f"Processing: {pdf_file.name}")
            
            # Extract text
            text = self.pdf_to_text(str(pdf_file))
            if not text.strip():
                print(f"No text extracted from {pdf_file.name}")
                continue
            
            # Chunk text
            chunks = self.chunk_text(text)
            
            # Prepare data for vector database
            for i, chunk in enumerate(chunks):
                chunk_id = f"{pdf_file.stem}_chunk_{i}"
                all_chunks.append(chunk)
                all_metadata.append({
                    "source": pdf_file.name,
                    "chunk_id": i,
                    "content": chunk[:100] + "..." if len(chunk) > 100 else chunk
                })
                all_ids.append(chunk_id)
        
        if all_chunks:
            # Generate embeddings
            print("Generating embeddings...")
            embeddings = self.embedding_model.encode(all_chunks).tolist()
            
            # Store in ChromaDB
            print("Storing in vector database...")
            self.collection.add(
                embeddings=embeddings,
                documents=all_chunks,
                metadatas=all_metadata,
                ids=all_ids
            )
            
            print(f"Successfully processed and stored {len(all_chunks)} chunks from {len(pdf_files)} PDFs")
        else:
            print("No content was extracted from the PDFs")
    
    def search_documents(self, query: str, n_results: int = 5) -> List[Dict]:
        """Search for relevant document chunks"""
        # Generate query embedding
        query_embedding = self.embedding_model.encode([query]).tolist()
        
        # Search in ChromaDB
        results = self.collection.query(
            query_embeddings=query_embedding,
            n_results=n_results
        )
        
        # Format results
        relevant_docs = []
        for i in range(len(results['documents'][0])):
            relevant_docs.append({
                'content': results['documents'][0][i],
                'metadata': results['metadatas'][0][i],
                'distance': results['distances'][0][i]
            })
        
        return relevant_docs
    
    def call_ollama(self, prompt: str) -> str:
        """Call Ollama API"""
        url = "http://localhost:11434/api/generate"
        
        payload = {
            "model": self.ollama_model,
            "prompt": prompt,
            "stream": False
        }
        
        try:
            response = requests.post(url, json=payload)
            if response.status_code == 200:
                return response.json()['response']
            else:
                return f"Error calling Ollama: {response.status_code}"
        except Exception as e:
            return f"Error connecting to Ollama: {e}"
    
    def generate_response(self, user_question: str) -> str:
        """Generate response using RAG approach"""
        # Search for relevant documents
        relevant_docs = self.search_documents(user_question, n_results=3)
        
        if not relevant_docs:
            return "I don't have information about that topic in the provided documents."
        
        # Create context from relevant documents
        context = "\n\n".join([doc['content'] for doc in relevant_docs])
        
        # Create prompt for Ollama
        prompt = f"""You are an AI assistant that can only answer questions based on the provided school documents. 

You are an AI assistant trained to answer questions using official Penn High School documents.

IMPORTANT RULES:
1. Only answer questions using information from the school documents below
2. If the information is not found, say: "I don't have information about that in the provided documents"
3. You may explain concepts in simple terms, but do not use outside sources to answer questions directly
4. Keep answers concise, friendly, and easy to understand
5. Organize your answer in bullet points or short paragraphs when helpful
6. If the question is unclear, ask the user to clarify
7. Do not use profanity, personal opinions, or political/controversial topics
8. Match the tone of a professional but helpful school guide


Context from school documents:
{context}

Question: {user_question}

Answer based only on the provided context:"""
        
        # Get response from Ollama
        response = self.call_ollama(prompt)
        
        return response
    
    def chat_loop(self):
        """Interactive chat loop"""
        print("PDF RAG System initialized!")
        print("Ask questions about the school documents. Type 'quit' to exit.")
        print("-" * 50)
        
        while True:
            user_input = input("\nYour question: ").strip()
            
            if user_input.lower() in ['quit', 'exit', 'q']:
                print("Goodbye!")
                break
            
            if not user_input:
                continue
            
            print("\nThinking...")
            response = self.generate_response(user_input)
            print(f"\nAnswer: {response}")
    
    def get_collection_info(self):
        """Get information about the current collection"""
        try:
            count = self.collection.count()
            print(f"Collection '{self.collection_name}' contains {count} document chunks")
            return count
        except Exception as e:
            print(f"Error getting collection info: {e}")
            return 0


print("Running script...")

def main():
    print("Inside main()")

    PDF_DIRECTORY = r"C:\Users\nsluser\Desktop\Penn Chatbot\backend\school_pdfs"  
    OLLAMA_MODEL = "llama3.1"

    os.makedirs(PDF_DIRECTORY, exist_ok=True)
    print("PDF directory checked")

    rag_system = PDFRAGSystem(
        pdf_directory=PDF_DIRECTORY,
        ollama_model=OLLAMA_MODEL
    )

    print("System initialized")

    existing_count = rag_system.get_collection_info()

    if existing_count == 0:
        print("No documents found, processing PDFs...")
        rag_system.process_pdfs()
    else:
        print(f"Found {existing_count} document chunks.")
        reprocess = input("Reprocess PDFs? (y/n): ").lower().strip()
        if reprocess == 'y':
            rag_system.chroma_client.delete_collection(rag_system.collection_name)
            rag_system.collection = rag_system.chroma_client.create_collection(
                name=rag_system.collection_name,
                metadata={"description": "School PDFs for RAG system"}
            )
            rag_system.process_pdfs()

    rag_system.chat_loop()

if __name__ == "__main__":
    print("Executing as main")
    main()

print("280")

if __name__ == "__main__":
    main()