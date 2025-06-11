from flask import Flask, request, jsonify, session
from flask_cors import CORS
from pymongo import MongoClient
from datetime import datetime
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize app
app = Flask(__name__)
app.secret_key = os.getenv("SECRET_KEY", "default_secret_key")

# CORS config to allow cookies from React frontend
CORS(app, supports_credentials=True, origins=["http://localhost:3000"])

# Session cookie configuration for development
app.config.update(
    SESSION_COOKIE_SAMESITE="Lax",   # For dev, Lax is safest cross-origin option
    SESSION_COOKIE_SECURE=False      # Use True only if using HTTPS
)

# Connect to MongoDB
uri = os.getenv("MONGO_URI")
print(f"[DEBUG] Using URI: {uri}")
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
        print("[DEBUG] Incoming registration request:", data)

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
        print("[DEBUG] Registration error:", e)
        return jsonify({"error": str(e)}), 500

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get("username")
    password = data.get("password")

    user = users.find_one({"username": username})
    if not user:
        return jsonify({"error": "User not found"}), 404

    if user["password"] != password:
        return jsonify({"error": "Incorrect password"}), 401

    session["user_email"] = username  # Store in session cookie
    print(f"[DEBUG] Logged in as: {username}")
    return jsonify({"message": "Login successful"}), 200

@app.route('/logout', methods=['POST'])
def logout():
    session.clear()
    print("[DEBUG] User logged out")
    return jsonify({"message": "Logged out"}), 200

@app.route('/current-user', methods=['GET'])
def current_user():
    print("[DEBUG] Session contents:", dict(session))  # Debug session

    email = session.get("user_email")
    if not email:
        return jsonify({"error": "Not logged in"}), 401

    user = users.find_one({"username": email})
    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify({
        "first_name": user.get("first_name", ""),
        "last_name": user.get("last_name", ""),
        "username": user.get("username", "")
    })

@app.route('/api/chats/<username>', methods=['GET'])
def get_chats(username):
    try:
        user = users.find_one({"username": username})
        if not user:
            return jsonify([])

        return jsonify(user.get("chats", [])), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/chats/<username>', methods=['POST'])
def save_chats(username):
    try:
        data = request.get_json()
        chat_data = data.get("chats", [])
        users.update_one(
            {"username": username},
            {"$set": {"chats": chat_data}}
        )
        return jsonify({"message": "Chats saved"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/update-profile', methods=['PUT'])
def update_profile():
    """Update user's first and last name"""
    try:
        # Check if user is logged in
        email = session.get("user_email")
        if not email:
            return jsonify({"error": "Not logged in"}), 401

        # Get the data from request
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400

        first_name = data.get("first_name", "").strip()
        last_name = data.get("last_name", "").strip()

        # Validate input
        if not first_name or not last_name:
            return jsonify({"error": "First name and last name are required"}), 400

        print(f"[DEBUG] Updating profile for {email}: {first_name} {last_name}")

        # Update the user in database
        result = users.update_one(
            {"username": email},
            {"$set": {
                "first_name": first_name, 
                "last_name": last_name,
                "updated_at": datetime.utcnow()
            }}
        )

        if result.matched_count == 0:
            return jsonify({"error": "User not found"}), 404

        if result.modified_count == 0:
            return jsonify({"message": "No changes were made"}), 200

        print(f"[DEBUG] Profile updated successfully for {email}")
        return jsonify({"message": "Profile updated successfully"}), 200

    except Exception as e:
        print(f"[DEBUG] Profile update error: {e}")
        return jsonify({"error": str(e)}), 500

# Alternative route that matches the original function name
@app.route('/change-names', methods=['PUT'])
def change_names():
    """Alternative endpoint for updating names (redirects to update_profile)"""
    return update_profile()

@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Not found"}), 404

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)