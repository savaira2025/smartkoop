from sqlalchemy import Column, String, Boolean, Integer, ForeignKey, Date, Numeric, Text
from sqlalchemy.orm import relationship
from app.db.database import Base
from app.models.base import BaseModel
from datetime import date

class Member(Base, BaseModel):
    """Member model for cooperative members"""
    
    # Basic information
    member_id = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=True)
    phone = Column(String, nullable=True)
    address = Column(Text, nullable=True)
    join_date = Column(Date, default=date.today, nullable=False)
    status = Column(String, default="calon_anggota")  # calon_anggota, anggota, pengurus, inactive, suspended
    
    # Savings information
    principal_savings = Column(Numeric(precision=10, scale=2), default=0.0)
    mandatory_savings = Column(Numeric(precision=10, scale=2), default=0.0)
    voluntary_savings = Column(Numeric(precision=10, scale=2), default=0.0)
    unpaid_mandatory = Column(Numeric(precision=10, scale=2), default=0.0)
    shu_balance = Column(Numeric(precision=10, scale=2), default=0.0)
    
    # Registration information
    registration_method = Column(String, default="web")  # web, mobile, office
    
    # User relationship (optional)
    user_id = Column(Integer, ForeignKey("user.id"), nullable=True)
    user = relationship("User", backref="member")
    
    # Relationships
    savings_transactions = relationship("SavingsTransaction", back_populates="member")
    shu_distributions = relationship("SHUDistribution", back_populates="member")
    time_entries = relationship("ProjectTimeEntry", back_populates="member")


class SavingsTransaction(Base, BaseModel):
    """Model for member savings transactions"""
    
    member_id = Column(Integer, ForeignKey("member.id"), nullable=False)
    transaction_date = Column(Date, default=date.today, nullable=False)
    amount = Column(Numeric(precision=10, scale=2), nullable=False)
    transaction_type = Column(String, nullable=False)  # principal, mandatory, voluntary, withdrawal
    description = Column(Text, nullable=True)
    status = Column(String, default="completed")  # pending, completed, failed
    
    # Relationships
    member = relationship("Member", back_populates="savings_transactions")


class SHUDistribution(Base, BaseModel):
    """Model for SHU (profit sharing) distributions to members"""
    
    member_id = Column(Integer, ForeignKey("member.id"), nullable=False)
    fiscal_year = Column(Integer, nullable=False)
    amount = Column(Numeric(precision=10, scale=2), nullable=False)
    distribution_date = Column(Date, default=date.today, nullable=False)
    distribution_method = Column(String, default="account_credit")  # account_credit, cash, reinvestment
    status = Column(String, default="pending")  # pending, completed, failed
    
    # Relationships
    member = relationship("Member", back_populates="shu_distributions")
