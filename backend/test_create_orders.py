import requests
import json
import random
from datetime import datetime, timedelta

# Base URL for the API
BASE_URL = "http://localhost:8000/api/v1"

def test_create_sales_order():
    """
    Test creating a sales order
    """
    print("\n=== Testing Sales Order Creation ===")
    
    # First, get a customer to use for the order
    response = requests.get(f"{BASE_URL}/customers")
    if response.status_code != 200:
        print(f"Failed to get customers: {response.status_code}")
        return
    
    customers = response.json()
    if not customers:
        print("No customers found. Creating a test customer...")
        
        # Create a test customer
        customer_data = {
            "name": "Test Customer",
            "contact_person": "John Doe",
            "email": "john.doe@example.com",
            "phone": "123-456-7890",
            "address": "123 Main St, Anytown, USA",
            "payment_terms": "Net 30",
            "tax_id": "TAX-12345",
            "status": "active"
        }
        
        response = requests.post(f"{BASE_URL}/customers", json=customer_data)
        if response.status_code != 201:
            print(f"Failed to create test customer: {response.status_code}")
            return
        
        customer = response.json()
        customer_id = customer["id"]
        print(f"Created test customer with ID: {customer_id}")
    else:
        customer_id = customers[0]["id"]
        print(f"Using existing customer with ID: {customer_id}")
    
    # Create a sales order
    order_date = datetime.now().strftime("%Y-%m-%d")
    due_date = (datetime.now() + timedelta(days=30)).strftime("%Y-%m-%d")
    
    sales_order_data = {
        "customer_id": customer_id,
        "order_date": order_date,
        "order_number": f"SO-TEST-{datetime.now().strftime('%Y%m%d%H%M%S')}",
        "status": "draft",
        "payment_status": "unpaid",
        "due_date": due_date,
        "subtotal": 1000.00,
        "tax_amount": 100.00,
        "total_amount": 1100.00,
        "items": [
            {
                "item_description": "Test Product 1",
                "quantity": 2,
                "unit_price": 300.00,
                "subtotal": 600.00,
                "tax_rate": 10.00
            },
            {
                "item_description": "Test Product 2",
                "quantity": 1,
                "unit_price": 400.00,
                "subtotal": 400.00,
                "tax_rate": 10.00
            }
        ]
    }
    
    response = requests.post(f"{BASE_URL}/sales/orders", json=sales_order_data)
    if response.status_code != 201:
        print(f"Failed to create sales order: {response.status_code}")
        print(response.text)
        return
    
    sales_order = response.json()
    print(f"Successfully created sales order with ID: {sales_order['id']}")
    print(json.dumps(sales_order, indent=2))
    
    return sales_order

def test_create_purchase_order():
    """
    Test creating a purchase order
    """
    print("\n=== Testing Purchase Order Creation ===")
    
    # First, get a supplier to use for the order
    response = requests.get(f"{BASE_URL}/suppliers")
    if response.status_code != 200:
        print(f"Failed to get suppliers: {response.status_code}")
        return
    
    suppliers = response.json()
    if not suppliers:
        print("No suppliers found. Creating a test supplier...")
        
        # Create a test supplier
        supplier_data = {
            "name": "Test Supplier",
            "contact_person": "Jane Smith",
            "email": "jane.smith@example.com",
            "phone": "987-654-3210",
            "address": "456 Oak St, Anytown, USA",
            "payment_terms": "Net 30",
            "tax_id": "TAX-54321",
            "status": "active",
            "bank_account": "1234567890"
        }
        
        response = requests.post(f"{BASE_URL}/suppliers", json=supplier_data)
        if response.status_code != 201:
            print(f"Failed to create test supplier: {response.status_code}")
            return
        
        supplier = response.json()
        supplier_id = supplier["id"]
        print(f"Created test supplier with ID: {supplier_id}")
    else:
        supplier_id = suppliers[0]["id"]
        print(f"Using existing supplier with ID: {supplier_id}")
    
    # Create a purchase order
    order_date = datetime.now().strftime("%Y-%m-%d")
    due_date = (datetime.now() + timedelta(days=30)).strftime("%Y-%m-%d")
    
    purchase_order_data = {
        "supplier_id": supplier_id,
        "order_date": order_date,
        "order_number": f"PO-TEST-{datetime.now().strftime('%Y%m%d%H%M%S')}",
        "status": "draft",
        "payment_status": "unpaid",
        "due_date": due_date,
        "subtotal": 1500.00,
        "tax_amount": 150.00,
        "total_amount": 1650.00,
        "items": [
            {
                "item_description": "Raw Material A",
                "quantity": 10,
                "unit_price": 50.00,
                "subtotal": 500.00,
                "tax_rate": 10.00
            },
            {
                "item_description": "Raw Material B",
                "quantity": 5,
                "unit_price": 200.00,
                "subtotal": 1000.00,
                "tax_rate": 10.00
            }
        ]
    }
    
    response = requests.post(f"{BASE_URL}/purchases/orders", json=purchase_order_data)
    if response.status_code != 201:
        print(f"Failed to create purchase order: {response.status_code}")
        print(response.text)
        return
    
    purchase_order = response.json()
    print(f"Successfully created purchase order with ID: {purchase_order['id']}")
    print(json.dumps(purchase_order, indent=2))
    
    return purchase_order

def test_create_sales_invoice(sales_order_id):
    """
    Test creating a sales invoice for a sales order
    """
    print("\n=== Testing Sales Invoice Creation ===")
    
    if not sales_order_id:
        print("No sales order ID provided. Cannot create invoice.")
        return
    
    # Create a sales invoice
    invoice_date = datetime.now().strftime("%Y-%m-%d")
    due_date = (datetime.now() + timedelta(days=30)).strftime("%Y-%m-%d")
    
    sales_invoice_data = {
        "sales_order_id": sales_order_id,
        "invoice_number": f"INV-SO-{datetime.now().strftime('%Y%m%d%H%M%S')}",
        "invoice_date": invoice_date,
        "due_date": due_date,
        "amount": 1100.00,
        "status": "unpaid"
    }
    
    response = requests.post(f"{BASE_URL}/sales/invoices", json=sales_invoice_data)
    if response.status_code != 201:
        print(f"Failed to create sales invoice: {response.status_code}")
        print(response.text)
        return
    
    sales_invoice = response.json()
    print(f"Successfully created sales invoice with ID: {sales_invoice['id']}")
    print(json.dumps(sales_invoice, indent=2))
    
    return sales_invoice

def test_create_sales_payment(invoice_id):
    """
    Test creating a payment for a sales invoice
    """
    print("\n=== Testing Sales Payment Creation ===")
    
    if not invoice_id:
        print("No invoice ID provided. Cannot create payment.")
        return
    
    # Create a sales payment
    payment_date = datetime.now().strftime("%Y-%m-%d")
    
    payment_methods = ["cash", "credit_card", "bank_transfer", "check"]
    
    sales_payment_data = {
        "invoice_id": invoice_id,
        "payment_date": payment_date,
        "amount": 1100.00,
        "payment_method": random.choice(payment_methods),
        "reference_number": f"REF-{datetime.now().strftime('%Y%m%d%H%M%S')}",
        "notes": "Test payment"
    }
    
    response = requests.post(f"{BASE_URL}/sales/invoices/{invoice_id}/payments", json=sales_payment_data)
    if response.status_code != 201:
        print(f"Failed to create sales payment: {response.status_code}")
        print(response.text)
        return
    
    sales_payment = response.json()
    print(f"Successfully created sales payment with ID: {sales_payment['id']}")
    print(json.dumps(sales_payment, indent=2))
    
    # Update the invoice status to reflect payment
    update_invoice_data = {
        "status": "paid"
    }
    
    response = requests.put(f"{BASE_URL}/sales/invoices/{invoice_id}", json=update_invoice_data)
    if response.status_code != 200:
        print(f"Failed to update invoice status: {response.status_code}")
        print(response.text)
    else:
        print(f"Successfully updated invoice status to 'paid'")
    
    return sales_payment

def test_create_supplier_invoice(purchase_order_id):
    """
    Test creating a supplier invoice for a purchase order
    """
    print("\n=== Testing Supplier Invoice Creation ===")
    
    if not purchase_order_id:
        print("No purchase order ID provided. Cannot create invoice.")
        return
    
    # Create a supplier invoice
    invoice_date = datetime.now().strftime("%Y-%m-%d")
    due_date = (datetime.now() + timedelta(days=30)).strftime("%Y-%m-%d")
    
    supplier_invoice_data = {
        "purchase_order_id": purchase_order_id,
        "invoice_number": f"INV-PO-{datetime.now().strftime('%Y%m%d%H%M%S')}",
        "invoice_date": invoice_date,
        "due_date": due_date,
        "amount": 1650.00,
        "status": "unpaid"
    }
    
    response = requests.post(f"{BASE_URL}/purchases/orders/{purchase_order_id}/invoices", json=supplier_invoice_data)
    if response.status_code != 201:
        print(f"Failed to create supplier invoice: {response.status_code}")
        print(response.text)
        return
    
    supplier_invoice = response.json()
    print(f"Successfully created supplier invoice with ID: {supplier_invoice['id']}")
    print(json.dumps(supplier_invoice, indent=2))
    
    return supplier_invoice

def test_create_supplier_payment(invoice_id):
    """
    Test creating a payment for a supplier invoice
    """
    print("\n=== Testing Supplier Payment Creation ===")
    
    if not invoice_id:
        print("No invoice ID provided. Cannot create payment.")
        return
    
    # Create a supplier payment
    payment_date = datetime.now().strftime("%Y-%m-%d")
    
    payment_methods = ["cash", "credit_card", "bank_transfer", "check"]
    
    supplier_payment_data = {
        "invoice_id": invoice_id,
        "payment_date": payment_date,
        "amount": 1650.00,
        "payment_method": random.choice(payment_methods),
        "reference_number": f"REF-{datetime.now().strftime('%Y%m%d%H%M%S')}",
        "notes": "Test payment to supplier"
    }
    
    response = requests.post(f"{BASE_URL}/purchases/invoices/{invoice_id}/payments", json=supplier_payment_data)
    if response.status_code != 201:
        print(f"Failed to create supplier payment: {response.status_code}")
        print(response.text)
        return
    
    supplier_payment = response.json()
    print(f"Successfully created supplier payment with ID: {supplier_payment['id']}")
    print(json.dumps(supplier_payment, indent=2))
    
    # Update the invoice status to reflect payment
    update_invoice_data = {
        "status": "paid"
    }
    
    response = requests.put(f"{BASE_URL}/purchases/invoices/{invoice_id}", json=update_invoice_data)
    if response.status_code != 200:
        print(f"Failed to update invoice status: {response.status_code}")
        print(response.text)
    else:
        print(f"Successfully updated invoice status to 'paid'")
    
    return supplier_payment

def test_complete_sales_workflow():
    """
    Test the complete sales workflow: order -> invoice -> payment
    """
    print("\n=== Testing Complete Sales Workflow ===")
    
    # Create a sales order
    sales_order = test_create_sales_order()
    if not sales_order:
        print("Failed to create sales order. Cannot continue workflow test.")
        return False
    
    # Create a sales invoice for the order
    sales_invoice = test_create_sales_invoice(sales_order['id'])
    if not sales_invoice:
        print("Failed to create sales invoice. Cannot continue workflow test.")
        return False
    
    # Create a payment for the invoice
    sales_payment = test_create_sales_payment(sales_invoice['id'])
    if not sales_payment:
        print("Failed to create sales payment.")
        return False
    
    print("\n=== Sales Workflow Test Completed Successfully ===")
    return True

def test_complete_purchase_workflow():
    """
    Test the complete purchase workflow: order -> invoice -> payment
    """
    print("\n=== Testing Complete Purchase Workflow ===")
    
    # Create a purchase order
    purchase_order = test_create_purchase_order()
    if not purchase_order:
        print("Failed to create purchase order. Cannot continue workflow test.")
        return False
    
    # Create a supplier invoice for the order
    supplier_invoice = test_create_supplier_invoice(purchase_order['id'])
    if not supplier_invoice:
        print("Failed to create supplier invoice. Cannot continue workflow test.")
        return False
    
    # Create a payment for the invoice
    supplier_payment = test_create_supplier_payment(supplier_invoice['id'])
    if not supplier_payment:
        print("Failed to create supplier payment.")
        return False
    
    print("\n=== Purchase Workflow Test Completed Successfully ===")
    return True

if __name__ == "__main__":
    print("=== Starting Order Workflow Tests ===")
    
    # Test the complete sales workflow
    sales_success = test_complete_sales_workflow()
    
    # Test the complete purchase workflow
    purchase_success = test_complete_purchase_workflow()
    
    # Print overall test results
    print("\n=== Test Results Summary ===")
    print(f"Sales Workflow: {'SUCCESS' if sales_success else 'FAILED'}")
    print(f"Purchase Workflow: {'SUCCESS' if purchase_success else 'FAILED'}")
