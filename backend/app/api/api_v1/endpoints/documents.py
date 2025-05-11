from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, Path, UploadFile, File, Form
from sqlalchemy.orm import Session
from datetime import date

from app.db.database import get_db
from app.models.documents import Document, DocumentVersion
from app.schemas.document import (
    Document as DocumentSchema,
    DocumentCreate, DocumentUpdate,
    DocumentVersion as DocumentVersionSchema,
    DocumentVersionCreate, DocumentVersionUpdate
)
from app.services.document_service import DocumentService

router = APIRouter()

# Document endpoints
@router.get("/", response_model=List[DocumentSchema])
async def get_documents(
    skip: int = Query(0, description="Skip the first n items"),
    limit: int = Query(100, description="Limit the number of items returned"),
    related_entity_type: Optional[str] = Query(None, description="Filter by related entity type"),
    related_entity_id: Optional[int] = Query(None, description="Filter by related entity ID"),
    document_type: Optional[str] = Query(None, description="Filter by document type"),
    status: Optional[str] = Query(None, description="Filter by status"),
    db: Session = Depends(get_db)
):
    """Get all documents with optional filtering"""
    documents = DocumentService.get_documents(
        db, 
        skip=skip, 
        limit=limit,
        related_entity_type=related_entity_type,
        related_entity_id=related_entity_id,
        document_type=document_type,
        status=status
    )
    return documents

@router.post("/", response_model=DocumentSchema)
async def create_document(
    document: DocumentCreate,
    db: Session = Depends(get_db)
):
    """Create a new document record without file upload"""
    return DocumentService.create_document(db, document)

@router.post("/upload", response_model=DocumentSchema)
async def upload_document(
    file: UploadFile = File(...),
    name: Optional[str] = Form(None),
    document_type: str = Form(...),
    related_entity_type: Optional[str] = Form(None),
    related_entity_id: Optional[int] = Form(None),
    description: Optional[str] = Form(None),
    tags: Optional[str] = Form(None),
    expiry_date: Optional[date] = Form(None),
    uploaded_by: Optional[int] = Form(None),
    db: Session = Depends(get_db)
):
    """Upload a new document file and create document record"""
    document_data = {
        "name": name or file.filename,
        "document_type": document_type,
        "related_entity_type": related_entity_type,
        "related_entity_id": related_entity_id,
        "description": description,
        "tags": tags,
        "expiry_date": expiry_date,
        "uploaded_by": uploaded_by
    }
    
    return await DocumentService.upload_document(db, file, document_data)

@router.get("/{document_id}", response_model=DocumentSchema)
async def get_document(
    document_id: int = Path(..., description="The ID of the document to get"),
    db: Session = Depends(get_db)
):
    """Get a single document by ID"""
    db_document = DocumentService.get_document(db, document_id)
    if db_document is None:
        raise HTTPException(
            status_code=404,
            detail=f"Document with ID {document_id} not found"
        )
    return db_document

@router.put("/{document_id}", response_model=DocumentSchema)
async def update_document(
    document: DocumentUpdate,
    document_id: int = Path(..., description="The ID of the document to update"),
    db: Session = Depends(get_db)
):
    """Update an existing document"""
    db_document = DocumentService.update_document(db, document_id, document)
    if db_document is None:
        raise HTTPException(
            status_code=404,
            detail=f"Document with ID {document_id} not found"
        )
    return db_document

@router.delete("/{document_id}", response_model=bool)
async def delete_document(
    document_id: int = Path(..., description="The ID of the document to delete"),
    db: Session = Depends(get_db)
):
    """Delete a document"""
    success = DocumentService.delete_document(db, document_id)
    if not success:
        raise HTTPException(
            status_code=404,
            detail=f"Document with ID {document_id} not found"
        )
    return success

# Document Version endpoints
@router.get("/{document_id}/versions", response_model=List[DocumentVersionSchema])
async def get_document_versions(
    document_id: int = Path(..., description="The ID of the document to get versions for"),
    db: Session = Depends(get_db)
):
    """Get all versions of a document"""
    # Check if document exists
    db_document = DocumentService.get_document(db, document_id)
    if db_document is None:
        raise HTTPException(
            status_code=404,
            detail=f"Document with ID {document_id} not found"
        )
    
    return DocumentService.get_document_versions(db, document_id)

@router.post("/{document_id}/versions", response_model=DocumentVersionSchema)
async def create_document_version(
    version: DocumentVersionCreate,
    document_id: int = Path(..., description="The ID of the document to create version for"),
    db: Session = Depends(get_db)
):
    """Create a new document version"""
    # Check if document exists
    db_document = DocumentService.get_document(db, document_id)
    if db_document is None:
        raise HTTPException(
            status_code=404,
            detail=f"Document with ID {document_id} not found"
        )
    
    # Ensure the document_id in the path matches the one in the request body
    if version.document_id != document_id:
        raise HTTPException(
            status_code=400,
            detail=f"Document ID in path ({document_id}) does not match document_id in request body ({version.document_id})"
        )
    
    return DocumentService.create_document_version(db, version)

@router.post("/{document_id}/upload-version", response_model=DocumentVersionSchema)
async def upload_document_version(
    document_id: int = Path(..., description="The ID of the document to upload version for"),
    file: UploadFile = File(...),
    notes: Optional[str] = Form(None),
    uploaded_by: Optional[int] = Form(None),
    db: Session = Depends(get_db)
):
    """Upload a new version of a document"""
    try:
        return await DocumentService.upload_document_version(
            db, 
            document_id, 
            file, 
            notes=notes, 
            uploaded_by=uploaded_by
        )
    except ValueError as e:
        raise HTTPException(
            status_code=404,
            detail=str(e)
        )

@router.get("/versions/{version_id}", response_model=DocumentVersionSchema)
async def get_document_version(
    version_id: int = Path(..., description="The ID of the document version to get"),
    db: Session = Depends(get_db)
):
    """Get a single document version by ID"""
    db_version = DocumentService.get_document_version(db, version_id)
    if db_version is None:
        raise HTTPException(
            status_code=404,
            detail=f"Document version with ID {version_id} not found"
        )
    return db_version

@router.put("/versions/{version_id}", response_model=DocumentVersionSchema)
async def update_document_version(
    version: DocumentVersionUpdate,
    version_id: int = Path(..., description="The ID of the document version to update"),
    db: Session = Depends(get_db)
):
    """Update an existing document version"""
    db_version = DocumentService.update_document_version(db, version_id, version)
    if db_version is None:
        raise HTTPException(
            status_code=404,
            detail=f"Document version with ID {version_id} not found"
        )
    return db_version

@router.delete("/versions/{version_id}", response_model=bool)
async def delete_document_version(
    version_id: int = Path(..., description="The ID of the document version to delete"),
    db: Session = Depends(get_db)
):
    """Delete a document version"""
    success = DocumentService.delete_document_version(db, version_id)
    if not success:
        raise HTTPException(
            status_code=404,
            detail=f"Document version with ID {version_id} not found"
        )
    return success
