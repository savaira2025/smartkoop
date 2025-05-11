from sqlalchemy import Column, String, Boolean, Integer, ForeignKey, Date, Numeric, Text
from sqlalchemy.orm import relationship
from app.db.database import Base
from app.models.base import BaseModel

class Customer(Base, BaseModel):
    """Customer model for business customers"""
    
    # Basic information
    name = Column(String, nullable=False)
    contact_person = Column(String, nullable=True)
    email = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    address = Column(Text, nullable=True)
    
    # Business information
    payment_terms = Column(String, nullable=True)
    credit_limit = Column(Numeric(precision=10, scale=2), default=0.0)
    tax_id = Column(String, nullable=True)
    status = Column(String, default="active")  # active, inactive
    
    # Relationships
    sales_orders = relationship("SalesOrder", back_populates="customer")
    projects = relationship("Project", back_populates="customer")


class Supplier(Base, BaseModel):
    """Supplier model for business suppliers/partners"""
    
    # Basic information
    name = Column(String, nullable=False)
    contact_person = Column(String, nullable=True)
    email = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    address = Column(Text, nullable=True)
    
    # Business information
    payment_terms = Column(String, nullable=True)
    tax_id = Column(String, nullable=True)
    bank_account = Column(String, nullable=True)
    status = Column(String, default="active")  # active, inactive
    
    # Relationships
    purchase_orders = relationship("PurchaseOrder", back_populates="supplier")
