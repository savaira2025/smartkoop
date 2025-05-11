import requests
import json
from datetime import datetime, timedelta
import random
import string

# Configuration
BASE_URL = "http://localhost:8000/api/v1"
HEADERS = {"Content-Type": "application/json"}

def random_string(length=8):
    """Generate a random string of fixed length"""
    letters = string.ascii_lowercase
    return ''.join(random.choice(letters) for i in range(length))

def format_date(date_obj):
    """Format a date object to YYYY-MM-DD string"""
    return date_obj.strftime("%Y-%m-%d")

def test_project_invoice():
    print("\n=== Testing Project Invoice Functionality ===\n")
    
    # Step 1: Create a test customer
    print("Step 1: Creating a test customer...")
    customer_data = {
        "name": f"Test Customer {random_string()}",
        "email": f"test_{random_string()}@example.com",
        "phone": "123-456-7890",
        "address": "123 Test St",
        "city": "Test City",
        "state": "TS",
        "zip_code": "12345",
        "country": "Test Country",
        "customer_type": "business"
    }
    
    response = requests.post(f"{BASE_URL}/customers", json=customer_data, headers=HEADERS)
    assert response.status_code == 201, f"Failed to create customer: {response.text}"
    customer = response.json()
    print(f"Created customer: {customer['name']} (ID: {customer['id']})")
    
    # Step 2: Create a test project
    print("\nStep 2: Creating a test project...")
    today = datetime.now()
    end_date = today + timedelta(days=30)
    
    project_data = {
        "project_name": f"Test Project {random_string()}",
        "project_number": f"PROJ-{random_string(4).upper()}",
        "customer_id": customer["id"],
        "start_date": format_date(today),
        "end_date": format_date(end_date),
        "status": "active",
        "budget_amount": 10000.00,
        "description": "This is a test project for invoice testing"
    }
    
    response = requests.post(f"{BASE_URL}/projects", json=project_data, headers=HEADERS)
    assert response.status_code == 200, f"Failed to create project: {response.text}"
    project = response.json()
    print(f"Created project: {project['project_name']} (ID: {project['id']})")
    
    # Step 3: Create a project task
    print("\nStep 3: Creating a project task...")
    task_data = {
        "project_id": project["id"],
        "task_name": f"Test Task {random_string()}",
        "description": "This is a test task for invoice testing",
        "start_date": format_date(today),
        "due_date": format_date(today + timedelta(days=15)),
        "status": "in-progress",
        "estimated_hours": 40.0,
        "hourly_rate": 100.0
    }
    
    response = requests.post(f"{BASE_URL}/projects/{project['id']}/tasks", json=task_data, headers=HEADERS)
    assert response.status_code == 200, f"Failed to create task: {response.text}"
    task = response.json()
    print(f"Created task: {task['task_name']} (ID: {task['id']})")
    
    # Step 4: Create a time entry for the task
    print("\nStep 4: Creating a time entry...")
    # First, get a member to associate with the time entry
    response = requests.get(f"{BASE_URL}/members", headers=HEADERS)
    assert response.status_code == 200, f"Failed to get members: {response.text}"
    members = response.json()
    assert len(members) > 0, "No members found in the system"
    member = members[0]
    
    time_entry_data = {
        "task_id": task["id"],
        "member_id": member["id"],
        "date": format_date(today),
        "hours": 8.0,
        "description": "Work on test task",
        "billable": True
    }
    
    response = requests.post(f"{BASE_URL}/projects/tasks/{task['id']}/time-entries", json=time_entry_data, headers=HEADERS)
    assert response.status_code == 200, f"Failed to create time entry: {response.text}"
    time_entry = response.json()
    print(f"Created time entry: {time_entry['hours']} hours (ID: {time_entry['id']})")
    
    # Step 5: Create a project invoice
    print("\nStep 5: Creating a project invoice...")
    invoice_date = today
    due_date = today + timedelta(days=30)
    
    invoice_data = {
        "project_id": project["id"],
        "invoice_number": f"INV-{random_string(6).upper()}",
        "invoice_date": format_date(invoice_date),
        "due_date": format_date(due_date),
        "status": "draft",
        "subtotal": 0.0,  # Will be calculated from items
        "tax_amount": 0.0,  # Will be calculated from items
        "total_amount": 0.0  # Will be calculated from items
    }
    
    response = requests.post(f"{BASE_URL}/projects/{project['id']}/invoices", json=invoice_data, headers=HEADERS)
    assert response.status_code == 200, f"Failed to create invoice: {response.text}"
    invoice = response.json()
    print(f"Created invoice: {invoice['invoice_number']} (ID: {invoice['id']})")
    
    # Step 6: Add invoice items
    print("\nStep 6: Adding invoice items...")
    # Item 1: Based on the task
    item1_data = {
        "invoice_id": invoice["id"],
        "description": f"Task: {task['task_name']}",
        "quantity": 8.0,  # Hours from time entry
        "unit_price": 100.0,  # Hourly rate from task
        "subtotal": 800.0,  # quantity * unit_price
        "tax_rate": 7.0,
        "task_id": task["id"]
    }
    
    response = requests.post(f"{BASE_URL}/projects/invoices/{invoice['id']}/items", json=item1_data, headers=HEADERS)
    assert response.status_code == 200, f"Failed to create invoice item 1: {response.text}"
    item1 = response.json()
    print(f"Created invoice item 1: {item1['description']} (ID: {item1['id']})")
    
    # Item 2: Additional item
    item2_data = {
        "invoice_id": invoice["id"],
        "description": "Additional services",
        "quantity": 1.0,
        "unit_price": 200.0,
        "subtotal": 200.0,  # quantity * unit_price
        "tax_rate": 7.0,
        "task_id": None
    }
    
    response = requests.post(f"{BASE_URL}/projects/invoices/{invoice['id']}/items", json=item2_data, headers=HEADERS)
    assert response.status_code == 200, f"Failed to create invoice item 2: {response.text}"
    item2 = response.json()
    print(f"Created invoice item 2: {item2['description']} (ID: {item2['id']})")
    
    # Step 7: Get the updated invoice
    print("\nStep 7: Getting the updated invoice...")
    response = requests.get(f"{BASE_URL}/projects/invoices/{invoice['id']}", headers=HEADERS)
    assert response.status_code == 200, f"Failed to get invoice: {response.text}"
    updated_invoice = response.json()
    print(f"Updated invoice subtotal: {updated_invoice['subtotal']}")
    print(f"Updated invoice tax amount: {updated_invoice['tax_amount']}")
    print(f"Updated invoice total amount: {updated_invoice['total_amount']}")
    
    # Step 8: Update the invoice status to 'sent'
    print("\nStep 8: Updating invoice status to 'sent'...")
    update_data = {
        "status": "sent"
    }
    
    response = requests.put(f"{BASE_URL}/projects/invoices/{invoice['id']}", json=update_data, headers=HEADERS)
    assert response.status_code == 200, f"Failed to update invoice: {response.text}"
    updated_invoice = response.json()
    print(f"Updated invoice status: {updated_invoice['status']}")
    
    # Step 9: Add a partial payment
    print("\nStep 9: Adding a partial payment...")
    payment_data = {
        "invoice_id": invoice["id"],
        "payment_date": format_date(today),
        "amount": 500.0,  # Partial payment
        "payment_method": "bank_transfer",
        "reference_number": f"REF-{random_string(6).upper()}",
        "notes": "Partial payment for invoice"
    }
    
    response = requests.post(f"{BASE_URL}/projects/invoices/{invoice['id']}/payments", json=payment_data, headers=HEADERS)
    assert response.status_code == 200, f"Failed to create payment: {response.text}"
    payment = response.json()
    print(f"Created payment: {payment['amount']} (ID: {payment['id']})")
    
    # Step 10: Get the updated invoice to check status
    print("\nStep 10: Getting the updated invoice to check status...")
    response = requests.get(f"{BASE_URL}/projects/invoices/{invoice['id']}", headers=HEADERS)
    assert response.status_code == 200, f"Failed to get invoice: {response.text}"
    updated_invoice = response.json()
    print(f"Updated invoice status after partial payment: {updated_invoice['status']}")
    
    # Step 11: Add the remaining payment
    print("\nStep 11: Adding the remaining payment...")
    remaining_amount = float(updated_invoice['total_amount']) - 500.0
    payment_data = {
        "invoice_id": invoice["id"],
        "payment_date": format_date(today),
        "amount": remaining_amount,
        "payment_method": "bank_transfer",
        "reference_number": f"REF-{random_string(6).upper()}",
        "notes": "Final payment for invoice"
    }
    
    response = requests.post(f"{BASE_URL}/projects/invoices/{invoice['id']}/payments", json=payment_data, headers=HEADERS)
    assert response.status_code == 200, f"Failed to create payment: {response.text}"
    payment = response.json()
    print(f"Created payment: {payment['amount']} (ID: {payment['id']})")
    
    # Step 12: Get the updated invoice to check status
    print("\nStep 12: Getting the updated invoice to check final status...")
    response = requests.get(f"{BASE_URL}/projects/invoices/{invoice['id']}", headers=HEADERS)
    assert response.status_code == 200, f"Failed to get invoice: {response.text}"
    updated_invoice = response.json()
    print(f"Updated invoice status after full payment: {updated_invoice['status']}")
    assert updated_invoice['status'] == 'paid', f"Expected invoice status to be 'paid', but got '{updated_invoice['status']}'"
    
    # Step 13: Clean up - Delete the invoice
    print("\nStep 13: Cleaning up - Deleting the invoice...")
    response = requests.delete(f"{BASE_URL}/projects/invoices/{invoice['id']}", headers=HEADERS)
    assert response.status_code == 200, f"Failed to delete invoice: {response.text}"
    print(f"Deleted invoice: {invoice['id']}")
    
    # Step 14: Clean up - Delete the project
    print("\nStep 14: Cleaning up - Deleting the project...")
    response = requests.delete(f"{BASE_URL}/projects/{project['id']}", headers=HEADERS)
    assert response.status_code == 200, f"Failed to delete project: {response.text}"
    print(f"Deleted project: {project['id']}")
    
    # Step 15: Clean up - Delete the customer
    print("\nStep 15: Cleaning up - Deleting the customer...")
    response = requests.delete(f"{BASE_URL}/customers/{customer['id']}", headers=HEADERS)
    assert response.status_code == 204, f"Failed to delete customer: {response.text}"
    print(f"Deleted customer: {customer['id']}")
    
    print("\n=== Project Invoice Test Completed Successfully ===")

if __name__ == "__main__":
    test_project_invoice()
