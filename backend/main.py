from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# Get Mongo URI directly from env
uri = os.getenv("MONGO_URI")
print(f"[DEBUG] Using URI: {uri}")

# Connect to MongoDB
client = MongoClient(uri)
db = client["chatbotDB"]
users = db["users"]

@app.route('/')
def home():
    return "Backend is active"

@app.route('/ping', methods=['GET'])
def ping():
    return jsonify({"message": "pong"})

@app.route('/test-db')
def test_db():
    try:
        count = users.count_documents({})
        return jsonify({"message": f"Connected to MongoDB. Total users: {count}"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        print("Incoming registration request:", data)

        username = data["username"]
        password = data["password"]
        first_name = data["firstName"]
        last_name = data["lastName"]

        if users.find_one({"username": username}):
            return jsonify({"error": "User already exists"}), 400

        users.insert_one({
            "username": username,
            "password": password,
            "first_name": first_name,
            "last_name": last_name,
            "created_at": datetime.utcnow()
        })

        return jsonify({"message": "User registered successfully"}), 201

    except Exception as e:
        print("Registration error:", e)
        return jsonify({"error": str(e)}), 500
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get("username")
    hashed_password = data.get("password")

    user = users.find_one({"username": username})
    if not user:
        return jsonify({"error": "User not found"}), 404

    if user["password"] != hashed_password:
        return jsonify({"error": "Incorrect password"}), 401

    return jsonify({"message": "Login successful"}), 200


@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Not found"}), 404

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
