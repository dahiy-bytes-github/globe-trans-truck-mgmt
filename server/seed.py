from faker import Faker
from datetime import datetime, timedelta
from .models import db, Driver, Truck, Assignment, User
from . import create_app

# Initialize Faker
fake = Faker()

def seed_drivers(num_drivers=10):
    """
    Seed the database with fake drivers.
    """
    drivers = []
    for _ in range(num_drivers):
        driver = Driver(
            name=fake.name(),
            license_number=fake.unique.bothify(text='??#########'),  # Unique license number
            contact_info=fake.phone_number(),
            created_at=datetime.utcnow()
        )
        drivers.append(driver)
    return drivers

def seed_trucks(num_trucks=5):
    """
    Seed the database with fake trucks.
    """
    trucks = []
    for _ in range(num_trucks):
        truck = Truck(
            plate_number=fake.unique.bothify(text='???###'),  # Unique plate number
            model=fake.random_element(elements=("Ford F-150", "Chevrolet Silverado", "Ram 1500", "Toyota Tacoma")),
            status=fake.random_element(elements=("Available", "In Use", "Maintenance")),
            created_at=datetime.utcnow()
        )
        trucks.append(truck)
    return trucks

def seed_assignments(drivers, trucks, num_assignments=15):
    """
    Seed the database with fake assignments.
    """
    assignments = []
    for _ in range(num_assignments):
        start_date = fake.date_time_between(start_date="-30d", end_date="now")
        end_date = fake.date_time_between(start_date=start_date, end_date="+30d") if fake.boolean(chance_of_getting_true=70) else None
        assignment = Assignment(
            start_date=start_date,
            end_date=end_date,
            status=fake.random_element(elements=("Active", "Completed")),
            driver_id=fake.random_element(elements=[driver.id for driver in drivers]),
            truck_id=fake.random_element(elements=[truck.id for truck in trucks])
        )
        assignments.append(assignment)
    return assignments

def seed_users(num_users=3):
    """
    Seed the database with fake users (admins and fleet managers).
    """
    users = []
    for _ in range(num_users):
        user = User(
            username=fake.unique.user_name(),
            email=fake.unique.email(),
            password_hash=fake.password(length=12),  # Fake password hash
            role=fake.random_element(elements=("Admin", "Fleet Manager")),
            created_at=datetime.utcnow()
        )
        users.append(user)
    return users

def seed_database():
    """
    Main function to seed the database with fake data.
    """
    app = create_app()
    with app.app_context():
        # Clear existing data
        print("Clearing existing data...")
        db.session.query(Assignment).delete()
        db.session.query(Driver).delete()
        db.session.query(Truck).delete()
        db.session.query(User).delete()
        db.session.commit()

        # Seed new data
        print("Seeding drivers...")
        drivers = seed_drivers()
        db.session.add_all(drivers)
        db.session.commit()

        print("Seeding trucks...")
        trucks = seed_trucks()
        db.session.add_all(trucks)
        db.session.commit()

        print("Seeding assignments...")
        assignments = seed_assignments(drivers, trucks)
        db.session.add_all(assignments)
        db.session.commit()

        print("Seeding users...")
        users = seed_users()
        db.session.add_all(users)
        db.session.commit()

        print("Database seeded successfully!")

if __name__ == "__main__":
    seed_database()
