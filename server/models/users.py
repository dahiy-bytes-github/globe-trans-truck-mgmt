from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.sql import func
from database import db
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model, SerializerMixin):
    """
    User Model: Manages admins and fleet managers (login system).
    - Tracks user roles (Admin/Fleet Manager).
    - Securely stores password hashes.
    """
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)  # Unique ID for each user
    username = db.Column(db.String(50), unique=True, nullable=False)  # Unique username
    email = db.Column(db.String(100), unique=True, nullable=False)  # Unique email address
    password_hash = db.Column(db.String(128), nullable=False)  # Hashed password for security
    role = db.Column(db.String(50), nullable=False, default="Fleet Manager")  # User role (Admin/Fleet Manager)
    created_at = db.Column(db.DateTime, server_default=func.now())  # Timestamp when the user was created

    # Password hashing
    def set_password(self, password):
        """Hashes and sets the user's password."""
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        """Verifies the provided password against the stored hash."""
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        """Returns a readable string representation of a User object."""
        return f"<User {self.username}, Role: {self.role}>"
