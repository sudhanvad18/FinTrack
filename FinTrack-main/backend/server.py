from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from gemini import generate_answer 

app = FastAPI()

# ✅ Allow requests from your frontend URL
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://fintrack-flax.vercel.app",  # Vercel deployment URL
        "http://localhost:5173",  # Vite default port
        "http://127.0.0.1:5173",   # Some systems resolve as 127.0.0.1 instead
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class StrategyRequest(BaseModel):
    user_input: str

@app.post("/generate-strategy")
async def generate_strategy(request: StrategyRequest):
    try:
        response = generate_answer(request.user_input)
        return {"strategy_code": response}
    except Exception as e:
        return {"error": str(e)}
