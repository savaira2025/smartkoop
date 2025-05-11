from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session, joinedload
from datetime import date
from decimal import Decimal

from app.models.project import (
    Project, ProjectTask, ProjectTimeEntry, 
    ProjectInvoice, ProjectInvoiceItem, ProjectPayment
)
from app.schemas.project import (
    ProjectCreate, ProjectUpdate,
    ProjectTaskCreate, ProjectTaskUpdate,
    ProjectTimeEntryCreate, ProjectTimeEntryUpdate,
    ProjectInvoiceCreate, ProjectInvoiceUpdate,
    ProjectInvoiceItemCreate, ProjectInvoiceItemUpdate,
    ProjectPaymentCreate, ProjectPaymentUpdate
)
from app.utils.id_generator import generate_project_number, generate_invoice_number

class ProjectService:
    # Project methods
    @staticmethod
    def get_projects(db: Session, skip: int = 0, limit: int = 100) -> List[Project]:
        """Get all projects with pagination"""
        return db.query(Project).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_project(db: Session, project_id: int) -> Optional[Project]:
        """Get a single project by ID"""
        return db.query(Project).filter(Project.id == project_id).first()
    
    @staticmethod
    def get_project_by_number(db: Session, project_number: str) -> Optional[Project]:
        """Get a single project by project number"""
        return db.query(Project).filter(Project.project_number == project_number).first()
    
    @staticmethod
    def create_project(db: Session, project: ProjectCreate) -> Project:
        """Create a new project"""
        # If project_number is not provided, generate one
        if not project.project_number:
            project_dict = project.dict()
            project_dict["project_number"] = generate_project_number(db)
            db_project = Project(**project_dict)
        else:
            db_project = Project(**project.dict())
        
        db.add(db_project)
        db.commit()
        db.refresh(db_project)
        return db_project
    
    @staticmethod
    def update_project(db: Session, project_id: int, project: ProjectUpdate) -> Optional[Project]:
        """Update an existing project"""
        db_project = ProjectService.get_project(db, project_id)
        if db_project:
            update_data = project.dict(exclude_unset=True)
            for key, value in update_data.items():
                setattr(db_project, key, value)
            
            db.commit()
            db.refresh(db_project)
        return db_project
    
    @staticmethod
    def delete_project(db: Session, project_id: int) -> bool:
        """Delete a project"""
        db_project = ProjectService.get_project(db, project_id)
        if db_project:
            db.delete(db_project)
            db.commit()
            return True
        return False
    
    # Project Task methods
    @staticmethod
    def get_project_tasks(db: Session, project_id: int) -> List[ProjectTask]:
        """Get all tasks for a project"""
        return db.query(ProjectTask).filter(ProjectTask.project_id == project_id).all()
    
    @staticmethod
    def get_project_task(db: Session, task_id: int) -> Optional[ProjectTask]:
        """Get a single project task by ID"""
        return db.query(ProjectTask).filter(ProjectTask.id == task_id).first()
    
    @staticmethod
    def create_project_task(db: Session, task: ProjectTaskCreate) -> ProjectTask:
        """Create a new project task"""
        db_task = ProjectTask(**task.dict())
        db.add(db_task)
        db.commit()
        db.refresh(db_task)
        return db_task
    
    @staticmethod
    def update_project_task(db: Session, task_id: int, task: ProjectTaskUpdate) -> Optional[ProjectTask]:
        """Update an existing project task"""
        db_task = ProjectService.get_project_task(db, task_id)
        if db_task:
            update_data = task.dict(exclude_unset=True)
            for key, value in update_data.items():
                setattr(db_task, key, value)
            
            # Update actual_hours based on time entries if not provided
            if "actual_hours" not in update_data:
                time_entries = db.query(ProjectTimeEntry).filter(ProjectTimeEntry.task_id == task_id).all()
                total_hours = sum(entry.hours for entry in time_entries)
                db_task.actual_hours = total_hours
            
            db.commit()
            db.refresh(db_task)
        return db_task
    
    @staticmethod
    def delete_project_task(db: Session, task_id: int) -> bool:
        """Delete a project task"""
        db_task = ProjectService.get_project_task(db, task_id)
        if db_task:
            db.delete(db_task)
            db.commit()
            return True
        return False
    
    # Project Time Entry methods
    @staticmethod
    def get_time_entries(db: Session, task_id: int) -> List[ProjectTimeEntry]:
        """Get all time entries for a task"""
        return db.query(ProjectTimeEntry).filter(ProjectTimeEntry.task_id == task_id).all()
    
    @staticmethod
    def get_time_entry(db: Session, entry_id: int) -> Optional[ProjectTimeEntry]:
        """Get a single time entry by ID"""
        return db.query(ProjectTimeEntry).filter(ProjectTimeEntry.id == entry_id).first()
    
    @staticmethod
    def create_time_entry(db: Session, entry: ProjectTimeEntryCreate) -> ProjectTimeEntry:
        """Create a new time entry"""
        db_entry = ProjectTimeEntry(**entry.dict())
        db.add(db_entry)
        db.commit()
        db.refresh(db_entry)
        
        # Update the task's actual_hours
        task = ProjectService.get_project_task(db, entry.task_id)
        if task:
            time_entries = db.query(ProjectTimeEntry).filter(ProjectTimeEntry.task_id == entry.task_id).all()
            total_hours = sum(entry.hours for entry in time_entries)
            task.actual_hours = total_hours
            db.commit()
        
        return db_entry
    
    @staticmethod
    def update_time_entry(db: Session, entry_id: int, entry: ProjectTimeEntryUpdate) -> Optional[ProjectTimeEntry]:
        """Update an existing time entry"""
        db_entry = ProjectService.get_time_entry(db, entry_id)
        if db_entry:
            update_data = entry.dict(exclude_unset=True)
            for key, value in update_data.items():
                setattr(db_entry, key, value)
            
            db.commit()
            db.refresh(db_entry)
            
            # Update the task's actual_hours
            task = ProjectService.get_project_task(db, db_entry.task_id)
            if task:
                time_entries = db.query(ProjectTimeEntry).filter(ProjectTimeEntry.task_id == db_entry.task_id).all()
                total_hours = sum(entry.hours for entry in time_entries)
                task.actual_hours = total_hours
                db.commit()
        
        return db_entry
    
    @staticmethod
    def delete_time_entry(db: Session, entry_id: int) -> bool:
        """Delete a time entry"""
        db_entry = ProjectService.get_time_entry(db, entry_id)
        if db_entry:
            task_id = db_entry.task_id
            db.delete(db_entry)
            db.commit()
            
            # Update the task's actual_hours
            task = ProjectService.get_project_task(db, task_id)
            if task:
                time_entries = db.query(ProjectTimeEntry).filter(ProjectTimeEntry.task_id == task_id).all()
                total_hours = sum(entry.hours for entry in time_entries)
                task.actual_hours = total_hours
                db.commit()
            
            return True
        return False
    
    # Project Invoice methods
    @staticmethod
    def get_project_invoices(db: Session, project_id: int) -> List[ProjectInvoice]:
        """Get all invoices for a project"""
        return db.query(ProjectInvoice).filter(ProjectInvoice.project_id == project_id).options(
            # Explicitly join the project relationship
            joinedload(ProjectInvoice.project).joinedload(Project.customer),
            # Also load items and payments
            joinedload(ProjectInvoice.items),
            joinedload(ProjectInvoice.payments)
        ).all()
    
    @staticmethod
    def get_all_invoices(db: Session, skip: int = 0, limit: int = 100) -> List[ProjectInvoice]:
        """Get all project invoices with pagination"""
        return db.query(ProjectInvoice).options(
            # Explicitly join the project relationship
            joinedload(ProjectInvoice.project).joinedload(Project.customer)
        ).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_project_invoice(db: Session, invoice_id: int) -> Optional[ProjectInvoice]:
        """Get a single project invoice by ID"""
        return db.query(ProjectInvoice).filter(ProjectInvoice.id == invoice_id).options(
            # Explicitly join the project relationship
            joinedload(ProjectInvoice.project).joinedload(Project.customer),
            # Also load items and payments
            joinedload(ProjectInvoice.items),
            joinedload(ProjectInvoice.payments)
        ).first()
    
    @staticmethod
    def get_invoice_by_number(db: Session, invoice_number: str) -> Optional[ProjectInvoice]:
        """Get a single project invoice by invoice number"""
        return db.query(ProjectInvoice).filter(ProjectInvoice.invoice_number == invoice_number).options(
            # Explicitly join the project relationship
            joinedload(ProjectInvoice.project).joinedload(Project.customer),
            # Also load items and payments
            joinedload(ProjectInvoice.items),
            joinedload(ProjectInvoice.payments)
        ).first()
    
    @staticmethod
    def create_project_invoice(db: Session, invoice: ProjectInvoiceCreate) -> ProjectInvoice:
        """Create a new project invoice"""
        # If invoice_number is not provided, generate one
        if not invoice.invoice_number:
            invoice_dict = invoice.dict()
            invoice_dict["invoice_number"] = generate_invoice_number(db)
            db_invoice = ProjectInvoice(**invoice_dict)
        else:
            db_invoice = ProjectInvoice(**invoice.dict())
        
        db.add(db_invoice)
        db.commit()
        db.refresh(db_invoice)
        
        # Update the project's total_invoiced
        project = ProjectService.get_project(db, invoice.project_id)
        if project:
            invoices = db.query(ProjectInvoice).filter(ProjectInvoice.project_id == invoice.project_id).all()
            total_invoiced = sum(invoice.total_amount for invoice in invoices)
            project.total_invoiced = total_invoiced
            db.commit()
        
        return db_invoice
    
    @staticmethod
    def update_project_invoice(db: Session, invoice_id: int, invoice: ProjectInvoiceUpdate) -> Optional[ProjectInvoice]:
        """Update an existing project invoice"""
        db_invoice = ProjectService.get_project_invoice(db, invoice_id)
        if db_invoice:
            update_data = invoice.dict(exclude_unset=True)
            for key, value in update_data.items():
                setattr(db_invoice, key, value)
            
            db.commit()
            db.refresh(db_invoice)
            
            # Update the project's total_invoiced
            project = ProjectService.get_project(db, db_invoice.project_id)
            if project:
                invoices = db.query(ProjectInvoice).filter(ProjectInvoice.project_id == db_invoice.project_id).all()
                total_invoiced = sum(invoice.total_amount for invoice in invoices)
                project.total_invoiced = total_invoiced
                db.commit()
        
        return db_invoice
    
    @staticmethod
    def delete_project_invoice(db: Session, invoice_id: int) -> bool:
        """Delete a project invoice"""
        db_invoice = ProjectService.get_project_invoice(db, invoice_id)
        if db_invoice:
            project_id = db_invoice.project_id
            db.delete(db_invoice)
            db.commit()
            
            # Update the project's total_invoiced
            project = ProjectService.get_project(db, project_id)
            if project:
                invoices = db.query(ProjectInvoice).filter(ProjectInvoice.project_id == project_id).all()
                total_invoiced = sum(invoice.total_amount for invoice in invoices)
                project.total_invoiced = total_invoiced
                db.commit()
            
            return True
        return False
    
    # Project Invoice Item methods
    @staticmethod
    def get_invoice_items(db: Session, invoice_id: int) -> List[ProjectInvoiceItem]:
        """Get all items for an invoice"""
        return db.query(ProjectInvoiceItem).filter(ProjectInvoiceItem.invoice_id == invoice_id).all()
    
    @staticmethod
    def get_invoice_item(db: Session, item_id: int) -> Optional[ProjectInvoiceItem]:
        """Get a single invoice item by ID"""
        return db.query(ProjectInvoiceItem).filter(ProjectInvoiceItem.id == item_id).first()
    
    @staticmethod
    def create_invoice_item(db: Session, item: ProjectInvoiceItemCreate) -> ProjectInvoiceItem:
        """Create a new invoice item"""
        db_item = ProjectInvoiceItem(**item.dict())
        db.add(db_item)
        db.commit()
        db.refresh(db_item)
        
        # Update the invoice's subtotal and total_amount
        invoice = ProjectService.get_project_invoice(db, item.invoice_id)
        if invoice:
            items = db.query(ProjectInvoiceItem).filter(ProjectInvoiceItem.invoice_id == item.invoice_id).all()
            subtotal = sum(item.subtotal for item in items)
            invoice.subtotal = subtotal
            invoice.total_amount = subtotal + invoice.tax_amount
            db.commit()
            
            # Update the project's total_invoiced
            project = ProjectService.get_project(db, invoice.project_id)
            if project:
                invoices = db.query(ProjectInvoice).filter(ProjectInvoice.project_id == invoice.project_id).all()
                total_invoiced = sum(invoice.total_amount for invoice in invoices)
                project.total_invoiced = total_invoiced
                db.commit()
        
        return db_item
    
    @staticmethod
    def update_invoice_item(db: Session, item_id: int, item: ProjectInvoiceItemUpdate) -> Optional[ProjectInvoiceItem]:
        """Update an existing invoice item"""
        db_item = ProjectService.get_invoice_item(db, item_id)
        if db_item:
            update_data = item.dict(exclude_unset=True)
            for key, value in update_data.items():
                setattr(db_item, key, value)
            
            db.commit()
            db.refresh(db_item)
            
            # Update the invoice's subtotal and total_amount
            invoice = ProjectService.get_project_invoice(db, db_item.invoice_id)
            if invoice:
                items = db.query(ProjectInvoiceItem).filter(ProjectInvoiceItem.invoice_id == db_item.invoice_id).all()
                subtotal = sum(item.subtotal for item in items)
                invoice.subtotal = subtotal
                invoice.total_amount = subtotal + invoice.tax_amount
                db.commit()
                
                # Update the project's total_invoiced
                project = ProjectService.get_project(db, invoice.project_id)
                if project:
                    invoices = db.query(ProjectInvoice).filter(ProjectInvoice.project_id == invoice.project_id).all()
                    total_invoiced = sum(invoice.total_amount for invoice in invoices)
                    project.total_invoiced = total_invoiced
                    db.commit()
        
        return db_item
    
    @staticmethod
    def delete_invoice_item(db: Session, item_id: int) -> bool:
        """Delete an invoice item"""
        db_item = ProjectService.get_invoice_item(db, item_id)
        if db_item:
            invoice_id = db_item.invoice_id
            db.delete(db_item)
            db.commit()
            
            # Update the invoice's subtotal and total_amount
            invoice = ProjectService.get_project_invoice(db, invoice_id)
            if invoice:
                items = db.query(ProjectInvoiceItem).filter(ProjectInvoiceItem.invoice_id == invoice_id).all()
                subtotal = sum(item.subtotal for item in items)
                invoice.subtotal = subtotal
                invoice.total_amount = subtotal + invoice.tax_amount
                db.commit()
                
                # Update the project's total_invoiced
                project = ProjectService.get_project(db, invoice.project_id)
                if project:
                    invoices = db.query(ProjectInvoice).filter(ProjectInvoice.project_id == invoice.project_id).all()
                    total_invoiced = sum(invoice.total_amount for invoice in invoices)
                    project.total_invoiced = total_invoiced
                    db.commit()
            
            return True
        return False
    
    # Project Payment methods
    @staticmethod
    def get_invoice_payments(db: Session, invoice_id: int) -> List[ProjectPayment]:
        """Get all payments for an invoice"""
        return db.query(ProjectPayment).filter(ProjectPayment.invoice_id == invoice_id).all()
    
    @staticmethod
    def get_payment(db: Session, payment_id: int) -> Optional[ProjectPayment]:
        """Get a single payment by ID"""
        return db.query(ProjectPayment).filter(ProjectPayment.id == payment_id).first()
    
    @staticmethod
    def create_payment(db: Session, payment: ProjectPaymentCreate) -> ProjectPayment:
        """Create a new payment"""
        db_payment = ProjectPayment(**payment.dict())
        db.add(db_payment)
        db.commit()
        db.refresh(db_payment)
        
        # Update the invoice's status
        invoice = ProjectService.get_project_invoice(db, payment.invoice_id)
        if invoice:
            payments = db.query(ProjectPayment).filter(ProjectPayment.invoice_id == payment.invoice_id).all()
            total_paid = sum(payment.amount for payment in payments)
            
            if total_paid >= invoice.total_amount:
                invoice.status = "paid"
            elif total_paid > 0:
                invoice.status = "partial"
            else:
                invoice.status = "unpaid"
            
            db.commit()
        
        return db_payment
    
    @staticmethod
    def update_payment(db: Session, payment_id: int, payment: ProjectPaymentUpdate) -> Optional[ProjectPayment]:
        """Update an existing payment"""
        db_payment = ProjectService.get_payment(db, payment_id)
        if db_payment:
            update_data = payment.dict(exclude_unset=True)
            for key, value in update_data.items():
                setattr(db_payment, key, value)
            
            db.commit()
            db.refresh(db_payment)
            
            # Update the invoice's status
            invoice = ProjectService.get_project_invoice(db, db_payment.invoice_id)
            if invoice:
                payments = db.query(ProjectPayment).filter(ProjectPayment.invoice_id == db_payment.invoice_id).all()
                total_paid = sum(payment.amount for payment in payments)
                
                if total_paid >= invoice.total_amount:
                    invoice.status = "paid"
                elif total_paid > 0:
                    invoice.status = "partial"
                else:
                    invoice.status = "unpaid"
                
                db.commit()
        
        return db_payment
    
    @staticmethod
    def delete_payment(db: Session, payment_id: int) -> bool:
        """Delete a payment"""
        db_payment = ProjectService.get_payment(db, payment_id)
        if db_payment:
            invoice_id = db_payment.invoice_id
            db.delete(db_payment)
            db.commit()
            
            # Update the invoice's status
            invoice = ProjectService.get_project_invoice(db, invoice_id)
            if invoice:
                payments = db.query(ProjectPayment).filter(ProjectPayment.invoice_id == invoice_id).all()
                total_paid = sum(payment.amount for payment in payments)
                
                if total_paid >= invoice.total_amount:
                    invoice.status = "paid"
                elif total_paid > 0:
                    invoice.status = "partial"
                else:
                    invoice.status = "unpaid"
                
                db.commit()
            
            return True
        return False
