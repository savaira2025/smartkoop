from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.purchases import PurchaseOrder, PurchaseOrderItem, SupplierInvoice, SupplierPayment
from app.schemas.purchase import (
    PurchaseOrder as PurchaseOrderSchema,
    PurchaseOrderCreate,
    PurchaseOrderUpdate,
    PurchaseOrderItem as PurchaseOrderItemSchema,
    SupplierInvoice as SupplierInvoiceSchema,
    SupplierInvoiceCreate,
    SupplierInvoiceUpdate,
    SupplierPayment as SupplierPaymentSchema,
    SupplierPaymentCreate,
    SupplierPaymentUpdate
)
from app.services.purchase_service import (
    create_purchase_order,
    get_purchase_order,
    get_purchase_orders,
    update_purchase_order,
    delete_purchase_order,
    get_purchase_order_items,
    create_supplier_invoice,
    get_supplier_invoice,
    get_supplier_invoices,
    update_supplier_invoice,
    delete_supplier_invoice,
    create_supplier_payment,
    get_supplier_payment,
    get_supplier_payments,
    update_supplier_payment,
    delete_supplier_payment
)

router = APIRouter()

# Purchase Order endpoints
@router.post("/orders", response_model=PurchaseOrderSchema, status_code=status.HTTP_201_CREATED)
def create_new_purchase_order(
    order: PurchaseOrderCreate,
    db: Session = Depends(get_db)
):
    """
    Create a new purchase order
    """
    try:
        return create_purchase_order(db=db, order=order)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"error": "Failed to create purchase order", "message": str(e)}
        )

@router.get("/orders", response_model=List[PurchaseOrderSchema])
def read_purchase_orders(
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = None,
    search: Optional[str] = None,
    supplier_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    """
    Retrieve purchase orders with optional filtering
    """
    return get_purchase_orders(
        db=db, 
        skip=skip, 
        limit=limit, 
        status=status, 
        search=search,
        supplier_id=supplier_id
    )

@router.get("/orders/{order_id}", response_model=PurchaseOrderSchema)
def read_purchase_order(
    order_id: int,
    db: Session = Depends(get_db)
):
    """
    Get a specific purchase order by ID
    """
    db_order = get_purchase_order(db=db, order_id=order_id)
    if db_order is None:
        raise HTTPException(status_code=404, detail="Purchase order not found")
    return db_order

@router.put("/orders/{order_id}", response_model=PurchaseOrderSchema)
def update_existing_purchase_order(
    order_id: int,
    order: PurchaseOrderUpdate,
    db: Session = Depends(get_db)
):
    """
    Update a purchase order
    """
    db_order = get_purchase_order(db=db, order_id=order_id)
    if db_order is None:
        raise HTTPException(status_code=404, detail="Purchase order not found")
    
    try:
        return update_purchase_order(db=db, order_id=order_id, order=order)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"error": "Failed to update purchase order", "message": str(e)}
        )

@router.delete("/orders/{order_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_existing_purchase_order(
    order_id: int,
    db: Session = Depends(get_db)
):
    """
    Delete a purchase order
    """
    db_order = get_purchase_order(db=db, order_id=order_id)
    if db_order is None:
        raise HTTPException(status_code=404, detail="Purchase order not found")
    delete_purchase_order(db=db, order_id=order_id)
    return {"detail": "Purchase order deleted successfully"}

@router.get("/orders/{order_id}/items", response_model=List[PurchaseOrderItemSchema])
def read_purchase_order_items(
    order_id: int,
    db: Session = Depends(get_db)
):
    """
    Get all items for a purchase order
    """
    db_order = get_purchase_order(db=db, order_id=order_id)
    if db_order is None:
        raise HTTPException(status_code=404, detail="Purchase order not found")
    return get_purchase_order_items(db=db, order_id=order_id)

# Supplier Invoice endpoints
@router.post("/orders/{order_id}/invoices", response_model=SupplierInvoiceSchema, status_code=status.HTTP_201_CREATED)
def create_new_supplier_invoice(
    order_id: int,
    invoice: SupplierInvoiceCreate,
    db: Session = Depends(get_db)
):
    """
    Create a new supplier invoice for a purchase order
    """
    db_order = get_purchase_order(db=db, order_id=order_id)
    if db_order is None:
        raise HTTPException(status_code=404, detail="Purchase order not found")
    
    # Ensure the invoice is for the correct order
    if invoice.purchase_order_id != order_id:
        raise HTTPException(status_code=400, detail="Invoice purchase order ID does not match URL")
    
    try:
        return create_supplier_invoice(db=db, invoice=invoice)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"error": "Failed to create supplier invoice", "message": str(e)}
        )

@router.get("/orders/{order_id}/invoices", response_model=List[SupplierInvoiceSchema])
def read_supplier_invoices_for_order(
    order_id: int,
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Retrieve supplier invoices for a purchase order
    """
    db_order = get_purchase_order(db=db, order_id=order_id)
    if db_order is None:
        raise HTTPException(status_code=404, detail="Purchase order not found")
    
    return get_supplier_invoices(
        db=db, 
        skip=skip, 
        limit=limit, 
        status=status,
        order_id=order_id
    )

@router.get("/invoices", response_model=List[SupplierInvoiceSchema])
def read_all_supplier_invoices(
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Retrieve all supplier invoices with optional filtering
    """
    return get_supplier_invoices(
        db=db, 
        skip=skip, 
        limit=limit, 
        status=status
    )

@router.get("/invoices/{invoice_id}", response_model=SupplierInvoiceSchema)
def read_supplier_invoice(
    invoice_id: int,
    db: Session = Depends(get_db)
):
    """
    Get a specific supplier invoice by ID
    """
    db_invoice = get_supplier_invoice(db=db, invoice_id=invoice_id)
    if db_invoice is None:
        raise HTTPException(status_code=404, detail="Supplier invoice not found")
    return db_invoice

@router.put("/invoices/{invoice_id}", response_model=SupplierInvoiceSchema)
def update_supplier_invoice_by_id(
    invoice_id: int,
    invoice: SupplierInvoiceUpdate,
    db: Session = Depends(get_db)
):
    """
    Update a supplier invoice directly by ID
    """
    db_invoice = get_supplier_invoice(db=db, invoice_id=invoice_id)
    if db_invoice is None:
        raise HTTPException(status_code=404, detail="Supplier invoice not found")
    
    try:
        return update_supplier_invoice(db=db, invoice_id=invoice_id, invoice=invoice)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"error": "Failed to update supplier invoice", "message": str(e)}
        )

@router.put("/orders/{order_id}/invoices/{invoice_id}", response_model=SupplierInvoiceSchema)
def update_existing_supplier_invoice(
    order_id: int,
    invoice_id: int,
    invoice: SupplierInvoiceUpdate,
    db: Session = Depends(get_db)
):
    """
    Update a supplier invoice
    """
    db_order = get_purchase_order(db=db, order_id=order_id)
    if db_order is None:
        raise HTTPException(status_code=404, detail="Purchase order not found")
    
    db_invoice = get_supplier_invoice(db=db, invoice_id=invoice_id)
    if db_invoice is None or db_invoice.purchase_order_id != order_id:
        raise HTTPException(status_code=404, detail="Supplier invoice not found")
    
    try:
        return update_supplier_invoice(db=db, invoice_id=invoice_id, invoice=invoice)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"error": "Failed to update supplier invoice", "message": str(e)}
        )

@router.delete("/orders/{order_id}/invoices/{invoice_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_existing_supplier_invoice(
    order_id: int,
    invoice_id: int,
    db: Session = Depends(get_db)
):
    """
    Delete a supplier invoice
    """
    db_order = get_purchase_order(db=db, order_id=order_id)
    if db_order is None:
        raise HTTPException(status_code=404, detail="Purchase order not found")
    
    db_invoice = get_supplier_invoice(db=db, invoice_id=invoice_id)
    if db_invoice is None or db_invoice.purchase_order_id != order_id:
        raise HTTPException(status_code=404, detail="Supplier invoice not found")
    
    delete_supplier_invoice(db=db, invoice_id=invoice_id)
    return {"detail": "Supplier invoice deleted successfully"}

# Supplier Payment endpoints
@router.post("/invoices/{invoice_id}/payments", response_model=SupplierPaymentSchema, status_code=status.HTTP_201_CREATED)
def create_new_supplier_payment(
    invoice_id: int,
    payment: SupplierPaymentCreate,
    db: Session = Depends(get_db)
):
    """
    Create a new supplier payment for an invoice
    """
    db_invoice = get_supplier_invoice(db=db, invoice_id=invoice_id)
    if db_invoice is None:
        raise HTTPException(status_code=404, detail="Supplier invoice not found")
    
    # Ensure the payment is for the correct invoice
    if payment.invoice_id != invoice_id:
        raise HTTPException(status_code=400, detail="Payment invoice ID does not match URL")
    
    try:
        return create_supplier_payment(db=db, payment=payment)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"error": "Failed to create supplier payment", "message": str(e)}
        )

@router.get("/invoices/{invoice_id}/payments", response_model=List[SupplierPaymentSchema])
def read_supplier_payments(
    invoice_id: int,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """
    Retrieve supplier payments for an invoice
    """
    db_invoice = get_supplier_invoice(db=db, invoice_id=invoice_id)
    if db_invoice is None:
        raise HTTPException(status_code=404, detail="Supplier invoice not found")
    
    return get_supplier_payments(
        db=db, 
        skip=skip, 
        limit=limit, 
        invoice_id=invoice_id
    )

@router.get("/invoices/{invoice_id}/payments/{payment_id}", response_model=SupplierPaymentSchema)
def read_supplier_payment(
    invoice_id: int,
    payment_id: int,
    db: Session = Depends(get_db)
):
    """
    Get a specific supplier payment by ID
    """
    db_invoice = get_supplier_invoice(db=db, invoice_id=invoice_id)
    if db_invoice is None:
        raise HTTPException(status_code=404, detail="Supplier invoice not found")
    
    db_payment = get_supplier_payment(db=db, payment_id=payment_id)
    if db_payment is None or db_payment.invoice_id != invoice_id:
        raise HTTPException(status_code=404, detail="Supplier payment not found")
    
    return db_payment

@router.put("/invoices/{invoice_id}/payments/{payment_id}", response_model=SupplierPaymentSchema)
def update_existing_supplier_payment(
    invoice_id: int,
    payment_id: int,
    payment: SupplierPaymentUpdate,
    db: Session = Depends(get_db)
):
    """
    Update a supplier payment
    """
    db_invoice = get_supplier_invoice(db=db, invoice_id=invoice_id)
    if db_invoice is None:
        raise HTTPException(status_code=404, detail="Supplier invoice not found")
    
    db_payment = get_supplier_payment(db=db, payment_id=payment_id)
    if db_payment is None or db_payment.invoice_id != invoice_id:
        raise HTTPException(status_code=404, detail="Supplier payment not found")
    
    try:
        return update_supplier_payment(db=db, payment_id=payment_id, payment=payment)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"error": "Failed to update supplier payment", "message": str(e)}
        )

@router.delete("/invoices/{invoice_id}/payments/{payment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_existing_supplier_payment(
    invoice_id: int,
    payment_id: int,
    db: Session = Depends(get_db)
):
    """
    Delete a supplier payment
    """
    db_invoice = get_supplier_invoice(db=db, invoice_id=invoice_id)
    if db_invoice is None:
        raise HTTPException(status_code=404, detail="Supplier invoice not found")
    
    db_payment = get_supplier_payment(db=db, payment_id=payment_id)
    if db_payment is None or db_payment.invoice_id != invoice_id:
        raise HTTPException(status_code=404, detail="Supplier payment not found")
    
    delete_supplier_payment(db=db, payment_id=payment_id)
    return {"detail": "Supplier payment deleted successfully"}
