from flask import Blueprint, request, jsonify
from config import get_db_connection

users_bp = Blueprint("users", __name__)

# Signup User
@users_bp.route("/signupuser", methods=["POST"])
def signup_user():
    data = request.json
    username = data.get("name")  # Column is 'username' in DB
    email = data.get("email")
    password = data.get("password")

    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        # Check if user already exists
        cursor.execute("SELECT * FROM userdata WHERE email = %s", (email,))
        existing = cursor.fetchone()
        if existing:
            conn.close()
            return jsonify({"message": "User already exists"}), 400

        # Insert new user
        cursor.execute(
            "INSERT INTO userdata (username, email, password) VALUES (%s, %s, %s)",
            (username, email, password),
        )
        conn.commit()
        conn.close()

        return jsonify({"message": "User registered successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Login User
@users_bp.route("/loginuser", methods=["POST"])
def login_user():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        # Find user by email
        cursor.execute("SELECT * FROM userdata WHERE email = %s", (email,))
        user = cursor.fetchone()
        conn.close()

        if not user:
            return jsonify({"message": "User not found"}), 404
        if user["password"] != password:
            return jsonify({"message": "Incorrect password"}), 401

        return jsonify({"message": "Login successful", "user": user}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
