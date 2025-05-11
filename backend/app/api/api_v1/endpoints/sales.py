from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.sales import SalesOrder, SalesOrderItem, SalesInvoice, SalesPayment
from app.schemas.sales import (
    SalesOrder as SalesOrderSchema,
    SalesOrderCreate,
    SalesOrderUpdate,
    SalesOrderItem as SalesOrderItemSchema,
    SalesInvoice as SalesInvoiceSchema,
    SalesInvoiceCreate,
    SalesInvoiceUpdate,
    SalesPayment as SalesPaymentSchema,
    SalesPaymentCreate,
    SalesPaymentUpdate
)
from app.services.sales_service import (
    create_sales_order,
    get_sales_order,
    get_sales_orders,
    update_sales_order,
    delete_sales_order,
    get_sales_order_items,
    create_sales_invoice,
    get_sales_invoice,
    get_sales_invoices,
    update_sales_invoice,
    delete_sales_invoice,
    create_sales_payment,
    get_sales_payment,
    get_sales_payments,
    update_sales_payment,
    delete_sales_payment
)

router = APIRouter()

# Sales Order endpoints
@router.post("/orders", response_model=SalesOrderSchema, status_code=status.HTTP_201_CREATED)
def create_new_sales_order(
    order: SalesOrderCreate,
    db: Session = Depends(get_db)
):
    """
    Create a new sales order
    """
    return create_sales_order(db=db, order=order)

@router.get("/orders", response_model=List[SalesOrderSchema])
def read_sales_orders(
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = None,
    search: Optional[str] = None,
    customer_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    """
    Retrieve sales orders with optional filtering
    """
    return get_sales_orders(
        db=db, 
        skip=skip, 
        limit=limit, 
        status=status, 
        search=search,
        customer_id=customer_id
    )

@router.get("/orders/{order_id}", response_model=SalesOrderSchema)
def read_sales_order(
    order_id: int,
    db: Session = Depends(get_db)
):
    """
    Get a specific sales order by ID
    """
    db_order = get_sales_order(db=db, order_id=order_id)
    if db_order is None:
        raise HTTPException(status_code=404, detail="Sales order not found")
    return db_order

@router.put("/orders/{order_id}", response_model=SalesOrderSchema)
def update_existing_sales_order(
    order_id: int,
    order: SalesOrderUpdate,
    db: Session = Depends(get_db)
):
    """
    Update a sales order
    """
    db_order = get_sales_order(db=db, order_id=order_id)
    if db_order is None:
        raise HTTPException(status_code=404, detail="Sales order not found")
    return update_sales_order(db=db, order_id=order_id, order=order)

@router.delete("/orders/{order_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_existing_sales_order(
    order_id: int,
    db: Session = Depends(get_db)
):
    """
    Delete a sales order
    """
    db_order = get_sales_order(db=db, order_id=order_id)
    if db_order is None:
        raise HTTPException(status_code=404, detail="Sales order not found")
    delete_sales_order(db=db, order_id=order_id)
    return {"detail": "Sales order deleted successfully"}

@router.get("/orders/{order_id}/items", response_model=List[SalesOrderItemSchema])
def read_sales_order_items(
    order_id: int,
    db: Session = Depends(get_db)
):
    """
    Get all items for a sales order
    """
    db_order = get_sales_order(db=db, order_id=order_id)
    if db_order is None:
        raise HTTPException(status_code=404, detail="Sales order not found")
    return get_sales_order_items(db=db, order_id=order_id)

# Sales Invoice endpoints
@router.post("/invoices", response_model=SalesInvoiceSchema, status_code=status.HTTP_201_CREATED)
def create_new_sales_invoice(
    invoice: SalesInvoiceCreate,
    db: Session = Depends(get_db)
):
    """
    Create a new sales invoice
    """
    return create_sales_invoice(db=db, invoice=invoice)

@router.get("/invoices", response_model=List[SalesInvoiceSchema])
def read_sales_invoices(
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = None,
    order_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    """
    Retrieve sales invoices with optional filtering
    """
    return get_sales_invoices(
        db=db, 
        skip=skip, 
        limit=limit, 
        status=status,
        order_id=order_id
    )

@router.get("/invoices/{invoice_id}", response_model=SalesInvoiceSchema)
def read_sales_invoice(
    invoice_id: int,
    db: Session = Depends(get_db)
):
    """
    Get a specific sales invoice by ID
    """
    db_invoice = get_sales_invoice(db=db, invoice_id=invoice_id)
    if db_invoice is None:
        raise HTTPException(status_code=404, detail="Sales invoice not found")
    return db_invoice

@router.put("/invoices/{invoice_id}", response_model=SalesInvoiceSchema)
def update_existing_sales_invoice(
    invoice_id: int,
    invoice: SalesInvoiceUpdate,
    db: Session = Depends(get_db)
):
    """
    Update a sales invoice
    """
    db_invoice = get_sales_invoice(db=db, invoice_id=invoice_id)
    if db_invoice is None:
        raise HTTPException(status_code=404, detail="Sales invoice not found")
    return update_sales_invoice(db=db, invoice_id=invoice_id, invoice=invoice)

@router.delete("/invoices/{invoice_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_existing_sales_invoice(
    invoice_id: int,
    db: Session = Depends(get_db)
):
    """
    Delete a sales invoice
    """
    db_invoice = get_sales_invoice(db=db, invoice_id=invoice_id)
    if db_invoice is None:
        raise HTTPException(status_code=404, detail="Sales invoice not found")
    delete_sales_invoice(db=db, invoice_id=invoice_id)
    return {"detail": "Sales invoice deleted successfully"}

# Sales Payment endpoints
@router.post("/invoices/{invoice_id}/payments", response_model=SalesPaymentSchema, status_code=status.HTTP_201_CREATED)
def create_new_sales_payment(
    invoice_id: int,
    payment: SalesPaymentCreate,
    db: Session = Depends(get_db)
):
    """
    Create a new sales payment for an invoice
    """
    db_invoice = get_sales_invoice(db=db, invoice_id=invoice_id)
    if db_invoice is None:
        raise HTTPException(status_code=404, detail="Sales invoice not found")
    
    # Ensure the payment is for the correct invoice
    if payment.invoice_id != invoice_id:
        raise HTTPException(status_code=400, detail="Payment invoice ID does not match URL")
    
    return create_sales_payment(db=db, payment=payment)

@router.get("/invoices/{invoice_id}/payments", response_model=List[SalesPaymentSchema])
def read_sales_payments(
    invoice_id: int,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """
    Retrieve sales payments for an invoice
    """
    db_invoice = get_sales_invoice(db=db, invoice_id=invoice_id)
    if db_invoice is None:
        raise HTTPException(status_code=404, detail="Sales invoice not found")
    
    return get_sales_payments(
        db=db, 
        skip=skip, 
        limit=limit, 
        invoice_id=invoice_id
    )

@router.get("/invoices/{invoice_id}/payments/{payment_id}", response_model=SalesPaymentSchema)
def read_sales_payment(
    invoice_id: int,
    payment_id: int,
    db: Session = Depends(get_db)
):
    """
    Get a specific sales payment by ID
    """
    db_invoice = get_sales_invoice(db=db, invoice_id=invoice_id)
    if db_invoice is None:
        raise HTTPException(status_code=404, detail="Sales invoice not found")
    
    db_payment = get_sales_payment(db=db, payment_id=payment_id)
    if db_payment is None or db_payment.invoice_id != invoice_id:
        raise HTTPException(status_code=404, detail="Sales payment not found")
    
    return db_payment

@router.put("/invoices/{invoice_id}/payments/{payment_id}", response_model=SalesPaymentSchema)
def update_existing_sales_payment(
    invoice_id: int,
    payment_id: int,
    payment: SalesPaymentUpdate,
    db: Session = Depends(get_db)
):
    """
    Update a sales payment
    """
    db_invoice = get_sales_invoice(db=db, invoice_id=invoice_id)
    if db_invoice is None:
        raise HTTPException(status_code=404, detail="Sales invoice not found")
    
    db_payment = get_sales_payment(db=db, payment_id=payment_id)
    if db_payment is None or db_payment.invoice_id != invoice_id:
        raise HTTPException(status_code=404, detail="Sales payment not found")
    
    return update_sales_payment(db=db, payment_id=payment_id, payment=payment)

@router.delete("/invoices/{invoice_id}/payments/{payment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_existing_sales_payment(
    invoice_id: int,
    payment_id: int,
    db: Session = Depends(get_db)
):
    """
    Delete a sales payment
    """
    db_invoice = get_sales_invoice(db=db, invoice_id=invoice_id)
    if db_invoice is None:
        raise HTTPException(status_code=404, detail="Sales invoice not found")
    
    db_payment = get_sales_payment(db=db, payment_id=payment_id)
    if db_payment is None or db_payment.invoice_id != invoice_id:
        raise HTTPException(status_code=404, detail="Sales payment not found")
    
    delete_sales_payment(db=db, payment_id=payment_id)
    return {"detail": "Sales payment deleted successfully"}
