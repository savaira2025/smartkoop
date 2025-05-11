from sqlalchemy import Column, String, Boolean, Integer, ForeignKey, Date, Numeric, Text
from sqlalchemy.orm import relationship
from app.db.database import Base
from app.models.base import BaseModel
from datetime import date

class ChartOfAccounts(Base, BaseModel):
    """Chart of accounts model for accounting structure"""
    
    # Account information
    account_number = Column(String, unique=True, nullable=False)
    account_name = Column(String, nullable=False)
    account_type = Column(String, nullable=False)  # asset, liability, equity, revenue, expense
    account_category = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    
    # Relationships
    ledger_entries = relationship("LedgerEntry", back_populates="account")


class JournalEntry(Base, BaseModel):
    """Journal entry model for accounting transactions"""
    
    # Entry information
    entry_number = Column(String, unique=True, nullable=False)
    entry_date = Column(Date, default=date.today, nullable=False)
    description = Column(Text, nullable=True)
    entry_type = Column(String, nullable=False)  # manual, system, adjustment
    status = Column(String, default="draft")  # draft, posted, reversed
    created_by = Column(Integer, ForeignKey("user.id"), nullable=True)
    
    # Relationships
    ledger_entries = relationship("LedgerEntry", back_populates="journal_entry", cascade="all, delete-orphan")
    fiscal_period = relationship("FiscalPeriod", back_populates="journal_entries")
    fiscal_period_id = Column(Integer, ForeignKey("fiscalperiod.id"), nullable=False)


class LedgerEntry(Base, BaseModel):
    """Ledger entry model for individual account entries"""
    
    # Entry information
    journal_entry_id = Column(Integer, ForeignKey("journalentry.id"), nullable=False)
    account_id = Column(Integer, ForeignKey("chartofaccounts.id"), nullable=False)
    debit_amount = Column(Numeric(precision=10, scale=2), default=0.0)
    credit_amount = Column(Numeric(precision=10, scale=2), default=0.0)
    description = Column(Text, nullable=True)
    
    # Relationships
    journal_entry = relationship("JournalEntry", back_populates="ledger_entries")
    account = relationship("ChartOfAccounts", back_populates="ledger_entries")


class FiscalPeriod(Base, BaseModel):
    """Fiscal period model for accounting periods"""
    
    # Period information
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    period_name = Column(String, nullable=False)
    status = Column(String, default="open")  # open, closed
    
    # Relationships
    journal_entries = relationship("JournalEntry", back_populates="fiscal_period")
    payrolls = relationship("Payroll", back_populates="fiscal_period")


class Payroll(Base, BaseModel):
    """Payroll model for employee payroll"""
    
    # Payroll information
    fiscal_period_id = Column(Integer, ForeignKey("fiscalperiod.id"), nullable=False)
    payroll_date = Column(Date, default=date.today, nullable=False)
    status = Column(String, default="draft")  # draft, approved, paid
    total_amount = Column(Numeric(precision=10, scale=2), default=0.0)
    
    # Relationships
    fiscal_period = relationship("FiscalPeriod", back_populates="payrolls")
    payroll_items = relationship("PayrollItem", back_populates="payroll", cascade="all, delete-orphan")


class PayrollItem(Base, BaseModel):
    """Payroll item model for individual employee payroll items"""
    
    # Item information
    payroll_id = Column(Integer, ForeignKey("payroll.id"), nullable=False)
    employee_id = Column(Integer, ForeignKey("employee.id"), nullable=False)
    gross_salary = Column(Numeric(precision=10, scale=2), nullable=False)
    deductions = Column(Numeric(precision=10, scale=2), default=0.0)
    net_salary = Column(Numeric(precision=10, scale=2), nullable=False)
    
    # Relationships
    payroll = relationship("Payroll", back_populates="payroll_items")
    employee = relationship("Employee", back_populates="payroll_items")


class Employee(Base, BaseModel):
    """Employee model for payroll employees"""
    
    # Employee information
    name = Column(String, nullable=False)
    employee_id = Column(String, unique=True, nullable=False)
    position = Column(String, nullable=True)
    hire_date = Column(Date, nullable=False)
    base_salary = Column(Numeric(precision=10, scale=2), nullable=False)
    bank_account = Column(String, nullable=True)
    tax_id = Column(String, nullable=True)
    status = Column(String, default="active")  # active, inactive
    
    # Relationships
    payroll_items = relationship("PayrollItem", back_populates="employee")
