import requests
import json
import sys
from datetime import datetime, timedelta

# Configuration
API_URL = "http://localhost:8000/api/v1"
TOKEN = None  # Set this if your API requires authentication

def get_headers():
    """Get headers for API requests"""
    headers = {
        "Content-Type": "application/json"
    }
    if TOKEN:
        headers["Authorization"] = f"Bearer {TOKEN}"
    return headers

def test_purchase_order_error():
    """Test purchase order error handling"""
    print("Testing purchase order error handling...")
    
    # 1. Get a supplier ID to use in the test
    try:
        response = requests.get(f"{API_URL}/suppliers", headers=get_headers())
        response.raise_for_status()
        suppliers = response.json()
        
        if not suppliers:
            print("Error: No suppliers found. Please create a supplier first.")
            return False
        
        supplier_id = suppliers[0]["id"]
    except Exception as e:
        print(f"Error getting suppliers: {str(e)}")
        return False
    
    # 2. Create a purchase order with invalid data
    # In this case, we'll use a negative value for subtotal which should trigger validation errors
    order_date = datetime.now().strftime("%Y-%m-%d")
    due_date = (datetime.now() + timedelta(days=30)).strftime("%Y-%m-%d")
    
    invalid_purchase_order = {
        "supplier_id": supplier_id,
        "order_date": order_date,
        "order_number": f"PO-TEST-{datetime.now().strftime('%Y%m%d%H%M%S')}",
        "status": "draft",
        "subtotal": -100.0,  # Invalid negative value
        "tax_amount": 10.0,
        "total_amount": -90.0,  # Invalid negative value
        "payment_status": "unpaid",
        "due_date": due_date,
        "items": [
            {
                "item_description": "Test Item",
                "quantity": 2,
                "unit_price": -50.0,  # Invalid negative value
                "subtotal": -100.0,  # Invalid negative value
                "tax_rate": 10.0
            }
        ]
    }
    
    try:
        response = requests.post(
            f"{API_URL}/purchases/orders",
            headers=get_headers(),
            data=json.dumps(invalid_purchase_order)
        )
        
        # Check if we got an error response
        if response.status_code >= 400:
            print(f"Successfully received error response: {response.status_code}")
            print(f"Error details: {response.json()}")
            return True
        else:
            print(f"Error: Expected error response, but got {response.status_code}")
            print(f"Response: {response.json()}")
            return False
    except Exception as e:
        print(f"Error creating purchase order: {str(e)}")
        return False

def test_purchase_order_update_error():
    """Test purchase order update error handling"""
    print("Testing purchase order update error handling...")
    
    # 1. Get a purchase order ID to use in the test
    try:
        response = requests.get(f"{API_URL}/purchases/orders", headers=get_headers())
        response.raise_for_status()
        orders = response.json()
        
        if not orders:
            print("Error: No purchase orders found. Please create a purchase order first.")
            return False
        
        order_id = orders[0]["id"]
    except Exception as e:
        print(f"Error getting purchase orders: {str(e)}")
        return False
    
    # 2. Update a purchase order with invalid data
    invalid_update = {
        "subtotal": -200.0,  # Invalid negative value
        "tax_amount": -20.0,  # Invalid negative value
        "total_amount": -220.0  # Invalid negative value
    }
    
    try:
        response = requests.put(
            f"{API_URL}/purchases/orders/{order_id}",
            headers=get_headers(),
            data=json.dumps(invalid_update)
        )
        
        # Check if we got an error response
        if response.status_code >= 400:
            print(f"Successfully received error response: {response.status_code}")
            print(f"Error details: {response.json()}")
            return True
        else:
            print(f"Error: Expected error response, but got {response.status_code}")
            print(f"Response: {response.json()}")
            return False
    except Exception as e:
        print(f"Error updating purchase order: {str(e)}")
        return False

if __name__ == "__main__":
    print("Purchase Order Error Handling Test")
    print("==================================")
    
    create_result = test_purchase_order_error()
    update_result = test_purchase_order_update_error()
    
    if create_result and update_result:
        print("\nAll tests passed!")
        sys.exit(0)
    else:
        print("\nSome tests failed!")
        sys.exit(1)
