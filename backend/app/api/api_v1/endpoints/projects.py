from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, Path
from sqlalchemy.orm import Session
from datetime import date

from app.db.database import get_db
from app.models.project import (
    Project, ProjectTask, ProjectTimeEntry, 
    ProjectInvoice, ProjectInvoiceItem, ProjectPayment
)
from app.schemas.project import (
    Project as ProjectSchema,
    ProjectCreate, ProjectUpdate,
    ProjectTask as ProjectTaskSchema,
    ProjectTaskCreate, ProjectTaskUpdate,
    ProjectTimeEntry as ProjectTimeEntrySchema,
    ProjectTimeEntryCreate, ProjectTimeEntryUpdate,
    ProjectInvoice as ProjectInvoiceSchema,
    ProjectInvoiceCreate, ProjectInvoiceUpdate,
    ProjectInvoiceItem as ProjectInvoiceItemSchema,
    ProjectInvoiceItemCreate, ProjectInvoiceItemUpdate,
    ProjectPayment as ProjectPaymentSchema,
    ProjectPaymentCreate, ProjectPaymentUpdate
)
from app.services.project_service import ProjectService

router = APIRouter()

# Project endpoints
@router.get("/", response_model=List[ProjectSchema])
def get_projects(
    skip: Optional[int] = Query(0, description="Skip the first n items", ge=0),
    limit: Optional[int] = Query(100, description="Limit the number of items returned", ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Get all projects with pagination"""
    projects = ProjectService.get_projects(db, skip=skip, limit=limit)
    return projects

@router.post("/", response_model=ProjectSchema)
def create_project(
    project: ProjectCreate,
    db: Session = Depends(get_db)
):
    """Create a new project"""
    # Check if project with the same project_number already exists
    if project.project_number:
        db_project = ProjectService.get_project_by_number(db, project.project_number)
        if db_project:
            raise HTTPException(
                status_code=400,
                detail=f"Project with project_number {project.project_number} already exists"
            )
    
    return ProjectService.create_project(db, project)

@router.get("/{project_id}", response_model=ProjectSchema)
def get_project(
    project_id: int = Path(..., description="The ID of the project to get"),
    db: Session = Depends(get_db)
):
    """Get a single project by ID"""
    db_project = ProjectService.get_project(db, project_id)
    if db_project is None:
        raise HTTPException(
            status_code=404,
            detail=f"Project with ID {project_id} not found"
        )
    return db_project

@router.put("/{project_id}", response_model=ProjectSchema)
def update_project(
    project: ProjectUpdate,
    project_id: int = Path(..., description="The ID of the project to update"),
    db: Session = Depends(get_db)
):
    """Update an existing project"""
    db_project = ProjectService.update_project(db, project_id, project)
    if db_project is None:
        raise HTTPException(
            status_code=404,
            detail=f"Project with ID {project_id} not found"
        )
    return db_project

@router.delete("/{project_id}", response_model=bool)
def delete_project(
    project_id: int = Path(..., description="The ID of the project to delete"),
    db: Session = Depends(get_db)
):
    """Delete a project"""
    success = ProjectService.delete_project(db, project_id)
    if not success:
        raise HTTPException(
            status_code=404,
            detail=f"Project with ID {project_id} not found"
        )
    return success

# Project Task endpoints
@router.get("/{project_id}/tasks", response_model=List[ProjectTaskSchema])
def get_project_tasks(
    project_id: int = Path(..., description="The ID of the project to get tasks for"),
    db: Session = Depends(get_db)
):
    """Get all tasks for a project"""
    # Check if project exists
    db_project = ProjectService.get_project(db, project_id)
    if db_project is None:
        raise HTTPException(
            status_code=404,
            detail=f"Project with ID {project_id} not found"
        )
    
    return ProjectService.get_project_tasks(db, project_id)

@router.post("/{project_id}/tasks", response_model=ProjectTaskSchema)
def create_project_task(
    task: ProjectTaskCreate,
    project_id: int = Path(..., description="The ID of the project to create task for"),
    db: Session = Depends(get_db)
):
    """Create a new project task"""
    # Check if project exists
    db_project = ProjectService.get_project(db, project_id)
    if db_project is None:
        raise HTTPException(
            status_code=404,
            detail=f"Project with ID {project_id} not found"
        )
    
    # Ensure the project_id in the path matches the one in the request body
    if task.project_id != project_id:
        raise HTTPException(
            status_code=400,
            detail=f"Project ID in path ({project_id}) does not match project_id in request body ({task.project_id})"
        )
    
    return ProjectService.create_project_task(db, task)

@router.get("/tasks/{task_id}", response_model=ProjectTaskSchema)
def get_project_task(
    task_id: int = Path(..., description="The ID of the task to get"),
    db: Session = Depends(get_db)
):
    """Get a single project task by ID"""
    db_task = ProjectService.get_project_task(db, task_id)
    if db_task is None:
        raise HTTPException(
            status_code=404,
            detail=f"Task with ID {task_id} not found"
        )
    return db_task

@router.put("/tasks/{task_id}", response_model=ProjectTaskSchema)
def update_project_task(
    task: ProjectTaskUpdate,
    task_id: int = Path(..., description="The ID of the task to update"),
    db: Session = Depends(get_db)
):
    """Update an existing project task"""
    db_task = ProjectService.update_project_task(db, task_id, task)
    if db_task is None:
        raise HTTPException(
            status_code=404,
            detail=f"Task with ID {task_id} not found"
        )
    return db_task

@router.delete("/tasks/{task_id}", response_model=bool)
def delete_project_task(
    task_id: int = Path(..., description="The ID of the task to delete"),
    db: Session = Depends(get_db)
):
    """Delete a project task"""
    success = ProjectService.delete_project_task(db, task_id)
    if not success:
        raise HTTPException(
            status_code=404,
            detail=f"Task with ID {task_id} not found"
        )
    return success

# Project Time Entry endpoints
@router.get("/tasks/{task_id}/time-entries", response_model=List[ProjectTimeEntrySchema])
def get_time_entries(
    task_id: int = Path(..., description="The ID of the task to get time entries for"),
    db: Session = Depends(get_db)
):
    """Get all time entries for a task"""
    # Check if task exists
    db_task = ProjectService.get_project_task(db, task_id)
    if db_task is None:
        raise HTTPException(
            status_code=404,
            detail=f"Task with ID {task_id} not found"
        )
    
    return ProjectService.get_time_entries(db, task_id)

@router.post("/tasks/{task_id}/time-entries", response_model=ProjectTimeEntrySchema)
def create_time_entry(
    entry: ProjectTimeEntryCreate,
    task_id: int = Path(..., description="The ID of the task to create time entry for"),
    db: Session = Depends(get_db)
):
    """Create a new time entry"""
    # Check if task exists
    db_task = ProjectService.get_project_task(db, task_id)
    if db_task is None:
        raise HTTPException(
            status_code=404,
            detail=f"Task with ID {task_id} not found"
        )
    
    # Ensure the task_id in the path matches the one in the request body
    if entry.task_id != task_id:
        raise HTTPException(
            status_code=400,
            detail=f"Task ID in path ({task_id}) does not match task_id in request body ({entry.task_id})"
        )
    
    return ProjectService.create_time_entry(db, entry)

@router.get("/time-entries/{entry_id}", response_model=ProjectTimeEntrySchema)
def get_time_entry(
    entry_id: int = Path(..., description="The ID of the time entry to get"),
    db: Session = Depends(get_db)
):
    """Get a single time entry by ID"""
    db_entry = ProjectService.get_time_entry(db, entry_id)
    if db_entry is None:
        raise HTTPException(
            status_code=404,
            detail=f"Time entry with ID {entry_id} not found"
        )
    return db_entry

@router.put("/time-entries/{entry_id}", response_model=ProjectTimeEntrySchema)
def update_time_entry(
    entry: ProjectTimeEntryUpdate,
    entry_id: int = Path(..., description="The ID of the time entry to update"),
    db: Session = Depends(get_db)
):
    """Update an existing time entry"""
    db_entry = ProjectService.update_time_entry(db, entry_id, entry)
    if db_entry is None:
        raise HTTPException(
            status_code=404,
            detail=f"Time entry with ID {entry_id} not found"
        )
    return db_entry

@router.delete("/time-entries/{entry_id}", response_model=bool)
def delete_time_entry(
    entry_id: int = Path(..., description="The ID of the time entry to delete"),
    db: Session = Depends(get_db)
):
    """Delete a time entry"""
    success = ProjectService.delete_time_entry(db, entry_id)
    if not success:
        raise HTTPException(
            status_code=404,
            detail=f"Time entry with ID {entry_id} not found"
        )
    return success

# Project Invoice endpoints - All Invoices
@router.get("/invoices/all", response_model=List[ProjectInvoiceSchema])
def get_all_invoices(
    skip: Optional[int] = Query(0, description="Skip the first n items", ge=0),
    limit: Optional[int] = Query(100, description="Limit the number of items returned", ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Get all project invoices with pagination"""
    invoices = ProjectService.get_all_invoices(db, skip=skip, limit=limit)
    return invoices

@router.get("/{project_id}/invoices", response_model=List[ProjectInvoiceSchema])
def get_project_invoices(
    project_id: int = Path(..., description="The ID of the project to get invoices for"),
    db: Session = Depends(get_db)
):
    """Get all invoices for a project"""
    # Check if project exists
    db_project = ProjectService.get_project(db, project_id)
    if db_project is None:
        raise HTTPException(
            status_code=404,
            detail=f"Project with ID {project_id} not found"
        )
    
    return ProjectService.get_project_invoices(db, project_id)

@router.post("/{project_id}/invoices", response_model=ProjectInvoiceSchema)
def create_project_invoice(
    invoice: ProjectInvoiceCreate,
    project_id: int = Path(..., description="The ID of the project to create invoice for"),
    db: Session = Depends(get_db)
):
    """Create a new project invoice"""
    # Check if project exists
    db_project = ProjectService.get_project(db, project_id)
    if db_project is None:
        raise HTTPException(
            status_code=404,
            detail=f"Project with ID {project_id} not found"
        )
    
    # Ensure the project_id in the path matches the one in the request body
    if invoice.project_id != project_id:
        raise HTTPException(
            status_code=400,
            detail=f"Project ID in path ({project_id}) does not match project_id in request body ({invoice.project_id})"
        )
    
    # Check if invoice with the same invoice_number already exists
    if invoice.invoice_number:
        db_invoice = ProjectService.get_invoice_by_number(db, invoice.invoice_number)
        if db_invoice:
            raise HTTPException(
                status_code=400,
                detail=f"Invoice with invoice_number {invoice.invoice_number} already exists"
            )
    
    return ProjectService.create_project_invoice(db, invoice)

@router.get("/invoices/{invoice_id}", response_model=ProjectInvoiceSchema)
def get_project_invoice(
    invoice_id: int = Path(..., description="The ID of the invoice to get"),
    db: Session = Depends(get_db)
):
    """Get a single project invoice by ID"""
    db_invoice = ProjectService.get_project_invoice(db, invoice_id)
    if db_invoice is None:
        raise HTTPException(
            status_code=404,
            detail=f"Invoice with ID {invoice_id} not found"
        )
    return db_invoice

@router.put("/invoices/{invoice_id}", response_model=ProjectInvoiceSchema)
def update_project_invoice(
    invoice: ProjectInvoiceUpdate,
    invoice_id: int = Path(..., description="The ID of the invoice to update"),
    db: Session = Depends(get_db)
):
    """Update an existing project invoice"""
    db_invoice = ProjectService.update_project_invoice(db, invoice_id, invoice)
    if db_invoice is None:
        raise HTTPException(
            status_code=404,
            detail=f"Invoice with ID {invoice_id} not found"
        )
    return db_invoice

@router.delete("/invoices/{invoice_id}", response_model=bool)
def delete_project_invoice(
    invoice_id: int = Path(..., description="The ID of the invoice to delete"),
    db: Session = Depends(get_db)
):
    """Delete a project invoice"""
    success = ProjectService.delete_project_invoice(db, invoice_id)
    if not success:
        raise HTTPException(
            status_code=404,
            detail=f"Invoice with ID {invoice_id} not found"
        )
    return success

# Project Invoice Item endpoints
@router.get("/invoices/{invoice_id}/items", response_model=List[ProjectInvoiceItemSchema])
def get_invoice_items(
    invoice_id: int = Path(..., description="The ID of the invoice to get items for"),
    db: Session = Depends(get_db)
):
    """Get all items for an invoice"""
    # Check if invoice exists
    db_invoice = ProjectService.get_project_invoice(db, invoice_id)
    if db_invoice is None:
        raise HTTPException(
            status_code=404,
            detail=f"Invoice with ID {invoice_id} not found"
        )
    
    return ProjectService.get_invoice_items(db, invoice_id)

@router.post("/invoices/{invoice_id}/items", response_model=ProjectInvoiceItemSchema)
def create_invoice_item(
    item: ProjectInvoiceItemCreate,
    invoice_id: int = Path(..., description="The ID of the invoice to create item for"),
    db: Session = Depends(get_db)
):
    """Create a new invoice item"""
    # Check if invoice exists
    db_invoice = ProjectService.get_project_invoice(db, invoice_id)
    if db_invoice is None:
        raise HTTPException(
            status_code=404,
            detail=f"Invoice with ID {invoice_id} not found"
        )
    
    # Ensure the invoice_id in the path matches the one in the request body
    if item.invoice_id != invoice_id:
        raise HTTPException(
            status_code=400,
            detail=f"Invoice ID in path ({invoice_id}) does not match invoice_id in request body ({item.invoice_id})"
        )
    
    return ProjectService.create_invoice_item(db, item)

@router.get("/invoice-items/{item_id}", response_model=ProjectInvoiceItemSchema)
def get_invoice_item(
    item_id: int = Path(..., description="The ID of the invoice item to get"),
    db: Session = Depends(get_db)
):
    """Get a single invoice item by ID"""
    db_item = ProjectService.get_invoice_item(db, item_id)
    if db_item is None:
        raise HTTPException(
            status_code=404,
            detail=f"Invoice item with ID {item_id} not found"
        )
    return db_item

@router.put("/invoice-items/{item_id}", response_model=ProjectInvoiceItemSchema)
def update_invoice_item(
    item: ProjectInvoiceItemUpdate,
    item_id: int = Path(..., description="The ID of the invoice item to update"),
    db: Session = Depends(get_db)
):
    """Update an existing invoice item"""
    db_item = ProjectService.update_invoice_item(db, item_id, item)
    if db_item is None:
        raise HTTPException(
            status_code=404,
            detail=f"Invoice item with ID {item_id} not found"
        )
    return db_item

@router.delete("/invoice-items/{item_id}", response_model=bool)
def delete_invoice_item(
    item_id: int = Path(..., description="The ID of the invoice item to delete"),
    db: Session = Depends(get_db)
):
    """Delete an invoice item"""
    success = ProjectService.delete_invoice_item(db, item_id)
    if not success:
        raise HTTPException(
            status_code=404,
            detail=f"Invoice item with ID {item_id} not found"
        )
    return success

# Project Payment endpoints
@router.get("/invoices/{invoice_id}/payments", response_model=List[ProjectPaymentSchema])
def get_invoice_payments(
    invoice_id: int = Path(..., description="The ID of the invoice to get payments for"),
    db: Session = Depends(get_db)
):
    """Get all payments for an invoice"""
    # Check if invoice exists
    db_invoice = ProjectService.get_project_invoice(db, invoice_id)
    if db_invoice is None:
        raise HTTPException(
            status_code=404,
            detail=f"Invoice with ID {invoice_id} not found"
        )
    
    return ProjectService.get_invoice_payments(db, invoice_id)

@router.post("/invoices/{invoice_id}/payments", response_model=ProjectPaymentSchema)
def create_payment(
    payment: ProjectPaymentCreate,
    invoice_id: int = Path(..., description="The ID of the invoice to create payment for"),
    db: Session = Depends(get_db)
):
    """Create a new payment"""
    # Check if invoice exists
    db_invoice = ProjectService.get_project_invoice(db, invoice_id)
    if db_invoice is None:
        raise HTTPException(
            status_code=404,
            detail=f"Invoice with ID {invoice_id} not found"
        )
    
    # Ensure the invoice_id in the path matches the one in the request body
    if payment.invoice_id != invoice_id:
        raise HTTPException(
            status_code=400,
            detail=f"Invoice ID in path ({invoice_id}) does not match invoice_id in request body ({payment.invoice_id})"
        )
    
    return ProjectService.create_payment(db, payment)

@router.get("/payments/{payment_id}", response_model=ProjectPaymentSchema)
def get_payment(
    payment_id: int = Path(..., description="The ID of the payment to get"),
    db: Session = Depends(get_db)
):
    """Get a single payment by ID"""
    db_payment = ProjectService.get_payment(db, payment_id)
    if db_payment is None:
        raise HTTPException(
            status_code=404,
            detail=f"Payment with ID {payment_id} not found"
        )
    return db_payment

@router.put("/payments/{payment_id}", response_model=ProjectPaymentSchema)
def update_payment(
    payment: ProjectPaymentUpdate,
    payment_id: int = Path(..., description="The ID of the payment to update"),
    db: Session = Depends(get_db)
):
    """Update an existing payment"""
    db_payment = ProjectService.update_payment(db, payment_id, payment)
    if db_payment is None:
        raise HTTPException(
            status_code=404,
            detail=f"Payment with ID {payment_id} not found"
        )
    return db_payment

@router.delete("/payments/{payment_id}", response_model=bool)
def delete_payment(
    payment_id: int = Path(..., description="The ID of the payment to delete"),
    db: Session = Depends(get_db)
):
    """Delete a payment"""
    success = ProjectService.delete_payment(db, payment_id)
    if not success:
        raise HTTPException(
            status_code=404,
            detail=f"Payment with ID {payment_id} not found"
        )
    return success
