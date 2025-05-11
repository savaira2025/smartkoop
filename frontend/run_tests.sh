#!/bin/bash

# Run Jest unit tests for PurchaseOrderForm
echo "Running Jest unit tests for PurchaseOrderForm..."
npm test -- --testPathPattern=src/components/purchases/__tests__/PurchaseOrderForm.test.js

# Run Cypress E2E tests for purchase order error handling
echo "Running Cypress E2E tests for purchase order error handling..."
npm run cypress:run -- --spec "cypress/integration/purchase_order_error.spec.js"

# Run backend tests for purchase order error handling
echo "Running backend tests for purchase order error handling..."
cd ../backend
python test_purchase_order_error.py
