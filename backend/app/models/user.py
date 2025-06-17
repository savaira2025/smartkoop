from sqlalchemy import Column, String, Boolean, Integer, ForeignKey
from sqlalchemy.orm import relationship
from app.db.database import Base
from app.models.base import BaseModel

class User(Base, BaseModel):
    """User model for authentication and authorization"""
    
    username = Column(String(100), unique=True, index=True, nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)
    role = Column(String(50), default="user")  # user, admin, manager, etc.
    
    # Relationships can be added here as needed
    # For example:
    # member = relationship("Member", back_populates="user", uselist=False)
