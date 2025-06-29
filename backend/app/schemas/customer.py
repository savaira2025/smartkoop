from typing import Optional, List
from pydantic import BaseModel, EmailStr
from datetime import datetime

# Customer Contact Schemas
class CustomerContactBase(BaseModel):
    name: str
    title: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    department: Optional[str] = None
    is_primary: bool = False

class CustomerContactCreate(CustomerContactBase):
    pass

class CustomerContactUpdate(CustomerContactBase):
    name: Optional[str] = None

class CustomerContactResponse(CustomerContactBase):
    id: int
    customer_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

# Base Customer Schema
class CustomerBase(BaseModel):
    name: str
    contact_person: Optional[str] = None  # Keep for backward compatibility
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    payment_terms: Optional[str] = None
    credit_limit: Optional[float] = 0.0
    tax_id: Optional[str] = None
    status: str = "active"

# Schema for creating a Customer
class CustomerCreate(CustomerBase):
    contacts: Optional[List[CustomerContactCreate]] = []

# Schema for updating a Customer
class CustomerUpdate(CustomerBase):
    name: Optional[str] = None
    status: Optional[str] = None
    contacts: Optional[List[CustomerContactCreate]] = None

# Schema for Customer response
class CustomerResponse(CustomerBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    contacts: List[CustomerContactResponse] = []

    class Config:
        orm_mode = True
