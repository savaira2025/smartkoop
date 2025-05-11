from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import date
from decimal import Decimal

# Base schemas for Asset
class AssetBase(BaseModel):
    name: str
    asset_number: str
    category: str
    acquisition_date: date
    acquisition_cost: Decimal
    current_value: Decimal
    depreciation_rate: Optional[Decimal] = Field(default=0.0)
    location: Optional[str] = None
    status: Optional[str] = Field(default="active")
    assigned_to: Optional[str] = None

class AssetCreate(AssetBase):
    pass

class AssetUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    acquisition_date: Optional[date] = None
    acquisition_cost: Optional[Decimal] = None
    current_value: Optional[Decimal] = None
    depreciation_rate: Optional[Decimal] = None
    location: Optional[str] = None
    status: Optional[str] = None
    assigned_to: Optional[str] = None

# Base schemas for AssetDepreciation
class AssetDepreciationBase(BaseModel):
    asset_id: int
    depreciation_date: date
    depreciation_amount: Decimal
    book_value_after: Decimal

class AssetDepreciationCreate(AssetDepreciationBase):
    pass

class AssetDepreciationUpdate(BaseModel):
    depreciation_date: Optional[date] = None
    depreciation_amount: Optional[Decimal] = None
    book_value_after: Optional[Decimal] = None

# Base schemas for AssetMaintenance
class AssetMaintenanceBase(BaseModel):
    asset_id: int
    maintenance_date: date
    maintenance_type: str
    cost: Optional[Decimal] = Field(default=0.0)
    description: Optional[str] = None
    performed_by: Optional[str] = None

class AssetMaintenanceCreate(AssetMaintenanceBase):
    pass

class AssetMaintenanceUpdate(BaseModel):
    maintenance_date: Optional[date] = None
    maintenance_type: Optional[str] = None
    cost: Optional[Decimal] = None
    description: Optional[str] = None
    performed_by: Optional[str] = None

# Response schemas
class AssetDepreciation(AssetDepreciationBase):
    id: int
    created_at: date
    updated_at: Optional[date] = None

    class Config:
        orm_mode = True

class AssetMaintenance(AssetMaintenanceBase):
    id: int
    created_at: date
    updated_at: Optional[date] = None

    class Config:
        orm_mode = True

class Asset(AssetBase):
    id: int
    created_at: date
    updated_at: Optional[date] = None
    depreciation_entries: List[AssetDepreciation] = []
    maintenance_records: List[AssetMaintenance] = []

    class Config:
        orm_mode = True
