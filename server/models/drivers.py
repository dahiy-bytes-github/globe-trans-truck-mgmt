from database import db 
from sqlalchemy_serializer import SerializerMixin
from datetime import datetime

class Driver(db.Model, SerializerMixin):
    """
    Driver Model: Represents individual drivers and their truck assignments.
    - One-to-Many Relationship with Assignments.
    - Tracks current truck assignment via `assigned_truck_id`.
    """
    __tablename__ = 'drivers'

    id = db.Column(db.Integer, primary_key=True)  # Unique ID for each driver
    name = db.Column(db.String(100), nullable=False)  # Driver's full name
    license_number = db.Column(db.String(50), unique=True, nullable=False)  # Unique license number
    contact_info = db.Column(db.String(100), nullable=False)  # Contact details
    assigned_truck_id = db.Column(db.Integer, db.ForeignKey('trucks.id'), nullable=True)  # Current truck assignment
    created_at = db.Column(db.DateTime, default=datetime.utcnow)  # Timestamp when driver record was created

    # Relationships
    assignments = db.relationship("Assignment", back_populates="driver", cascade="all, delete-orphan")  
    # Establishes one-to-many relationship with assignments

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "license_number": self.license_number,
            "contact_info": self.contact_info,
            "assigned_truck_id": self.assigned_truck_id,
            "created_at": self.created_at.strftime('%Y-%m-%d %H:%M:%S')
        }

    def __repr__(self):
        """Returns a readable string representation of a Driver object."""
        return f"<Driver {self.name}, License: {self.license_number}>"
    
