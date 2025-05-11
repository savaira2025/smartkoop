from sqlalchemy import Column, String, Boolean, Integer, ForeignKey, Date, Numeric, Text
from sqlalchemy.orm import relationship
from app.db.database import Base
from app.models.base import BaseModel
from datetime import date

class Project(Base, BaseModel):
    """Project model for tracking projects"""
    
    # Project information
    project_name = Column(String, nullable=False)
    project_number = Column(String, unique=True, nullable=False)
    customer_id = Column(Integer, ForeignKey("customer.id"), nullable=False)
    start_date = Column(Date, default=date.today, nullable=False)
    end_date = Column(Date, nullable=True)
    status = Column(String, default="active")  # active, completed, cancelled, on-hold
    
    # Financial information
    budget_amount = Column(Numeric(precision=10, scale=2), default=0.0)
    total_invoiced = Column(Numeric(precision=10, scale=2), default=0.0)
    total_cost = Column(Numeric(precision=10, scale=2), default=0.0)
    
    # Description
    description = Column(Text, nullable=True)
    
    # Relationships
    customer = relationship("Customer", back_populates="projects")
    tasks = relationship("ProjectTask", back_populates="project", cascade="all, delete-orphan")
    invoices = relationship("ProjectInvoice", back_populates="project", cascade="all, delete-orphan")


class ProjectTask(Base, BaseModel):
    """Project task model for tracking tasks within a project"""
    
    # Task information
    project_id = Column(Integer, ForeignKey("project.id"), nullable=False)
    task_name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    start_date = Column(Date, default=date.today, nullable=False)
    due_date = Column(Date, nullable=True)
    completion_date = Column(Date, nullable=True)
    status = Column(String, default="pending")  # pending, in-progress, completed, cancelled
    
    # Financial information
    estimated_hours = Column(Numeric(precision=10, scale=2), default=0.0)
    actual_hours = Column(Numeric(precision=10, scale=2), default=0.0)
    hourly_rate = Column(Numeric(precision=10, scale=2), default=0.0)
    
    # Relationships
    project = relationship("Project", back_populates="tasks")
    time_entries = relationship("ProjectTimeEntry", back_populates="task", cascade="all, delete-orphan")
    invoice_items = relationship("ProjectInvoiceItem", back_populates="task")


class ProjectTimeEntry(Base, BaseModel):
    """Project time entry model for tracking time spent on tasks"""
    
    # Time entry information
    task_id = Column(Integer, ForeignKey("projecttask.id"), nullable=False)
    member_id = Column(Integer, ForeignKey("member.id"), nullable=False)
    date = Column(Date, default=date.today, nullable=False)
    hours = Column(Numeric(precision=10, scale=2), nullable=False)
    description = Column(Text, nullable=True)
    billable = Column(Boolean, default=True)
    
    # Relationships
    task = relationship("ProjectTask", back_populates="time_entries")
    member = relationship("Member", back_populates="time_entries")


class ProjectInvoice(Base, BaseModel):
    """Project invoice model for invoicing projects"""
    
    # Invoice information
    project_id = Column(Integer, ForeignKey("project.id"), nullable=False)
    invoice_number = Column(String, unique=True, nullable=False)
    invoice_date = Column(Date, default=date.today, nullable=False)
    due_date = Column(Date, nullable=True)
    status = Column(String, default="draft")  # draft, sent, paid, cancelled
    
    # Financial information
    subtotal = Column(Numeric(precision=10, scale=2), default=0.0)
    tax_amount = Column(Numeric(precision=10, scale=2), default=0.0)
    total_amount = Column(Numeric(precision=10, scale=2), default=0.0)
    
    # Relationships
    project = relationship("Project", back_populates="invoices")
    items = relationship("ProjectInvoiceItem", back_populates="invoice", cascade="all, delete-orphan")
    payments = relationship("ProjectPayment", back_populates="invoice", cascade="all, delete-orphan")


class ProjectInvoiceItem(Base, BaseModel):
    """Project invoice item model for items in a project invoice"""
    
    # Item information
    invoice_id = Column(Integer, ForeignKey("projectinvoice.id"), nullable=False)
    description = Column(String, nullable=False)
    quantity = Column(Numeric(precision=10, scale=2), nullable=False)
    unit_price = Column(Numeric(precision=10, scale=2), nullable=False)
    subtotal = Column(Numeric(precision=10, scale=2), nullable=False)
    tax_rate = Column(Numeric(precision=5, scale=2), default=0.0)
    
    # Optional task reference
    task_id = Column(Integer, ForeignKey("projecttask.id"), nullable=True)
    
    # Relationships
    invoice = relationship("ProjectInvoice", back_populates="items")
    task = relationship("ProjectTask", back_populates="invoice_items")


class ProjectPayment(Base, BaseModel):
    """Project payment model for payments against project invoices"""
    
    # Payment information
    invoice_id = Column(Integer, ForeignKey("projectinvoice.id"), nullable=False)
    payment_date = Column(Date, default=date.today, nullable=False)
    amount = Column(Numeric(precision=10, scale=2), nullable=False)
    payment_method = Column(String, nullable=False)  # cash, bank_transfer, check
    reference_number = Column(String, nullable=True)
    notes = Column(Text, nullable=True)
    
    # Relationships
    invoice = relationship("ProjectInvoice", back_populates="payments")
