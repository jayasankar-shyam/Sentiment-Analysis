import pickle
from flask import Flask, request, jsonify
from tensorflow.keras.models import load_model
from sklearn.feature_extraction.text import CountVectorizer
from flask_cors import CORS
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["http://192.168.0.170:5500", "https://jayasankar-shyam.github.io/Sentiment-Analysis", "https://comment-moderation.netlify.app"]}})
# Load the Keras model
model = load_model('k.h5')
# Load the CountVectorizer configuration
with open('countvectorizer_config.pkl', 'rb') as file:
    count_vectorizer_config = pickle.load(file)
count_vectorizer = CountVectorizer(**count_vectorizer_config)

@app.route('/', methods=['GET','POST'])
def predict():
    if request.method == "POST":
        # Get the comment from the request
        comment = request.json['comment']
        # Vectorize the comment
        comment_vector = count_vectorizer.transform([comment])
        # Make prediction using the loaded model
        prediction = model.predict(comment_vector)[0][0]
        # Return the result based on the prediction
        if prediction > 0.5:
            result = {'result': 0}
        else:
            result = {'result': 1}

        return jsonify(result)
    return "OK"
if __name__ == '__main__':
    app.run()
