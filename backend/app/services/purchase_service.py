from typing import List, Optional, Dict, Any
from datetime import date
from sqlalchemy.orm import Session
from sqlalchemy import or_
import uuid

from app.models.purchases import PurchaseOrder, PurchaseOrderItem, SupplierInvoice, SupplierPayment
from app.schemas.purchase import (
    PurchaseOrderCreate, 
    PurchaseOrderUpdate, 
    PurchaseOrderItemCreate,
    SupplierInvoiceCreate,
    SupplierInvoiceUpdate,
    SupplierPaymentCreate,
    SupplierPaymentUpdate
)

# Helper function to generate order number
def generate_order_number() -> str:
    """
    Generate a unique purchase order number
    """
    date_part = date.today().strftime("%Y%m%d")
    random_part = str(uuid.uuid4().int)[:6]
    return f"PO-{date_part}-{random_part}"

# Purchase Order CRUD operations
def create_purchase_order(db: Session, order: PurchaseOrderCreate) -> PurchaseOrder:
    """
    Create a new purchase order with items
    """
    # Validate required fields
    if not order.supplier_id:
        raise ValueError("Supplier ID is required")
    
    if not order.order_date:
        raise ValueError("Order date is required")
    
    if not order.status:
        raise ValueError("Status is required")
    
    if not order.items or len(order.items) == 0:
        raise ValueError("At least one item is required")
    
    # Generate order number if not provided
    if not order.order_number:
        order_number = generate_order_number()
    else:
        order_number = order.order_number
    
    # Validate numeric fields
    if order.subtotal < 0:
        raise ValueError("Subtotal cannot be negative")
    
    if order.tax_amount < 0:
        raise ValueError("Tax amount cannot be negative")
    
    if order.total_amount < 0:
        raise ValueError("Total amount cannot be negative")
    
    # Create purchase order
    try:
        db_order = PurchaseOrder(
            supplier_id=order.supplier_id,
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
            # Validate item fields
            if not item.item_description:
                raise ValueError("Item description is required")
            
            if item.quantity <= 0:
                raise ValueError("Item quantity must be greater than zero")
            
            if item.unit_price < 0:
                raise ValueError("Item unit price cannot be negative")
            
            if item.subtotal < 0:
                raise ValueError("Item subtotal cannot be negative")
            
            db_item = PurchaseOrderItem(
                purchase_order_id=db_order.id,
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
    except Exception as e:
        db.rollback()
        raise ValueError(f"Failed to create purchase order: {str(e)}")

def get_purchase_order(db: Session, order_id: int) -> Optional[PurchaseOrder]:
    """
    Get a purchase order by ID
    """
    return db.query(PurchaseOrder).filter(PurchaseOrder.id == order_id).first()

def get_purchase_orders(
    db: Session, 
    skip: int = 0, 
    limit: int = 100,
    status: Optional[str] = None,
    search: Optional[str] = None,
    supplier_id: Optional[int] = None
) -> List[PurchaseOrder]:
    """
    Get all purchase orders with optional filtering
    """
    query = db.query(PurchaseOrder)
    
    # Apply status filter if provided
    if status:
        query = query.filter(PurchaseOrder.status == status)
    
    # Apply supplier filter if provided
    if supplier_id:
        query = query.filter(PurchaseOrder.supplier_id == supplier_id)
    
    # Apply search filter if provided
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            or_(
                PurchaseOrder.order_number.ilike(search_term)
            )
        )
    
    # Apply pagination
    return query.offset(skip).limit(limit).all()

def update_purchase_order(db: Session, order_id: int, order: PurchaseOrderUpdate) -> PurchaseOrder:
    """
    Update a purchase order's information
    """
    db_order = get_purchase_order(db, order_id)
    if not db_order:
        raise ValueError(f"Purchase order with ID {order_id} not found")
    
    # Validate numeric fields if provided
    if order.subtotal is not None and order.subtotal < 0:
        raise ValueError("Subtotal cannot be negative")
    
    if order.tax_amount is not None and order.tax_amount < 0:
        raise ValueError("Tax amount cannot be negative")
    
    if order.total_amount is not None and order.total_amount < 0:
        raise ValueError("Total amount cannot be negative")
    
    try:
        # Update order attributes
        for key, value in order.dict(exclude_unset=True, exclude={"items"}).items():
            setattr(db_order, key, value)
        
        # Update items if provided
        if order.items is not None:
            # Validate items
            if len(order.items) == 0:
                raise ValueError("At least one item is required")
            
            # Delete existing items
            db.query(PurchaseOrderItem).filter(PurchaseOrderItem.purchase_order_id == order_id).delete()
            
            # Create new items
            for item in order.items:
                # Validate item fields
                if not item.item_description:
                    raise ValueError("Item description is required")
                
                if item.quantity <= 0:
                    raise ValueError("Item quantity must be greater than zero")
                
                if item.unit_price < 0:
                    raise ValueError("Item unit price cannot be negative")
                
                if item.subtotal < 0:
                    raise ValueError("Item subtotal cannot be negative")
                
                db_item = PurchaseOrderItem(
                    purchase_order_id=order_id,
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
    except Exception as e:
        db.rollback()
        raise ValueError(f"Failed to update purchase order: {str(e)}")

def delete_purchase_order(db: Session, order_id: int) -> None:
    """
    Delete a purchase order
    """
    db_order = get_purchase_order(db, order_id)
    db.delete(db_order)
    db.commit()

# Purchase Order Item operations
def get_purchase_order_items(db: Session, order_id: int) -> List[PurchaseOrderItem]:
    """
    Get all items for a purchase order
    """
    return db.query(PurchaseOrderItem).filter(PurchaseOrderItem.purchase_order_id == order_id).all()

# Supplier Invoice CRUD operations
def create_supplier_invoice(db: Session, invoice: SupplierInvoiceCreate) -> SupplierInvoice:
    """
    Create a new supplier invoice
    """
    db_invoice = SupplierInvoice(
        purchase_order_id=invoice.purchase_order_id,
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

def get_supplier_invoice(db: Session, invoice_id: int) -> Optional[SupplierInvoice]:
    """
    Get a supplier invoice by ID
    """
    return db.query(SupplierInvoice).filter(SupplierInvoice.id == invoice_id).first()

def get_supplier_invoices(
    db: Session, 
    skip: int = 0, 
    limit: int = 100,
    status: Optional[str] = None,
    order_id: Optional[int] = None
) -> List[SupplierInvoice]:
    """
    Get all supplier invoices with optional filtering
    """
    query = db.query(SupplierInvoice)
    
    # Apply status filter if provided
    if status:
        query = query.filter(SupplierInvoice.status == status)
    
    # Apply order filter if provided
    if order_id:
        query = query.filter(SupplierInvoice.purchase_order_id == order_id)
    
    # Apply pagination
    return query.offset(skip).limit(limit).all()

def update_supplier_invoice(db: Session, invoice_id: int, invoice: SupplierInvoiceUpdate) -> SupplierInvoice:
    """
    Update a supplier invoice's information
    """
    db_invoice = get_supplier_invoice(db, invoice_id)
    
    # Update invoice attributes
    for key, value in invoice.dict(exclude_unset=True).items():
        setattr(db_invoice, key, value)
    
    db.commit()
    db.refresh(db_invoice)
    return db_invoice

def delete_supplier_invoice(db: Session, invoice_id: int) -> None:
    """
    Delete a supplier invoice
    """
    db_invoice = get_supplier_invoice(db, invoice_id)
    db.delete(db_invoice)
    db.commit()

# Supplier Payment CRUD operations
def create_supplier_payment(db: Session, payment: SupplierPaymentCreate) -> SupplierPayment:
    """
    Create a new supplier payment
    """
    db_payment = SupplierPayment(
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

def get_supplier_payment(db: Session, payment_id: int) -> Optional[SupplierPayment]:
    """
    Get a supplier payment by ID
    """
    return db.query(SupplierPayment).filter(SupplierPayment.id == payment_id).first()

def get_supplier_payments(
    db: Session, 
    skip: int = 0, 
    limit: int = 100,
    invoice_id: Optional[int] = None
) -> List[SupplierPayment]:
    """
    Get all supplier payments with optional filtering
    """
    query = db.query(SupplierPayment)
    
    # Apply invoice filter if provided
    if invoice_id:
        query = query.filter(SupplierPayment.invoice_id == invoice_id)
    
    # Apply pagination
    return query.offset(skip).limit(limit).all()

def update_supplier_payment(db: Session, payment_id: int, payment: SupplierPaymentUpdate) -> SupplierPayment:
    """
    Update a supplier payment's information
    """
    db_payment = get_supplier_payment(db, payment_id)
    
    # Update payment attributes
    for key, value in payment.dict(exclude_unset=True).items():
        setattr(db_payment, key, value)
    
    db.commit()
    db.refresh(db_payment)
    
    # Update invoice status based on payments
    update_invoice_payment_status(db, db_payment.invoice_id)
    
    return db_payment

def delete_supplier_payment(db: Session, payment_id: int) -> None:
    """
    Delete a supplier payment
    """
    db_payment = get_supplier_payment(db, payment_id)
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
    invoice = get_supplier_invoice(db, invoice_id)
    payments = get_supplier_payments(db, invoice_id=invoice_id)
    
    total_paid = sum(payment.amount for payment in payments)
    
    if total_paid >= invoice.amount:
        invoice.status = "paid"
    elif total_paid > 0:
        invoice.status = "partial"
    else:
        invoice.status = "unpaid"
    
    db.commit()
    
    # Update order payment status based on invoices
    update_order_payment_status(db, invoice.purchase_order_id)

# Helper function to update order payment status
def update_order_payment_status(db: Session, order_id: int) -> None:
    """
    Update order payment status based on invoices
    """
    order = get_purchase_order(db, order_id)
    invoices = get_supplier_invoices(db, order_id=order_id)
    
    if not invoices:
        order.payment_status = "unpaid"
    elif all(invoice.status == "paid" for invoice in invoices):
        order.payment_status = "paid"
    elif any(invoice.status in ["paid", "partial"] for invoice in invoices):
        order.payment_status = "partial"
    else:
        order.payment_status = "unpaid"
    
    db.commit()
