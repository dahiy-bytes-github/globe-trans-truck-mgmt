from sqlalchemy_serializer import SerializerMixin
from datetime import datetime
from database import db

class Truck(db.Model, SerializerMixin):
    """
    Truck Model: Manages fleet vehicles and their status.
    - One-to-Many Relationship with Assignments.
    - Tracks current driver assignment via `current_driver_id`.
    """
    __tablename__ = 'trucks'

    id = db.Column(db.Integer, primary_key=True)  # Unique ID for each truck
    plate_number = db.Column(db.String(50), unique=True, nullable=False)  # Unique license plate number
    model = db.Column(db.String(100), nullable=False)  # Truck model
    status = db.Column(db.String(50), nullable=False, default="Available")  # Truck status (Available/In Use/Maintenance)
    current_driver_id = db.Column(db.Integer, db.ForeignKey('drivers.id'), nullable=True)  # Assigned driver 
    created_at = db.Column(db.DateTime, default=datetime.utcnow)  # Timestamp when the truck record was created

    # Relationships
    assignments = db.relationship("Assignment", back_populates="truck", cascade="all, delete-orphan")  
    # Establishes one-to-many relationship with assignments
    driver = db.relationship("Driver", foreign_keys=[current_driver_id])  # Link to Driver model

    def to_dict(self):
        return {
            "id": self.id,
            "plate_number": self.plate_number,
            "model": self.model,
            "status": self.status,
            "current_driver_id": self.current_driver_id,
            "created_at": self.created_at.strftime('%Y-%m-%d %H:%M:%S')
        }

    def __repr__(self):
        """Returns a readable string representation of a Truck object."""
        return f"<Truck {self.plate_number}, Model: {self.model}, Status: {self.status}>"
