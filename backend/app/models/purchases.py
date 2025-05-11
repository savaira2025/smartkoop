from sqlalchemy import Column, String, Boolean, Integer, ForeignKey, Date, Numeric, Text
from sqlalchemy.orm import relationship
from app.db.database import Base
from app.models.base import BaseModel
from datetime import date

class PurchaseOrder(Base, BaseModel):
    """Purchase order model for supplier orders"""
    
    # Order information
    supplier_id = Column(Integer, ForeignKey("supplier.id"), nullable=False)
    order_date = Column(Date, default=date.today, nullable=False)
    order_number = Column(String, unique=True, nullable=False)
    status = Column(String, default="draft")  # draft, approved, completed, cancelled
    
    # Financial information
    subtotal = Column(Numeric(precision=10, scale=2), default=0.0)
    tax_amount = Column(Numeric(precision=10, scale=2), default=0.0)
    total_amount = Column(Numeric(precision=10, scale=2), default=0.0)
    payment_status = Column(String, default="unpaid")  # unpaid, partial, paid
    due_date = Column(Date, nullable=True)
    
    # Relationships
    supplier = relationship("Supplier", back_populates="purchase_orders")
    items = relationship("PurchaseOrderItem", back_populates="purchase_order", cascade="all, delete-orphan")
    invoices = relationship("SupplierInvoice", back_populates="purchase_order", cascade="all, delete-orphan")


class PurchaseOrderItem(Base, BaseModel):
    """Purchase order item model for items in a purchase order"""
    
    # Item information
    purchase_order_id = Column(Integer, ForeignKey("purchaseorder.id"), nullable=False)
    item_description = Column(String, nullable=False)
    quantity = Column(Numeric(precision=10, scale=2), nullable=False)
    unit_price = Column(Numeric(precision=10, scale=2), nullable=False)
    subtotal = Column(Numeric(precision=10, scale=2), nullable=False)
    tax_rate = Column(Numeric(precision=5, scale=2), default=0.0)
    
    # Relationships
    purchase_order = relationship("PurchaseOrder", back_populates="items")


class SupplierInvoice(Base, BaseModel):
    """Supplier invoice model for supplier invoices"""
    
    # Invoice information
    purchase_order_id = Column(Integer, ForeignKey("purchaseorder.id"), nullable=False)
    invoice_number = Column(String, nullable=False)
    invoice_date = Column(Date, default=date.today, nullable=False)
    due_date = Column(Date, nullable=True)
    amount = Column(Numeric(precision=10, scale=2), nullable=False)
    status = Column(String, default="unpaid")  # unpaid, partial, paid
    
    # Relationships
    purchase_order = relationship("PurchaseOrder", back_populates="invoices")
    payments = relationship("SupplierPayment", back_populates="invoice", cascade="all, delete-orphan")


class SupplierPayment(Base, BaseModel):
    """Supplier payment model for payments to suppliers"""
    
    # Payment information
    invoice_id = Column(Integer, ForeignKey("supplierinvoice.id"), nullable=False)
    payment_date = Column(Date, default=date.today, nullable=False)
    amount = Column(Numeric(precision=10, scale=2), nullable=False)
    payment_method = Column(String, nullable=False)  # cash, bank_transfer, check
    reference_number = Column(String, nullable=True)
    notes = Column(Text, nullable=True)
    
    # Relationships
    invoice = relationship("SupplierInvoice", back_populates="payments")
