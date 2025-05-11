from typing import List, Optional
from datetime import date
from pydantic import BaseModel, Field
from decimal import Decimal


class SalesOrderItemBase(BaseModel):
    item_description: str
    quantity: Decimal
    unit_price: Decimal
    subtotal: Decimal
    tax_rate: Decimal = Field(default=0.0)


class SalesOrderItemCreate(SalesOrderItemBase):
    pass


class SalesOrderItemUpdate(SalesOrderItemBase):
    item_description: Optional[str] = None
    quantity: Optional[Decimal] = None
    unit_price: Optional[Decimal] = None
    subtotal: Optional[Decimal] = None
    tax_rate: Optional[Decimal] = None


class SalesOrderItem(SalesOrderItemBase):
    id: int
    sales_order_id: int
    created_at: date
    updated_at: date

    class Config:
        orm_mode = True


class SalesOrderBase(BaseModel):
    customer_id: int
    order_date: date = Field(default_factory=date.today)
    order_number: str
    status: str = Field(default="draft")
    subtotal: Decimal = Field(default=0.0)
    tax_amount: Decimal = Field(default=0.0)
    total_amount: Decimal = Field(default=0.0)
    payment_status: str = Field(default="unpaid")
    due_date: Optional[date] = None


class SalesOrderCreate(SalesOrderBase):
    items: List[SalesOrderItemCreate]


class SalesOrderUpdate(BaseModel):
    customer_id: Optional[int] = None
    order_date: Optional[date] = None
    status: Optional[str] = None
    subtotal: Optional[Decimal] = None
    tax_amount: Optional[Decimal] = None
    total_amount: Optional[Decimal] = None
    payment_status: Optional[str] = None
    due_date: Optional[date] = None
    items: Optional[List[SalesOrderItemCreate]] = None


class SalesOrder(SalesOrderBase):
    id: int
    items: List[SalesOrderItem] = []
    created_at: date
    updated_at: date

    class Config:
        orm_mode = True


class SalesInvoiceBase(BaseModel):
    sales_order_id: int
    invoice_number: str
    invoice_date: date = Field(default_factory=date.today)
    due_date: Optional[date] = None
    amount: Decimal
    status: str = Field(default="unpaid")


class SalesInvoiceCreate(SalesInvoiceBase):
    pass


class SalesInvoiceUpdate(BaseModel):
    invoice_date: Optional[date] = None
    due_date: Optional[date] = None
    amount: Optional[Decimal] = None
    status: Optional[str] = None


class SalesInvoice(SalesInvoiceBase):
    id: int
    created_at: date
    updated_at: date

    class Config:
        orm_mode = True


class SalesPaymentBase(BaseModel):
    invoice_id: int
    payment_date: date = Field(default_factory=date.today)
    amount: Decimal
    payment_method: str
    reference_number: Optional[str] = None
    notes: Optional[str] = None


class SalesPaymentCreate(SalesPaymentBase):
    pass


class SalesPaymentUpdate(BaseModel):
    payment_date: Optional[date] = None
    amount: Optional[Decimal] = None
    payment_method: Optional[str] = None
    reference_number: Optional[str] = None
    notes: Optional[str] = None


class SalesPayment(SalesPaymentBase):
    id: int
    created_at: date
    updated_at: date

    class Config:
        orm_mode = True
