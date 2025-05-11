from typing import List, Optional
from datetime import date
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.models.business_partners import Supplier
from app.schemas.supplier import SupplierCreate, SupplierUpdate

# Supplier CRUD operations
def create_supplier(db: Session, supplier: SupplierCreate) -> Supplier:
    """
    Create a new supplier in the database
    """
    db_supplier = Supplier(
        name=supplier.name,
        contact_person=supplier.contact_person,
        email=supplier.email,
        phone=supplier.phone,
        address=supplier.address,
        payment_terms=supplier.payment_terms,
        tax_id=supplier.tax_id,
        status=supplier.status,
        bank_account=getattr(supplier, 'bank_account', None)
    )
    db.add(db_supplier)
    db.commit()
    db.refresh(db_supplier)
    return db_supplier

def get_supplier(db: Session, supplier_id: int) -> Optional[Supplier]:
    """
    Get a supplier by ID
    """
    return db.query(Supplier).filter(Supplier.id == supplier_id).first()

def get_suppliers(
    db: Session, 
    skip: int = 0, 
    limit: int = 100,
    status: Optional[str] = None,
    search: Optional[str] = None
) -> List[Supplier]:
    """
    Get all suppliers with optional filtering
    """
    query = db.query(Supplier)
    
    # Apply status filter if provided
    if status:
        query = query.filter(Supplier.status == status)
    
    # Apply search filter if provided
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            or_(
                Supplier.name.ilike(search_term),
                Supplier.contact_person.ilike(search_term),
                Supplier.email.ilike(search_term),
                Supplier.phone.ilike(search_term)
            )
        )
    
    # Apply pagination
    return query.offset(skip).limit(limit).all()

def update_supplier(db: Session, supplier_id: int, supplier: SupplierUpdate) -> Supplier:
    """
    Update a supplier's information
    """
    db_supplier = get_supplier(db, supplier_id)
    
    # Update supplier attributes
    for key, value in supplier.dict(exclude_unset=True).items():
        setattr(db_supplier, key, value)
    
    db.commit()
    db.refresh(db_supplier)
    return db_supplier

def delete_supplier(db: Session, supplier_id: int) -> None:
    """
    Delete a supplier
    """
    db_supplier = get_supplier(db, supplier_id)
    db.delete(db_supplier)
    db.commit()
