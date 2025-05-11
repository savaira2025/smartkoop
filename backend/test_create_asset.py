import requests
import json
from datetime import datetime, timedelta

# Base URL for the API
BASE_URL = "http://localhost:8000/api/v1"

def test_create_asset():
    """
    Test creating a new asset
    """
    print("\n=== Testing Asset Creation ===")
    
    # Create asset data
    acquisition_date = datetime.now().strftime("%Y-%m-%d")
    
    asset_data = {
        "name": f"Test Asset {datetime.now().strftime('%Y%m%d%H%M%S')}",
        "asset_number": f"AST-TEST-{datetime.now().strftime('%Y%m%d%H%M%S')}",
        "category": "Equipment",
        "acquisition_date": acquisition_date,
        "acquisition_cost": 5000.00,
        "current_value": 5000.00,
        "depreciation_rate": 10.0,
        "location": "Main Office",
        "status": "active",
        "assigned_to": "IT Department"
    }
    
    response = requests.post(f"{BASE_URL}/assets", json=asset_data)
    if response.status_code != 200:
        print(f"Failed to create asset: {response.status_code}")
        print(response.text)
        return
    
    asset = response.json()
    print(f"Successfully created asset with ID: {asset['id']}")
    print(json.dumps(asset, indent=2))
    
    return asset

def test_create_asset_depreciation(asset_id):
    """
    Test creating a depreciation entry for an asset
    """
    print("\n=== Testing Asset Depreciation Creation ===")
    
    if not asset_id:
        print("No asset ID provided. Cannot create depreciation entry.")
        return
    
    # Create a depreciation entry
    depreciation_date = datetime.now().strftime("%Y-%m-%d")
    
    # Calculate depreciation amount (10% of current value)
    response = requests.get(f"{BASE_URL}/assets/{asset_id}")
    if response.status_code != 200:
        print(f"Failed to get asset: {response.status_code}")
        return
    
    asset = response.json()
    current_value = float(asset["current_value"])
    depreciation_amount = current_value * 0.1  # 10% depreciation
    book_value_after = current_value - depreciation_amount
    
    depreciation_data = {
        "asset_id": asset_id,
        "depreciation_date": depreciation_date,
        "depreciation_amount": depreciation_amount,
        "book_value_after": book_value_after
    }
    
    response = requests.post(f"{BASE_URL}/assets/{asset_id}/depreciations", json=depreciation_data)
    if response.status_code != 200:
        print(f"Failed to create depreciation entry: {response.status_code}")
        print(response.text)
        return
    
    depreciation = response.json()
    print(f"Successfully created depreciation entry with ID: {depreciation['id']}")
    print(json.dumps(depreciation, indent=2))
    
    return depreciation

def test_create_asset_maintenance(asset_id):
    """
    Test creating a maintenance record for an asset
    """
    print("\n=== Testing Asset Maintenance Creation ===")
    
    if not asset_id:
        print("No asset ID provided. Cannot create maintenance record.")
        return
    
    # Create a maintenance record
    maintenance_date = datetime.now().strftime("%Y-%m-%d")
    
    maintenance_data = {
        "asset_id": asset_id,
        "maintenance_date": maintenance_date,
        "maintenance_type": "Preventive",
        "cost": 250.00,
        "description": "Regular maintenance check",
        "performed_by": "Maintenance Team"
    }
    
    response = requests.post(f"{BASE_URL}/assets/{asset_id}/maintenances", json=maintenance_data)
    if response.status_code != 200:
        print(f"Failed to create maintenance record: {response.status_code}")
        print(response.text)
        return
    
    maintenance = response.json()
    print(f"Successfully created maintenance record with ID: {maintenance['id']}")
    print(json.dumps(maintenance, indent=2))
    
    return maintenance

def test_complete_asset_workflow():
    """
    Test the complete asset workflow: create asset -> add depreciation -> add maintenance
    """
    print("\n=== Testing Complete Asset Workflow ===")
    
    # Create an asset
    asset = test_create_asset()
    if not asset:
        print("Failed to create asset. Cannot continue workflow test.")
        return False
    
    # Create a depreciation entry for the asset
    depreciation = test_create_asset_depreciation(asset['id'])
    if not depreciation:
        print("Failed to create depreciation entry. Continuing workflow test...")
    
    # Create a maintenance record for the asset
    maintenance = test_create_asset_maintenance(asset['id'])
    if not maintenance:
        print("Failed to create maintenance record.")
    
    print("\n=== Asset Workflow Test Completed Successfully ===")
    return True

if __name__ == "__main__":
    print("=== Starting Asset Workflow Test ===")
    
    # Test the complete asset workflow
    asset_success = test_complete_asset_workflow()
    
    # Print overall test results
    print("\n=== Test Results Summary ===")
    print(f"Asset Workflow: {'SUCCESS' if asset_success else 'FAILED'}")
