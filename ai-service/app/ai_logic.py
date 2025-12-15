import os
import json
from groq import Groq
from PIL import Image
from io import BytesIO
from base64 import b64encode
from pydantic import BaseModel
from typing import List

# --- Pydantic Schemas for Structured Output ---

# Defines the structure of a single item extracted from the receipt
class TransactionItem(BaseModel):
    description: str
    amount: float
    category: str
    
# Defines the complete response structure from the AI
class AiAnalysisResponse(BaseModel):
    items: List[TransactionItem]
    # The intelligent analysis (e.g., "You spent 30% more on groceries this month...")
    monthly_summary_text: str
    # Flag to determine the language for the summary text
    language_code: str # e.g., "en" (English) or "es" (Spanish)

# --- Groq Client Initialization ---

# Reads API key from the .env file
client = Groq(api_key=os.getenv("GROQ_API_KEY")) 

# --- JSON Schema Definition for LLM Constraint ---

# This schema forces the LLM to return a valid JSON structure matching AiAnalysisResponse
RECEIPT_SCHEMA = {
    "type": "object",
    "properties": {
        "items": {
            "type": "array",
            "description": "List of individual items and their prices extracted from the receipt.",
            "items": {
                "type": "object",
                "properties": {
                    "description": {"type": "string"},
                    "amount": {"type": "number"},
                    "category": {"type": "string", "description": "e.g., Groceries, Transport, Office Supplies"},
                },
                "required": ["description", "amount", "category"]
            }
        },
        "monthly_summary_text": {
            "type": "string",
            "description": (
                "Intelligent, friendly, and professional analysis of the user's spending habits observed from this receipt. "
                "The analysis must be provided in either English or Spanish based on the 'language_code' field."
            )
        },
        "language_code": {
             "type": "string",
             "description": "Must be 'en' for English or 'es' for Spanish. Choose one based on context/user preference."
        }
    },
    "required": ["items", "monthly_summary_text", "language_code"]
}

# --- Core Multimodal Analysis Function ---

async def analyze_receipt_with_llm(image: Image.Image) -> AiAnalysisResponse:
    """
    Performs multimodal analysis on the image using Groq API.
    """
    # Convert image to Base64 format for API transmission
    buffered = BytesIO()
    image.save(buffered, format="JPEG")
    img_b64 = b64encode(buffered.getvalue()).decode("utf-8")
    
    # Define the multimodal prompt (text instructions + image data)
    prompt_content = [
        {
            "type": "text",
            "text": (
                "Analyze the provided receipt image. Extract all individual line items, their specific prices, and categorize them "
                "from a business or personal finance perspective (e.g., 'Groceries', 'Transport', 'Software License'). "
                "Crucially, provide an intelligent summary of this spending activity. "
                "If the items are few, generate the summary in English ('en'). If the items are many or complex, generate the summary in Spanish ('es')."
            )
        },
        {
            "type": "image_url",
            "image_url": {
                "url": f"data:image/jpeg;base64,{img_b64}"
            }
        }
    ]

    try:
        # Call the LLM API, forcing JSON output
        completion = client.chat.completions.create(
            model="llama-3.1-70b-versatile", # Highly capable multimodal model
            messages=[{"role": "user", "content": prompt_content}],
            response_format={"type": "json_object", "schema": RECEIPT_SCHEMA}
        )

        # Parse the JSON string output into the Pydantic model
        json_output = json.loads(completion.choices[0].message.content)
        
        # Validation and coercion into the final response model
        return AiAnalysisResponse(**json_output)
        
    except Exception as e:
        print(f"Error during LLM call or JSON parsing: {e}")
        # Throw a specific error for the main FastAPI endpoint
        raise ValueError("AI failed to process the request or return valid JSON. Check API key and model response.")