from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from datetime import date

from app.models.accounting import (
    ChartOfAccounts, JournalEntry, LedgerEntry, 
    FiscalPeriod, Payroll, PayrollItem, Employee
)
from app.schemas.accounting import (
    ChartOfAccountsCreate, ChartOfAccountsUpdate,
    JournalEntryCreate, JournalEntryUpdate,
    LedgerEntryCreate, LedgerEntryUpdate,
    FiscalPeriodCreate, FiscalPeriodUpdate,
    PayrollCreate, PayrollUpdate,
    PayrollItemCreate, PayrollItemUpdate,
    EmployeeCreate, EmployeeUpdate
)
from app.utils.id_generator import generate_journal_entry_number

class AccountingService:
    # Chart of Accounts methods
    @staticmethod
    def get_chart_of_accounts(db: Session, skip: int = 0, limit: int = 100) -> List[ChartOfAccounts]:
        """Get all chart of accounts with pagination"""
        return db.query(ChartOfAccounts).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_account(db: Session, account_id: int) -> Optional[ChartOfAccounts]:
        """Get a single account by ID"""
        return db.query(ChartOfAccounts).filter(ChartOfAccounts.id == account_id).first()
    
    @staticmethod
    def get_account_by_number(db: Session, account_number: str) -> Optional[ChartOfAccounts]:
        """Get a single account by account number"""
        return db.query(ChartOfAccounts).filter(ChartOfAccounts.account_number == account_number).first()
    
    @staticmethod
    def create_account(db: Session, account: ChartOfAccountsCreate) -> ChartOfAccounts:
        """Create a new account"""
        db_account = ChartOfAccounts(**account.dict())
        db.add(db_account)
        db.commit()
        db.refresh(db_account)
        return db_account
    
    @staticmethod
    def update_account(db: Session, account_id: int, account: ChartOfAccountsUpdate) -> Optional[ChartOfAccounts]:
        """Update an existing account"""
        db_account = AccountingService.get_account(db, account_id)
        if db_account:
            update_data = account.dict(exclude_unset=True)
            for key, value in update_data.items():
                setattr(db_account, key, value)
            
            db.commit()
            db.refresh(db_account)
        return db_account
    
    @staticmethod
    def delete_account(db: Session, account_id: int) -> bool:
        """Delete an account"""
        db_account = AccountingService.get_account(db, account_id)
        if db_account:
            db.delete(db_account)
            db.commit()
            return True
        return False
    
    # Journal Entry methods
    @staticmethod
    def get_journal_entries(db: Session, skip: int = 0, limit: int = 100) -> List[JournalEntry]:
        """Get all journal entries with pagination"""
        return db.query(JournalEntry).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_journal_entry(db: Session, entry_id: int) -> Optional[JournalEntry]:
        """Get a single journal entry by ID"""
        return db.query(JournalEntry).filter(JournalEntry.id == entry_id).first()
    
    @staticmethod
    def get_journal_entry_by_number(db: Session, entry_number: str) -> Optional[JournalEntry]:
        """Get a single journal entry by entry number"""
        return db.query(JournalEntry).filter(JournalEntry.entry_number == entry_number).first()
    
    @staticmethod
    def create_journal_entry(db: Session, entry: JournalEntryCreate) -> JournalEntry:
        """Create a new journal entry"""
        # If entry_number is not provided, generate one
        if not entry.entry_number:
            entry_dict = entry.dict()
            entry_dict["entry_number"] = generate_journal_entry_number(db)
            db_entry = JournalEntry(**entry_dict)
        else:
            db_entry = JournalEntry(**entry.dict())
        
        db.add(db_entry)
        db.commit()
        db.refresh(db_entry)
        return db_entry
    
    @staticmethod
    def update_journal_entry(db: Session, entry_id: int, entry: JournalEntryUpdate) -> Optional[JournalEntry]:
        """Update an existing journal entry"""
        db_entry = AccountingService.get_journal_entry(db, entry_id)
        if db_entry:
            update_data = entry.dict(exclude_unset=True)
            for key, value in update_data.items():
                setattr(db_entry, key, value)
            
            db.commit()
            db.refresh(db_entry)
        return db_entry
    
    @staticmethod
    def delete_journal_entry(db: Session, entry_id: int) -> bool:
        """Delete a journal entry"""
        db_entry = AccountingService.get_journal_entry(db, entry_id)
        if db_entry:
            db.delete(db_entry)
            db.commit()
            return True
        return False
    
    # Ledger Entry methods
    @staticmethod
    def get_ledger_entries(db: Session, journal_entry_id: int) -> List[LedgerEntry]:
        """Get all ledger entries for a journal entry"""
        return db.query(LedgerEntry).filter(LedgerEntry.journal_entry_id == journal_entry_id).all()
    
    @staticmethod
    def get_ledger_entry(db: Session, entry_id: int) -> Optional[LedgerEntry]:
        """Get a single ledger entry by ID"""
        return db.query(LedgerEntry).filter(LedgerEntry.id == entry_id).first()
    
    @staticmethod
    def create_ledger_entry(db: Session, entry: LedgerEntryCreate) -> LedgerEntry:
        """Create a new ledger entry"""
        db_entry = LedgerEntry(**entry.dict())
        db.add(db_entry)
        db.commit()
        db.refresh(db_entry)
        return db_entry
    
    @staticmethod
    def update_ledger_entry(db: Session, entry_id: int, entry: LedgerEntryUpdate) -> Optional[LedgerEntry]:
        """Update an existing ledger entry"""
        db_entry = AccountingService.get_ledger_entry(db, entry_id)
        if db_entry:
            update_data = entry.dict(exclude_unset=True)
            for key, value in update_data.items():
                setattr(db_entry, key, value)
            
            db.commit()
            db.refresh(db_entry)
        return db_entry
    
    @staticmethod
    def delete_ledger_entry(db: Session, entry_id: int) -> bool:
        """Delete a ledger entry"""
        db_entry = AccountingService.get_ledger_entry(db, entry_id)
        if db_entry:
            db.delete(db_entry)
            db.commit()
            return True
        return False
    
    # Fiscal Period methods
    @staticmethod
    def get_fiscal_periods(db: Session, skip: int = 0, limit: int = 100) -> List[FiscalPeriod]:
        """Get all fiscal periods with pagination"""
        return db.query(FiscalPeriod).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_fiscal_period(db: Session, period_id: int) -> Optional[FiscalPeriod]:
        """Get a single fiscal period by ID"""
        return db.query(FiscalPeriod).filter(FiscalPeriod.id == period_id).first()
    
    @staticmethod
    def create_fiscal_period(db: Session, period: FiscalPeriodCreate) -> FiscalPeriod:
        """Create a new fiscal period"""
        db_period = FiscalPeriod(**period.dict())
        db.add(db_period)
        db.commit()
        db.refresh(db_period)
        return db_period
    
    @staticmethod
    def update_fiscal_period(db: Session, period_id: int, period: FiscalPeriodUpdate) -> Optional[FiscalPeriod]:
        """Update an existing fiscal period"""
        db_period = AccountingService.get_fiscal_period(db, period_id)
        if db_period:
            update_data = period.dict(exclude_unset=True)
            for key, value in update_data.items():
                setattr(db_period, key, value)
            
            db.commit()
            db.refresh(db_period)
        return db_period
    
    @staticmethod
    def delete_fiscal_period(db: Session, period_id: int) -> bool:
        """Delete a fiscal period"""
        db_period = AccountingService.get_fiscal_period(db, period_id)
        if db_period:
            db.delete(db_period)
            db.commit()
            return True
        return False
    
    # Payroll methods
    @staticmethod
    def get_payrolls(db: Session, skip: int = 0, limit: int = 100) -> List[Payroll]:
        """Get all payrolls with pagination"""
        return db.query(Payroll).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_payroll(db: Session, payroll_id: int) -> Optional[Payroll]:
        """Get a single payroll by ID"""
        return db.query(Payroll).filter(Payroll.id == payroll_id).first()
    
    @staticmethod
    def create_payroll(db: Session, payroll: PayrollCreate) -> Payroll:
        """Create a new payroll"""
        db_payroll = Payroll(**payroll.dict())
        db.add(db_payroll)
        db.commit()
        db.refresh(db_payroll)
        return db_payroll
    
    @staticmethod
    def update_payroll(db: Session, payroll_id: int, payroll: PayrollUpdate) -> Optional[Payroll]:
        """Update an existing payroll"""
        db_payroll = AccountingService.get_payroll(db, payroll_id)
        if db_payroll:
            update_data = payroll.dict(exclude_unset=True)
            for key, value in update_data.items():
                setattr(db_payroll, key, value)
            
            db.commit()
            db.refresh(db_payroll)
        return db_payroll
    
    @staticmethod
    def delete_payroll(db: Session, payroll_id: int) -> bool:
        """Delete a payroll"""
        db_payroll = AccountingService.get_payroll(db, payroll_id)
        if db_payroll:
            db.delete(db_payroll)
            db.commit()
            return True
        return False
    
    # Payroll Item methods
    @staticmethod
    def get_payroll_items(db: Session, payroll_id: int) -> List[PayrollItem]:
        """Get all payroll items for a payroll"""
        return db.query(PayrollItem).filter(PayrollItem.payroll_id == payroll_id).all()
    
    @staticmethod
    def get_payroll_item(db: Session, item_id: int) -> Optional[PayrollItem]:
        """Get a single payroll item by ID"""
        return db.query(PayrollItem).filter(PayrollItem.id == item_id).first()
    
    @staticmethod
    def create_payroll_item(db: Session, item: PayrollItemCreate) -> PayrollItem:
        """Create a new payroll item"""
        db_item = PayrollItem(**item.dict())
        db.add(db_item)
        db.commit()
        db.refresh(db_item)
        
        # Update the payroll's total amount
        payroll = AccountingService.get_payroll(db, item.payroll_id)
        if payroll:
            payroll.total_amount += item.net_salary
            db.commit()
        
        return db_item
    
    @staticmethod
    def update_payroll_item(db: Session, item_id: int, item: PayrollItemUpdate) -> Optional[PayrollItem]:
        """Update an existing payroll item"""
        db_item = AccountingService.get_payroll_item(db, item_id)
        if db_item:
            # Store the old net salary for updating the payroll total
            old_net_salary = db_item.net_salary
            
            update_data = item.dict(exclude_unset=True)
            for key, value in update_data.items():
                setattr(db_item, key, value)
            
            db.commit()
            db.refresh(db_item)
            
            # Update the payroll's total amount if net_salary was updated
            if "net_salary" in update_data:
                payroll = AccountingService.get_payroll(db, db_item.payroll_id)
                if payroll:
                    payroll.total_amount = payroll.total_amount - old_net_salary + db_item.net_salary
                    db.commit()
        
        return db_item
    
    @staticmethod
    def delete_payroll_item(db: Session, item_id: int) -> bool:
        """Delete a payroll item"""
        db_item = AccountingService.get_payroll_item(db, item_id)
        if db_item:
            # Update the payroll's total amount
            payroll = AccountingService.get_payroll(db, db_item.payroll_id)
            if payroll:
                payroll.total_amount -= db_item.net_salary
                db.commit()
            
            db.delete(db_item)
            db.commit()
            return True
        return False
    
    # Employee methods
    @staticmethod
    def get_employees(db: Session, skip: int = 0, limit: int = 100) -> List[Employee]:
        """Get all employees with pagination"""
        return db.query(Employee).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_employee(db: Session, employee_id: int) -> Optional[Employee]:
        """Get a single employee by ID"""
        return db.query(Employee).filter(Employee.id == employee_id).first()
    
    @staticmethod
    def get_employee_by_employee_id(db: Session, employee_id: str) -> Optional[Employee]:
        """Get a single employee by employee ID"""
        return db.query(Employee).filter(Employee.employee_id == employee_id).first()
    
    @staticmethod
    def create_employee(db: Session, employee: EmployeeCreate) -> Employee:
        """Create a new employee"""
        db_employee = Employee(**employee.dict())
        db.add(db_employee)
        db.commit()
        db.refresh(db_employee)
        return db_employee
    
    @staticmethod
    def update_employee(db: Session, employee_id: int, employee: EmployeeUpdate) -> Optional[Employee]:
        """Update an existing employee"""
        db_employee = AccountingService.get_employee(db, employee_id)
        if db_employee:
            update_data = employee.dict(exclude_unset=True)
            for key, value in update_data.items():
                setattr(db_employee, key, value)
            
            db.commit()
            db.refresh(db_employee)
        return db_employee
    
    @staticmethod
    def delete_employee(db: Session, employee_id: int) -> bool:
        """Delete an employee"""
        db_employee = AccountingService.get_employee(db, employee_id)
        if db_employee:
            db.delete(db_employee)
            db.commit()
            return True
        return False
