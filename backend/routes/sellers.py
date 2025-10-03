from flask import Blueprint, request, jsonify
from config import get_db_connection

sellers_bp = Blueprint("sellers", __name__, url_prefix="/")


# ✅ Seller Signup
@sellers_bp.route("/signupseller", methods=["POST"])
def seller_signup():
    data = request.json
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    shopName = data.get("shopName")
    address = data.get("address")
    category = data.get("category")
    upiId = data.get("upiId")
    contact = data.get("contact")

    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        # Check if seller already exists
        cursor.execute("SELECT * FROM SellerData WHERE email = %s", (email,))
        existing = cursor.fetchone()
        if existing:
            conn.close()
            return jsonify({"message": "Seller already exists"}), 400

        # Insert new seller
        cursor.execute(
            """
            INSERT INTO SellerData (name, email, password, shopName, address, category, upiId, contact)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """,
            (name, email, password, shopName, address, category, upiId, contact),
        )
        conn.commit()

        seller_id = cursor.lastrowid
        conn.close()

        return jsonify({
            "message": "Seller registered successfully",
            "seller": {
                "id": seller_id,
                "name": name,
                "email": email,
                "shopName": shopName
            }
        }), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ✅ Seller Login
@sellers_bp.route("/loginseller", methods=["POST"])
def seller_login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        # Check seller
        cursor.execute("SELECT * FROM SellerData WHERE email = %s", (email,))
        seller = cursor.fetchone()
        conn.close()

        if not seller:
            return jsonify({"message": "Seller not found"}), 404
        if seller["password"] != password:
            return jsonify({"message": "Incorrect password"}), 401

        return jsonify({
            "message": "Login successful",
            "seller": {
                "id": seller["id"],
                "name": seller["name"],
                "email": seller["email"],
                "shopName": seller["shopName"]
            }
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500