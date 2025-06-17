from sqlalchemy import Column, String, Boolean, Integer, ForeignKey, Date, Numeric, Text
from sqlalchemy.orm import relationship
from app.db.database import Base
from app.models.base import BaseModel
from datetime import date

class SalesOrder(Base, BaseModel):
    """Sales order model for customer orders"""
    
    # Order information
    customer_id = Column(Integer, ForeignKey("customer.id"), nullable=False)
    order_date = Column(Date, default=date.today, nullable=False)
    order_number = Column(String(100), unique=True, nullable=False)
    status = Column(String(50), default="draft")  # draft, approved, completed, cancelled
    
    # Financial information
    subtotal = Column(Numeric(precision=10, scale=2), default=0.0)
    tax_amount = Column(Numeric(precision=10, scale=2), default=0.0)
    total_amount = Column(Numeric(precision=10, scale=2), default=0.0)
    payment_status = Column(String(50), default="unpaid")  # unpaid, partial, paid
    due_date = Column(Date, nullable=True)
    
    # Relationships
    customer = relationship("Customer", back_populates="sales_orders")
    items = relationship("SalesOrderItem", back_populates="sales_order", cascade="all, delete-orphan")
    invoices = relationship("SalesInvoice", back_populates="sales_order", cascade="all, delete-orphan")


class SalesOrderItem(Base, BaseModel):
    """Sales order item model for items in a sales order"""
    
    # Item information
    sales_order_id = Column(Integer, ForeignKey("salesorder.id"), nullable=False)
    item_description = Column(String(255), nullable=False)
    quantity = Column(Numeric(precision=10, scale=2), nullable=False)
    unit_price = Column(Numeric(precision=10, scale=2), nullable=False)
    subtotal = Column(Numeric(precision=10, scale=2), nullable=False)
    tax_rate = Column(Numeric(precision=5, scale=2), default=0.0)
    
    # Relationships
    sales_order = relationship("SalesOrder", back_populates="items")


class SalesInvoice(Base, BaseModel):
    """Sales invoice model for customer invoices"""
    
    # Invoice information
    sales_order_id = Column(Integer, ForeignKey("salesorder.id"), nullable=False)
    invoice_number = Column(String(100), unique=True, nullable=False)
    invoice_date = Column(Date, default=date.today, nullable=False)
    due_date = Column(Date, nullable=True)
    amount = Column(Numeric(precision=10, scale=2), nullable=False)
    status = Column(String(50), default="unpaid")  # unpaid, partial, paid
    
    # Relationships
    sales_order = relationship("SalesOrder", back_populates="invoices")
    payments = relationship("SalesPayment", back_populates="invoice", cascade="all, delete-orphan")


class SalesPayment(Base, BaseModel):
    """Sales payment model for customer payments"""
    
    # Payment information
    invoice_id = Column(Integer, ForeignKey("salesinvoice.id"), nullable=False)
    payment_date = Column(Date, default=date.today, nullable=False)
    amount = Column(Numeric(precision=10, scale=2), nullable=False)
    payment_method = Column(String(255), nullable=False)  # cash, bank_transfer, check
    reference_number = Column(String(255), nullable=True)
    notes = Column(Text, nullable=True)
    
    # Relationships
    invoice = relationship("SalesInvoice", back_populates="payments")
