from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
import traceback
import secrets
import hashlib

# Load environment variables
load_dotenv()

# Initialize app
app = Flask(__name__)

# Simple CORS config - no session cookies needed
CORS(app, 
     origins=["http://localhost:3000", "http://127.0.0.1:3000"],
     allow_headers=["Content-Type", "Authorization"],
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])

# In-memory token storage (in production, use Redis or database)
active_tokens = {}

# Connect to MongoDB with better error handling
try:
    uri = os.getenv("MONGO_URI")
    print(f"[DEBUG] Connecting to MongoDB with URI: {uri[:20]}...")
    client = MongoClient(uri)
    client.admin.command('ping')
    db = client["chatbotDB"]
    users = db["users"]
    db_connected = True
    print("[DEBUG] MongoDB connection successful")
except Exception as e:
    print(f"[ERROR] MongoDB connection failed: {e}")
    client = None
    db = None
    users = None
    db_connected = False

def generate_token():
    """Generate a secure random token"""
    return secrets.token_urlsafe(32)

def get_user_from_token():
    """Extract user email from Authorization header token"""
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return None
    
    token = auth_header[7:]  # Remove 'Bearer ' prefix
    token_data = active_tokens.get(token)
    
    if not token_data:
        return None
    
    # Check if token is expired (1 hour)
    if datetime.utcnow() > token_data['expires']:
        del active_tokens[token]
        return None
    
    return token_data['email']

@app.before_request
def log_request_info():
    """Log request details for debugging"""
    print(f"[DEBUG] {request.method} {request.path}")
    
    # Log JSON data for non-OPTIONS requests
    if (request.method != "OPTIONS" and 
        request.content_type and 
        "application/json" in request.content_type and
        request.get_json(silent=True)):
        data = request.get_json().copy()
        if 'password' in data:
            data['password'] = '***HIDDEN***'
        print(f"[DEBUG] Request data: {data}")

@app.route('/')
def home():
    return "Backend is active (Token-based auth)"

@app.route('/register', methods=['POST', 'OPTIONS'])
def register():
    if request.method == 'OPTIONS':
        return '', 200
        
    if not db_connected:
        return jsonify({"error": "Database not available"}), 500

    try:
        if not request.is_json:
            return jsonify({"error": "Request must be JSON"}), 415

        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400

        print("[DEBUG] Registration attempt for user:", data.get("username", "unknown"))

        # Validate required fields
        required_fields = ["username", "password", "firstName", "lastName"]
        for field in required_fields:
            value = data.get(field, "")
            if not isinstance(value, str) or not value.strip():
                return jsonify({"error": f"Missing or invalid field: {field}"}), 400

        username = data["username"].strip()
        password = data["password"]
        first_name = data["firstName"].strip()
        last_name = data["lastName"].strip()

        # Check if user already exists
        existing_user = users.find_one({"username": username})
        if existing_user:
            print(f"[DEBUG] Registration failed: User {username} already exists")
            return jsonify({"error": "User already exists"}), 400

        # Insert new user
        user_doc = {
            "username": username,
            "password": password,  # In production, hash this!
            "first_name": first_name,
            "last_name": last_name,
            "created_at": datetime.utcnow(),
            "chats": []
        }

        result = users.insert_one(user_doc)
        print(f"[DEBUG] User registered successfully with ID: {result.inserted_id}")

        return jsonify({"message": "User registered successfully"}), 201

    except Exception as e:
        print(f"[ERROR] Registration error: {e}")
        print(f"[ERROR] Stack trace: {traceback.format_exc()}")
        return jsonify({"error": "Registration failed. Please try again."}), 500

@app.route('/login', methods=['POST', 'OPTIONS'])
def login():
    if request.method == 'OPTIONS':
        return '', 200
        
    if not db_connected:
        return jsonify({"error": "Database not available"}), 500
        
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400
            
        username = data.get("username", "").strip()
        password = data.get("password", "")
        
        if not username or not password:
            return jsonify({"error": "Username and password required"}), 400

        user = users.find_one({"username": username})
        if not user:
            print(f"[DEBUG] Login failed: User {username} not found")
            return jsonify({"error": "Invalid credentials"}), 401

        if user["password"] != password:
            print(f"[DEBUG] Login failed: Invalid password for {username}")
            return jsonify({"error": "Invalid credentials"}), 401

        # Generate token and store it
        token = generate_token()
        active_tokens[token] = {
            'email': username,
            'expires': datetime.utcnow() + timedelta(hours=1)
        }
        
        print(f"[DEBUG] Login successful for: {username}")
        print(f"[DEBUG] Generated token: {token[:10]}...")
        
        return jsonify({
            "message": "Login successful",
            "token": token,
            "user": {
                "username": user["username"],
                "first_name": user.get("first_name", ""),
                "last_name": user.get("last_name", "")
            }
        }), 200
        
    except Exception as e:
        print(f"[ERROR] Login error: {e}")
        return jsonify({"error": "Login failed. Please try again."}), 500

@app.route('/logout', methods=['POST'])
def logout():
    email = get_user_from_token()
    if email:
        # Remove token
        auth_header = request.headers.get('Authorization')
        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header[7:]
            if token in active_tokens:
                del active_tokens[token]
        print(f"[DEBUG] User {email} logged out")
    return jsonify({"message": "Logged out successfully"}), 200

@app.route('/current-user', methods=['GET'])
def current_user():
    email = get_user_from_token()
    print(f"[DEBUG] Current user check for email: {email}")
    
    if not email:
        print("[DEBUG] No valid token - returning 401")
        return jsonify({"error": "Not logged in"}), 401

    if not db_connected:
        return jsonify({"error": "Database not available"}), 500

    try:
        user = users.find_one({"username": email})
        if not user:
            print(f"[DEBUG] User {email} not found in database")
            return jsonify({"error": "User not found"}), 404

        print(f"[DEBUG] Current user found: {email}")
        return jsonify({
            "first_name": user.get("first_name", ""),
            "last_name": user.get("last_name", ""),
            "username": user.get("username", "")
        }), 200
        
    except Exception as e:
        print(f"[ERROR] Current user error: {e}")
        return jsonify({"error": "Failed to get user info"}), 500

@app.route('/api/chats/<username>', methods=['GET'])
def get_chats(username):
    # Verify the user is authenticated and requesting their own chats
    email = get_user_from_token()
    if not email or email != username:
        return jsonify({"error": "Unauthorized"}), 401
        
    if not db_connected:
        return jsonify({"error": "Database not available"}), 500
        
    try:
        user = users.find_one({"username": username})
        if not user:
            return jsonify([]), 200

        return jsonify(user.get("chats", [])), 200
    except Exception as e:
        print(f"[ERROR] Get chats error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/chats/<username>', methods=['POST'])
def save_chats(username):
    # Verify the user is authenticated and updating their own chats
    email = get_user_from_token()
    if not email or email != username:
        return jsonify({"error": "Unauthorized"}), 401
        
    if not db_connected:
        return jsonify({"error": "Database not available"}), 500
        
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400
            
        chat_data = data.get("chats", [])
        
        result = users.update_one(
            {"username": username},
            {"$set": {"chats": chat_data, "updated_at": datetime.utcnow()}}
        )
        
        if result.matched_count == 0:
            return jsonify({"error": "User not found"}), 404
            
        return jsonify({"message": "Chats saved successfully"}), 200
    except Exception as e:
        print(f"[ERROR] Save chats error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/update-profile', methods=['PUT'])
def update_profile():
    """Update user's first and last name"""
    email = get_user_from_token()
    if not email:
        return jsonify({"error": "Not logged in"}), 401
        
    if not db_connected:
        return jsonify({"error": "Database not available"}), 500
        
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400

        first_name = data.get("first_name", "").strip()
        last_name = data.get("last_name", "").strip()

        if not first_name or not last_name:
            return jsonify({"error": "First name and last name are required"}), 400

        print(f"[DEBUG] Updating profile for {email}: {first_name} {last_name}")

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
        print(f"[ERROR] Profile update error: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("[DEBUG] Starting Flask application with token-based auth...")
    if db_connected:
        try:
            client.admin.command('ping')
            print("[DEBUG] Database connected: Yes (ping successful)")
        except Exception as e:
            print(f"[DEBUG] Database connected: No ({e})")
    else:
        print("[DEBUG] Database connected: No (initial connection failed)")
    app.run(host='0.0.0.0', port=5000, debug=True)