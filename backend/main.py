from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from datetime import datetime
import os

app = Flask(__name__)
CORS(app)

MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)
db = client["chatbotDB"]
users = db["users"]

@app.route('/')
def home():
    return "Backend is live!"

@app.route('/ping', methods=['GET'])
def ping():
    return jsonify({"message": "pong"})

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    hashed_password = data.get('password')

    if users.find_one({"username": username}):
        return jsonify({"error": "User already exists"}), 400

    users.insert_one({
        "username": username,
        "password": hashed_password,
        "created_at": datetime.utcnow()
    })
    return jsonify({"message": "User registered successfully"}), 201

@app.route('/nlp', methods=['POST'])
def nlp_processing():
    data = request.json
    text = data.get('text')
    return jsonify({"result": "NLP output placeholder"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
