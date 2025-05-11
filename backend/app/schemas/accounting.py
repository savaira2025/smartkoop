from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import date
from decimal import Decimal

# Base schemas for ChartOfAccounts
class ChartOfAccountsBase(BaseModel):
    account_number: str
    account_name: str
    account_type: str
    account_category: Optional[str] = None
    is_active: Optional[bool] = Field(default=True)

class ChartOfAccountsCreate(ChartOfAccountsBase):
    pass

class ChartOfAccountsUpdate(BaseModel):
    account_name: Optional[str] = None
    account_type: Optional[str] = None
    account_category: Optional[str] = None
    is_active: Optional[bool] = None

# Base schemas for JournalEntry
class JournalEntryBase(BaseModel):
    entry_number: str
    entry_date: date
    description: Optional[str] = None
    entry_type: str
    status: Optional[str] = Field(default="draft")
    created_by: Optional[int] = None
    fiscal_period_id: int

class JournalEntryCreate(JournalEntryBase):
    pass

class JournalEntryUpdate(BaseModel):
    entry_date: Optional[date] = None
    description: Optional[str] = None
    entry_type: Optional[str] = None
    status: Optional[str] = None
    created_by: Optional[int] = None
    fiscal_period_id: Optional[int] = None

# Base schemas for LedgerEntry
class LedgerEntryBase(BaseModel):
    journal_entry_id: int
    account_id: int
    debit_amount: Decimal = Field(default=0.0)
    credit_amount: Decimal = Field(default=0.0)
    description: Optional[str] = None

class LedgerEntryCreate(LedgerEntryBase):
    pass

class LedgerEntryUpdate(BaseModel):
    debit_amount: Optional[Decimal] = None
    credit_amount: Optional[Decimal] = None
    description: Optional[str] = None

# Base schemas for FiscalPeriod
class FiscalPeriodBase(BaseModel):
    start_date: date
    end_date: date
    period_name: str
    status: Optional[str] = Field(default="open")

class FiscalPeriodCreate(FiscalPeriodBase):
    pass

class FiscalPeriodUpdate(BaseModel):
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    period_name: Optional[str] = None
    status: Optional[str] = None

# Base schemas for Payroll
class PayrollBase(BaseModel):
    fiscal_period_id: int
    payroll_date: date
    status: Optional[str] = Field(default="draft")
    total_amount: Decimal = Field(default=0.0)

class PayrollCreate(PayrollBase):
    pass

class PayrollUpdate(BaseModel):
    payroll_date: Optional[date] = None
    status: Optional[str] = None
    total_amount: Optional[Decimal] = None

# Base schemas for PayrollItem
class PayrollItemBase(BaseModel):
    payroll_id: int
    employee_id: int
    gross_salary: Decimal
    deductions: Decimal = Field(default=0.0)
    net_salary: Decimal

class PayrollItemCreate(PayrollItemBase):
    pass

class PayrollItemUpdate(BaseModel):
    gross_salary: Optional[Decimal] = None
    deductions: Optional[Decimal] = None
    net_salary: Optional[Decimal] = None

# Base schemas for Employee
class EmployeeBase(BaseModel):
    name: str
    employee_id: str
    position: Optional[str] = None
    hire_date: date
    base_salary: Decimal
    bank_account: Optional[str] = None
    tax_id: Optional[str] = None
    status: Optional[str] = Field(default="active")

class EmployeeCreate(EmployeeBase):
    pass

class EmployeeUpdate(BaseModel):
    name: Optional[str] = None
    position: Optional[str] = None
    hire_date: Optional[date] = None
    base_salary: Optional[Decimal] = None
    bank_account: Optional[str] = None
    tax_id: Optional[str] = None
    status: Optional[str] = None

# Response schemas
class LedgerEntry(LedgerEntryBase):
    id: int
    created_at: date
    updated_at: Optional[date] = None

    class Config:
        orm_mode = True

class Employee(EmployeeBase):
    id: int
    created_at: date
    updated_at: Optional[date] = None

    class Config:
        orm_mode = True

class PayrollItem(PayrollItemBase):
    id: int
    created_at: date
    updated_at: Optional[date] = None
    employee: Employee

    class Config:
        orm_mode = True

class Payroll(PayrollBase):
    id: int
    created_at: date
    updated_at: Optional[date] = None
    payroll_items: List[PayrollItem] = []

    class Config:
        orm_mode = True

class FiscalPeriod(FiscalPeriodBase):
    id: int
    created_at: date
    updated_at: Optional[date] = None
    payrolls: List[Payroll] = []

    class Config:
        orm_mode = True

class ChartOfAccounts(ChartOfAccountsBase):
    id: int
    created_at: date
    updated_at: Optional[date] = None
    ledger_entries: List[LedgerEntry] = []

    class Config:
        orm_mode = True

class JournalEntry(JournalEntryBase):
    id: int
    created_at: date
    updated_at: Optional[date] = None
    ledger_entries: List[LedgerEntry] = []
    fiscal_period: FiscalPeriod

    class Config:
        orm_mode = True
