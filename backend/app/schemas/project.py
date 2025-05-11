from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import date
from decimal import Decimal

# Base schemas for Project
class ProjectBase(BaseModel):
    project_name: str
    project_number: str
    customer_id: int
    start_date: date
    end_date: Optional[date] = None
    status: Optional[str] = Field(default="active")
    budget_amount: Decimal = Field(default=0.0)
    description: Optional[str] = None

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(BaseModel):
    project_name: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    status: Optional[str] = None
    budget_amount: Optional[Decimal] = None
    description: Optional[str] = None

# Base schemas for ProjectTask
class ProjectTaskBase(BaseModel):
    project_id: int
    task_name: str
    description: Optional[str] = None
    start_date: date
    due_date: Optional[date] = None
    completion_date: Optional[date] = None
    status: Optional[str] = Field(default="pending")
    estimated_hours: Decimal = Field(default=0.0)
    actual_hours: Decimal = Field(default=0.0)
    hourly_rate: Decimal = Field(default=0.0)

class ProjectTaskCreate(ProjectTaskBase):
    pass

class ProjectTaskUpdate(BaseModel):
    task_name: Optional[str] = None
    description: Optional[str] = None
    start_date: Optional[date] = None
    due_date: Optional[date] = None
    completion_date: Optional[date] = None
    status: Optional[str] = None
    estimated_hours: Optional[Decimal] = None
    actual_hours: Optional[Decimal] = None
    hourly_rate: Optional[Decimal] = None

# Base schemas for ProjectTimeEntry
class ProjectTimeEntryBase(BaseModel):
    task_id: int
    member_id: int
    date: date
    hours: Decimal
    description: Optional[str] = None
    billable: Optional[bool] = Field(default=True)

class ProjectTimeEntryCreate(ProjectTimeEntryBase):
    pass

class ProjectTimeEntryUpdate(BaseModel):
    date: Optional[date] = None
    hours: Optional[Decimal] = None
    description: Optional[str] = None
    billable: Optional[bool] = None

# Base schemas for ProjectInvoice
class ProjectInvoiceBase(BaseModel):
    project_id: int
    invoice_number: str
    invoice_date: date
    due_date: Optional[date] = None
    status: Optional[str] = Field(default="draft")
    subtotal: Decimal = Field(default=0.0)
    tax_amount: Decimal = Field(default=0.0)
    total_amount: Decimal = Field(default=0.0)

class ProjectInvoiceCreate(ProjectInvoiceBase):
    pass

class ProjectInvoiceUpdate(BaseModel):
    invoice_date: Optional[date] = None
    due_date: Optional[date] = None
    status: Optional[str] = None
    subtotal: Optional[Decimal] = None
    tax_amount: Optional[Decimal] = None
    total_amount: Optional[Decimal] = None

# Base schemas for ProjectInvoiceItem
class ProjectInvoiceItemBase(BaseModel):
    invoice_id: int
    description: str
    quantity: Decimal
    unit_price: Decimal
    subtotal: Decimal
    tax_rate: Decimal = Field(default=0.0)
    task_id: Optional[int] = None

class ProjectInvoiceItemCreate(ProjectInvoiceItemBase):
    pass

class ProjectInvoiceItemUpdate(BaseModel):
    description: Optional[str] = None
    quantity: Optional[Decimal] = None
    unit_price: Optional[Decimal] = None
    subtotal: Optional[Decimal] = None
    tax_rate: Optional[Decimal] = None
    task_id: Optional[int] = None

# Base schemas for ProjectPayment
class ProjectPaymentBase(BaseModel):
    invoice_id: int
    payment_date: date
    amount: Decimal
    payment_method: str
    reference_number: Optional[str] = None
    notes: Optional[str] = None

class ProjectPaymentCreate(ProjectPaymentBase):
    pass

class ProjectPaymentUpdate(BaseModel):
    payment_date: Optional[date] = None
    amount: Optional[Decimal] = None
    payment_method: Optional[str] = None
    reference_number: Optional[str] = None
    notes: Optional[str] = None

# Response schemas
class ProjectTimeEntry(ProjectTimeEntryBase):
    id: int
    created_at: date
    updated_at: Optional[date] = None

    class Config:
        orm_mode = True

class ProjectTask(ProjectTaskBase):
    id: int
    created_at: date
    updated_at: Optional[date] = None
    time_entries: List[ProjectTimeEntry] = []

    class Config:
        orm_mode = True

class ProjectPayment(ProjectPaymentBase):
    id: int
    created_at: date
    updated_at: Optional[date] = None

    class Config:
        orm_mode = True

class ProjectInvoiceItem(ProjectInvoiceItemBase):
    id: int
    created_at: date
    updated_at: Optional[date] = None

    class Config:
        orm_mode = True

class ProjectInvoice(ProjectInvoiceBase):
    id: int
    created_at: date
    updated_at: Optional[date] = None
    items: List[ProjectInvoiceItem] = []
    payments: List[ProjectPayment] = []

    class Config:
        orm_mode = True

class Project(ProjectBase):
    id: int
    created_at: date
    updated_at: Optional[date] = None
    total_invoiced: Decimal
    total_cost: Decimal
    tasks: List[ProjectTask] = []
    invoices: List[ProjectInvoice] = []

    class Config:
        orm_mode = True
