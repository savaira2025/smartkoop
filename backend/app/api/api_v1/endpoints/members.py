from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.member import Member, SavingsTransaction, SHUDistribution
from app.schemas.member import (
    MemberCreate, 
    MemberUpdate, 
    MemberResponse, 
    SavingsTransactionCreate,
    SavingsTransactionResponse,
    SHUDistributionCreate,
    SHUDistributionResponse
)
from app.services.member_service import (
    create_member,
    get_member,
    get_members,
    update_member,
    delete_member,
    create_savings_transaction,
    get_member_savings_transactions,
    create_shu_distribution,
    get_member_shu_distributions
)

router = APIRouter()

@router.post("/", response_model=MemberResponse, status_code=status.HTTP_201_CREATED)
def create_new_member(
    member: MemberCreate,
    db: Session = Depends(get_db)
):
    """
    Create a new member
    """
    return create_member(db=db, member=member)

@router.get("/", response_model=List[MemberResponse])
def read_members(
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Retrieve members with optional filtering
    """
    return get_members(db=db, skip=skip, limit=limit, status=status, search=search)

@router.get("/{member_id}", response_model=MemberResponse)
def read_member(
    member_id: int,
    db: Session = Depends(get_db)
):
    """
    Get a specific member by ID
    """
    db_member = get_member(db=db, member_id=member_id)
    if db_member is None:
        raise HTTPException(status_code=404, detail="Member not found")
    return db_member

@router.put("/{member_id}", response_model=MemberResponse)
def update_existing_member(
    member_id: int,
    member: MemberUpdate,
    db: Session = Depends(get_db)
):
    """
    Update a member
    """
    db_member = get_member(db=db, member_id=member_id)
    if db_member is None:
        raise HTTPException(status_code=404, detail="Member not found")
    return update_member(db=db, member_id=member_id, member=member)

@router.delete("/{member_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_existing_member(
    member_id: int,
    db: Session = Depends(get_db)
):
    """
    Delete a member
    """
    db_member = get_member(db=db, member_id=member_id)
    if db_member is None:
        raise HTTPException(status_code=404, detail="Member not found")
    delete_member(db=db, member_id=member_id)
    return {"detail": "Member deleted successfully"}

# Savings Transaction endpoints
@router.post("/{member_id}/savings", response_model=SavingsTransactionResponse)
def create_member_savings_transaction(
    member_id: int,
    transaction: SavingsTransactionCreate,
    db: Session = Depends(get_db)
):
    """
    Create a savings transaction for a member
    """
    db_member = get_member(db=db, member_id=member_id)
    if db_member is None:
        raise HTTPException(status_code=404, detail="Member not found")
    return create_savings_transaction(db=db, member_id=member_id, transaction=transaction)

@router.get("/{member_id}/savings", response_model=List[SavingsTransactionResponse])
def read_member_savings_transactions(
    member_id: int,
    skip: int = 0,
    limit: int = 100,
    transaction_type: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Get all savings transactions for a member
    """
    db_member = get_member(db=db, member_id=member_id)
    if db_member is None:
        raise HTTPException(status_code=404, detail="Member not found")
    return get_member_savings_transactions(
        db=db, 
        member_id=member_id, 
        skip=skip, 
        limit=limit, 
        transaction_type=transaction_type
    )

# SHU Distribution endpoints
@router.post("/{member_id}/shu", response_model=SHUDistributionResponse)
def create_member_shu_distribution(
    member_id: int,
    distribution: SHUDistributionCreate,
    db: Session = Depends(get_db)
):
    """
    Create a SHU distribution for a member
    """
    db_member = get_member(db=db, member_id=member_id)
    if db_member is None:
        raise HTTPException(status_code=404, detail="Member not found")
    return create_shu_distribution(db=db, member_id=member_id, distribution=distribution)

@router.get("/{member_id}/shu", response_model=List[SHUDistributionResponse])
def read_member_shu_distributions(
    member_id: int,
    skip: int = 0,
    limit: int = 100,
    fiscal_year: Optional[int] = None,
    db: Session = Depends(get_db)
):
    """
    Get all SHU distributions for a member
    """
    db_member = get_member(db=db, member_id=member_id)
    if db_member is None:
        raise HTTPException(status_code=404, detail="Member not found")
    return get_member_shu_distributions(
        db=db, 
        member_id=member_id, 
        skip=skip, 
        limit=limit, 
        fiscal_year=fiscal_year
    )
