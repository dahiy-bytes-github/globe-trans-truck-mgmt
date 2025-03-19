
# **Fleet Management System - Backend**

The Fleet Management System is a **full-stack application** designed to manage drivers, trucks, assignments, and users. This repository contains the **backend** built with **Flask** and **SQLAlchemy**. The backend provides a RESTful API for the frontend (built with React) to interact with the database.

---

## **Features**
- **Driver Management**: Track individual drivers and their truck assignments.
- **Truck Management**: Manage fleet vehicles and their status (Available, In Use, Maintenance).
- **Assignment Tracking**: Assign drivers to trucks and track assignment history.
- **User Authentication**: Secure login system for admins and fleet managers.
- **RESTful API**: Endpoints for CRUD operations on drivers, trucks, assignments, and users.

---

## **Technologies Used**
- **Backend**: Flask, SQLAlchemy, Flask-Migrate
- **Database**: SQLite (can be replaced with PostgreSQL/MySQL for production)
- **Authentication**: Werkzeug password hashing
- **Testing**: Faker for seeding fake data

---

## **Setup Instructions**

### **1. Clone the Repository**
```bash
git clone https://github.com/your-username/fleet-management-backend.git
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


=======
# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
>>>>>>> b032e603 (first commit)
