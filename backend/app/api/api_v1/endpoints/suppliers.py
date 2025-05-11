from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.business_partners import Supplier
from app.schemas.supplier import SupplierCreate, SupplierUpdate, SupplierResponse
from app.services.supplier_service import (
    create_supplier,
    get_supplier,
    get_suppliers,
    update_supplier,
    delete_supplier
)

router = APIRouter()

@router.post("/", response_model=SupplierResponse, status_code=status.HTTP_201_CREATED)
def create_new_supplier(
    supplier: SupplierCreate,
    db: Session = Depends(get_db)
):
    """
    Create a new supplier
    """
    return create_supplier(db=db, supplier=supplier)

@router.get("/", response_model=List[SupplierResponse])
def read_suppliers(
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Retrieve suppliers with optional filtering
    """
    return get_suppliers(db=db, skip=skip, limit=limit, status=status, search=search)

@router.get("/{supplier_id}", response_model=SupplierResponse)
def read_supplier(
    supplier_id: int,
    db: Session = Depends(get_db)
):
    """
    Get a specific supplier by ID
    """
    db_supplier = get_supplier(db=db, supplier_id=supplier_id)
    if db_supplier is None:
        raise HTTPException(status_code=404, detail="Supplier not found")
    return db_supplier

@router.put("/{supplier_id}", response_model=SupplierResponse)
def update_existing_supplier(
    supplier_id: int,
    supplier: SupplierUpdate,
    db: Session = Depends(get_db)
):
    """
    Update a supplier
    """
    db_supplier = get_supplier(db=db, supplier_id=supplier_id)
    if db_supplier is None:
        raise HTTPException(status_code=404, detail="Supplier not found")
    return update_supplier(db=db, supplier_id=supplier_id, supplier=supplier)

@router.delete("/{supplier_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_existing_supplier(
    supplier_id: int,
    db: Session = Depends(get_db)
):
    """
    Delete a supplier
    """
    db_supplier = get_supplier(db=db, supplier_id=supplier_id)
    if db_supplier is None:
        raise HTTPException(status_code=404, detail="Supplier not found")
    delete_supplier(db=db, supplier_id=supplier_id)
    return {"detail": "Supplier deleted successfully"}
