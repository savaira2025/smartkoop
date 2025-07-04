"""Initial migration with MySQL-compatible String lengths

Revision ID: f7cce1487919
Revises: 
Create Date: 2025-06-16 21:08:37.315055

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'f7cce1487919'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('asset',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.Column('updated_at', sa.DateTime(), nullable=False),
    sa.Column('name', sa.String(length=255), nullable=False),
    sa.Column('asset_number', sa.String(length=100), nullable=False),
    sa.Column('category', sa.String(length=100), nullable=False),
    sa.Column('acquisition_date', sa.Date(), nullable=False),
    sa.Column('acquisition_cost', sa.Numeric(precision=10, scale=2), nullable=False),
    sa.Column('current_value', sa.Numeric(precision=10, scale=2), nullable=False),
    sa.Column('depreciation_rate', sa.Numeric(precision=5, scale=2), nullable=True),
    sa.Column('location', sa.String(length=255), nullable=True),
    sa.Column('status', sa.String(length=50), nullable=True),
    sa.Column('assigned_to', sa.String(length=255), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('asset_number')
    )
    op.create_index(op.f('ix_asset_id'), 'asset', ['id'], unique=False)
    op.create_table('chartofaccounts',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.Column('updated_at', sa.DateTime(), nullable=False),
    sa.Column('account_number', sa.String(length=255), nullable=False),
    sa.Column('account_name', sa.String(length=255), nullable=False),
    sa.Column('account_type', sa.String(length=255), nullable=False),
    sa.Column('account_category', sa.String(length=255), nullable=True),
    sa.Column('is_active', sa.Boolean(), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('account_number')
    )
    op.create_index(op.f('ix_chartofaccounts_id'), 'chartofaccounts', ['id'], unique=False)
    op.create_table('customer',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.Column('updated_at', sa.DateTime(), nullable=False),
    sa.Column('name', sa.String(length=255), nullable=False),
    sa.Column('contact_person', sa.String(length=255), nullable=True),
    sa.Column('email', sa.String(length=255), nullable=True),
    sa.Column('phone', sa.String(length=20), nullable=True),
    sa.Column('address', sa.Text(), nullable=True),
    sa.Column('payment_terms', sa.String(length=255), nullable=True),
    sa.Column('credit_limit', sa.Numeric(precision=10, scale=2), nullable=True),
    sa.Column('tax_id', sa.String(length=255), nullable=True),
    sa.Column('status', sa.String(length=50), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_customer_id'), 'customer', ['id'], unique=False)
    op.create_table('employee',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.Column('updated_at', sa.DateTime(), nullable=False),
    sa.Column('name', sa.String(length=255), nullable=False),
    sa.Column('employee_id', sa.String(length=255), nullable=False),
    sa.Column('position', sa.String(length=255), nullable=True),
    sa.Column('hire_date', sa.Date(), nullable=False),
    sa.Column('base_salary', sa.Numeric(precision=10, scale=2), nullable=False),
    sa.Column('bank_account', sa.String(length=255), nullable=True),
    sa.Column('tax_id', sa.String(length=255), nullable=True),
    sa.Column('status', sa.String(length=50), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('employee_id')
    )
    op.create_index(op.f('ix_employee_id'), 'employee', ['id'], unique=False)
    op.create_table('fiscalperiod',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.Column('updated_at', sa.DateTime(), nullable=False),
    sa.Column('start_date', sa.Date(), nullable=False),
    sa.Column('end_date', sa.Date(), nullable=False),
    sa.Column('period_name', sa.String(length=255), nullable=False),
    sa.Column('status', sa.String(length=50), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_fiscalperiod_id'), 'fiscalperiod', ['id'], unique=False)
    op.create_table('supplier',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.Column('updated_at', sa.DateTime(), nullable=False),
    sa.Column('name', sa.String(length=255), nullable=False),
    sa.Column('contact_person', sa.String(length=255), nullable=True),
    sa.Column('email', sa.String(length=255), nullable=True),
    sa.Column('phone', sa.String(length=20), nullable=True),
    sa.Column('address', sa.Text(), nullable=True),
    sa.Column('payment_terms', sa.String(length=255), nullable=True),
    sa.Column('tax_id', sa.String(length=255), nullable=True),
    sa.Column('bank_account', sa.String(length=255), nullable=True),
    sa.Column('status', sa.String(length=50), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_supplier_id'), 'supplier', ['id'], unique=False)
    op.create_table('user',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.Column('updated_at', sa.DateTime(), nullable=False),
    sa.Column('username', sa.String(length=100), nullable=False),
    sa.Column('email', sa.String(length=255), nullable=False),
    sa.Column('password_hash', sa.String(length=255), nullable=False),
    sa.Column('full_name', sa.String(length=255), nullable=True),
    sa.Column('is_active', sa.Boolean(), nullable=True),
    sa.Column('is_superuser', sa.Boolean(), nullable=True),
    sa.Column('role', sa.String(length=50), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_user_email'), 'user', ['email'], unique=True)
    op.create_index(op.f('ix_user_id'), 'user', ['id'], unique=False)
    op.create_index(op.f('ix_user_username'), 'user', ['username'], unique=True)
    op.create_table('assetdepreciation',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.Column('updated_at', sa.DateTime(), nullable=False),
    sa.Column('asset_id', sa.Integer(), nullable=False),
    sa.Column('depreciation_date', sa.Date(), nullable=False),
    sa.Column('depreciation_amount', sa.Numeric(precision=10, scale=2), nullable=False),
    sa.Column('book_value_after', sa.Numeric(precision=10, scale=2), nullable=False),
    sa.ForeignKeyConstraint(['asset_id'], ['asset.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_assetdepreciation_id'), 'assetdepreciation', ['id'], unique=False)
    op.create_table('assetmaintenance',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.Column('updated_at', sa.DateTime(), nullable=False),
    sa.Column('asset_id', sa.Integer(), nullable=False),
    sa.Column('maintenance_date', sa.Date(), nullable=False),
    sa.Column('maintenance_type', sa.String(length=100), nullable=False),
    sa.Column('cost', sa.Numeric(precision=10, scale=2), nullable=True),
    sa.Column('description', sa.Text(), nullable=True),
    sa.Column('performed_by', sa.String(length=255), nullable=True),
    sa.ForeignKeyConstraint(['asset_id'], ['asset.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_assetmaintenance_id'), 'assetmaintenance', ['id'], unique=False)
    op.create_table('document',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.Column('updated_at', sa.DateTime(), nullable=False),
    sa.Column('name', sa.String(length=255), nullable=False),
    sa.Column('file_path', sa.String(length=255), nullable=False),
    sa.Column('document_type', sa.String(length=255), nullable=False),
    sa.Column('upload_date', sa.Date(), nullable=False),
    sa.Column('uploaded_by', sa.Integer(), nullable=True),
    sa.Column('status', sa.String(length=50), nullable=True),
    sa.Column('related_entity_type', sa.String(length=255), nullable=True),
    sa.Column('related_entity_id', sa.Integer(), nullable=True),
    sa.Column('description', sa.Text(), nullable=True),
    sa.Column('tags', sa.String(length=255), nullable=True),
    sa.Column('expiry_date', sa.Date(), nullable=True),
    sa.ForeignKeyConstraint(['uploaded_by'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_document_id'), 'document', ['id'], unique=False)
    op.create_table('journalentry',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.Column('updated_at', sa.DateTime(), nullable=False),
    sa.Column('entry_number', sa.String(length=255), nullable=False),
    sa.Column('entry_date', sa.Date(), nullable=False),
    sa.Column('description', sa.Text(), nullable=True),
    sa.Column('entry_type', sa.String(length=255), nullable=False),
    sa.Column('status', sa.String(length=50), nullable=True),
    sa.Column('created_by', sa.Integer(), nullable=True),
    sa.Column('fiscal_period_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['created_by'], ['user.id'], ),
    sa.ForeignKeyConstraint(['fiscal_period_id'], ['fiscalperiod.id'], ),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('entry_number')
    )
    op.create_index(op.f('ix_journalentry_id'), 'journalentry', ['id'], unique=False)
    op.create_table('member',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.Column('updated_at', sa.DateTime(), nullable=False),
    sa.Column('member_id', sa.String(length=50), nullable=False),
    sa.Column('name', sa.String(length=255), nullable=False),
    sa.Column('email', sa.String(length=255), nullable=True),
    sa.Column('phone', sa.String(length=20), nullable=True),
    sa.Column('address', sa.Text(), nullable=True),
    sa.Column('join_date', sa.Date(), nullable=False),
    sa.Column('status', sa.String(length=50), nullable=True),
    sa.Column('principal_savings', sa.Numeric(precision=10, scale=2), nullable=True),
    sa.Column('mandatory_savings', sa.Numeric(precision=10, scale=2), nullable=True),
    sa.Column('voluntary_savings', sa.Numeric(precision=10, scale=2), nullable=True),
    sa.Column('unpaid_mandatory', sa.Numeric(precision=10, scale=2), nullable=True),
    sa.Column('shu_balance', sa.Numeric(precision=10, scale=2), nullable=True),
    sa.Column('registration_method', sa.String(length=50), nullable=True),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_member_email'), 'member', ['email'], unique=True)
    op.create_index(op.f('ix_member_id'), 'member', ['id'], unique=False)
    op.create_index(op.f('ix_member_member_id'), 'member', ['member_id'], unique=True)
    op.create_table('payroll',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.Column('updated_at', sa.DateTime(), nullable=False),
    sa.Column('fiscal_period_id', sa.Integer(), nullable=False),
    sa.Column('payroll_date', sa.Date(), nullable=False),
    sa.Column('status', sa.String(length=50), nullable=True),
    sa.Column('total_amount', sa.Numeric(precision=10, scale=2), nullable=True),
    sa.ForeignKeyConstraint(['fiscal_period_id'], ['fiscalperiod.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_payroll_id'), 'payroll', ['id'], unique=False)
    op.create_table('purchaseorder',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.Column('updated_at', sa.DateTime(), nullable=False),
    sa.Column('supplier_id', sa.Integer(), nullable=False),
    sa.Column('order_date', sa.Date(), nullable=False),
    sa.Column('order_number', sa.String(length=100), nullable=False),
    sa.Column('status', sa.String(length=50), nullable=True),
    sa.Column('subtotal', sa.Numeric(precision=10, scale=2), nullable=True),
    sa.Column('tax_amount', sa.Numeric(precision=10, scale=2), nullable=True),
    sa.Column('total_amount', sa.Numeric(precision=10, scale=2), nullable=True),
    sa.Column('payment_status', sa.String(length=50), nullable=True),
    sa.Column('due_date', sa.Date(), nullable=True),
    sa.ForeignKeyConstraint(['supplier_id'], ['supplier.id'], ),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('order_number')
    )
    op.create_index(op.f('ix_purchaseorder_id'), 'purchaseorder', ['id'], unique=False)
    op.create_table('salesorder',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.Column('updated_at', sa.DateTime(), nullable=False),
    sa.Column('customer_id', sa.Integer(), nullable=False),
    sa.Column('order_date', sa.Date(), nullable=False),
    sa.Column('order_number', sa.String(length=100), nullable=False),
    sa.Column('status', sa.String(length=50), nullable=True),
    sa.Column('subtotal', sa.Numeric(precision=10, scale=2), nullable=True),
    sa.Column('tax_amount', sa.Numeric(precision=10, scale=2), nullable=True),
    sa.Column('total_amount', sa.Numeric(precision=10, scale=2), nullable=True),
    sa.Column('payment_status', sa.String(length=50), nullable=True),
    sa.Column('due_date', sa.Date(), nullable=True),
    sa.ForeignKeyConstraint(['customer_id'], ['customer.id'], ),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('order_number')
    )
    op.create_index(op.f('ix_salesorder_id'), 'salesorder', ['id'], unique=False)
    op.create_table('documentversion',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.Column('updated_at', sa.DateTime(), nullable=False),
    sa.Column('document_id', sa.Integer(), nullable=False),
    sa.Column('version_number', sa.Integer(), nullable=False),
    sa.Column('file_path', sa.String(length=255), nullable=False),
    sa.Column('upload_date', sa.Date(), nullable=False),
    sa.Column('uploaded_by', sa.Integer(), nullable=True),
    sa.Column('notes', sa.Text(), nullable=True),
    sa.ForeignKeyConstraint(['document_id'], ['document.id'], ),
    sa.ForeignKeyConstraint(['uploaded_by'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_documentversion_id'), 'documentversion', ['id'], unique=False)
    op.create_table('ledgerentry',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.Column('updated_at', sa.DateTime(), nullable=False),
    sa.Column('journal_entry_id', sa.Integer(), nullable=False),
    sa.Column('account_id', sa.Integer(), nullable=False),
    sa.Column('debit_amount', sa.Numeric(precision=10, scale=2), nullable=True),
    sa.Column('credit_amount', sa.Numeric(precision=10, scale=2), nullable=True),
    sa.Column('description', sa.Text(), nullable=True),
    sa.ForeignKeyConstraint(['account_id'], ['chartofaccounts.id'], ),
    sa.ForeignKeyConstraint(['journal_entry_id'], ['journalentry.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_ledgerentry_id'), 'ledgerentry', ['id'], unique=False)
    op.create_table('payrollitem',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.Column('updated_at', sa.DateTime(), nullable=False),
    sa.Column('payroll_id', sa.Integer(), nullable=False),
    sa.Column('employee_id', sa.Integer(), nullable=False),
    sa.Column('gross_salary', sa.Numeric(precision=10, scale=2), nullable=False),
    sa.Column('deductions', sa.Numeric(precision=10, scale=2), nullable=True),
    sa.Column('net_salary', sa.Numeric(precision=10, scale=2), nullable=False),
    sa.ForeignKeyConstraint(['employee_id'], ['employee.id'], ),
    sa.ForeignKeyConstraint(['payroll_id'], ['payroll.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_payrollitem_id'), 'payrollitem', ['id'], unique=False)
    op.create_table('purchaseorderitem',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.Column('updated_at', sa.DateTime(), nullable=False),
    sa.Column('purchase_order_id', sa.Integer(), nullable=False),
    sa.Column('item_description', sa.String(length=255), nullable=False),
    sa.Column('quantity', sa.Numeric(precision=10, scale=2), nullable=False),
    sa.Column('unit_price', sa.Numeric(precision=10, scale=2), nullable=False),
    sa.Column('subtotal', sa.Numeric(precision=10, scale=2), nullable=False),
    sa.Column('tax_rate', sa.Numeric(precision=5, scale=2), nullable=True),
    sa.ForeignKeyConstraint(['purchase_order_id'], ['purchaseorder.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_purchaseorderitem_id'), 'purchaseorderitem', ['id'], unique=False)
    op.create_table('salesinvoice',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.Column('updated_at', sa.DateTime(), nullable=False),
    sa.Column('sales_order_id', sa.Integer(), nullable=False),
    sa.Column('invoice_number', sa.String(length=100), nullable=False),
    sa.Column('invoice_date', sa.Date(), nullable=False),
    sa.Column('due_date', sa.Date(), nullable=True),
    sa.Column('amount', sa.Numeric(precision=10, scale=2), nullable=False),
    sa.Column('status', sa.String(length=50), nullable=True),
    sa.ForeignKeyConstraint(['sales_order_id'], ['salesorder.id'], ),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('invoice_number')
    )
    op.create_index(op.f('ix_salesinvoice_id'), 'salesinvoice', ['id'], unique=False)
    op.create_table('salesorderitem',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.Column('updated_at', sa.DateTime(), nullable=False),
    sa.Column('sales_order_id', sa.Integer(), nullable=False),
    sa.Column('item_description', sa.String(length=255), nullable=False),
    sa.Column('quantity', sa.Numeric(precision=10, scale=2), nullable=False),
    sa.Column('unit_price', sa.Numeric(precision=10, scale=2), nullable=False),
    sa.Column('subtotal', sa.Numeric(precision=10, scale=2), nullable=False),
    sa.Column('tax_rate', sa.Numeric(precision=5, scale=2), nullable=True),
    sa.ForeignKeyConstraint(['sales_order_id'], ['salesorder.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_salesorderitem_id'), 'salesorderitem', ['id'], unique=False)
    op.create_table('savingstransaction',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.Column('updated_at', sa.DateTime(), nullable=False),
    sa.Column('member_id', sa.Integer(), nullable=False),
    sa.Column('transaction_date', sa.Date(), nullable=False),
    sa.Column('amount', sa.Numeric(precision=10, scale=2), nullable=False),
    sa.Column('transaction_type', sa.String(length=50), nullable=False),
    sa.Column('description', sa.Text(), nullable=True),
    sa.Column('status', sa.String(length=50), nullable=True),
    sa.ForeignKeyConstraint(['member_id'], ['member.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_savingstransaction_id'), 'savingstransaction', ['id'], unique=False)
    op.create_table('shudistribution',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.Column('updated_at', sa.DateTime(), nullable=False),
    sa.Column('member_id', sa.Integer(), nullable=False),
    sa.Column('fiscal_year', sa.Integer(), nullable=False),
    sa.Column('amount', sa.Numeric(precision=10, scale=2), nullable=False),
    sa.Column('distribution_date', sa.Date(), nullable=False),
    sa.Column('distribution_method', sa.String(length=50), nullable=True),
    sa.Column('status', sa.String(length=50), nullable=True),
    sa.ForeignKeyConstraint(['member_id'], ['member.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_shudistribution_id'), 'shudistribution', ['id'], unique=False)
    op.create_table('supplierinvoice',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.Column('updated_at', sa.DateTime(), nullable=False),
    sa.Column('purchase_order_id', sa.Integer(), nullable=False),
    sa.Column('invoice_number', sa.String(length=100), nullable=False),
    sa.Column('invoice_date', sa.Date(), nullable=False),
    sa.Column('due_date', sa.Date(), nullable=True),
    sa.Column('amount', sa.Numeric(precision=10, scale=2), nullable=False),
    sa.Column('status', sa.String(length=50), nullable=True),
    sa.ForeignKeyConstraint(['purchase_order_id'], ['purchaseorder.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_supplierinvoice_id'), 'supplierinvoice', ['id'], unique=False)
    op.create_table('salespayment',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.Column('updated_at', sa.DateTime(), nullable=False),
    sa.Column('invoice_id', sa.Integer(), nullable=False),
    sa.Column('payment_date', sa.Date(), nullable=False),
    sa.Column('amount', sa.Numeric(precision=10, scale=2), nullable=False),
    sa.Column('payment_method', sa.String(length=255), nullable=False),
    sa.Column('reference_number', sa.String(length=255), nullable=True),
    sa.Column('notes', sa.Text(), nullable=True),
    sa.ForeignKeyConstraint(['invoice_id'], ['salesinvoice.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_salespayment_id'), 'salespayment', ['id'], unique=False)
    op.create_table('supplierpayment',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.Column('updated_at', sa.DateTime(), nullable=False),
    sa.Column('invoice_id', sa.Integer(), nullable=False),
    sa.Column('payment_date', sa.Date(), nullable=False),
    sa.Column('amount', sa.Numeric(precision=10, scale=2), nullable=False),
    sa.Column('payment_method', sa.String(length=255), nullable=False),
    sa.Column('reference_number', sa.String(length=255), nullable=True),
    sa.Column('notes', sa.Text(), nullable=True),
    sa.ForeignKeyConstraint(['invoice_id'], ['supplierinvoice.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_supplierpayment_id'), 'supplierpayment', ['id'], unique=False)
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f('ix_supplierpayment_id'), table_name='supplierpayment')
    op.drop_table('supplierpayment')
    op.drop_index(op.f('ix_salespayment_id'), table_name='salespayment')
    op.drop_table('salespayment')
    op.drop_index(op.f('ix_supplierinvoice_id'), table_name='supplierinvoice')
    op.drop_table('supplierinvoice')
    op.drop_index(op.f('ix_shudistribution_id'), table_name='shudistribution')
    op.drop_table('shudistribution')
    op.drop_index(op.f('ix_savingstransaction_id'), table_name='savingstransaction')
    op.drop_table('savingstransaction')
    op.drop_index(op.f('ix_salesorderitem_id'), table_name='salesorderitem')
    op.drop_table('salesorderitem')
    op.drop_index(op.f('ix_salesinvoice_id'), table_name='salesinvoice')
    op.drop_table('salesinvoice')
    op.drop_index(op.f('ix_purchaseorderitem_id'), table_name='purchaseorderitem')
    op.drop_table('purchaseorderitem')
    op.drop_index(op.f('ix_payrollitem_id'), table_name='payrollitem')
    op.drop_table('payrollitem')
    op.drop_index(op.f('ix_ledgerentry_id'), table_name='ledgerentry')
    op.drop_table('ledgerentry')
    op.drop_index(op.f('ix_documentversion_id'), table_name='documentversion')
    op.drop_table('documentversion')
    op.drop_index(op.f('ix_salesorder_id'), table_name='salesorder')
    op.drop_table('salesorder')
    op.drop_index(op.f('ix_purchaseorder_id'), table_name='purchaseorder')
    op.drop_table('purchaseorder')
    op.drop_index(op.f('ix_payroll_id'), table_name='payroll')
    op.drop_table('payroll')
    op.drop_index(op.f('ix_member_member_id'), table_name='member')
    op.drop_index(op.f('ix_member_id'), table_name='member')
    op.drop_index(op.f('ix_member_email'), table_name='member')
    op.drop_table('member')
    op.drop_index(op.f('ix_journalentry_id'), table_name='journalentry')
    op.drop_table('journalentry')
    op.drop_index(op.f('ix_document_id'), table_name='document')
    op.drop_table('document')
    op.drop_index(op.f('ix_assetmaintenance_id'), table_name='assetmaintenance')
    op.drop_table('assetmaintenance')
    op.drop_index(op.f('ix_assetdepreciation_id'), table_name='assetdepreciation')
    op.drop_table('assetdepreciation')
    op.drop_index(op.f('ix_user_username'), table_name='user')
    op.drop_index(op.f('ix_user_id'), table_name='user')
    op.drop_index(op.f('ix_user_email'), table_name='user')
    op.drop_table('user')
    op.drop_index(op.f('ix_supplier_id'), table_name='supplier')
    op.drop_table('supplier')
    op.drop_index(op.f('ix_fiscalperiod_id'), table_name='fiscalperiod')
    op.drop_table('fiscalperiod')
    op.drop_index(op.f('ix_employee_id'), table_name='employee')
    op.drop_table('employee')
    op.drop_index(op.f('ix_customer_id'), table_name='customer')
    op.drop_table('customer')
    op.drop_index(op.f('ix_chartofaccounts_id'), table_name='chartofaccounts')
    op.drop_table('chartofaccounts')
    op.drop_index(op.f('ix_asset_id'), table_name='asset')
    op.drop_table('asset')
    # ### end Alembic commands ###
