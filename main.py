from fastapi import FastAPI,Request
from fastapi.middleware.cors import CORSMiddleware
import pickle
import keras
import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
# Load the configurations from the file
with open('countvectorizer_config.pkl', 'rb') as f:
    configurations = pickle.load(f)

# Create a new CountVectorizer object with the saved configurations
vectorizer = CountVectorizer(vocabulary=configurations['vocabulary'],
                             stop_words=configurations['stop_words'],
                             binary=configurations['binary'])
model = keras.models.load_model("k.h5")
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
    comment = pd.Series(comment)
    comment = vectorizer.transform(comment)
    p=model.predict(comment)
    if p[0] > 0.5:
        return {'result': 0}
    else:
        return {'result': 1}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
#cd D:/coding/sentiment-analysis && python -m uvicorn main:app --reload

