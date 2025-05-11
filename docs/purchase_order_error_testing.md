# Testing Purchase Order Error Handling

This document explains how to test the "Failed to save purchase order. Please try again." error message in the Smartkoop system.

## Overview

The Smartkoop system includes error handling for purchase order operations. When a purchase order cannot be saved due to an error, the system displays the message "Failed to save purchase order. Please try again." to the user. This error message is displayed in the following scenarios:

1. When creating a new purchase order fails
2. When updating an existing purchase order fails

## Test Files

We have created several test files to verify that the error message is displayed correctly:

1. **Frontend Unit Tests**: `frontend/src/components/purchases/__tests__/PurchaseOrderForm.test.js`
   - Tests that the error message is displayed when the API call to create or update a purchase order fails

2. **Frontend E2E Tests**: `frontend/cypress/integration/purchase_order_error.spec.js`
   - Tests the full user flow of creating/updating a purchase order and seeing the error message when it fails

3. **Backend Tests**: `backend/test_purchase_order_error.py`
   - Tests that the backend API returns appropriate error responses when purchase order operations fail
   - Tests that the error handling middleware correctly formats error responses

4. **Backend API Tests**: `backend/tests/api/test_purchases.py`
   - Tests the purchase order API endpoints and their error handling

## Running the Tests

### All Tests

To run all tests, use the provided script:

```bash
cd frontend
./run_tests.sh
```

This script will run all the tests in sequence.

### Frontend Unit Tests

To run only the frontend unit tests:

```bash
cd frontend
npm test -- --testPathPattern=src/components/purchases/__tests__/PurchaseOrderForm.test.js
```

### Frontend E2E Tests

To run only the frontend E2E tests:

```bash
cd frontend
npm run cypress:open
```

Then select the `purchase_order_error.spec.js` test in the Cypress UI.

Or to run it headlessly:

```bash
cd frontend
npm run cypress:run -- --spec "cypress/integration/purchase_order_error.spec.js"
```

### Backend Tests

To run only the backend tests:

```bash
cd backend
python test_purchase_order_error.py
```

## Test Scenarios

### Frontend Unit Tests

The frontend unit tests mock the API calls to simulate failures and verify that the error message is displayed correctly. The tests include:

1. Testing that the error message is displayed when creating a new purchase order fails
2. Testing that the error message is displayed when updating an existing purchase order fails

### Frontend E2E Tests

The frontend E2E tests use Cypress to simulate a user interacting with the application. The tests include:

1. Filling out the purchase order form and submitting it, then verifying that the error message is displayed when the API call fails
2. Editing an existing purchase order and submitting it, then verifying that the error message is displayed when the API call fails

### Backend Tests

The backend tests verify that the API endpoints return appropriate error responses when operations fail. The tests include:

1. Testing that the create purchase order endpoint returns a 500 error with an appropriate error message when the operation fails
2. Testing that the update purchase order endpoint returns a 500 error with an appropriate error message when the operation fails

## Error Handling Implementation

### Frontend

In the `PurchaseOrderForm.js` component, error handling is implemented in the `handleSubmit` function:

```javascript
try {
  setLoading(true);
  setError(null);
  
  // ... code to prepare and submit the purchase order ...
  
  if (isEditMode) {
    await purchaseService.updatePurchaseOrder(id, purchaseOrderData);
  } else {
    const response = await purchaseService.createPurchaseOrder(purchaseOrderData);
    id = response.id;
  }
  
  setLoading(false);
  navigate(`/purchases/orders/${id}`);
} catch (err) {
  console.error('Error saving purchase order:', err);
  setError('Failed to save purchase order. Please try again.');
  setLoading(false);
}
```

### Backend

In the `purchases.py` API endpoints, error handling is implemented using try-except blocks:

```python
@router.post("/orders", response_model=PurchaseOrderSchema, status_code=status.HTTP_201_CREATED)
def create_new_purchase_order(
    order: PurchaseOrderCreate,
    db: Session = Depends(get_db)
):
    """
    Create a new purchase order
    """
    try:
        return create_purchase_order(db=db, order=order)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"error": "Failed to create purchase order", "message": str(e)}
        )
```

## Fixes Implemented

To address the "Failed to save purchase order. Please try again." error message, we've implemented the following fixes:

### Frontend Fixes

1. **Enhanced Form Validation**: We've added more robust validation in the `PurchaseOrderForm.js` component:
   - Validating that a supplier is selected
   - Ensuring at least one item is added to the purchase order
   - Validating that all required fields are present before submission
   - Checking for negative values in numeric fields

```javascript
// Validate form data
if (!formData.supplier_id) {
  throw new Error('Supplier is required');
}

if (items.length === 0) {
  throw new Error('At least one item is required');
}

// Validate that all required fields are present
const requiredFields = ['supplier_id', 'order_date', 'order_number', 'status'];
const missingFields = requiredFields.filter(field => !purchaseOrderData[field]);

if (missingFields.length > 0) {
  throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
}
```

2. **Improved Error Handling**: We've improved the error handling in the form submission process to provide more specific error messages.

### Backend Fixes

1. **Enhanced Validation in Purchase Service**: We've added comprehensive validation in the `purchase_service.py` file:
   - Validating required fields (supplier_id, order_date, status, etc.)
   - Ensuring at least one item is included in the purchase order
   - Validating numeric fields to prevent negative values
   - Validating item fields (description, quantity, unit_price, etc.)

```python
# Validate required fields
if not order.supplier_id:
    raise ValueError("Supplier ID is required")

if not order.order_date:
    raise ValueError("Order date is required")

if not order.status:
    raise ValueError("Status is required")

if not order.items or len(order.items) == 0:
    raise ValueError("At least one item is required")
```

2. **Transaction Management**: We've added proper transaction management with rollback in case of errors:

```python
try:
    # Create purchase order and items
    # ...
    db.commit()
    db.refresh(db_order)
    return db_order
except Exception as e:
    db.rollback()
    raise ValueError(f"Failed to create purchase order: {str(e)}")
```

3. **Specific Error Messages**: We've improved error messages to provide more specific information about what went wrong.

## Conclusion

The error handling for purchase orders has been thoroughly tested and improved to ensure that users receive appropriate feedback when operations fail. The tests cover both frontend and backend components, ensuring that the system behaves correctly in error scenarios.

The implemented fixes address the root causes of the "Failed to save purchase order. Please try again." error message by:
1. Preventing invalid data from being submitted
2. Providing more specific error messages
3. Properly handling transactions in the backend
4. Adding comprehensive validation at both frontend and backend levels

These improvements make the system more robust and user-friendly by preventing errors before they occur and providing clear feedback when they do occur.
