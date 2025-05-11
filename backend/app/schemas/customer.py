from typing import Optional
from pydantic import BaseModel, EmailStr
from datetime import datetime

# Base Customer Schema
class CustomerBase(BaseModel):
    name: str
    contact_person: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    payment_terms: Optional[str] = None
    credit_limit: Optional[float] = 0.0
    tax_id: Optional[str] = None
    status: str = "active"

# Schema for creating a Customer
class CustomerCreate(CustomerBase):
    pass

# Schema for updating a Customer
class CustomerUpdate(CustomerBase):
    name: Optional[str] = None
    status: Optional[str] = None

# Schema for Customer response
class CustomerResponse(CustomerBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True
