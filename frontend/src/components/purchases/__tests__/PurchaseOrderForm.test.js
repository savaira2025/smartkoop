import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import PurchaseOrderForm from '../PurchaseOrderForm';
import purchaseService from '../../../services/purchaseService';
import supplierService from '../../../services/supplierService';

// Mock the services
jest.mock('../../../services/purchaseService');
jest.mock('../../../services/supplierService');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ id: undefined }),
  useNavigate: () => jest.fn()
}));

describe('PurchaseOrderForm', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    
    // Mock the supplier service to return some test data
    supplierService.getSuppliers.mockResolvedValue([
      { id: 1, name: 'Supplier 1' },
      { id: 2, name: 'Supplier 2' }
    ]);
  });

  test('displays error message when purchase order save fails', async () => {
    // Mock the createPurchaseOrder method to reject with an error
    purchaseService.createPurchaseOrder.mockRejectedValue(new Error('API Error'));

    // Render the component
    render(
      <MemoryRouter>
        <PurchaseOrderForm />
      </MemoryRouter>
    );

    // Wait for suppliers to load
    await waitFor(() => {
      expect(supplierService.getSuppliers).toHaveBeenCalled();
    });

    // Fill out the form
    fireEvent.change(screen.getByLabelText(/supplier/i), { target: { value: '1' } });
    
    // Add an item
    fireEvent.click(screen.getByText('Add Item'));
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'Test Item' } });
    fireEvent.change(screen.getByLabelText(/quantity/i), { target: { value: '2' } });
    fireEvent.change(screen.getByLabelText(/unit price/i), { target: { value: '10' } });
    fireEvent.click(screen.getByText('Save').closest('button'));

    // Submit the form
    fireEvent.click(screen.getByText('Save').closest('button'));

    // Wait for the error message to appear
    await waitFor(() => {
      expect(purchaseService.createPurchaseOrder).toHaveBeenCalled();
      expect(screen.getByText('Failed to save purchase order. Please try again.')).toBeInTheDocument();
    });
  });

  test('displays error message when purchase order update fails', async () => {
    // Mock useParams to return an ID for edit mode
    jest.spyOn(require('react-router-dom'), 'useParams').mockReturnValue({ id: '1' });
    
    // Mock the getPurchaseOrder and getPurchaseOrderItems methods
    purchaseService.getPurchaseOrder.mockResolvedValue({
      id: 1,
      supplier_id: 1,
      order_date: '2025-05-01',
      order_number: 'PO-250501-1234',
      status: 'draft',
      payment_status: 'unpaid'
    });
    
    purchaseService.getPurchaseOrderItems.mockResolvedValue([
      {
        id: 1,
        purchase_order_id: 1,
        item_description: 'Existing Item',
        quantity: 1,
        unit_price: 100,
        subtotal: 100,
        tax_rate: 0
      }
    ]);
    
    // Mock the updatePurchaseOrder method to reject with an error
    purchaseService.updatePurchaseOrder.mockRejectedValue(new Error('API Error'));

    // Render the component
    render(
      <MemoryRouter>
        <PurchaseOrderForm />
      </MemoryRouter>
    );

    // Wait for data to load
    await waitFor(() => {
      expect(purchaseService.getPurchaseOrder).toHaveBeenCalled();
      expect(purchaseService.getPurchaseOrderItems).toHaveBeenCalled();
    });

    // Submit the form
    fireEvent.click(screen.getByText('Save').closest('button'));

    // Wait for the error message to appear
    await waitFor(() => {
      expect(purchaseService.updatePurchaseOrder).toHaveBeenCalled();
      expect(screen.getByText('Failed to save purchase order. Please try again.')).toBeInTheDocument();
    });
  });
});
