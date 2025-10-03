from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
import os
from config import get_db_connection

products_bp = Blueprint("products", __name__)


# ✅ Add Product
@products_bp.route("/addproduct/<sellername>", methods=["POST"])
def add_product(sellername):
    try:
        productName = request.form.get("productName")
        category = request.form.get("category")
        description = request.form.get("description")
        price = request.form.get("price")
        file = request.files.get("image")

        if not all([productName, category, description, price, sellername, file]):
            return jsonify({"success": False, "message": "All fields including image are required"}), 400

        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        # Find seller
        cursor.execute("SELECT * FROM SellerData WHERE LOWER(name) = LOWER(%s)", (sellername,))
        seller = cursor.fetchone()
        if not seller:
            conn.close()
            return jsonify({"success": False, "message": "Seller not found"}), 404

        # Save image
        filename = secure_filename(file.filename)
        image_path = os.path.join(current_app.config["UPLOAD_FOLDER"], filename)
        file.save(image_path)
        relative_path = os.path.relpath(image_path, os.getcwd()).replace("\\", "/")

        # Insert product
        cursor.execute(
            """
            INSERT INTO ProductData (productName, category, sellerId, sellerName, description, price, imagePath)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            """,
            (productName, category, seller["id"], seller["name"], description, price, relative_path)
        )
        conn.commit()
        product_id = cursor.lastrowid
        conn.close()

        return jsonify({
            "success": True,
            "message": "Product added successfully",
            "product": {
                "id": product_id,
                "productName": productName,
                "sellerName": seller["name"],
                "imagePath": relative_path
            }
        }), 201
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


# ✅ Get All Products
@products_bp.route("/products", methods=["GET"])
def get_all_products():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM ProductData")
        products = cursor.fetchall()
        conn.close()
        return jsonify(products), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ✅ Get Product by ID
@products_bp.route("/products/<int:id>", methods=["GET"])
def get_product_by_id(id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM ProductData WHERE id = %s", (id,))
        product = cursor.fetchone()
        conn.close()
        if not product:
            return jsonify({"message": "Product not found"}), 404
        return jsonify(product), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ✅ Get Products by Seller
@products_bp.route("/seller/<sellerName>", methods=["GET"])
def get_products_by_seller(sellerName):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM ProductData WHERE sellerName = %s", (sellerName,))
        products = cursor.fetchall()
        conn.close()
        return jsonify(products), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ✅ Update Product Rating
@products_bp.route("/updaterating/<int:productId>", methods=["PUT"])
def update_product_rating(productId):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        # Calculate average rating from ReviewData (to be implemented later)
        cursor.execute("SELECT AVG(rating) as avgRating, COUNT(*) as reviewCount FROM ReviewData WHERE productId = %s", (productId,))
        review_stats = cursor.fetchone()

        avg_rating = round(review_stats["avgRating"], 1) if review_stats["avgRating"] else 0
        review_count = review_stats["reviewCount"]

        cursor.execute(
            "UPDATE ProductData SET avgRating = %s, reviewCount = %s WHERE id = %s",
            (avg_rating, review_count, productId)
        )
        conn.commit()

        cursor.execute("SELECT * FROM ProductData WHERE id = %s", (productId,))
        updated_product = cursor.fetchone()
        conn.close()

        return jsonify(updated_product), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500