from sqlalchemy import Column, String, Boolean, Integer, ForeignKey, Date, Numeric, Text
from sqlalchemy.orm import relationship
from app.db.database import Base
from app.models.base import BaseModel

class Customer(Base, BaseModel):
    """Customer model for business customers"""
    
    # Basic information
    name = Column(String(255), nullable=False)
    contact_person = Column(String(255), nullable=True)  # Keep for backward compatibility
    email = Column(String(255), nullable=True)
    phone = Column(String(20), nullable=True)
    address = Column(Text, nullable=True)
    
    # Business information
    payment_terms = Column(String(255), nullable=True)
    credit_limit = Column(Numeric(precision=10, scale=2), default=0.0)
    tax_id = Column(String(255), nullable=True)
    status = Column(String(50), default="active")  # active, inactive
    
    # Relationships
    sales_orders = relationship("SalesOrder", back_populates="customer")
    projects = relationship("Project", back_populates="customer")
    contacts = relationship("CustomerContact", back_populates="customer", cascade="all, delete-orphan")


class CustomerContact(Base, BaseModel):
    """Customer contact/PIC model for multiple persons in charge"""
    
    # Foreign key to customer
    customer_id = Column(Integer, ForeignKey("customer.id"), nullable=False)
    
    # Contact information
    name = Column(String(255), nullable=False)
    title = Column(String(255), nullable=True)  # Job title/position
    email = Column(String(255), nullable=True)
    phone = Column(String(20), nullable=True)
    department = Column(String(255), nullable=True)
    is_primary = Column(Boolean, default=False)
    
    # Relationships
    customer = relationship("Customer", back_populates="contacts")


class Supplier(Base, BaseModel):
    """Supplier model for business suppliers/partners"""
    
    # Basic information
    name = Column(String(255), nullable=False)
    contact_person = Column(String(255), nullable=True)
    email = Column(String(255), nullable=True)
    phone = Column(String(20), nullable=True)
    address = Column(Text, nullable=True)
    
    # Business information
    payment_terms = Column(String(255), nullable=True)
    tax_id = Column(String(255), nullable=True)
    bank_account = Column(String(255), nullable=True)
    status = Column(String(50), default="active")  # active, inactive
    
    # Relationships
    purchase_orders = relationship("PurchaseOrder", back_populates="supplier")
