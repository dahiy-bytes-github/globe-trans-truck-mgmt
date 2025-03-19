from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
from flask_migrate import Migrate

from database import db  # Importing the database instance
from models.drivers import Driver
from models.trucks import Truck
from models.assignments import Assignment
from models.users import User

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

#AUTHENTICATION ENDPOINTS
@app.route('/register', methods=['POST'])
def register():
    """ Register a new user """
    data = request.get_json()

    if not data.get("username") or not data.get("password"):
        return jsonify({"error": "Username and password are required"}), 400

    existing_user = User.query.filter_by(username=data["username"]).first()
    if existing_user:
        return jsonify({"error": "User already exists, please login"}), 400

    hashed_password = generate_password_hash(data["password"])
    new_user = User(username=data["username"], password_hash=hashed_password)

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User registered successfully"}), 201

@app.route('/login', methods=['POST'])
def login():
    """ Authenticate user """
    data = request.get_json()

    if not data.get("username") or not data.get("password"):
        return jsonify({"error": "Username and password are required"}), 400

    user = User.query.filter_by(username=data["username"]).first()
    if not user:
        return jsonify({"error": "User not found, please register"}), 404

    if not check_password_hash(user.password_hash, data["password"]):
        return jsonify({"error": "Incorrect credentials, please try again or register"}), 401

    login_user(user)
    return jsonify({"message": "Login successful"}), 200

@app.route('/logout', methods=['POST'])
@login_required
def logout():
    """ Logout the current user """
    logout_user()
    return jsonify({"message": "Logged out successfully"}), 200


#Get all the drivers
@app.route('/drivers', methods =['GET'])
@login_required
def get_drivers():
    drivers = Driver.query.all()
    driver_list = [driver.to_dict()for driver in drivers]
    return jsonify(driver_list), 200
#Get a driver by id
@app.route('/drivers/<int:id>')
@login_required
def get_driver_by_id(id):
    driver = Driver.query.filter(Driver.id == id).first()
    if driver is None:
        return jsonify({"Driver": "Not found"}), 404
    return jsonify(driver.to_dict()), 200
# POST a new driver
@app.route('/drivers', methods=['POST'])
@login_required
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
@login_required
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
@login_required
def delete_driver(id):
    driver = Driver.query.get(id)
    if not driver:
        return jsonify({"error": "Driver not found"}), 404

    db.session.delete(driver)
    db.session.commit()

    return jsonify({"message": "Driver deleted successfully"}), 200

# GET all trucks
@app.route('/trucks', methods=['GET'])
@login_required
def get_trucks():
    trucks = Truck.query.all()
    truck_list = [truck.to_dict() for truck in trucks]
    return jsonify(truck_list), 200

# GET a truck by ID
@app.route('/trucks/<int:id>', methods=['GET'])
@login_required
def get_truck_by_id(id):
    truck = Truck.query.get(id)
    if not truck:
        return jsonify({"error": "Truck not found"}), 404

    return jsonify(truck.to_dict()), 200

# POST a new truck
@app.route('/trucks', methods=['POST'])
@login_required
def create_truck():
    data = request.get_json()
    
    required_fields = ['plate_number', 'model', 'status']
    for field in required_fields:
        if field not in data or not data[field]:
            return jsonify({'error': f"Missing required field: {field}"}), 400

    if Truck.query.filter_by(plate_number=data["plate_number"]).first():
        return jsonify({"error": "Plate number already exists"}), 400

    new_truck = Truck(
        plate_number=data["plate_number"],
        model=data["model"],
        status=data["status"],
        current_driver_id=data.get("current_driver_id"),
        created_at=datetime.utcnow()
    )

    db.session.add(new_truck)
    db.session.commit()

    return jsonify(new_truck.to_dict()), 201
# PATCH (Update) a truck by ID
@app.route('/trucks/<int:id>', methods=['PATCH'])
@login_required
def update_truck(id):
    truck = Truck.query.get(id)
    if not truck:
        return jsonify({"error": "Truck not found"}), 404

    data = request.get_json()

    if "plate_number" in data:
        if Truck.query.filter(Truck.plate_number == data["plate_number"], Truck.id != id).first():
            return jsonify({"error": "Plate number already exists"}), 400
        truck.plate_number = data["plate_number"]
    if "model" in data:
        truck.model = data["model"]
    if "status" in data:
        truck.status = data["status"]
    if "current_driver_id" in data:
        truck.current_driver_id = data["current_driver_id"]

    db.session.commit()

    return jsonify(truck.to_dict()), 200

# DELETE a truck by ID
@app.route('/trucks/<int:id>', methods=['DELETE'])
@login_required
def delete_truck(id):
    truck = Truck.query.get(id)
    if not truck:
        return jsonify({"error": "Truck not found"}), 404

    db.session.delete(truck)
    db.session.commit()

    return jsonify({"message": "Truck deleted successfully"}), 200

# GET all assignments
@app.route('/assignments', methods=['GET'])
@login_required
def get_assignments():
    assignments = Assignment.query.all()
    return jsonify([assignment.to_dict() for assignment in assignments]), 200

# GET an assignment by ID
@app.route('/assignments/<int:id>', methods=['GET'])
@login_required
def get_assignment_by_id(id):
    assignment = Assignment.query.get(id)
    if not assignment:
        return jsonify({"error": "Assignment not found"}), 404

    return jsonify(assignment.to_dict()), 200

# POST a new assignment
@app.route('/assignments', methods=['POST'])
@login_required
def create_assignment():
    data = request.get_json()
    
    required_fields = ['start_date', 'status', 'driver_id', 'truck_id']
    for field in required_fields:
        if field not in data or not data[field]:
            return jsonify({'error': f"Missing required field: {field}"}), 400

    if not Driver.query.get(data["driver_id"]):
        return jsonify({"error": "Driver not found"}), 404
    if not Truck.query.get(data["truck_id"]):
        return jsonify({"error": "Truck not found"}), 404

    new_assignment = Assignment(
        start_date=datetime.strptime(data["start_date"], '%Y-%m-%d %H:%M:%S'),
        end_date=datetime.strptime(data["end_date"], '%Y-%m-%d %H:%M:%S') if data.get("end_date") else None,
        status=data["status"],
        driver_id=data["driver_id"],
        truck_id=data["truck_id"]
    )

    db.session.add(new_assignment)
    db.session.commit()

    return jsonify(new_assignment.to_dict()), 201

# PATCH (Update) an assignment by ID
@app.route('/assignments/<int:id>', methods=['PATCH'])
@login_required
def update_assignment(id):
    assignment = Assignment.query.get(id)
    if not assignment:
        return jsonify({"error": "Assignment not found"}), 404

    data = request.get_json()

    if "start_date" in data:
        assignment.start_date = datetime.strptime(data["start_date"], '%Y-%m-%d %H:%M:%S')
    if "end_date" in data:
        assignment.end_date = datetime.strptime(data["end_date"], '%Y-%m-%d %H:%M:%S') if data["end_date"] else None
    if "status" in data:
        assignment.status = data["status"]
    if "driver_id" in data:
        if not Driver.query.get(data["driver_id"]):
            return jsonify({"error": "Driver not found"}), 404
        assignment.driver_id = data["driver_id"]
    if "truck_id" in data:
        if not Truck.query.get(data["truck_id"]):
            return jsonify({"error": "Truck not found"}), 404
        assignment.truck_id = data["truck_id"]

    db.session.commit()

    return jsonify(assignment.to_dict()), 200

# DELETE an assignment by ID
@app.route('/assignments/<int:id>', methods=['DELETE'])
@login_required
def delete_assignment(id):
    assignment = Assignment.query.get(id)
    if not assignment:
        return jsonify({"error": "Assignment not found"}), 404

    db.session.delete(assignment)
    db.session.commit()

    return jsonify({"message": "Assignment deleted successfully"}), 200

if __name__ == '__main__':
    app.run(debug=True)