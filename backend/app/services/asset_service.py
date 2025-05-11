from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from datetime import date

from app.models.assets import Asset, AssetDepreciation, AssetMaintenance
from app.schemas.asset import AssetCreate, AssetUpdate, AssetDepreciationCreate, AssetDepreciationUpdate, AssetMaintenanceCreate, AssetMaintenanceUpdate
from app.utils.id_generator import generate_asset_number

class AssetService:
    @staticmethod
    def get_assets(db: Session, skip: int = 0, limit: int = 100) -> List[Asset]:
        """Get all assets with pagination"""
        return db.query(Asset).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_asset(db: Session, asset_id: int) -> Optional[Asset]:
        """Get a single asset by ID"""
        return db.query(Asset).filter(Asset.id == asset_id).first()
    
    @staticmethod
    def get_asset_by_number(db: Session, asset_number: str) -> Optional[Asset]:
        """Get a single asset by asset number"""
        return db.query(Asset).filter(Asset.asset_number == asset_number).first()
    
    @staticmethod
    def create_asset(db: Session, asset: AssetCreate) -> Asset:
        """Create a new asset"""
        # If asset_number is not provided, generate one
        if not asset.asset_number:
            asset_dict = asset.dict()
            asset_dict["asset_number"] = generate_asset_number(db, "AST")
            db_asset = Asset(**asset_dict)
        else:
            db_asset = Asset(**asset.dict())
        
        db.add(db_asset)
        db.commit()
        db.refresh(db_asset)
        return db_asset
    
    @staticmethod
    def update_asset(db: Session, asset_id: int, asset: AssetUpdate) -> Optional[Asset]:
        """Update an existing asset"""
        db_asset = AssetService.get_asset(db, asset_id)
        if db_asset:
            update_data = asset.dict(exclude_unset=True)
            for key, value in update_data.items():
                setattr(db_asset, key, value)
            
            db.commit()
            db.refresh(db_asset)
        return db_asset
    
    @staticmethod
    def delete_asset(db: Session, asset_id: int) -> bool:
        """Delete an asset"""
        db_asset = AssetService.get_asset(db, asset_id)
        if db_asset:
            db.delete(db_asset)
            db.commit()
            return True
        return False
    
    # Asset Depreciation methods
    @staticmethod
    def get_asset_depreciations(db: Session, asset_id: int) -> List[AssetDepreciation]:
        """Get all depreciation entries for an asset"""
        return db.query(AssetDepreciation).filter(AssetDepreciation.asset_id == asset_id).all()
    
    @staticmethod
    def get_asset_depreciation(db: Session, depreciation_id: int) -> Optional[AssetDepreciation]:
        """Get a single depreciation entry by ID"""
        return db.query(AssetDepreciation).filter(AssetDepreciation.id == depreciation_id).first()
    
    @staticmethod
    def create_asset_depreciation(db: Session, depreciation: AssetDepreciationCreate) -> AssetDepreciation:
        """Create a new depreciation entry for an asset"""
        db_depreciation = AssetDepreciation(**depreciation.dict())
        db.add(db_depreciation)
        db.commit()
        db.refresh(db_depreciation)
        
        # Update the asset's current value
        asset = AssetService.get_asset(db, depreciation.asset_id)
        if asset:
            asset.current_value = depreciation.book_value_after
            db.commit()
        
        return db_depreciation
    
    @staticmethod
    def update_asset_depreciation(db: Session, depreciation_id: int, depreciation: AssetDepreciationUpdate) -> Optional[AssetDepreciation]:
        """Update an existing depreciation entry"""
        db_depreciation = AssetService.get_asset_depreciation(db, depreciation_id)
        if db_depreciation:
            update_data = depreciation.dict(exclude_unset=True)
            for key, value in update_data.items():
                setattr(db_depreciation, key, value)
            
            db.commit()
            db.refresh(db_depreciation)
            
            # Update the asset's current value if book_value_after was updated
            if "book_value_after" in update_data:
                asset = AssetService.get_asset(db, db_depreciation.asset_id)
                if asset:
                    asset.current_value = db_depreciation.book_value_after
                    db.commit()
        
        return db_depreciation
    
    @staticmethod
    def delete_asset_depreciation(db: Session, depreciation_id: int) -> bool:
        """Delete a depreciation entry"""
        db_depreciation = AssetService.get_asset_depreciation(db, depreciation_id)
        if db_depreciation:
            db.delete(db_depreciation)
            db.commit()
            return True
        return False
    
    # Asset Maintenance methods
    @staticmethod
    def get_asset_maintenances(db: Session, asset_id: int) -> List[AssetMaintenance]:
        """Get all maintenance records for an asset"""
        return db.query(AssetMaintenance).filter(AssetMaintenance.asset_id == asset_id).all()
    
    @staticmethod
    def get_asset_maintenance(db: Session, maintenance_id: int) -> Optional[AssetMaintenance]:
        """Get a single maintenance record by ID"""
        return db.query(AssetMaintenance).filter(AssetMaintenance.id == maintenance_id).first()
    
    @staticmethod
    def create_asset_maintenance(db: Session, maintenance: AssetMaintenanceCreate) -> AssetMaintenance:
        """Create a new maintenance record for an asset"""
        db_maintenance = AssetMaintenance(**maintenance.dict())
        db.add(db_maintenance)
        db.commit()
        db.refresh(db_maintenance)
        return db_maintenance
    
    @staticmethod
    def update_asset_maintenance(db: Session, maintenance_id: int, maintenance: AssetMaintenanceUpdate) -> Optional[AssetMaintenance]:
        """Update an existing maintenance record"""
        db_maintenance = AssetService.get_asset_maintenance(db, maintenance_id)
        if db_maintenance:
            update_data = maintenance.dict(exclude_unset=True)
            for key, value in update_data.items():
                setattr(db_maintenance, key, value)
            
            db.commit()
            db.refresh(db_maintenance)
        
        return db_maintenance
    
    @staticmethod
    def delete_asset_maintenance(db: Session, maintenance_id: int) -> bool:
        """Delete a maintenance record"""
        db_maintenance = AssetService.get_asset_maintenance(db, maintenance_id)
        if db_maintenance:
            db.delete(db_maintenance)
            db.commit()
            return True
        return False
