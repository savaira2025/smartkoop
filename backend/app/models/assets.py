from sqlalchemy import Column, String, Boolean, Integer, ForeignKey, Date, Numeric, Text
from sqlalchemy.orm import relationship
from app.db.database import Base
from app.models.base import BaseModel
from datetime import date

class Asset(Base, BaseModel):
    """Asset model for cooperative assets"""
    
    # Asset information
    name = Column(String, nullable=False)
    asset_number = Column(String, unique=True, nullable=False)
    category = Column(String, nullable=False)
    acquisition_date = Column(Date, nullable=False)
    acquisition_cost = Column(Numeric(precision=10, scale=2), nullable=False)
    current_value = Column(Numeric(precision=10, scale=2), nullable=False)
    depreciation_rate = Column(Numeric(precision=5, scale=2), default=0.0)
    location = Column(String, nullable=True)
    status = Column(String, default="active")  # active, inactive, disposed
    assigned_to = Column(String, nullable=True)
    
    # Relationships
    depreciation_entries = relationship("AssetDepreciation", back_populates="asset", cascade="all, delete-orphan")
    maintenance_records = relationship("AssetMaintenance", back_populates="asset", cascade="all, delete-orphan")


class AssetDepreciation(Base, BaseModel):
    """Asset depreciation model for tracking asset depreciation"""
    
    # Depreciation information
    asset_id = Column(Integer, ForeignKey("asset.id"), nullable=False)
    depreciation_date = Column(Date, default=date.today, nullable=False)
    depreciation_amount = Column(Numeric(precision=10, scale=2), nullable=False)
    book_value_after = Column(Numeric(precision=10, scale=2), nullable=False)
    
    # Relationships
    asset = relationship("Asset", back_populates="depreciation_entries")


class AssetMaintenance(Base, BaseModel):
    """Asset maintenance model for tracking asset maintenance"""
    
    # Maintenance information
    asset_id = Column(Integer, ForeignKey("asset.id"), nullable=False)
    maintenance_date = Column(Date, default=date.today, nullable=False)
    maintenance_type = Column(String, nullable=False)  # repair, service, inspection
    cost = Column(Numeric(precision=10, scale=2), default=0.0)
    description = Column(Text, nullable=True)
    performed_by = Column(String, nullable=True)
    
    # Relationships
    asset = relationship("Asset", back_populates="maintenance_records")
