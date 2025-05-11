from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, Path
from sqlalchemy.orm import Session
from datetime import date

from app.db.database import get_db
from app.models.assets import Asset, AssetDepreciation, AssetMaintenance
from app.schemas.asset import (
    Asset as AssetSchema,
    AssetCreate,
    AssetUpdate,
    AssetDepreciation as AssetDepreciationSchema,
    AssetDepreciationCreate,
    AssetDepreciationUpdate,
    AssetMaintenance as AssetMaintenanceSchema,
    AssetMaintenanceCreate,
    AssetMaintenanceUpdate
)
from app.services.asset_service import AssetService

router = APIRouter()

# Asset endpoints
@router.get("/", response_model=List[AssetSchema])
def get_assets(
    skip: int = Query(0, description="Skip the first n items"),
    limit: int = Query(100, description="Limit the number of items returned"),
    db: Session = Depends(get_db)
):
    """Get all assets with pagination"""
    assets = AssetService.get_assets(db, skip=skip, limit=limit)
    return assets

@router.post("/", response_model=AssetSchema)
def create_asset(
    asset: AssetCreate,
    db: Session = Depends(get_db)
):
    """Create a new asset"""
    # Check if asset with the same asset_number already exists
    if asset.asset_number:
        db_asset = AssetService.get_asset_by_number(db, asset.asset_number)
        if db_asset:
            raise HTTPException(
                status_code=400,
                detail=f"Asset with asset_number {asset.asset_number} already exists"
            )
    
    return AssetService.create_asset(db, asset)

@router.get("/{asset_id}", response_model=AssetSchema)
def get_asset(
    asset_id: int = Path(..., description="The ID of the asset to get"),
    db: Session = Depends(get_db)
):
    """Get a single asset by ID"""
    db_asset = AssetService.get_asset(db, asset_id)
    if db_asset is None:
        raise HTTPException(
            status_code=404,
            detail=f"Asset with ID {asset_id} not found"
        )
    return db_asset

@router.put("/{asset_id}", response_model=AssetSchema)
def update_asset(
    asset: AssetUpdate,
    asset_id: int = Path(..., description="The ID of the asset to update"),
    db: Session = Depends(get_db)
):
    """Update an existing asset"""
    db_asset = AssetService.update_asset(db, asset_id, asset)
    if db_asset is None:
        raise HTTPException(
            status_code=404,
            detail=f"Asset with ID {asset_id} not found"
        )
    return db_asset

@router.delete("/{asset_id}", response_model=bool)
def delete_asset(
    asset_id: int = Path(..., description="The ID of the asset to delete"),
    db: Session = Depends(get_db)
):
    """Delete an asset"""
    success = AssetService.delete_asset(db, asset_id)
    if not success:
        raise HTTPException(
            status_code=404,
            detail=f"Asset with ID {asset_id} not found"
        )
    return success

# Asset Depreciation endpoints
@router.get("/{asset_id}/depreciations", response_model=List[AssetDepreciationSchema])
def get_asset_depreciations(
    asset_id: int = Path(..., description="The ID of the asset to get depreciations for"),
    db: Session = Depends(get_db)
):
    """Get all depreciation entries for an asset"""
    # Check if asset exists
    db_asset = AssetService.get_asset(db, asset_id)
    if db_asset is None:
        raise HTTPException(
            status_code=404,
            detail=f"Asset with ID {asset_id} not found"
        )
    
    return AssetService.get_asset_depreciations(db, asset_id)

@router.post("/{asset_id}/depreciations", response_model=AssetDepreciationSchema)
def create_asset_depreciation(
    depreciation: AssetDepreciationCreate,
    asset_id: int = Path(..., description="The ID of the asset to create depreciation for"),
    db: Session = Depends(get_db)
):
    """Create a new depreciation entry for an asset"""
    # Check if asset exists
    db_asset = AssetService.get_asset(db, asset_id)
    if db_asset is None:
        raise HTTPException(
            status_code=404,
            detail=f"Asset with ID {asset_id} not found"
        )
    
    # Ensure the asset_id in the path matches the one in the request body
    if depreciation.asset_id != asset_id:
        raise HTTPException(
            status_code=400,
            detail=f"Asset ID in path ({asset_id}) does not match asset_id in request body ({depreciation.asset_id})"
        )
    
    return AssetService.create_asset_depreciation(db, depreciation)

@router.get("/depreciations/{depreciation_id}", response_model=AssetDepreciationSchema)
def get_asset_depreciation(
    depreciation_id: int = Path(..., description="The ID of the depreciation entry to get"),
    db: Session = Depends(get_db)
):
    """Get a single depreciation entry by ID"""
    db_depreciation = AssetService.get_asset_depreciation(db, depreciation_id)
    if db_depreciation is None:
        raise HTTPException(
            status_code=404,
            detail=f"Depreciation entry with ID {depreciation_id} not found"
        )
    return db_depreciation

@router.put("/depreciations/{depreciation_id}", response_model=AssetDepreciationSchema)
def update_asset_depreciation(
    depreciation: AssetDepreciationUpdate,
    depreciation_id: int = Path(..., description="The ID of the depreciation entry to update"),
    db: Session = Depends(get_db)
):
    """Update an existing depreciation entry"""
    db_depreciation = AssetService.update_asset_depreciation(db, depreciation_id, depreciation)
    if db_depreciation is None:
        raise HTTPException(
            status_code=404,
            detail=f"Depreciation entry with ID {depreciation_id} not found"
        )
    return db_depreciation

@router.delete("/depreciations/{depreciation_id}", response_model=bool)
def delete_asset_depreciation(
    depreciation_id: int = Path(..., description="The ID of the depreciation entry to delete"),
    db: Session = Depends(get_db)
):
    """Delete a depreciation entry"""
    success = AssetService.delete_asset_depreciation(db, depreciation_id)
    if not success:
        raise HTTPException(
            status_code=404,
            detail=f"Depreciation entry with ID {depreciation_id} not found"
        )
    return success

# Asset Maintenance endpoints
@router.get("/{asset_id}/maintenances", response_model=List[AssetMaintenanceSchema])
def get_asset_maintenances(
    asset_id: int = Path(..., description="The ID of the asset to get maintenances for"),
    db: Session = Depends(get_db)
):
    """Get all maintenance records for an asset"""
    # Check if asset exists
    db_asset = AssetService.get_asset(db, asset_id)
    if db_asset is None:
        raise HTTPException(
            status_code=404,
            detail=f"Asset with ID {asset_id} not found"
        )
    
    return AssetService.get_asset_maintenances(db, asset_id)

@router.post("/{asset_id}/maintenances", response_model=AssetMaintenanceSchema)
def create_asset_maintenance(
    maintenance: AssetMaintenanceCreate,
    asset_id: int = Path(..., description="The ID of the asset to create maintenance for"),
    db: Session = Depends(get_db)
):
    """Create a new maintenance record for an asset"""
    # Check if asset exists
    db_asset = AssetService.get_asset(db, asset_id)
    if db_asset is None:
        raise HTTPException(
            status_code=404,
            detail=f"Asset with ID {asset_id} not found"
        )
    
    # Ensure the asset_id in the path matches the one in the request body
    if maintenance.asset_id != asset_id:
        raise HTTPException(
            status_code=400,
            detail=f"Asset ID in path ({asset_id}) does not match asset_id in request body ({maintenance.asset_id})"
        )
    
    return AssetService.create_asset_maintenance(db, maintenance)

@router.get("/maintenances/{maintenance_id}", response_model=AssetMaintenanceSchema)
def get_asset_maintenance(
    maintenance_id: int = Path(..., description="The ID of the maintenance record to get"),
    db: Session = Depends(get_db)
):
    """Get a single maintenance record by ID"""
    db_maintenance = AssetService.get_asset_maintenance(db, maintenance_id)
    if db_maintenance is None:
        raise HTTPException(
            status_code=404,
            detail=f"Maintenance record with ID {maintenance_id} not found"
        )
    return db_maintenance

@router.put("/maintenances/{maintenance_id}", response_model=AssetMaintenanceSchema)
def update_asset_maintenance(
    maintenance: AssetMaintenanceUpdate,
    maintenance_id: int = Path(..., description="The ID of the maintenance record to update"),
    db: Session = Depends(get_db)
):
    """Update an existing maintenance record"""
    db_maintenance = AssetService.update_asset_maintenance(db, maintenance_id, maintenance)
    if db_maintenance is None:
        raise HTTPException(
            status_code=404,
            detail=f"Maintenance record with ID {maintenance_id} not found"
        )
    return db_maintenance

@router.delete("/maintenances/{maintenance_id}", response_model=bool)
def delete_asset_maintenance(
    maintenance_id: int = Path(..., description="The ID of the maintenance record to delete"),
    db: Session = Depends(get_db)
):
    """Delete a maintenance record"""
    success = AssetService.delete_asset_maintenance(db, maintenance_id)
    if not success:
        raise HTTPException(
            status_code=404,
            detail=f"Maintenance record with ID {maintenance_id} not found"
        )
    return success
