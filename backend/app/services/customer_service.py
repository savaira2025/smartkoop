from typing import List, Optional
from datetime import date
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.models.business_partners import Customer
from app.schemas.customer import CustomerCreate, CustomerUpdate

# Customer CRUD operations
def create_customer(db: Session, customer: CustomerCreate) -> Customer:
    """
    Create a new customer in the database
    """
    db_customer = Customer(
        name=customer.name,
        contact_person=customer.contact_person,
        email=customer.email,
        phone=customer.phone,
        address=customer.address,
        payment_terms=customer.payment_terms,
        credit_limit=customer.credit_limit,
        tax_id=customer.tax_id,
        status=customer.status
    )
    db.add(db_customer)
    db.commit()
    db.refresh(db_customer)
    return db_customer

def get_customer(db: Session, customer_id: int) -> Optional[Customer]:
    """
    Get a customer by ID
    """
    return db.query(Customer).filter(Customer.id == customer_id).first()

def get_customers(
    db: Session, 
    skip: int = 0, 
    limit: int = 100,
    status: Optional[str] = None,
    search: Optional[str] = None
) -> List[Customer]:
    """
    Get all customers with optional filtering
    """
    query = db.query(Customer)
    
    # Apply status filter if provided
    if status:
        query = query.filter(Customer.status == status)
    
    # Apply search filter if provided
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            or_(
                Customer.name.ilike(search_term),
                Customer.contact_person.ilike(search_term),
                Customer.email.ilike(search_term),
                Customer.phone.ilike(search_term)
            )
        )
    
    # Apply pagination
    return query.offset(skip).limit(limit).all()

def update_customer(db: Session, customer_id: int, customer: CustomerUpdate) -> Customer:
    """
    Update a customer's information
    """
    db_customer = get_customer(db, customer_id)
    
    # Update customer attributes
    for key, value in customer.dict(exclude_unset=True).items():
        setattr(db_customer, key, value)
    
    db.commit()
    db.refresh(db_customer)
    return db_customer

def delete_customer(db: Session, customer_id: int) -> None:
    """
    Delete a customer
    """
    db_customer = get_customer(db, customer_id)
    db.delete(db_customer)
    db.commit()
