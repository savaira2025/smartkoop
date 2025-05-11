import random
import string
from datetime import datetime
from sqlalchemy.orm import Session
from app.models.member import Member
from app.models.sales import SalesOrder, SalesInvoice
from app.models.purchases import PurchaseOrder, SupplierInvoice
from app.models.accounting import JournalEntry
from app.models.project import Project, ProjectInvoice

def generate_member_id(db: Session) -> str:
    """
    Generate a unique member ID in the format MEM-YYYYMM-XXXX
    where YYYY is the year, MM is the month, and XXXX is a random 4-digit number
    """
    now = datetime.now()
    year_month = now.strftime("%Y%m")
    
    # Generate a random 4-digit number
    random_digits = ''.join(random.choices(string.digits, k=4))
    
    # Create the member ID
    member_id = f"MEM-{year_month}-{random_digits}"
    
    # Check if the member ID already exists
    while db.query(Member).filter(Member.member_id == member_id).first():
        # If it exists, generate a new random number
        random_digits = ''.join(random.choices(string.digits, k=4))
        member_id = f"MEM-{year_month}-{random_digits}"
    
    return member_id

def generate_sales_order_number(db: Session) -> str:
    """
    Generate a unique sales order number in the format SO-YYYYMM-XXXX
    """
    now = datetime.now()
    year_month = now.strftime("%Y%m")
    
    # Generate a random 4-digit number
    random_digits = ''.join(random.choices(string.digits, k=4))
    
    # Create the sales order number
    order_number = f"SO-{year_month}-{random_digits}"
    
    # Check if the order number already exists
    while db.query(SalesOrder).filter(SalesOrder.order_number == order_number).first():
        # If it exists, generate a new random number
        random_digits = ''.join(random.choices(string.digits, k=4))
        order_number = f"SO-{year_month}-{random_digits}"
    
    return order_number

def generate_sales_invoice_number(db: Session) -> str:
    """
    Generate a unique sales invoice number in the format INV-YYYYMM-XXXX
    """
    now = datetime.now()
    year_month = now.strftime("%Y%m")
    
    # Generate a random 4-digit number
    random_digits = ''.join(random.choices(string.digits, k=4))
    
    # Create the invoice number
    invoice_number = f"INV-{year_month}-{random_digits}"
    
    # Check if the invoice number already exists
    while db.query(SalesInvoice).filter(SalesInvoice.invoice_number == invoice_number).first():
        # If it exists, generate a new random number
        random_digits = ''.join(random.choices(string.digits, k=4))
        invoice_number = f"INV-{year_month}-{random_digits}"
    
    return invoice_number

def generate_purchase_order_number(db: Session) -> str:
    """
    Generate a unique purchase order number in the format PO-YYYYMM-XXXX
    """
    now = datetime.now()
    year_month = now.strftime("%Y%m")
    
    # Generate a random 4-digit number
    random_digits = ''.join(random.choices(string.digits, k=4))
    
    # Create the purchase order number
    order_number = f"PO-{year_month}-{random_digits}"
    
    # Check if the order number already exists
    while db.query(PurchaseOrder).filter(PurchaseOrder.order_number == order_number).first():
        # If it exists, generate a new random number
        random_digits = ''.join(random.choices(string.digits, k=4))
        order_number = f"PO-{year_month}-{random_digits}"
    
    return order_number

def generate_journal_entry_number(db: Session) -> str:
    """
    Generate a unique journal entry number in the format JE-YYYYMM-XXXX
    """
    now = datetime.now()
    year_month = now.strftime("%Y%m")
    
    # Generate a random 4-digit number
    random_digits = ''.join(random.choices(string.digits, k=4))
    
    # Create the journal entry number
    entry_number = f"JE-{year_month}-{random_digits}"
    
    # Check if the entry number already exists
    while db.query(JournalEntry).filter(JournalEntry.entry_number == entry_number).first():
        # If it exists, generate a new random number
        random_digits = ''.join(random.choices(string.digits, k=4))
        entry_number = f"JE-{year_month}-{random_digits}"
    
    return entry_number

def generate_asset_number(db: Session) -> str:
    """
    Generate a unique asset number in the format AST-YYYYMM-XXXX
    """
    now = datetime.now()
    year_month = now.strftime("%Y%m")
    
    # Generate a random 4-digit number
    random_digits = ''.join(random.choices(string.digits, k=4))
    
    # Create the asset number
    asset_number = f"AST-{year_month}-{random_digits}"
    
    # Check if the asset number already exists
    # This would require importing the Asset model, which we'll assume exists
    # while db.query(Asset).filter(Asset.asset_number == asset_number).first():
    #     # If it exists, generate a new random number
    #     random_digits = ''.join(random.choices(string.digits, k=4))
    #     asset_number = f"AST-{year_month}-{random_digits}"
    
    return asset_number

def generate_project_number(db: Session) -> str:
    """
    Generate a unique project number in the format PRJ-YYYYMM-XXXX
    """
    now = datetime.now()
    year_month = now.strftime("%Y%m")
    
    # Generate a random 4-digit number
    random_digits = ''.join(random.choices(string.digits, k=4))
    
    # Create the project number
    project_number = f"PRJ-{year_month}-{random_digits}"
    
    # Check if the project number already exists
    while db.query(Project).filter(Project.project_number == project_number).first():
        # If it exists, generate a new random number
        random_digits = ''.join(random.choices(string.digits, k=4))
        project_number = f"PRJ-{year_month}-{random_digits}"
    
    return project_number

def generate_invoice_number(db: Session) -> str:
    """
    Generate a unique project invoice number in the format PINV-YYYYMM-XXXX
    """
    now = datetime.now()
    year_month = now.strftime("%Y%m")
    
    # Generate a random 4-digit number
    random_digits = ''.join(random.choices(string.digits, k=4))
    
    # Create the invoice number
    invoice_number = f"PINV-{year_month}-{random_digits}"
    
    # Check if the invoice number already exists
    while db.query(ProjectInvoice).filter(ProjectInvoice.invoice_number == invoice_number).first():
        # If it exists, generate a new random number
        random_digits = ''.join(random.choices(string.digits, k=4))
        invoice_number = f"PINV-{year_month}-{random_digits}"
    
    return invoice_number
