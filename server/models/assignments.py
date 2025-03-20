from sqlalchemy_serializer import SerializerMixin
from datetime import datetime
from database import db

class Assignment(db.Model, SerializerMixin):
    """
    Assignment Model: Tracks driver-truck assignments over time.
    - Many-to-Many Relationship between Drivers and Trucks.
    - User-submittable attributes: `start_date`, `end_date`, `status`.
    """
    __tablename__ = 'assignments'

    id = db.Column(db.Integer, primary_key=True)  # Unique ID for each assignment
    start_date = db.Column(db.DateTime, nullable=False)  # Assignment start date
    end_date = db.Column(db.DateTime, nullable=True)  # Nullable for ongoing assignments
    status = db.Column(db.String(50), nullable=False, default="Active")  # Assignment status (Active/Completed)

    # Foreign Keys
    driver_id = db.Column(db.Integer, db.ForeignKey('drivers.id'), nullable=False)  # Assigned driver
    truck_id = db.Column(db.Integer, db.ForeignKey('trucks.id'), nullable=False)  # Assigned truck

    # Relationships
    driver = db.relationship("Driver", back_populates="assignments")  # Link to Driver model
    truck = db.relationship("Truck", back_populates="assignments")  # Link to Truck model

    def to_dict(self):
        return {
            "id": self.id,
            "start_date": self.start_date.strftime('%Y-%m-%d %H:%M:%S'),
            "end_date": self.end_date.strftime('%Y-%m-%d %H:%M:%S') if self.end_date else None,
            "status": self.status,
            "driver_id": self.driver_id,
            "truck_id": self.truck_id
        }

    def __repr__(self):
        """Returns a readable string representation of an Assignment object."""
        return f"<Assignment Driver ID: {self.driver_id}, Truck ID: {self.truck_id}, Status: {self.status}>"
