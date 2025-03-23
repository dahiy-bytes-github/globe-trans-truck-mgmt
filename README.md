
# **Fleet Management System - Backend**

The Fleet Management System is a **full-stack application** designed to manage drivers, trucks, assignments, and users. This repository contains the **backend** built with **Flask** and **SQLAlchemy**. The backend provides a RESTful API for the frontend (built with React) to interact with the database.

---

## 🚀 Features

- **Driver Management**  
  Track individual drivers and their truck assignments.

- **Truck Management**  
  Manage fleet vehicles and their status (Available, In Use, Maintenance).

- **Assignment Tracking**  
  Assign drivers to trucks and track assignment history.

- **User Authentication**  
  Secure login system for admins and fleet managers.

- **RESTful API**  
  Endpoints for full CRUD operations on drivers, trucks, assignments, and users.

- **Responsive UI**  
  - Fully responsive React-based frontend  
  - Interactive and intuitive design


---

## **Technologies Used**

### **Backend**
- **Flask**: Lightweight Python web framework
- **SQLAlchemy**: ORM for database interaction
- **Flask-Migrate**: Manages database migrations

### **Database**
- **SQLite**: Default development database  
  *(Can be replaced with PostgreSQL or MySQL for production)*

### **Authentication**
- **Werkzeug**: Used for secure password hashing

### **Testing**
- **Faker**: Used to seed the database with realistic fake data

---

### **Frontend**
- **React.js**: Frontend library with component-based architecture
- **React Router**: Enables client-side routing
- **CSS**: For styling and layout
- **React Icons**: Provides a set of popular icons for UI enhancements

## **Setup Instructions**
backend
### **1. Clone the Repository**
```bash
git clone https://github.com/dahiy-bytes-github/globe-trans-truck-mgmt.git
cd fleet-management-backend
```

### **2. Install Dependencies**
Make sure you have Python 3.8+ installed. Then, install the required packages:
```bash
pip install -r requirements.txt
```

### **3. Set Up the Database**
- Initialize the database and run migrations:
  ```bash
  flask db init
  flask db migrate -m "Initial migration"
  flask db upgrade
  ```

- Seed the database with fake data (optional):
  ```bash
  python seed.py
  ```

### **4. Run the Application**
Start the Flask development server:
```bash
python app.py
```
The backend will be available at `http://127.0.0.1:5555`.

---
## Frontend: Installation and Setup

### Prerequisites
Ensure you have the following installed on your system:
- Node.js & npm
- Git

### Clone the Repository
```sh
git clone https://github.com/dahiy-bytes-github/globe-trans-truck-mgmt.git
cd globe-trans-truck-mgmt/client

### Install Dependencies
```sh
npm install

### Start the Frontend Development Server
```sh
npm start


## **API Endpoints**

### **Drivers**
- **GET /drivers**: Get a list of all drivers.
- **GET /drivers/<int:id>**: Get details of a specific driver.
- **POST /drivers**: Create a new driver.
- **PATCH /drivers/<int:id>**: Update a driver's details.
- **DELETE /drivers/<int:id>**: Delete a driver.

### **Trucks**
- **GET /trucks**: Get a list of all trucks.
- **GET /trucks/<int:id>**: Get details of a specific truck.
- **POST /trucks**: Create a new truck.
- **PATCH /trucks/<int:id>**: Update a truck's details.
- **DELETE /trucks/<int:id>**: Delete a truck.

### **Assignments**
- **GET /assignments**: Get a list of all assignments.
- **GET /assignments/<int:id>**: Get details of a specific assignment.
- **POST /assignments**: Create a new assignment.
- **PATCH /assignments/<int:id>**: Update an assignment's details.
- **DELETE /assignments/<int:id>**: Delete an assignment.

### **Users**
- **GET /users**: Get a list of all users.
- **GET /users/<int:id>**: Get details of a specific user.
- **POST /users**: Create a new user.
- **PATCH /users/<int:id>**: Update a user's details.
- **DELETE /users/<int:id>**: Delete a user.

---
### **Tables**
1. **Drivers**
   - `id`, `name`, `license_number`, `contact_info`, `assigned_truck_id`, `created_at`

2. **Trucks**
   - `id`, `plate_number`, `model`, `status`, `current_driver_id`, `created_at`

3. **Assignments**
   - `id`, `start_date`, `end_date`, `status`, `driver_id`, `truck_id`

4. **Users**
   - `id`, `username`, `email`, `password_hash`, `role`, `created_at`

---

## **Seeding the Database**
To populate the database with fake data for testing, run:
```bash
python seed.py
```
This script uses the **Faker** library to generate realistic data for drivers, trucks, assignments, and users.

---

## **Environment Variables**
Create a `.env` file in the root directory with the following variables:
```env
FLASK_APP=app.py
FLASK_ENV=development
DATABASE_URL=sqlite:///fleet_management.db
SECRET_KEY=your-secret-key
```

---

## Usage
### Running the Application
- Open `http://localhost:3000/` in a browser.
- Register/Login as a user.
- Admins has full control of the application , while fleet Managers can view assignments.

## **Future Improvements**
- Add real-time tracking of truck locations using a map API.
- Implement WebSocket or Server-Sent Events (SSE) for live updates.
- Add advanced reporting features for driver performance and truck utilization.

---

## **Contributing**
Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeatureName`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/YourFeatureName`).
5. Open a pull request.

```

## License
This project is licensed under Group 1/Phase 5 Class.

## Contact
For any queries or collaborations, feel free to reach out:
- Email: contact@globetrans.com
- GitHub: [dahiy-bytes](https://github.com/dahiy-bytes-github)


