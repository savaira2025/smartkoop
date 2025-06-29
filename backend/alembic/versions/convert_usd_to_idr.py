"""Convert USD to IDR currency

Revision ID: convert_usd_to_idr
Revises: f7cce1487919
Create Date: 2025-06-29 13:55:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy import text

# revision identifiers, used by Alembic.
revision = 'convert_usd_to_idr'
down_revision = 'f7cce1487919'
branch_labels = None
depends_on = None

# Exchange rate: 1 USD = 15,500 IDR
USD_TO_IDR_RATE = 15500.0

def upgrade():
    """Convert all monetary values from USD to IDR"""
    
    # Get connection
    connection = op.get_bind()
    
    print(f"Converting USD to IDR using rate: 1 USD = {USD_TO_IDR_RATE} IDR")
    
    # Assets table
    print("Converting asset values...")
    connection.execute(text(f"""
        UPDATE asset SET 
            acquisition_cost = acquisition_cost * {USD_TO_IDR_RATE},
            current_value = current_value * {USD_TO_IDR_RATE}
        WHERE acquisition_cost IS NOT NULL OR current_value IS NOT NULL
    """))
    
    # Asset depreciation
    print("Converting asset depreciation values...")
    connection.execute(text(f"""
        UPDATE assetdepreciation SET 
            depreciation_amount = depreciation_amount * {USD_TO_IDR_RATE},
            book_value_after = book_value_after * {USD_TO_IDR_RATE}
        WHERE depreciation_amount IS NOT NULL OR book_value_after IS NOT NULL
    """))
    
    # Asset maintenance
    print("Converting asset maintenance costs...")
    connection.execute(text(f"""
        UPDATE assetmaintenance SET 
            cost = cost * {USD_TO_IDR_RATE}
        WHERE cost IS NOT NULL
    """))
    
    # Accounting - Ledger entries
    print("Converting ledger entry amounts...")
    connection.execute(text(f"""
        UPDATE ledgerentry SET 
            debit_amount = debit_amount * {USD_TO_IDR_RATE},
            credit_amount = credit_amount * {USD_TO_IDR_RATE}
        WHERE debit_amount IS NOT NULL OR credit_amount IS NOT NULL
    """))
    
    # Payroll
    print("Converting payroll amounts...")
    connection.execute(text(f"""
        UPDATE payroll SET 
            total_amount = total_amount * {USD_TO_IDR_RATE}
        WHERE total_amount IS NOT NULL
    """))
    
    # Payroll items
    print("Converting payroll item amounts...")
    connection.execute(text(f"""
        UPDATE payrollitem SET 
            gross_salary = gross_salary * {USD_TO_IDR_RATE},
            deductions = deductions * {USD_TO_IDR_RATE},
            net_salary = net_salary * {USD_TO_IDR_RATE}
        WHERE gross_salary IS NOT NULL OR deductions IS NOT NULL OR net_salary IS NOT NULL
    """))
    
    # Employee base salary
    print("Converting employee base salaries...")
    connection.execute(text(f"""
        UPDATE employee SET 
            base_salary = base_salary * {USD_TO_IDR_RATE}
        WHERE base_salary IS NOT NULL
    """))
    
    # Sales orders
    print("Converting sales order amounts...")
    connection.execute(text(f"""
        UPDATE salesorder SET 
            subtotal = subtotal * {USD_TO_IDR_RATE},
            tax_amount = tax_amount * {USD_TO_IDR_RATE},
            total_amount = total_amount * {USD_TO_IDR_RATE}
        WHERE subtotal IS NOT NULL OR tax_amount IS NOT NULL OR total_amount IS NOT NULL
    """))
    
    # Sales order items
    print("Converting sales order item amounts...")
    connection.execute(text(f"""
        UPDATE salesorderitem SET 
            unit_price = unit_price * {USD_TO_IDR_RATE},
            subtotal = subtotal * {USD_TO_IDR_RATE}
        WHERE unit_price IS NOT NULL OR subtotal IS NOT NULL
    """))
    
    # Sales invoices
    print("Converting sales invoice amounts...")
    connection.execute(text(f"""
        UPDATE salesinvoice SET 
            amount = amount * {USD_TO_IDR_RATE}
        WHERE amount IS NOT NULL
    """))
    
    # Sales payments
    print("Converting sales payment amounts...")
    connection.execute(text(f"""
        UPDATE salespayment SET 
            amount = amount * {USD_TO_IDR_RATE}
        WHERE amount IS NOT NULL
    """))
    
    # Purchase orders
    print("Converting purchase order amounts...")
    connection.execute(text(f"""
        UPDATE purchaseorder SET 
            subtotal = subtotal * {USD_TO_IDR_RATE},
            tax_amount = tax_amount * {USD_TO_IDR_RATE},
            total_amount = total_amount * {USD_TO_IDR_RATE}
        WHERE subtotal IS NOT NULL OR tax_amount IS NOT NULL OR total_amount IS NOT NULL
    """))
    
    # Purchase order items
    print("Converting purchase order item amounts...")
    connection.execute(text(f"""
        UPDATE purchaseorderitem SET 
            unit_price = unit_price * {USD_TO_IDR_RATE},
            subtotal = subtotal * {USD_TO_IDR_RATE}
        WHERE unit_price IS NOT NULL OR subtotal IS NOT NULL
    """))
    
    # Supplier invoices
    print("Converting supplier invoice amounts...")
    connection.execute(text(f"""
        UPDATE supplierinvoice SET 
            amount = amount * {USD_TO_IDR_RATE}
        WHERE amount IS NOT NULL
    """))
    
    # Supplier payments
    print("Converting supplier payment amounts...")
    connection.execute(text(f"""
        UPDATE supplierpayment SET 
            amount = amount * {USD_TO_IDR_RATE}
        WHERE amount IS NOT NULL
    """))
    
    # Projects
    print("Converting project amounts...")
    connection.execute(text(f"""
        UPDATE project SET 
            budget_amount = budget_amount * {USD_TO_IDR_RATE},
            total_invoiced = total_invoiced * {USD_TO_IDR_RATE},
            total_cost = total_cost * {USD_TO_IDR_RATE}
        WHERE budget_amount IS NOT NULL OR total_invoiced IS NOT NULL OR total_cost IS NOT NULL
    """))
    
    # Project tasks
    print("Converting project task rates...")
    connection.execute(text(f"""
        UPDATE projecttask SET 
            hourly_rate = hourly_rate * {USD_TO_IDR_RATE}
        WHERE hourly_rate IS NOT NULL
    """))
    
    # Project invoices
    print("Converting project invoice amounts...")
    connection.execute(text(f"""
        UPDATE projectinvoice SET 
            subtotal = subtotal * {USD_TO_IDR_RATE},
            tax_amount = tax_amount * {USD_TO_IDR_RATE},
            total_amount = total_amount * {USD_TO_IDR_RATE}
        WHERE subtotal IS NOT NULL OR tax_amount IS NOT NULL OR total_amount IS NOT NULL
    """))
    
    # Project invoice items
    print("Converting project invoice item amounts...")
    connection.execute(text(f"""
        UPDATE projectinvoiceitem SET 
            unit_price = unit_price * {USD_TO_IDR_RATE},
            subtotal = subtotal * {USD_TO_IDR_RATE}
        WHERE unit_price IS NOT NULL OR subtotal IS NOT NULL
    """))
    
    # Project payments
    print("Converting project payment amounts...")
    connection.execute(text(f"""
        UPDATE projectpayment SET 
            amount = amount * {USD_TO_IDR_RATE}
        WHERE amount IS NOT NULL
    """))
    
    print("Currency conversion completed successfully!")
    print(f"All monetary values have been converted from USD to IDR using rate: {USD_TO_IDR_RATE}")


def downgrade():
    """Convert all monetary values from IDR back to USD"""
    
    # Get connection
    connection = op.get_bind()
    
    print(f"Converting IDR back to USD using rate: 1 IDR = {1/USD_TO_IDR_RATE} USD")
    
    # Reverse conversion rate
    IDR_TO_USD_RATE = 1.0 / USD_TO_IDR_RATE
    
    # Assets table
    print("Converting asset values back to USD...")
    connection.execute(text(f"""
        UPDATE asset SET 
            acquisition_cost = acquisition_cost * {IDR_TO_USD_RATE},
            current_value = current_value * {IDR_TO_USD_RATE}
        WHERE acquisition_cost IS NOT NULL OR current_value IS NOT NULL
    """))
    
    # Asset depreciation
    print("Converting asset depreciation values back to USD...")
    connection.execute(text(f"""
        UPDATE assetdepreciation SET 
            depreciation_amount = depreciation_amount * {IDR_TO_USD_RATE},
            book_value_after = book_value_after * {IDR_TO_USD_RATE}
        WHERE depreciation_amount IS NOT NULL OR book_value_after IS NOT NULL
    """))
    
    # Asset maintenance
    print("Converting asset maintenance costs back to USD...")
    connection.execute(text(f"""
        UPDATE assetmaintenance SET 
            cost = cost * {IDR_TO_USD_RATE}
        WHERE cost IS NOT NULL
    """))
    
    # Accounting - Ledger entries
    print("Converting ledger entry amounts back to USD...")
    connection.execute(text(f"""
        UPDATE ledgerentry SET 
            debit_amount = debit_amount * {IDR_TO_USD_RATE},
            credit_amount = credit_amount * {IDR_TO_USD_RATE}
        WHERE debit_amount IS NOT NULL OR credit_amount IS NOT NULL
    """))
    
    # Payroll
    print("Converting payroll amounts back to USD...")
    connection.execute(text(f"""
        UPDATE payroll SET 
            total_amount = total_amount * {IDR_TO_USD_RATE}
        WHERE total_amount IS NOT NULL
    """))
    
    # Payroll items
    print("Converting payroll item amounts back to USD...")
    connection.execute(text(f"""
        UPDATE payrollitem SET 
            gross_salary = gross_salary * {IDR_TO_USD_RATE},
            deductions = deductions * {IDR_TO_USD_RATE},
            net_salary = net_salary * {IDR_TO_USD_RATE}
        WHERE gross_salary IS NOT NULL OR deductions IS NOT NULL OR net_salary IS NOT NULL
    """))
    
    # Employee base salary
    print("Converting employee base salaries back to USD...")
    connection.execute(text(f"""
        UPDATE employee SET 
            base_salary = base_salary * {IDR_TO_USD_RATE}
        WHERE base_salary IS NOT NULL
    """))
    
    # Sales orders
    print("Converting sales order amounts back to USD...")
    connection.execute(text(f"""
        UPDATE salesorder SET 
            subtotal = subtotal * {IDR_TO_USD_RATE},
            tax_amount = tax_amount * {IDR_TO_USD_RATE},
            total_amount = total_amount * {IDR_TO_USD_RATE}
        WHERE subtotal IS NOT NULL OR tax_amount IS NOT NULL OR total_amount IS NOT NULL
    """))
    
    # Sales order items
    print("Converting sales order item amounts back to USD...")
    connection.execute(text(f"""
        UPDATE salesorderitem SET 
            unit_price = unit_price * {IDR_TO_USD_RATE},
            subtotal = subtotal * {IDR_TO_USD_RATE}
        WHERE unit_price IS NOT NULL OR subtotal IS NOT NULL
    """))
    
    # Sales invoices
    print("Converting sales invoice amounts back to USD...")
    connection.execute(text(f"""
        UPDATE salesinvoice SET 
            amount = amount * {IDR_TO_USD_RATE}
        WHERE amount IS NOT NULL
    """))
    
    # Sales payments
    print("Converting sales payment amounts back to USD...")
    connection.execute(text(f"""
        UPDATE salespayment SET 
            amount = amount * {IDR_TO_USD_RATE}
        WHERE amount IS NOT NULL
    """))
    
    # Purchase orders
    print("Converting purchase order amounts back to USD...")
    connection.execute(text(f"""
        UPDATE purchaseorder SET 
            subtotal = subtotal * {IDR_TO_USD_RATE},
            tax_amount = tax_amount * {IDR_TO_USD_RATE},
            total_amount = total_amount * {IDR_TO_USD_RATE}
        WHERE subtotal IS NOT NULL OR tax_amount IS NOT NULL OR total_amount IS NOT NULL
    """))
    
    # Purchase order items
    print("Converting purchase order item amounts back to USD...")
    connection.execute(text(f"""
        UPDATE purchaseorderitem SET 
            unit_price = unit_price * {IDR_TO_USD_RATE},
            subtotal = subtotal * {IDR_TO_USD_RATE}
        WHERE unit_price IS NOT NULL OR subtotal IS NOT NULL
    """))
    
    # Supplier invoices
    print("Converting supplier invoice amounts back to USD...")
    connection.execute(text(f"""
        UPDATE supplierinvoice SET 
            amount = amount * {IDR_TO_USD_RATE}
        WHERE amount IS NOT NULL
    """))
    
    # Supplier payments
    print("Converting supplier payment amounts back to USD...")
    connection.execute(text(f"""
        UPDATE supplierpayment SET 
            amount = amount * {IDR_TO_USD_RATE}
        WHERE amount IS NOT NULL
    """))
    
    # Projects
    print("Converting project amounts back to USD...")
    connection.execute(text(f"""
        UPDATE project SET 
            budget_amount = budget_amount * {IDR_TO_USD_RATE},
            total_invoiced = total_invoiced * {IDR_TO_USD_RATE},
            total_cost = total_cost * {IDR_TO_USD_RATE}
        WHERE budget_amount IS NOT NULL OR total_invoiced IS NOT NULL OR total_cost IS NOT NULL
    """))
    
    # Project tasks
    print("Converting project task rates back to USD...")
    connection.execute(text(f"""
        UPDATE projecttask SET 
            hourly_rate = hourly_rate * {IDR_TO_USD_RATE}
        WHERE hourly_rate IS NOT NULL
    """))
    
    # Project invoices
    print("Converting project invoice amounts back to USD...")
    connection.execute(text(f"""
        UPDATE projectinvoice SET 
            subtotal = subtotal * {IDR_TO_USD_RATE},
            tax_amount = tax_amount * {IDR_TO_USD_RATE},
            total_amount = total_amount * {IDR_TO_USD_RATE}
        WHERE subtotal IS NOT NULL OR tax_amount IS NOT NULL OR total_amount IS NOT NULL
    """))
    
    # Project invoice items
    print("Converting project invoice item amounts back to USD...")
    connection.execute(text(f"""
        UPDATE projectinvoiceitem SET 
            unit_price = unit_price * {IDR_TO_USD_RATE},
            subtotal = subtotal * {IDR_TO_USD_RATE}
        WHERE unit_price IS NOT NULL OR subtotal IS NOT NULL
    """))
    
    # Project payments
    print("Converting project payment amounts back to USD...")
    connection.execute(text(f"""
        UPDATE projectpayment SET 
            amount = amount * {IDR_TO_USD_RATE}
        WHERE amount IS NOT NULL
    """))
    
    print("Currency conversion rollback completed successfully!")
    print(f"All monetary values have been converted from IDR back to USD using rate: {IDR_TO_USD_RATE}")
