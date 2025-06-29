from typing import List, Optional
from datetime import date
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.models.business_partners import Customer, CustomerContact
from app.schemas.customer import CustomerCreate, CustomerUpdate

# Customer CRUD operations
def create_customer(db: Session, customer: CustomerCreate) -> Customer:
    """
    Create a new customer in the database with contacts
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
    db.flush()  # Flush to get the customer ID
    
    # Create contacts if provided
    if customer.contacts:
        # Ensure only one primary contact
        primary_count = sum(1 for contact in customer.contacts if contact.is_primary)
        if primary_count > 1:
            # Set only the first one as primary
            for i, contact in enumerate(customer.contacts):
                contact.is_primary = i == 0
        elif primary_count == 0 and customer.contacts:
            # Set the first contact as primary if none specified
            customer.contacts[0].is_primary = True
            
        for contact_data in customer.contacts:
            db_contact = CustomerContact(
                customer_id=db_customer.id,
                name=contact_data.name,
                title=contact_data.title,
                email=contact_data.email,
                phone=contact_data.phone,
                department=contact_data.department,
                is_primary=contact_data.is_primary
            )
            db.add(db_contact)
    
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
    Update a customer's information including contacts
    """
    db_customer = get_customer(db, customer_id)
    
    # Update customer attributes (excluding contacts)
    customer_data = customer.dict(exclude_unset=True, exclude={'contacts'})
    for key, value in customer_data.items():
        setattr(db_customer, key, value)
    
    # Handle contacts update if provided
    if customer.contacts is not None:
        # Delete existing contacts
        db.query(CustomerContact).filter(CustomerContact.customer_id == customer_id).delete()
        
        # Create new contacts
        if customer.contacts:
            # Ensure only one primary contact
            primary_count = sum(1 for contact in customer.contacts if contact.is_primary)
            if primary_count > 1:
                # Set only the first one as primary
                for i, contact in enumerate(customer.contacts):
                    contact.is_primary = i == 0
            elif primary_count == 0 and customer.contacts:
                # Set the first contact as primary if none specified
                customer.contacts[0].is_primary = True
                
            for contact_data in customer.contacts:
                db_contact = CustomerContact(
                    customer_id=customer_id,
                    name=contact_data.name,
                    title=contact_data.title,
                    email=contact_data.email,
                    phone=contact_data.phone,
                    department=contact_data.department,
                    is_primary=contact_data.is_primary
                )
                db.add(db_contact)
    
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
