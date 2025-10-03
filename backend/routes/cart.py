from flask import Blueprint, request, jsonify
import mysql.connector
import traceback
import datetime

cart_bp = Blueprint("cart", __name__)

# Database connection
def get_db():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="Dinesh@2301",
        database="Handscape",
        port=9000
    )

# ✅ Get Cart
@cart_bp.route("/cart/<string:username>", methods=["GET"])
def get_cart(username):
    try:
        db = get_db()
        cursor = db.cursor(dictionary=True)

        # Find user
        cursor.execute("SELECT id FROM UserData WHERE username=%s", (username,))
        user = cursor.fetchone()
        if not user:
            return jsonify({"error": "User not found"}), 404

        userId = user["id"]

        # Get or create cart
        cursor.execute("SELECT * FROM ShoppingCart WHERE userId=%s", (userId,))
        cart = cursor.fetchone()

        if not cart:
            cursor.execute("INSERT INTO ShoppingCart (userId, totalAmount) VALUES (%s, %s)", (userId, 0))
            db.commit()
            cursor.execute("SELECT * FROM ShoppingCart WHERE userId=%s", (userId,))
            cart = cursor.fetchone()

        # Fetch items
        cursor.execute("""
            SELECT ci.id, ci.productId, p.productName, p.price, ci.quantity
            FROM CartItems ci
            JOIN ProductData p ON ci.productId = p.id
            WHERE ci.cartId=%s
        """, (cart["id"],))
        items = cursor.fetchall()

        cursor.close()
        db.close()

        return jsonify({
            "cartId": cart["id"],
            "userId": cart["userId"],
            "totalAmount": float(cart["totalAmount"]),
            "lastUpdated": cart["lastUpdated"],
            "items": items
        }), 200

    except Exception as e:
        return jsonify({"error": "Internal server error", "details": str(e)}), 500


# ✅ Add to Cart
@cart_bp.route("/cart/add", methods=["POST"])
def add_to_cart():
    try:
        data = request.get_json()
        productId = data.get("productId")
        quantity = data.get("quantity", 1)
        username = data.get("username")

        if not username or not productId:
            return jsonify({"success": False, "message": "Username and product ID are required"}), 400

        db = get_db()
        cursor = db.cursor(dictionary=True)

        cursor.execute("SELECT id FROM UserData WHERE username=%s", (username,))
        user = cursor.fetchone()
        if not user:
            return jsonify({"success": False, "message": "User not found"}), 404
        userId = user["id"]

        cursor.execute("SELECT id FROM ProductData WHERE id=%s", (productId,))
        product = cursor.fetchone()
        if not product:
            return jsonify({"success": False, "message": "Product not found"}), 404

        cursor.execute("SELECT * FROM ShoppingCart WHERE userId=%s", (userId,))
        cart = cursor.fetchone()
        if not cart:
            cursor.execute(
                "INSERT INTO ShoppingCart (userId, totalAmount) VALUES (%s, %s)", 
                (userId, 0)
            )
            db.commit()
            cursor.execute("SELECT * FROM ShoppingCart WHERE userId=%s", (userId,))
            cart = cursor.fetchone()

        cartId = cart["id"]

        cursor.execute(
            "SELECT quantity FROM CartItems WHERE cartId=%s AND productId=%s",
            (cartId, productId)
        )
        existingItem = cursor.fetchone()

        if existingItem:
            cursor.execute(
                "UPDATE CartItems SET quantity = quantity + %s WHERE cartId=%s AND productId=%s",
                (quantity, cartId, productId)
            )
        else:
            cursor.execute(
                "INSERT INTO CartItems (cartId, productId, quantity) VALUES (%s, %s, %s)",
                (cartId, productId, quantity)
            )

        cursor.execute("""
            SELECT SUM(p.price * ci.quantity) AS total
            FROM CartItems ci
            JOIN ProductData p ON ci.productId = p.id
            WHERE ci.cartId=%s
        """, (cartId,))
        total = cursor.fetchone()["total"] or 0

        cursor.execute(
            "UPDATE ShoppingCart SET totalAmount=%s, lastUpdated=%s WHERE id=%s",
            (total, datetime.datetime.now(), cartId)
        )

        db.commit()
        cursor.close()
        db.close()

        return jsonify({"success": True, "message": "Product added to cart"}), 200

    except Exception as e:
        traceback.print_exc()  # <-- This will print the full error in Flask console
        return jsonify({"success": False, "message": "Server error while adding to cart", "details": str(e)}), 500


# ✅ Remove from Cart
@cart_bp.route("/cart/remove/<int:productId>", methods=["DELETE"])
def remove_from_cart(productId):
    try:
        data = request.get_json()
        username = data.get("username")

        if not username:
            return jsonify({"error": "Username is required"}), 400

        db = get_db()
        cursor = db.cursor(dictionary=True)

        # Find user
        cursor.execute("SELECT id FROM UserData WHERE username=%s", (username,))
        user = cursor.fetchone()
        if not user:
            return jsonify({"error": "User not found"}), 404
        userId = user["id"]

        # Get cart
        cursor.execute("SELECT * FROM ShoppingCart WHERE userId=%s", (userId,))
        cart = cursor.fetchone()
        if not cart:
            return jsonify({"error": "Cart not found"}), 404

        # Remove item
        cursor.execute("DELETE FROM CartItems WHERE cartId=%s AND productId=%s", (cart["id"], productId))

        # Recalculate total
        cursor.execute("""
            SELECT SUM(p.price * ci.quantity) as total
            FROM CartItems ci
            JOIN ProductData p ON ci.productId = p.id
            WHERE ci.cartId=%s
        """, (cart["id"],))
        total = cursor.fetchone()["total"] or 0

        cursor.execute("UPDATE ShoppingCart SET totalAmount=%s, lastUpdated=%s WHERE id=%s",
                       (total, datetime.datetime.now(), cart["id"]))

        db.commit()
        cursor.close()
        db.close()

        return jsonify({"message": "Product removed from cart"}), 200

    except Exception as e:
        return jsonify({"error": "Server error while removing from cart", "details": str(e)}), 500
