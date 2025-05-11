from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.business_partners import Customer
from app.schemas.customer import CustomerCreate, CustomerUpdate, CustomerResponse
from app.services.customer_service import (
    create_customer,
    get_customer,
    get_customers,
    update_customer,
    delete_customer
)

router = APIRouter()

@router.post("/", response_model=CustomerResponse, status_code=status.HTTP_201_CREATED)
def create_new_customer(
    customer: CustomerCreate,
    db: Session = Depends(get_db)
):
    """
    Create a new customer
    """
    return create_customer(db=db, customer=customer)

@router.get("/", response_model=List[CustomerResponse])
def read_customers(
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Retrieve customers with optional filtering
    """
    return get_customers(db=db, skip=skip, limit=limit, status=status, search=search)

@router.get("/{customer_id}", response_model=CustomerResponse)
def read_customer(
    customer_id: int,
    db: Session = Depends(get_db)
):
    """
    Get a specific customer by ID
    """
    db_customer = get_customer(db=db, customer_id=customer_id)
    if db_customer is None:
        raise HTTPException(status_code=404, detail="Customer not found")
    return db_customer

@router.put("/{customer_id}", response_model=CustomerResponse)
def update_existing_customer(
    customer_id: int,
    customer: CustomerUpdate,
    db: Session = Depends(get_db)
):
    """
    Update a customer
    """
    db_customer = get_customer(db=db, customer_id=customer_id)
    if db_customer is None:
        raise HTTPException(status_code=404, detail="Customer not found")
    return update_customer(db=db, customer_id=customer_id, customer=customer)

@router.delete("/{customer_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_existing_customer(
    customer_id: int,
    db: Session = Depends(get_db)
):
    """
    Delete a customer
    """
    db_customer = get_customer(db=db, customer_id=customer_id)
    if db_customer is None:
        raise HTTPException(status_code=404, detail="Customer not found")
    delete_customer(db=db, customer_id=customer_id)
    return {"detail": "Customer deleted successfully"}
