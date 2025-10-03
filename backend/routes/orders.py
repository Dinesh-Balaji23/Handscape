from flask import Blueprint, request, jsonify, make_response
from config import get_db_connection
import razorpay
import secrets
import datetime
import traceback

orders_bp = Blueprint("orders", __name__)

razorpay_client = razorpay.Client(auth=(
    "rzp_test_8qY0PPemsA7yUW",
    "Fd5kXuZlWGH1Wzp2PzOJEh0w"
))

def serialize_order(order_row):
    if not order_row:
        return {}
    return {
        k: (float(v) if isinstance(v, (int, float)) else v.isoformat() if isinstance(v, datetime.datetime) else v)
        for k, v in order_row.items()
    }

def serialize_items(items_rows):
    return [
        {k: (float(v) if isinstance(v, (int, float)) else v.isoformat() if isinstance(v, datetime.datetime) else v)
         for k, v in item.items()}
        for item in items_rows
    ]

@orders_bp.route("/orders", methods=["POST"])
def createOrder():
    try:
        data = request.get_json()
        userName = data.get("userName")
        paymentId = data.get("paymentId")
        razorpayOrderId = data.get("razorpayOrderId")
        cartItems = data.get("cartItems", [])
        totalAmount = data.get("totalAmount")
        status = data.get("status", "Pending")

        if not userName or not cartItems or totalAmount is None:
            return jsonify({"error": "userName, cartItems, and totalAmount are required"}), 400

        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        # Get numeric userId
        cursor.execute("SELECT id FROM UserData WHERE username = %s", (userName,))
        user_row = cursor.fetchone()
        if not user_row:
            return jsonify({"error": "User not found"}), 404
        userId = user_row["id"]

        # Dates
        bookingDate = datetime.datetime.now()
        estimatedDelivery = bookingDate + datetime.timedelta(days=7)

        # Seller info from first product
        sellerId = None
        sellerName = None
        if cartItems:
            first_item = cartItems[0].get("productId", {})
            pid = first_item.get("_id") or first_item.get("id") if isinstance(first_item, dict) else str(first_item)
            cursor.execute("SELECT sellerId, sellerName FROM ProductData WHERE id = %s", (pid,))
            prod_row = cursor.fetchone()
            if prod_row:
                sellerId = prod_row.get("sellerId")
                sellerName = prod_row.get("sellerName")
            if not sellerId or not sellerName:
                return jsonify({"error": f"Seller info not found for product {pid}"}), 400

        # Insert order
        cursor.execute("""
            INSERT INTO OrderData
            (userId, userName, sellerId, sellerName, bookingDate, estimatedDelivery, status, totalAmount, paymentId, razorpayOrderId)
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
        """, (userId, userName, sellerId, sellerName, bookingDate, estimatedDelivery, status, totalAmount, paymentId, razorpayOrderId))
        conn.commit()
        order_id = cursor.lastrowid

        # Insert items
        # Insert items
        for item in cartItems:
            product_id = item.get("productId")  # this might be just the ID
            quantity = item.get("quantity", 1)

            # Fetch product details from ProductData
            cursor.execute("SELECT productName, imagePath, price FROM ProductData WHERE id = %s", (product_id,))
            product = cursor.fetchone()
            if not product:
                continue

            productName = product.get("productName")
            productImage = product.get("imagePath")
            price = product.get("price")

            cursor.execute("""
                INSERT INTO OrderItems (orderId, productId, productName, productImage, price, quantity)
                VALUES (%s,%s,%s,%s,%s,%s)
            """, (order_id, product_id, productName, productImage, price, quantity))

        conn.commit()

        # Fetch order and items
        cursor.execute("SELECT * FROM OrderData WHERE id = %s", (order_id,))
        order_row = cursor.fetchone()
        cursor.execute("SELECT * FROM OrderItems WHERE orderId = %s", (order_id,))
        items_rows = cursor.fetchall()

        # Clear shopping cart
        cursor.execute("SELECT id FROM ShoppingCart WHERE userId = %s", (userId,))
        cart_row = cursor.fetchone()
        if cart_row:
            cart_id = cart_row["id"]
            cursor.execute("DELETE FROM CartItems WHERE cartId = %s", (cart_id,))
            cursor.execute("UPDATE ShoppingCart SET totalAmount = 0 WHERE id = %s", (cart_id,))
            conn.commit()

        cursor.close()
        conn.close()

        return jsonify({
            "order": {**serialize_order(order_row), "items": serialize_items(items_rows)}
        }), 201

    except Exception as e:
        traceback.print_exc()

@orders_bp.route("/user-orders/<string:username>", methods=["GET"])
def getUserOrders(username):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        # Get userId from username
        cursor.execute("SELECT id FROM UserData WHERE username = %s", (username,))
        user_row = cursor.fetchone()
        user_id = user_row["id"] if user_row else None

        # Fetch orders for this user
        cursor.execute(
            "SELECT * FROM OrderData WHERE userId = %s OR userName = %s ORDER BY bookingDate DESC",
            (user_id, username)
        )
        orders = cursor.fetchall()

        # Attach items for each order
        for order in orders:
            cursor.execute("SELECT * FROM OrderItems WHERE orderId = %s", (order["id"],))
            items_rows = cursor.fetchall()
            order["items"] = serialize_items(items_rows)  # ensure items are in list of dicts

        cursor.close()
        conn.close()
        return jsonify(orders), 200

    except Exception as e:
        return jsonify({"error": "Failed to fetch orders", "details": str(e)}), 500@orders_bp.route("/user-orders/<string:username>", methods=["GET"])
def getUserOrders(username):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        # Get numeric userId
        cursor.execute("SELECT id FROM UserData WHERE username = %s", (username,))
        user_row = cursor.fetchone()
        user_id = user_row["id"] if user_row else None

        # Fetch orders
        cursor.execute(
            "SELECT * FROM OrderData WHERE userId = %s OR userName = %s ORDER BY bookingDate DESC",
            (user_id, username)
        )
        orders = cursor.fetchall()

        # Attach items
        for order in orders:
            cursor.execute("SELECT * FROM OrderItems WHERE orderId = %s", (order["id"],))
            items_rows = cursor.fetchall()
            order["items"] = serialize_items(items_rows)

        cursor.close()
        conn.close()
        return jsonify(orders), 200

    except Exception as e:
        return jsonify({"error": "Failed to fetch orders", "details": str(e)}), 500

@orders_bp.route("/orders/seller-orders/<string:sellername>", methods=["GET"])
def getSellerOrdersByName(sellername):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM OrderData WHERE sellerName = %s ORDER BY bookingDate DESC", (sellername,))
        orders = cursor.fetchall()
        for order in orders:
            cursor.execute("SELECT * FROM OrderItems WHERE orderId = %s", (order["id"],))
            order["items"] = serialize_items(cursor.fetchall())
        cursor.close()
        conn.close()
        return jsonify(serialize_items(orders)), 200
    except Exception as e:
        return jsonify({"error": "Failed to fetch seller orders", "details": str(e)}), 500

@orders_bp.route("/seller", methods=["GET"])
def getSellerOrders():
    try:
        sellerId = request.args.get("sellerId")
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM OrderData WHERE sellerId = %s", (sellerId,))
        orders = cursor.fetchall()
        for order in orders:
            cursor.execute("SELECT * FROM OrderItems WHERE orderId = %s", (order["id"],))
            order["items"] = serialize_items(cursor.fetchall())
        cursor.close()
        conn.close()
        return jsonify(serialize_items(orders)), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@orders_bp.route("/orders/status", methods=["PATCH", "OPTIONS"])
def updateOrderStatus():
    if request.method == "OPTIONS":
        resp = make_response("", 200)
        resp.headers["Access-Control-Allow-Methods"] = "PATCH"
        resp.headers["Access-Control-Allow-Headers"] = "Content-Type"
        return resp
    try:
        data = request.get_json()
        orderId = data.get("orderId")
        status = data.get("status")
        if status not in ['Pending', 'Shipped', 'Delivered', 'Cancelled']:
            return jsonify({"error": "Invalid status"}), 400
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("UPDATE OrderData SET status = %s WHERE id = %s", (status, orderId))
        conn.commit()
        cursor.execute("SELECT * FROM OrderData WHERE id = %s", (orderId,))
        updated = serialize_order(cursor.fetchone())
        cursor.close()
        conn.close()
        return jsonify(updated), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@orders_bp.route("/cart/<string:username>/razorpay", methods=["POST"])
def createRazorpayOrder(username):
    try:
        data = request.get_json()
        totalAmount = data.get("totalAmount")
        if totalAmount is None:
            return jsonify({"error": "totalAmount required"}), 400
        order = razorpay_client.order.create({
            "amount": int(totalAmount) * 100,
            "currency": "INR",
            "receipt": secrets.token_hex(10)
        })
        return jsonify({"order": order}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@orders_bp.route("/orders/seller-analytics/<string:sellername>", methods=["GET"])
def getSellerAnalytics(sellername):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        # Fetch orders and products for this seller
        cursor.execute("SELECT * FROM OrderData WHERE sellerName = %s", (sellername,))
        orders = cursor.fetchall()

        cursor.execute("SELECT * FROM ProductData WHERE sellerName = %s", (sellername,))
        products = cursor.fetchall()

        productSales = {}
        total_products_sold = 0

        for order in orders:
            cursor.execute("SELECT * FROM OrderItems WHERE orderId = %s", (order["id"],))
            items = cursor.fetchall()

            # Only count delivered orders
            if order.get("status") == "Delivered":
                for item in items:
                    pid = item.get("productId")
                    qty = item.get("quantity", 0) or 0
                    price = item.get("price") or 0

                    total_products_sold += qty

                    if pid not in productSales:
                        productSales[pid] = {
                            "name": item.get("productName"),
                            "count": 0,
                            "revenue": 0
                        }
                    productSales[pid]["count"] += qty
                    productSales[pid]["revenue"] += qty * price

        status_dist = {
            "Pending": len([o for o in orders if o.get("status") == "Pending"]),
            "Shipped": len([o for o in orders if o.get("status") == "Shipped"]),
            "Delivered": len([o for o in orders if o.get("status") == "Delivered"]),
            "Cancelled": len([o for o in orders if o.get("status") == "Cancelled"])
        }

        cursor.close()
        conn.close()

        return jsonify({
            "totalOrders": len(orders),
            "totalProducts": len(products),
            "totalProductsSold": total_products_sold,  # 👈 NEW
            "productSales": list(productSales.values()),
            "statusDistribution": status_dist
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500