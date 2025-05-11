from sqlalchemy import Column, String, Boolean, Integer, ForeignKey
from sqlalchemy.orm import relationship
from app.db.database import Base
from app.models.base import BaseModel

class User(Base, BaseModel):
    """User model for authentication and authorization"""
    
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    full_name = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)
    role = Column(String, default="user")  # user, admin, manager, etc.
    
    # Relationships can be added here as needed
    # For example:
    # member = relationship("Member", back_populates="user", uselist=False)
