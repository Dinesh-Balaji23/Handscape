from flask import Flask, send_from_directory
from flask_cors import CORS
import os

# Import routes (blueprints)
from routes.users import users_bp
from routes.sellers import sellers_bp
from routes.products import products_bp
from routes.cart import cart_bp
from routes.orders import orders_bp

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

# Uploads directory
UPLOAD_FOLDER = os.path.join(os.getcwd(), "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

# Serve uploads like Express static middleware
@app.route("/uploads/<filename>")
def uploaded_file(filename):
    return send_from_directory(app.config["UPLOAD_FOLDER"], filename)

# Register blueprints (just like app.use(...) in Express)
app.register_blueprint(users_bp)
app.register_blueprint(sellers_bp)
app.register_blueprint(products_bp)
app.register_blueprint(cart_bp)
app.register_blueprint(orders_bp)

if __name__ == "__main__":
    app.run(debug=True, port=8000)