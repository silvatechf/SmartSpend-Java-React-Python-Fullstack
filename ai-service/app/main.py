from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .ai_logic import analyze_receipt_with_llm, AiAnalysisResponse
from PIL import Image
import io
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="SmartSpend AI Service",
    description="Multimodal API for receipt parsing and financial analysis."
)

# Configuração CORS - Importante para o Frontend (FE) e o Backend (BE)
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")
BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:8080")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL, BACKEND_URL], # Permite FE e BE acessarem
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def health_check():
    return {"status": "AI Service is running", "model": "Llama 3.1"}


@app.post("/analyze-receipt", response_model=AiAnalysisResponse)
async def analyze_receipt_endpoint(file: UploadFile = File(...)):
    """
    Receives an image (JPEG, PNG) or PDF and uses LLM for multimodal analysis 
    to extract transaction data and generate a summary.
    """
    # 1. Validação do Tipo de Arquivo
    if not file.content_type.startswith("image/") and file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Invalid file type. Must be image or PDF.")

    # 2. Processa o arquivo (para imagens)
    try:
        # Lê o arquivo binário
        file_data = await file.read()
        
        # A LangChain/Groq API tipicamente requer a imagem em Base64 ou um objeto Image.
        # Abrimos a imagem usando PIL
        image = Image.open(io.BytesIO(file_data))
        
        # 3. Chama a lógica de IA multimodal (ai_logic.py)
        analysis_result = await analyze_receipt_with_llm(image)

        return analysis_result 

    except Exception as e:
        print(f"AI Service Error: {e}")
        # Retorna um erro 500 para o Frontend
        raise HTTPException(status_code=500, detail=f"Error during AI processing: {e}")