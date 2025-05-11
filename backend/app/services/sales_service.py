from typing import List, Optional, Dict, Any
from datetime import date
from sqlalchemy.orm import Session
from sqlalchemy import or_
import uuid

from app.models.sales import SalesOrder, SalesOrderItem, SalesInvoice, SalesPayment
from app.schemas.sales import (
    SalesOrderCreate, 
    SalesOrderUpdate, 
    SalesOrderItemCreate,
    SalesInvoiceCreate,
    SalesInvoiceUpdate,
    SalesPaymentCreate,
    SalesPaymentUpdate
)

# Helper function to generate order number
def generate_order_number() -> str:
    """
    Generate a unique sales order number
    """
    date_part = date.today().strftime("%Y%m%d")
    random_part = str(uuid.uuid4().int)[:6]
    return f"SO-{date_part}-{random_part}"

# Sales Order CRUD operations
def create_sales_order(db: Session, order: SalesOrderCreate) -> SalesOrder:
    """
    Create a new sales order with items
    """
    # Generate order number if not provided
    if not order.order_number:
        order_number = generate_order_number()
    else:
        order_number = order.order_number
    
    # Create sales order
    db_order = SalesOrder(
        customer_id=order.customer_id,
        order_date=order.order_date,
        order_number=order_number,
        status=order.status,
        subtotal=order.subtotal,
        tax_amount=order.tax_amount,
        total_amount=order.total_amount,
        payment_status=order.payment_status,
        due_date=order.due_date
    )
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    
    # Create order items
    for item in order.items:
        db_item = SalesOrderItem(
            sales_order_id=db_order.id,
            item_description=item.item_description,
            quantity=item.quantity,
            unit_price=item.unit_price,
            subtotal=item.subtotal,
            tax_rate=item.tax_rate
        )
        db.add(db_item)
    
    db.commit()
    db.refresh(db_order)
    return db_order

def get_sales_order(db: Session, order_id: int) -> Optional[SalesOrder]:
    """
    Get a sales order by ID
    """
    return db.query(SalesOrder).filter(SalesOrder.id == order_id).first()

def get_sales_orders(
    db: Session, 
    skip: int = 0, 
    limit: int = 100,
    status: Optional[str] = None,
    search: Optional[str] = None,
    customer_id: Optional[int] = None
) -> List[SalesOrder]:
    """
    Get all sales orders with optional filtering
    """
    query = db.query(SalesOrder)
    
    # Apply status filter if provided
    if status:
        query = query.filter(SalesOrder.status == status)
    
    # Apply customer filter if provided
    if customer_id:
        query = query.filter(SalesOrder.customer_id == customer_id)
    
    # Apply search filter if provided
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            or_(
                SalesOrder.order_number.ilike(search_term)
            )
        )
    
    # Apply pagination
    return query.offset(skip).limit(limit).all()

def update_sales_order(db: Session, order_id: int, order: SalesOrderUpdate) -> SalesOrder:
    """
    Update a sales order's information
    """
    db_order = get_sales_order(db, order_id)
    
    # Update order attributes
    for key, value in order.dict(exclude_unset=True, exclude={"items"}).items():
        setattr(db_order, key, value)
    
    # Update items if provided
    if order.items is not None:
        # Delete existing items
        db.query(SalesOrderItem).filter(SalesOrderItem.sales_order_id == order_id).delete()
        
        # Create new items
        for item in order.items:
            db_item = SalesOrderItem(
                sales_order_id=order_id,
                item_description=item.item_description,
                quantity=item.quantity,
                unit_price=item.unit_price,
                subtotal=item.subtotal,
                tax_rate=item.tax_rate
            )
            db.add(db_item)
    
    db.commit()
    db.refresh(db_order)
    return db_order

def delete_sales_order(db: Session, order_id: int) -> None:
    """
    Delete a sales order
    """
    db_order = get_sales_order(db, order_id)
    db.delete(db_order)
    db.commit()

# Sales Order Item operations
def get_sales_order_items(db: Session, order_id: int) -> List[SalesOrderItem]:
    """
    Get all items for a sales order
    """
    return db.query(SalesOrderItem).filter(SalesOrderItem.sales_order_id == order_id).all()

# Sales Invoice CRUD operations
def create_sales_invoice(db: Session, invoice: SalesInvoiceCreate) -> SalesInvoice:
    """
    Create a new sales invoice
    """
    db_invoice = SalesInvoice(
        sales_order_id=invoice.sales_order_id,
        invoice_number=invoice.invoice_number,
        invoice_date=invoice.invoice_date,
        due_date=invoice.due_date,
        amount=invoice.amount,
        status=invoice.status
    )
    db.add(db_invoice)
    db.commit()
    db.refresh(db_invoice)
    return db_invoice

def get_sales_invoice(db: Session, invoice_id: int) -> Optional[SalesInvoice]:
    """
    Get a sales invoice by ID
    """
    return db.query(SalesInvoice).filter(SalesInvoice.id == invoice_id).first()

def get_sales_invoices(
    db: Session, 
    skip: int = 0, 
    limit: int = 100,
    status: Optional[str] = None,
    order_id: Optional[int] = None
) -> List[SalesInvoice]:
    """
    Get all sales invoices with optional filtering
    """
    query = db.query(SalesInvoice)
    
    # Apply status filter if provided
    if status:
        query = query.filter(SalesInvoice.status == status)
    
    # Apply order filter if provided
    if order_id:
        query = query.filter(SalesInvoice.sales_order_id == order_id)
    
    # Apply pagination
    return query.offset(skip).limit(limit).all()

def update_sales_invoice(db: Session, invoice_id: int, invoice: SalesInvoiceUpdate) -> SalesInvoice:
    """
    Update a sales invoice's information
    """
    db_invoice = get_sales_invoice(db, invoice_id)
    
    # Update invoice attributes
    for key, value in invoice.dict(exclude_unset=True).items():
        setattr(db_invoice, key, value)
    
    db.commit()
    db.refresh(db_invoice)
    return db_invoice

def delete_sales_invoice(db: Session, invoice_id: int) -> None:
    """
    Delete a sales invoice
    """
    db_invoice = get_sales_invoice(db, invoice_id)
    db.delete(db_invoice)
    db.commit()

# Sales Payment CRUD operations
def create_sales_payment(db: Session, payment: SalesPaymentCreate) -> SalesPayment:
    """
    Create a new sales payment
    """
    db_payment = SalesPayment(
        invoice_id=payment.invoice_id,
        payment_date=payment.payment_date,
        amount=payment.amount,
        payment_method=payment.payment_method,
        reference_number=payment.reference_number,
        notes=payment.notes
    )
    db.add(db_payment)
    db.commit()
    db.refresh(db_payment)
    
    # Update invoice status based on payments
    update_invoice_payment_status(db, payment.invoice_id)
    
    return db_payment

def get_sales_payment(db: Session, payment_id: int) -> Optional[SalesPayment]:
    """
    Get a sales payment by ID
    """
    return db.query(SalesPayment).filter(SalesPayment.id == payment_id).first()

def get_sales_payments(
    db: Session, 
    skip: int = 0, 
    limit: int = 100,
    invoice_id: Optional[int] = None
) -> List[SalesPayment]:
    """
    Get all sales payments with optional filtering
    """
    query = db.query(SalesPayment)
    
    # Apply invoice filter if provided
    if invoice_id:
        query = query.filter(SalesPayment.invoice_id == invoice_id)
    
    # Apply pagination
    return query.offset(skip).limit(limit).all()

def update_sales_payment(db: Session, payment_id: int, payment: SalesPaymentUpdate) -> SalesPayment:
    """
    Update a sales payment's information
    """
    db_payment = get_sales_payment(db, payment_id)
    
    # Update payment attributes
    for key, value in payment.dict(exclude_unset=True).items():
        setattr(db_payment, key, value)
    
    db.commit()
    db.refresh(db_payment)
    
    # Update invoice status based on payments
    update_invoice_payment_status(db, db_payment.invoice_id)
    
    return db_payment

def delete_sales_payment(db: Session, payment_id: int) -> None:
    """
    Delete a sales payment
    """
    db_payment = get_sales_payment(db, payment_id)
    invoice_id = db_payment.invoice_id
    
    db.delete(db_payment)
    db.commit()
    
    # Update invoice status based on remaining payments
    update_invoice_payment_status(db, invoice_id)

# Helper function to update invoice payment status
def update_invoice_payment_status(db: Session, invoice_id: int) -> None:
    """
    Update invoice payment status based on payments
    """
    invoice = get_sales_invoice(db, invoice_id)
    payments = get_sales_payments(db, invoice_id=invoice_id)
    
    total_paid = sum(payment.amount for payment in payments)
    
    if total_paid >= invoice.amount:
        invoice.status = "paid"
    elif total_paid > 0:
        invoice.status = "partial"
    else:
        invoice.status = "unpaid"
    
    db.commit()
    
    # Update order payment status based on invoices
    update_order_payment_status(db, invoice.sales_order_id)

# Helper function to update order payment status
def update_order_payment_status(db: Session, order_id: int) -> None:
    """
    Update order payment status based on invoices
    """
    order = get_sales_order(db, order_id)
    invoices = get_sales_invoices(db, order_id=order_id)
    
    if not invoices:
        order.payment_status = "unpaid"
    elif all(invoice.status == "paid" for invoice in invoices):
        order.payment_status = "paid"
    elif any(invoice.status in ["paid", "partial"] for invoice in invoices):
        order.payment_status = "partial"
    else:
        order.payment_status = "unpaid"
    
    db.commit()
