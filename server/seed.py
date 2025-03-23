#!/usr/bin/env python3

from app import app
from models import Driver, Truck, Assignment, User
from database import db
from faker import Faker
import random as rc
from werkzeug.security import generate_password_hash

fake = Faker()

with app.app_context():
    # Clear existing data
    Assignment.query.delete()
    Truck.query.delete()
    Driver.query.delete()
    User.query.delete()

    # Seed Drivers
    drivers = []
    for i in range(5):
        driver = Driver(
            name=fake.name(),
            license_number=fake.unique.bothify(text='??#####'),
            contact_info=fake.phone_number()
        )
        drivers.append(driver)

    db.session.add_all(drivers)
    db.session.commit()

    # Seed Trucks
    trucks = []
    for i in range(5):
        truck = Truck(
            plate_number=fake.unique.bothify(text='K?? ####?'),
            model=fake.word().capitalize() + " " + rc.choice(["FH16", "R500", "XF", "Actros"]),
            status=rc.choice(["Available", "In Use", "Maintenance"])
        )
        trucks.append(truck)

    db.session.add_all(trucks)
    db.session.commit()

    # Seed Assignments
    assignments = []
    for i in range(5):
        start_date = fake.date_time_between(start_date='-30d', end_date='-5d')
        end_date = rc.choice([None, fake.date_time_between(start_date=start_date, end_date='now')])
        status = "Completed" if end_date else "Active"

        assignment = Assignment(
            start_date=start_date,
            end_date=end_date,
            status=status,
            driver_id=rc.choice(drivers).id,
            truck_id=rc.choice(trucks).id
        )
        assignments.append(assignment)

    db.session.add_all(assignments)
    db.session.commit()

    # Seed Users (Manual Real-Life Data)
    users = [
        User(
            username="admin_john",
            email="john.doe@example.com",
            password_hash=generate_password_hash("securepass123"),
            role="Admin"
        ),
        User(
            username="admin_lisa",
            email="lisa.morgan@example.com",
            password_hash=generate_password_hash("securepass123"),
            role="Admin"
        ),
        User(
            username="fleet_michael",
            email="michael.smith@example.com",
            password_hash=generate_password_hash("securepass123"),
            role="Fleet Manager"
        )
    ]

    db.session.add_all(users)
    db.session.commit()

    print("Database seeded successfully.")
