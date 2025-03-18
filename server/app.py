from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
from flask_migrate import Migrate

from database import db  # Importing the database instance
from drivers import Driver
from trucks import Truck
from assignments import Assignment
from users import User

from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import LoginManager, login_user, logout_user, login_required

from datetime import datetime

load_dotenv()

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///globe_trans.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.secret_key = os.environ.get('SECRET_KEY', 'fallback_secret_key') 

db.init_app(app)
CORS(app)
migrate = Migrate(app, db)

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = "login"

# Load user for Flask-Login
@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))
#Get all the drivers
@app.route('/drivers', methods =['GET'])
def get_drivers():
    drivers = Driver.query.all()
    driver_list = [driver.to_dict()for driver in drivers]
    return jsonify(driver_list), 200
#Get a driver by id
@app.route('/drivers/<int:id>')
def get_driver_by_id(id):
    driver = Driver.query.filter(Driver.id == id).first()
    if driver is None:
        return jsonify({"Driver": "Not found"}), 404
    return jsonify(driver.to_dict()), 200
# POST a new driver
@app.route('/drivers', methods=['POST'])
def create_driver():
    data = request.get_json()
    
    required_fields = ['name', 'license_number', 'contact_info']
    for field in required_fields:
        if field not in data or not data[field]:
            return jsonify({'error': f"Missing required field: {field}"}), 400
        
    if Driver.query.filter_by(license_number=data["license_number"]).first():
        return jsonify({"error": "License number already exists"}), 400
    
    new_driver = Driver(
        name=data["name"],
        license_number=data["license_number"],
        contact_info=data["contact_info"],
        assigned_truck_id=data.get("assigned_truck_id"),
        created_at=datetime.utcnow()
    )

    db.session.add(new_driver)
    db.session.commit()

    return jsonify(new_driver.to_dict()), 201

# PATCH (Update) a driver by ID
@app.route('/drivers/<int:id>', methods=['PATCH'])
def update_driver(id):
    driver = Driver.query.get(id)
    if not driver:
        return jsonify({"error": "Driver not found"}), 404

    data = request.get_json()

    if "name" in data:
        driver.name = data["name"]
    if "license_number" in data:
        if Driver.query.filter(Driver.license_number == data["license_number"], Driver.id != id).first():
            return jsonify({"error": "License number already exists"}), 400
        driver.license_number = data["license_number"]
    if "contact_info" in data:
        driver.contact_info = data["contact_info"]
    if "assigned_truck_id" in data:
        driver.assigned_truck_id = data["assigned_truck_id"]

    db.session.commit()

    return jsonify(driver.to_dict()), 200

# DELETE a driver by ID
@app.route('/drivers/<int:id>', methods=['DELETE'])
def delete_driver(id):
    driver = Driver.query.get(id)
    if not driver:
        return jsonify({"error": "Driver not found"}), 404

    db.session.delete(driver)
    db.session.commit()

    return jsonify({"message": "Driver deleted successfully"}), 200


if __name__ == '__main__':
    app.run(debug=True)