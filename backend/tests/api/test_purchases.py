import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from unittest.mock import patch, MagicMock

from app.main import app
from app.db.database import get_db
from app.models.purchases import PurchaseOrder
from app.services.purchase_service import create_purchase_order

client = TestClient(app)

# Mock database session
@pytest.fixture
def mock_db():
    mock = MagicMock()
    return mock

# Override the get_db dependency
@pytest.fixture
def override_get_db(mock_db):
    app.dependency_overrides[get_db] = lambda: mock_db
    yield
    app.dependency_overrides = {}

def test_create_purchase_order_success(mock_db, override_get_db):
    """Test successful purchase order creation"""
    # Mock data
    test_order = {
        "supplier_id": 1,
        "order_date": "2025-05-01",
        "order_number": "PO-250501-1234",
        "status": "draft",
        "subtotal": 100.0,
        "tax_amount": 10.0,
        "total_amount": 110.0,
        "payment_status": "unpaid",
        "items": [
            {
                "item_description": "Test Item",
                "quantity": 2,
                "unit_price": 50.0,
                "subtotal": 100.0,
                "tax_rate": 10.0
            }
        ]
    }
    
    # Mock the create_purchase_order service function
    mock_order = MagicMock()
    mock_order.id = 1
    mock_order.supplier_id = 1
    mock_order.order_date = "2025-05-01"
    mock_order.order_number = "PO-250501-1234"
    mock_order.status = "draft"
    mock_order.subtotal = 100.0
    mock_order.tax_amount = 10.0
    mock_order.total_amount = 110.0
    mock_order.payment_status = "unpaid"
    mock_order.items = []
    mock_order.created_at = "2025-05-01"
    mock_order.updated_at = "2025-05-01"
    
    with patch('app.api.api_v1.endpoints.purchases.create_purchase_order', return_value=mock_order):
        response = client.post("/api/v1/purchases/orders", json=test_order)
    
    assert response.status_code == 201
    assert response.json()["order_number"] == "PO-250501-1234"

def test_create_purchase_order_failure(mock_db, override_get_db):
    """Test purchase order creation failure"""
    # Mock data
    test_order = {
        "supplier_id": 1,
        "order_date": "2025-05-01",
        "order_number": "PO-250501-1234",
        "status": "draft",
        "subtotal": 100.0,
        "tax_amount": 10.0,
        "total_amount": 110.0,
        "payment_status": "unpaid",
        "items": [
            {
                "item_description": "Test Item",
                "quantity": 2,
                "unit_price": 50.0,
                "subtotal": 100.0,
                "tax_rate": 10.0
            }
        ]
    }
    
    # Mock the create_purchase_order service function to raise an exception
    with patch('app.api.api_v1.endpoints.purchases.create_purchase_order', side_effect=Exception("Database error")):
        response = client.post("/api/v1/purchases/orders", json=test_order)
    
    assert response.status_code == 500
    assert "error" in response.json()

def test_update_purchase_order_failure(mock_db, override_get_db):
    """Test purchase order update failure"""
    # Mock data
    test_order = {
        "supplier_id": 1,
        "status": "approved"
    }
    
    # Mock the get_purchase_order service function
    mock_order = MagicMock()
    mock_order.id = 1
    
    # Mock the service functions
    with patch('app.api.api_v1.endpoints.purchases.get_purchase_order', return_value=mock_order):
        with patch('app.api.api_v1.endpoints.purchases.update_purchase_order', side_effect=Exception("Database error")):
            response = client.put("/api/v1/purchases/orders/1", json=test_order)
    
    assert response.status_code == 500
    assert "error" in response.json()

def test_get_purchase_order_not_found(mock_db, override_get_db):
    """Test getting a non-existent purchase order"""
    # Mock the get_purchase_order service function to return None
    with patch('app.api.api_v1.endpoints.purchases.get_purchase_order', return_value=None):
        response = client.get("/api/v1/purchases/orders/999")
    
    assert response.status_code == 404
    assert response.json()["detail"] == "Purchase order not found"
