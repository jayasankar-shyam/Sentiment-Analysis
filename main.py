from fastapi import FastAPI,Request
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Enable CORS to allow the webpage to make requests to the FastAPI server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["POST"],
    allow_headers=["*"],
)
@app.post("/api/sentiment-analyser")
async def check_character_count(request: Request):
    data = await request.json()
    comment = data.get('comment', '')
    if len(comment) < 10:
        return {'result': 1}
    else:
        return {'result': 0}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
#python -m uvicorn main:app --reload

