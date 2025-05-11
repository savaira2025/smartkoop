from typing import List, Optional
from datetime import date
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.models.member import Member, SavingsTransaction, SHUDistribution
from app.schemas.member import MemberCreate, MemberUpdate, SavingsTransactionCreate, SHUDistributionCreate
from app.utils.id_generator import generate_member_id

# Member CRUD operations
def create_member(db: Session, member: MemberCreate) -> Member:
    """
    Create a new member in the database
    """
    # Generate a member_id if not provided
    member_id = member.member_id if member.member_id else generate_member_id(db)
    
    db_member = Member(
        member_id=member_id,
        name=member.name,
        email=member.email,
        phone=member.phone,
        address=member.address,
        join_date=member.join_date or date.today(),
        status=member.status,
        principal_savings=member.principal_savings,
        mandatory_savings=member.mandatory_savings,
        voluntary_savings=member.voluntary_savings,
        unpaid_mandatory=0,  # Default to 0 for new members
        shu_balance=0,  # Default to 0 for new members
        registration_method=member.registration_method,
        user_id=member.user_id
    )
    db.add(db_member)
    db.commit()
    db.refresh(db_member)
    return db_member

def get_member(db: Session, member_id: int) -> Optional[Member]:
    """
    Get a member by ID
    """
    return db.query(Member).filter(Member.id == member_id).first()

def get_member_by_member_id(db: Session, member_id: str) -> Optional[Member]:
    """
    Get a member by member_id (not the primary key)
    """
    return db.query(Member).filter(Member.member_id == member_id).first()

def get_members(
    db: Session, 
    skip: int = 0, 
    limit: int = 100,
    status: Optional[str] = None,
    search: Optional[str] = None
) -> List[Member]:
    """
    Get all members with optional filtering
    """
    query = db.query(Member)
    
    # Apply status filter if provided
    if status:
        query = query.filter(Member.status == status)
    
    # Apply search filter if provided
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            or_(
                Member.name.ilike(search_term),
                Member.email.ilike(search_term),
                Member.phone.ilike(search_term),
                Member.member_id.ilike(search_term)
            )
        )
    
    # Apply pagination
    return query.offset(skip).limit(limit).all()

def update_member(db: Session, member_id: int, member: MemberUpdate) -> Member:
    """
    Update a member's information
    """
    db_member = get_member(db, member_id)
    
    # Update member attributes
    for key, value in member.dict(exclude_unset=True).items():
        setattr(db_member, key, value)
    
    db.commit()
    db.refresh(db_member)
    return db_member

def delete_member(db: Session, member_id: int) -> None:
    """
    Delete a member
    """
    db_member = get_member(db, member_id)
    db.delete(db_member)
    db.commit()

# Savings Transaction operations
def create_savings_transaction(
    db: Session, 
    member_id: int, 
    transaction: SavingsTransactionCreate
) -> SavingsTransaction:
    """
    Create a new savings transaction for a member
    """
    db_transaction = SavingsTransaction(
        member_id=member_id,
        transaction_date=transaction.transaction_date or date.today(),
        amount=transaction.amount,
        transaction_type=transaction.transaction_type,
        description=transaction.description,
        status=transaction.status
    )
    
    # Update member's savings balances based on transaction type
    db_member = get_member(db, member_id)
    if transaction.transaction_type == "principal":
        db_member.principal_savings += transaction.amount
    elif transaction.transaction_type == "mandatory":
        db_member.mandatory_savings += transaction.amount
        # If this is a payment towards unpaid mandatory savings, reduce the unpaid amount
        if db_member.unpaid_mandatory > 0:
            reduction = min(transaction.amount, db_member.unpaid_mandatory)
            db_member.unpaid_mandatory -= reduction
    elif transaction.transaction_type == "voluntary":
        db_member.voluntary_savings += transaction.amount
    elif transaction.transaction_type == "withdrawal":
        # For withdrawals, the amount is deducted from voluntary savings
        if db_member.voluntary_savings >= transaction.amount:
            db_member.voluntary_savings -= transaction.amount
        else:
            raise ValueError("Insufficient voluntary savings for withdrawal")
    
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    return db_transaction

def get_member_savings_transactions(
    db: Session, 
    member_id: int, 
    skip: int = 0, 
    limit: int = 100,
    transaction_type: Optional[str] = None
) -> List[SavingsTransaction]:
    """
    Get all savings transactions for a member with optional filtering
    """
    query = db.query(SavingsTransaction).filter(SavingsTransaction.member_id == member_id)
    
    # Apply transaction type filter if provided
    if transaction_type:
        query = query.filter(SavingsTransaction.transaction_type == transaction_type)
    
    # Apply pagination and ordering
    return query.order_by(SavingsTransaction.transaction_date.desc()).offset(skip).limit(limit).all()

# SHU Distribution operations
def create_shu_distribution(
    db: Session, 
    member_id: int, 
    distribution: SHUDistributionCreate
) -> SHUDistribution:
    """
    Create a new SHU distribution for a member
    """
    db_distribution = SHUDistribution(
        member_id=member_id,
        fiscal_year=distribution.fiscal_year,
        amount=distribution.amount,
        distribution_date=distribution.distribution_date or date.today(),
        distribution_method=distribution.distribution_method,
        status=distribution.status
    )
    
    # Update member's SHU balance
    db_member = get_member(db, member_id)
    
    # If the distribution is completed, update the member's SHU balance
    if distribution.status == "completed":
        db_member.shu_balance += distribution.amount
        
        # If the distribution method is account_credit, add to voluntary savings
        if distribution.distribution_method == "account_credit":
            db_member.voluntary_savings += distribution.amount
    
    db.add(db_distribution)
    db.commit()
    db.refresh(db_distribution)
    return db_distribution

def get_member_shu_distributions(
    db: Session, 
    member_id: int, 
    skip: int = 0, 
    limit: int = 100,
    fiscal_year: Optional[int] = None
) -> List[SHUDistribution]:
    """
    Get all SHU distributions for a member with optional filtering
    """
    query = db.query(SHUDistribution).filter(SHUDistribution.member_id == member_id)
    
    # Apply fiscal year filter if provided
    if fiscal_year:
        query = query.filter(SHUDistribution.fiscal_year == fiscal_year)
    
    # Apply pagination and ordering
    return query.order_by(SHUDistribution.distribution_date.desc()).offset(skip).limit(limit).all()
