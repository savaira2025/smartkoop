from typing import Optional, List
from datetime import date
from pydantic import BaseModel, EmailStr, Field, validator
from decimal import Decimal

# Base schemas for Member
class MemberBase(BaseModel):
    name: str
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    status: Optional[str] = "calon_anggota"
    registration_method: Optional[str] = "web"

class MemberCreate(MemberBase):
    member_id: Optional[str] = None
    join_date: Optional[date] = None
    principal_savings: Optional[Decimal] = Field(default=0, ge=0)
    mandatory_savings: Optional[Decimal] = Field(default=0, ge=0)
    voluntary_savings: Optional[Decimal] = Field(default=0, ge=0)
    user_id: Optional[int] = None

class MemberUpdate(MemberBase):
    member_id: Optional[str] = None
    join_date: Optional[date] = None
    principal_savings: Optional[Decimal] = Field(default=None, ge=0)
    mandatory_savings: Optional[Decimal] = Field(default=None, ge=0)
    voluntary_savings: Optional[Decimal] = Field(default=None, ge=0)
    unpaid_mandatory: Optional[Decimal] = Field(default=None, ge=0)
    shu_balance: Optional[Decimal] = Field(default=None, ge=0)
    user_id: Optional[int] = None

class MemberResponse(MemberBase):
    id: int
    member_id: str
    join_date: date
    principal_savings: Decimal
    mandatory_savings: Decimal
    voluntary_savings: Decimal
    unpaid_mandatory: Decimal
    shu_balance: Decimal
    user_id: Optional[int] = None
    created_at: date
    updated_at: date

    class Config:
        orm_mode = True

# Base schemas for SavingsTransaction
class SavingsTransactionBase(BaseModel):
    transaction_date: Optional[date] = None
    amount: Decimal = Field(gt=0)
    transaction_type: str
    description: Optional[str] = None
    status: Optional[str] = "completed"

class SavingsTransactionCreate(SavingsTransactionBase):
    pass

class SavingsTransactionUpdate(SavingsTransactionBase):
    pass

class SavingsTransactionResponse(SavingsTransactionBase):
    id: int
    member_id: int
    transaction_date: date
    created_at: date
    updated_at: date

    class Config:
        orm_mode = True

# Base schemas for SHUDistribution
class SHUDistributionBase(BaseModel):
    fiscal_year: int
    amount: Decimal = Field(gt=0)
    distribution_date: Optional[date] = None
    distribution_method: Optional[str] = "account_credit"
    status: Optional[str] = "pending"

class SHUDistributionCreate(SHUDistributionBase):
    pass

class SHUDistributionUpdate(SHUDistributionBase):
    pass

class SHUDistributionResponse(SHUDistributionBase):
    id: int
    member_id: int
    distribution_date: date
    created_at: date
    updated_at: date

    class Config:
        orm_mode = True

# Extended Member response with related data
class MemberDetailResponse(MemberResponse):
    savings_transactions: List[SavingsTransactionResponse] = []
    shu_distributions: List[SHUDistributionResponse] = []

    class Config:
        orm_mode = True
