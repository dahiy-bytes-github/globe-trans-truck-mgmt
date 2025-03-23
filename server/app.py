from flask import Flask, request, jsonify, session
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from dotenv import load_dotenv
from functools import wraps
from datetime import datetime
import os

from database import db
from models import User, Driver, Truck, Assignment

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')

# Initialize extensions
db.init_app(app)
migrate = Migrate(app, db)
CORS(app, origins=["http://localhost:3000"], supports_credentials=True)

# Decorators

def login_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({"error": "Authentication required"}), 401
        return f(*args, **kwargs)
    return decorated

def admin_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        user_id = session.get('user_id')
        if not user_id:
            return jsonify({"error": "Unauthorized. Please log in."}), 401

        user = User.query.get(user_id)
        if not user or user.role != "Admin":
            return jsonify({"error": "Forbidden. Admin access required."}), 403

        return f(*args, **kwargs)
    return decorated

def admin_or_manager_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if 'role' not in session or session['role'] not in ['Admin', 'Fleet Manager']:
            return jsonify({"error": "Admin or Fleet Manager access required"}), 403
        return f(*args, **kwargs)
    return decorated


# Authentication Routes

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    role = data.get('role', 'Fleet Manager')

    if not username or not email or not password:
        return jsonify({"error": "Username, email, and password are required."}), 400

    if User.query.filter_by(username=username).first():
        return jsonify({"error": "Username already exists."}), 409

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already exists."}), 409

    try:
        new_user = User(username=username, email=email, role=role)
        new_user.set_password(password)
        db.session.add(new_user)
        db.session.commit()

        return jsonify({"message": "User registered successfully."}), 201

    except Exception:
        db.session.rollback()
        return jsonify({"error": "An error occurred while creating the user."}), 500

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"error": "Username and password are required."}), 400

    user = User.query.filter_by(username=username).first()
    if not user or not user.check_password(password):
        return jsonify({"error": "Invalid username or password."}), 401

    session['user_id'] = user.id
    session['username'] = user.username
    session['role'] = user.role

    return jsonify({
        "message": "Login successful.",
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "role": user.role
        }
    }), 200

@app.route('/logout', methods=['POST'])
def logout():
    if 'user_id' not in session:
        return jsonify({"error": "Not logged in."}), 401

    session.clear()
    return jsonify({"message": "Logged out successfully."}), 200


# Driver Routes

@app.route('/drivers', methods=['GET'])
@admin_required
def get_all_drivers():
    drivers = Driver.query.all()
    return jsonify([d.to_dict() for d in drivers]), 200

@app.route('/drivers/<int:id>', methods=['GET'])
@admin_required
def get_driver_by_id(id):
    driver = Driver.query.get(id)
    if not driver:
        return jsonify({"error": "Driver not found."}), 404

    return jsonify(driver.to_dict()), 200


@app.route('/drivers', methods=['POST'])
@admin_required
def create_driver():
    data = request.get_json()
    for field in ['name', 'license_number', 'contact_info']:
        if field not in data:
            return jsonify({"error": f"Missing required field: {field}"}), 400

    if Driver.query.filter_by(license_number=data['license_number']).first():
        return jsonify({"error": "License number already exists."}), 409

    new_driver = Driver(
        name=data['name'],
        license_number=data['license_number'],
        contact_info=data['contact_info'],
        assigned_truck_id=data.get('assigned_truck_id')
    )

    db.session.add(new_driver)
    db.session.commit()

    return jsonify(new_driver.to_dict()), 201

@app.route('/drivers/<int:id>', methods=['PUT'])
@admin_required
def update_driver(id):
    driver = Driver.query.get(id)
    if not driver:
        return jsonify({"error": "Driver not found."}), 404

    data = request.get_json()
    driver.name = data.get('name', driver.name)
    driver.license_number = data.get('license_number', driver.license_number)
    driver.contact_info = data.get('contact_info', driver.contact_info)
    driver.assigned_truck_id = data.get('assigned_truck_id', driver.assigned_truck_id)

    db.session.commit()
    return jsonify(driver.to_dict()), 200

@app.route('/drivers/<int:id>', methods=['DELETE'])
@admin_required
def delete_driver(id):
    driver = Driver.query.get(id)
    if not driver:
        return jsonify({"error": "Driver not found."}), 404

    db.session.delete(driver)
    db.session.commit()
    return jsonify({"message": "Driver deleted successfully."}), 200



# Truck Routes

@app.route('/trucks', methods=['GET'])
@admin_required
def get_all_trucks():
    trucks = Truck.query.all()
    return jsonify([t.to_dict() for t in trucks]), 200

@app.route('/trucks/<int:id>', methods=['GET'])
@admin_required
def get_truck_by_id(id):
    truck = Truck.query.get(id)
    if not truck:
        return jsonify({"error": "Truck not found."}), 404

    return jsonify(truck.to_dict()), 200


@app.route('/trucks', methods=['POST'])
@admin_required
def create_truck():
    data = request.get_json()
    for field in ['plate_number', 'model']:
        if field not in data:
            return jsonify({"error": f"Missing required field: {field}"}), 400

    if Truck.query.filter_by(plate_number=data['plate_number']).first():
        return jsonify({"error": "Truck with this plate number already exists."}), 409

    new_truck = Truck(
        plate_number=data['plate_number'],
        model=data['model'],
        status=data.get('status', 'Available'),
        current_driver_id=data.get('current_driver_id')
    )

    db.session.add(new_truck)
    db.session.commit()

    return jsonify(new_truck.to_dict()), 201

@app.route('/trucks/<int:id>', methods=['PUT'])
@admin_required
def update_truck(id):
    truck = Truck.query.get(id)
    if not truck:
        return jsonify({"error": "Truck not found."}), 404

    data = request.get_json()
    truck.model = data.get('model', truck.model)
    truck.plate_number = data.get('plate_number', truck.plate_number)
    truck.status = data.get('status', truck.status)
    truck.current_driver_id = data.get('current_driver_id', truck.current_driver_id)

    db.session.commit()
    return jsonify(truck.to_dict()), 200

@app.route('/trucks/<int:id>', methods=['DELETE'])
@admin_required
def delete_truck(id):
    truck = Truck.query.get(id)
    if not truck:
        return jsonify({"error": "Truck not found."}), 404

    db.session.delete(truck)
    db.session.commit()
    return jsonify({"message": "Truck deleted successfully."}), 200

# Assignment Routes

@app.route('/assignments', methods=['GET'])
@login_required
@admin_or_manager_required
def get_assignments():
    assignments = Assignment.query.all()
    return jsonify([a.to_dict() for a in assignments]), 200

@app.route('/assignments/<int:id>', methods=['GET'])
@admin_or_manager_required
def get_assignment_by_id(id):
    assignment = Assignment.query.get(id)
    if not assignment:
        return jsonify({"error": "Assignment not found."}), 404

    return jsonify(assignment.to_dict()), 200


@app.route('/assignments', methods=['POST'])
@login_required
@admin_or_manager_required
def create_assignment():
    data = request.get_json()
    try:
        start_date = datetime.strptime(data['start_date'], '%Y-%m-%d %H:%M:%S')
        end_date = datetime.strptime(data['end_date'], '%Y-%m-%d %H:%M:%S') if data.get('end_date') else None

        new_assignment = Assignment(
            start_date=start_date,
            end_date=end_date,
            status=data.get('status', 'Active'),
            driver_id=data['driver_id'],
            truck_id=data['truck_id']
        )

        db.session.add(new_assignment)
        db.session.commit()

        return jsonify(new_assignment.to_dict()), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/assignments/<int:id>', methods=['PATCH'])
@login_required
@admin_or_manager_required
def update_assignment(id):
    assignment = Assignment.query.get(id)
    if not assignment:
        return jsonify({"error": "Assignment not found"}), 404

    data = request.get_json()
    try:
        if 'start_date' in data:
            assignment.start_date = datetime.strptime(data['start_date'], '%Y-%m-%d %H:%M:%S')
        if 'end_date' in data:
            assignment.end_date = datetime.strptime(data['end_date'], '%Y-%m-%d %H:%M:%S')
        if 'status' in data:
            assignment.status = data['status']
        if 'driver_id' in data:
            assignment.driver_id = data['driver_id']
        if 'truck_id' in data:
            assignment.truck_id = data['truck_id']

        db.session.commit()
        return jsonify(assignment.to_dict()), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/assignments/<int:id>', methods=['DELETE'])
@login_required
@admin_or_manager_required
def delete_assignment(id):
    assignment = Assignment.query.get(id)
    if not assignment:
        return jsonify({"error": "Assignment not found"}), 404

    try:
        db.session.delete(assignment)
        db.session.commit()
        return jsonify({"message": "Assignment deleted successfully"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 400


# Run App

if __name__ == '__main__':
    app.run(port=5555, debug=True)
