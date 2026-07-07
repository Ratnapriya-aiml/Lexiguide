import requests
import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

API_TOKEN = "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"
MODEL_URL = "https://router.huggingface.co/v1/chat/completions"

# --- TEMPORARY STORAGE ---
# This list holds your data in RAM as long as the script runs
roadmap_history = [] 

class LegalRequest(BaseModel):
    prompt: str
    system_prompt: str

@app.get("/")
def health():
    return {"status": "JurisEase Backend is LIVE", "history_count": len(roadmap_history)}

@app.get("/favicon.ico", include_in_schema=False)
async def favicon():
    return JSONResponse(content={})

# New endpoint to fetch the archive
@app.get("/archive")
async def get_archive():
    return {"history": roadmap_history}

@app.post("/generate")
async def generate(request: LegalRequest):
    headers = {"Authorization": f"Bearer {API_TOKEN}", "Content-Type": "application/json"}
    payload = {
        "model": "Qwen/Qwen2.5-7B-Instruct",
        "messages": [
            {"role": "system", "content": request.system_prompt},
            {"role": "user", "content": request.prompt}
        ],
        "temperature": 0.7,
        "max_tokens": 1000
    }
    try:
        response = requests.post(MODEL_URL, json=payload, headers=headers, timeout=60)
        data = response.json()
        
        # Store result in temporary backend history
        if "choices" in data:
            roadmap_history.append({
                "query": request.prompt,
                "result": data["choices"][0]["message"]["content"]
            })
            
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)