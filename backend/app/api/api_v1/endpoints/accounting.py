from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, Path
from sqlalchemy.orm import Session
from datetime import date

from app.db.database import get_db
from app.models.accounting import (
    ChartOfAccounts, JournalEntry, LedgerEntry, 
    FiscalPeriod, Payroll, PayrollItem, Employee
)
from app.schemas.accounting import (
    ChartOfAccounts as ChartOfAccountsSchema,
    ChartOfAccountsCreate, ChartOfAccountsUpdate,
    JournalEntry as JournalEntrySchema,
    JournalEntryCreate, JournalEntryUpdate,
    LedgerEntry as LedgerEntrySchema,
    LedgerEntryCreate, LedgerEntryUpdate,
    FiscalPeriod as FiscalPeriodSchema,
    FiscalPeriodCreate, FiscalPeriodUpdate,
    Payroll as PayrollSchema,
    PayrollCreate, PayrollUpdate,
    PayrollItem as PayrollItemSchema,
    PayrollItemCreate, PayrollItemUpdate,
    Employee as EmployeeSchema,
    EmployeeCreate, EmployeeUpdate
)
from app.services.accounting_service import AccountingService

router = APIRouter()

# Chart of Accounts endpoints
@router.get("/chart-of-accounts", response_model=List[ChartOfAccountsSchema])
def get_chart_of_accounts(
    skip: int = Query(0, description="Skip the first n items"),
    limit: int = Query(100, description="Limit the number of items returned"),
    db: Session = Depends(get_db)
):
    """Get all chart of accounts with pagination"""
    accounts = AccountingService.get_chart_of_accounts(db, skip=skip, limit=limit)
    return accounts

@router.post("/chart-of-accounts", response_model=ChartOfAccountsSchema)
def create_account(
    account: ChartOfAccountsCreate,
    db: Session = Depends(get_db)
):
    """Create a new account"""
    # Check if account with the same account_number already exists
    db_account = AccountingService.get_account_by_number(db, account.account_number)
    if db_account:
        raise HTTPException(
            status_code=400,
            detail=f"Account with account_number {account.account_number} already exists"
        )
    
    return AccountingService.create_account(db, account)

@router.get("/chart-of-accounts/{account_id}", response_model=ChartOfAccountsSchema)
def get_account(
    account_id: int = Path(..., description="The ID of the account to get"),
    db: Session = Depends(get_db)
):
    """Get a single account by ID"""
    db_account = AccountingService.get_account(db, account_id)
    if db_account is None:
        raise HTTPException(
            status_code=404,
            detail=f"Account with ID {account_id} not found"
        )
    return db_account

@router.put("/chart-of-accounts/{account_id}", response_model=ChartOfAccountsSchema)
def update_account(
    account: ChartOfAccountsUpdate,
    account_id: int = Path(..., description="The ID of the account to update"),
    db: Session = Depends(get_db)
):
    """Update an existing account"""
    db_account = AccountingService.update_account(db, account_id, account)
    if db_account is None:
        raise HTTPException(
            status_code=404,
            detail=f"Account with ID {account_id} not found"
        )
    return db_account

@router.delete("/chart-of-accounts/{account_id}", response_model=bool)
def delete_account(
    account_id: int = Path(..., description="The ID of the account to delete"),
    db: Session = Depends(get_db)
):
    """Delete an account"""
    success = AccountingService.delete_account(db, account_id)
    if not success:
        raise HTTPException(
            status_code=404,
            detail=f"Account with ID {account_id} not found"
        )
    return success

# Journal Entry endpoints
@router.get("/journal-entries", response_model=List[JournalEntrySchema])
def get_journal_entries(
    skip: int = Query(0, description="Skip the first n items"),
    limit: int = Query(100, description="Limit the number of items returned"),
    db: Session = Depends(get_db)
):
    """Get all journal entries with pagination"""
    entries = AccountingService.get_journal_entries(db, skip=skip, limit=limit)
    return entries

@router.post("/journal-entries", response_model=JournalEntrySchema)
def create_journal_entry(
    entry: JournalEntryCreate,
    db: Session = Depends(get_db)
):
    """Create a new journal entry"""
    # Check if entry with the same entry_number already exists
    if entry.entry_number:
        db_entry = AccountingService.get_journal_entry_by_number(db, entry.entry_number)
        if db_entry:
            raise HTTPException(
                status_code=400,
                detail=f"Journal entry with entry_number {entry.entry_number} already exists"
            )
    
    return AccountingService.create_journal_entry(db, entry)

@router.get("/journal-entries/{entry_id}", response_model=JournalEntrySchema)
def get_journal_entry(
    entry_id: int = Path(..., description="The ID of the journal entry to get"),
    db: Session = Depends(get_db)
):
    """Get a single journal entry by ID"""
    db_entry = AccountingService.get_journal_entry(db, entry_id)
    if db_entry is None:
        raise HTTPException(
            status_code=404,
            detail=f"Journal entry with ID {entry_id} not found"
        )
    return db_entry

@router.put("/journal-entries/{entry_id}", response_model=JournalEntrySchema)
def update_journal_entry(
    entry: JournalEntryUpdate,
    entry_id: int = Path(..., description="The ID of the journal entry to update"),
    db: Session = Depends(get_db)
):
    """Update an existing journal entry"""
    db_entry = AccountingService.update_journal_entry(db, entry_id, entry)
    if db_entry is None:
        raise HTTPException(
            status_code=404,
            detail=f"Journal entry with ID {entry_id} not found"
        )
    return db_entry

@router.delete("/journal-entries/{entry_id}", response_model=bool)
def delete_journal_entry(
    entry_id: int = Path(..., description="The ID of the journal entry to delete"),
    db: Session = Depends(get_db)
):
    """Delete a journal entry"""
    success = AccountingService.delete_journal_entry(db, entry_id)
    if not success:
        raise HTTPException(
            status_code=404,
            detail=f"Journal entry with ID {entry_id} not found"
        )
    return success

# Ledger Entry endpoints
@router.get("/journal-entries/{entry_id}/ledger-entries", response_model=List[LedgerEntrySchema])
def get_ledger_entries(
    entry_id: int = Path(..., description="The ID of the journal entry to get ledger entries for"),
    db: Session = Depends(get_db)
):
    """Get all ledger entries for a journal entry"""
    # Check if journal entry exists
    db_entry = AccountingService.get_journal_entry(db, entry_id)
    if db_entry is None:
        raise HTTPException(
            status_code=404,
            detail=f"Journal entry with ID {entry_id} not found"
        )
    
    return AccountingService.get_ledger_entries(db, entry_id)

@router.post("/journal-entries/{entry_id}/ledger-entries", response_model=LedgerEntrySchema)
def create_ledger_entry(
    entry: LedgerEntryCreate,
    entry_id: int = Path(..., description="The ID of the journal entry to create ledger entry for"),
    db: Session = Depends(get_db)
):
    """Create a new ledger entry for a journal entry"""
    # Check if journal entry exists
    db_entry = AccountingService.get_journal_entry(db, entry_id)
    if db_entry is None:
        raise HTTPException(
            status_code=404,
            detail=f"Journal entry with ID {entry_id} not found"
        )
    
    # Ensure the journal_entry_id in the path matches the one in the request body
    if entry.journal_entry_id != entry_id:
        raise HTTPException(
            status_code=400,
            detail=f"Journal entry ID in path ({entry_id}) does not match journal_entry_id in request body ({entry.journal_entry_id})"
        )
    
    return AccountingService.create_ledger_entry(db, entry)

@router.get("/ledger-entries/{entry_id}", response_model=LedgerEntrySchema)
def get_ledger_entry(
    entry_id: int = Path(..., description="The ID of the ledger entry to get"),
    db: Session = Depends(get_db)
):
    """Get a single ledger entry by ID"""
    db_entry = AccountingService.get_ledger_entry(db, entry_id)
    if db_entry is None:
        raise HTTPException(
            status_code=404,
            detail=f"Ledger entry with ID {entry_id} not found"
        )
    return db_entry

@router.put("/ledger-entries/{entry_id}", response_model=LedgerEntrySchema)
def update_ledger_entry(
    entry: LedgerEntryUpdate,
    entry_id: int = Path(..., description="The ID of the ledger entry to update"),
    db: Session = Depends(get_db)
):
    """Update an existing ledger entry"""
    db_entry = AccountingService.update_ledger_entry(db, entry_id, entry)
    if db_entry is None:
        raise HTTPException(
            status_code=404,
            detail=f"Ledger entry with ID {entry_id} not found"
        )
    return db_entry

@router.delete("/ledger-entries/{entry_id}", response_model=bool)
def delete_ledger_entry(
    entry_id: int = Path(..., description="The ID of the ledger entry to delete"),
    db: Session = Depends(get_db)
):
    """Delete a ledger entry"""
    success = AccountingService.delete_ledger_entry(db, entry_id)
    if not success:
        raise HTTPException(
            status_code=404,
            detail=f"Ledger entry with ID {entry_id} not found"
        )
    return success

# Fiscal Period endpoints
@router.get("/fiscal-periods", response_model=List[FiscalPeriodSchema])
def get_fiscal_periods(
    skip: int = Query(0, description="Skip the first n items"),
    limit: int = Query(100, description="Limit the number of items returned"),
    db: Session = Depends(get_db)
):
    """Get all fiscal periods with pagination"""
    periods = AccountingService.get_fiscal_periods(db, skip=skip, limit=limit)
    return periods

@router.post("/fiscal-periods", response_model=FiscalPeriodSchema)
def create_fiscal_period(
    period: FiscalPeriodCreate,
    db: Session = Depends(get_db)
):
    """Create a new fiscal period"""
    return AccountingService.create_fiscal_period(db, period)

@router.get("/fiscal-periods/{period_id}", response_model=FiscalPeriodSchema)
def get_fiscal_period(
    period_id: int = Path(..., description="The ID of the fiscal period to get"),
    db: Session = Depends(get_db)
):
    """Get a single fiscal period by ID"""
    db_period = AccountingService.get_fiscal_period(db, period_id)
    if db_period is None:
        raise HTTPException(
            status_code=404,
            detail=f"Fiscal period with ID {period_id} not found"
        )
    return db_period

@router.put("/fiscal-periods/{period_id}", response_model=FiscalPeriodSchema)
def update_fiscal_period(
    period: FiscalPeriodUpdate,
    period_id: int = Path(..., description="The ID of the fiscal period to update"),
    db: Session = Depends(get_db)
):
    """Update an existing fiscal period"""
    db_period = AccountingService.update_fiscal_period(db, period_id, period)
    if db_period is None:
        raise HTTPException(
            status_code=404,
            detail=f"Fiscal period with ID {period_id} not found"
        )
    return db_period

@router.delete("/fiscal-periods/{period_id}", response_model=bool)
def delete_fiscal_period(
    period_id: int = Path(..., description="The ID of the fiscal period to delete"),
    db: Session = Depends(get_db)
):
    """Delete a fiscal period"""
    success = AccountingService.delete_fiscal_period(db, period_id)
    if not success:
        raise HTTPException(
            status_code=404,
            detail=f"Fiscal period with ID {period_id} not found"
        )
    return success

# Payroll endpoints
@router.get("/payrolls", response_model=List[PayrollSchema])
def get_payrolls(
    skip: int = Query(0, description="Skip the first n items"),
    limit: int = Query(100, description="Limit the number of items returned"),
    db: Session = Depends(get_db)
):
    """Get all payrolls with pagination"""
    payrolls = AccountingService.get_payrolls(db, skip=skip, limit=limit)
    return payrolls

@router.post("/payrolls", response_model=PayrollSchema)
def create_payroll(
    payroll: PayrollCreate,
    db: Session = Depends(get_db)
):
    """Create a new payroll"""
    return AccountingService.create_payroll(db, payroll)

@router.get("/payrolls/{payroll_id}", response_model=PayrollSchema)
def get_payroll(
    payroll_id: int = Path(..., description="The ID of the payroll to get"),
    db: Session = Depends(get_db)
):
    """Get a single payroll by ID"""
    db_payroll = AccountingService.get_payroll(db, payroll_id)
    if db_payroll is None:
        raise HTTPException(
            status_code=404,
            detail=f"Payroll with ID {payroll_id} not found"
        )
    return db_payroll

@router.put("/payrolls/{payroll_id}", response_model=PayrollSchema)
def update_payroll(
    payroll: PayrollUpdate,
    payroll_id: int = Path(..., description="The ID of the payroll to update"),
    db: Session = Depends(get_db)
):
    """Update an existing payroll"""
    db_payroll = AccountingService.update_payroll(db, payroll_id, payroll)
    if db_payroll is None:
        raise HTTPException(
            status_code=404,
            detail=f"Payroll with ID {payroll_id} not found"
        )
    return db_payroll

@router.delete("/payrolls/{payroll_id}", response_model=bool)
def delete_payroll(
    payroll_id: int = Path(..., description="The ID of the payroll to delete"),
    db: Session = Depends(get_db)
):
    """Delete a payroll"""
    success = AccountingService.delete_payroll(db, payroll_id)
    if not success:
        raise HTTPException(
            status_code=404,
            detail=f"Payroll with ID {payroll_id} not found"
        )
    return success

# Payroll Item endpoints
@router.get("/payrolls/{payroll_id}/items", response_model=List[PayrollItemSchema])
def get_payroll_items(
    payroll_id: int = Path(..., description="The ID of the payroll to get items for"),
    db: Session = Depends(get_db)
):
    """Get all payroll items for a payroll"""
    # Check if payroll exists
    db_payroll = AccountingService.get_payroll(db, payroll_id)
    if db_payroll is None:
        raise HTTPException(
            status_code=404,
            detail=f"Payroll with ID {payroll_id} not found"
        )
    
    return AccountingService.get_payroll_items(db, payroll_id)

@router.post("/payrolls/{payroll_id}/items", response_model=PayrollItemSchema)
def create_payroll_item(
    item: PayrollItemCreate,
    payroll_id: int = Path(..., description="The ID of the payroll to create item for"),
    db: Session = Depends(get_db)
):
    """Create a new payroll item for a payroll"""
    # Check if payroll exists
    db_payroll = AccountingService.get_payroll(db, payroll_id)
    if db_payroll is None:
        raise HTTPException(
            status_code=404,
            detail=f"Payroll with ID {payroll_id} not found"
        )
    
    # Ensure the payroll_id in the path matches the one in the request body
    if item.payroll_id != payroll_id:
        raise HTTPException(
            status_code=400,
            detail=f"Payroll ID in path ({payroll_id}) does not match payroll_id in request body ({item.payroll_id})"
        )
    
    return AccountingService.create_payroll_item(db, item)

@router.get("/payroll-items/{item_id}", response_model=PayrollItemSchema)
def get_payroll_item(
    item_id: int = Path(..., description="The ID of the payroll item to get"),
    db: Session = Depends(get_db)
):
    """Get a single payroll item by ID"""
    db_item = AccountingService.get_payroll_item(db, item_id)
    if db_item is None:
        raise HTTPException(
            status_code=404,
            detail=f"Payroll item with ID {item_id} not found"
        )
    return db_item

@router.put("/payroll-items/{item_id}", response_model=PayrollItemSchema)
def update_payroll_item(
    item: PayrollItemUpdate,
    item_id: int = Path(..., description="The ID of the payroll item to update"),
    db: Session = Depends(get_db)
):
    """Update an existing payroll item"""
    db_item = AccountingService.update_payroll_item(db, item_id, item)
    if db_item is None:
        raise HTTPException(
            status_code=404,
            detail=f"Payroll item with ID {item_id} not found"
        )
    return db_item

@router.delete("/payroll-items/{item_id}", response_model=bool)
def delete_payroll_item(
    item_id: int = Path(..., description="The ID of the payroll item to delete"),
    db: Session = Depends(get_db)
):
    """Delete a payroll item"""
    success = AccountingService.delete_payroll_item(db, item_id)
    if not success:
        raise HTTPException(
            status_code=404,
            detail=f"Payroll item with ID {item_id} not found"
        )
    return success

# Employee endpoints
@router.get("/employees", response_model=List[EmployeeSchema])
def get_employees(
    skip: int = Query(0, description="Skip the first n items"),
    limit: int = Query(100, description="Limit the number of items returned"),
    db: Session = Depends(get_db)
):
    """Get all employees with pagination"""
    employees = AccountingService.get_employees(db, skip=skip, limit=limit)
    return employees

@router.post("/employees", response_model=EmployeeSchema)
def create_employee(
    employee: EmployeeCreate,
    db: Session = Depends(get_db)
):
    """Create a new employee"""
    # Check if employee with the same employee_id already exists
    db_employee = AccountingService.get_employee_by_employee_id(db, employee.employee_id)
    if db_employee:
        raise HTTPException(
            status_code=400,
            detail=f"Employee with employee_id {employee.employee_id} already exists"
        )
    
    return AccountingService.create_employee(db, employee)

@router.get("/employees/{employee_id}", response_model=EmployeeSchema)
def get_employee(
    employee_id: int = Path(..., description="The ID of the employee to get"),
    db: Session = Depends(get_db)
):
    """Get a single employee by ID"""
    db_employee = AccountingService.get_employee(db, employee_id)
    if db_employee is None:
        raise HTTPException(
            status_code=404,
            detail=f"Employee with ID {employee_id} not found"
        )
    return db_employee

@router.put("/employees/{employee_id}", response_model=EmployeeSchema)
def update_employee(
    employee: EmployeeUpdate,
    employee_id: int = Path(..., description="The ID of the employee to update"),
    db: Session = Depends(get_db)
):
    """Update an existing employee"""
    db_employee = AccountingService.update_employee(db, employee_id, employee)
    if db_employee is None:
        raise HTTPException(
            status_code=404,
            detail=f"Employee with ID {employee_id} not found"
        )
    return db_employee

@router.delete("/employees/{employee_id}", response_model=bool)
def delete_employee(
    employee_id: int = Path(..., description="The ID of the employee to delete"),
    db: Session = Depends(get_db)
):
    """Delete an employee"""
    success = AccountingService.delete_employee(db, employee_id)
    if not success:
        raise HTTPException(
            status_code=404,
            detail=f"Employee with ID {employee_id} not found"
        )
    return success
