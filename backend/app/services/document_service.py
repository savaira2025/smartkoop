from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from datetime import date
import os
from fastapi import UploadFile, File

from app.models.documents import Document, DocumentVersion
from app.schemas.document import DocumentCreate, DocumentUpdate, DocumentVersionCreate, DocumentVersionUpdate

class DocumentService:
    @staticmethod
    def get_documents(
        db: Session, 
        skip: int = 0, 
        limit: int = 100,
        related_entity_type: Optional[str] = None,
        related_entity_id: Optional[int] = None,
        document_type: Optional[str] = None,
        status: Optional[str] = None
    ) -> List[Document]:
        """Get all documents with optional filtering"""
        query = db.query(Document)
        
        if related_entity_type:
            query = query.filter(Document.related_entity_type == related_entity_type)
        
        if related_entity_id:
            query = query.filter(Document.related_entity_id == related_entity_id)
        
        if document_type:
            query = query.filter(Document.document_type == document_type)
        
        if status:
            query = query.filter(Document.status == status)
        
        return query.offset(skip).limit(limit).all()
    
    @staticmethod
    def get_document(db: Session, document_id: int) -> Optional[Document]:
        """Get a single document by ID"""
        return db.query(Document).filter(Document.id == document_id).first()
    
    @staticmethod
    def create_document(db: Session, document: DocumentCreate) -> Document:
        """Create a new document"""
        db_document = Document(**document.dict())
        db.add(db_document)
        db.commit()
        db.refresh(db_document)
        return db_document
    
    @staticmethod
    async def upload_document(
        db: Session, 
        file: UploadFile, 
        document_data: Dict[str, Any],
        upload_dir: str = "uploads"
    ) -> Document:
        """Upload a new document file and create document record"""
        # Ensure upload directory exists
        os.makedirs(upload_dir, exist_ok=True)
        
        # Generate file path
        file_extension = os.path.splitext(file.filename)[1]
        timestamp = date.today().strftime("%Y%m%d")
        file_name = f"{timestamp}_{file.filename}"
        file_path = os.path.join(upload_dir, file_name)
        
        # Save file
        with open(file_path, "wb") as f:
            content = await file.read()
            f.write(content)
        
        # Create document record
        document_data["file_path"] = file_path
        document_data["name"] = document_data.get("name", file.filename)
        
        document = DocumentCreate(**document_data)
        return DocumentService.create_document(db, document)
    
    @staticmethod
    def update_document(db: Session, document_id: int, document: DocumentUpdate) -> Optional[Document]:
        """Update an existing document"""
        db_document = DocumentService.get_document(db, document_id)
        if db_document:
            update_data = document.dict(exclude_unset=True)
            for key, value in update_data.items():
                setattr(db_document, key, value)
            
            db.commit()
            db.refresh(db_document)
        return db_document
    
    @staticmethod
    def delete_document(db: Session, document_id: int) -> bool:
        """Delete a document"""
        db_document = DocumentService.get_document(db, document_id)
        if db_document:
            # Delete the file if it exists
            if os.path.exists(db_document.file_path):
                os.remove(db_document.file_path)
            
            # Delete document versions files
            for version in db_document.versions:
                if os.path.exists(version.file_path):
                    os.remove(version.file_path)
            
            db.delete(db_document)
            db.commit()
            return True
        return False
    
    @staticmethod
    def get_document_versions(db: Session, document_id: int) -> List[DocumentVersion]:
        """Get all versions of a document"""
        return db.query(DocumentVersion).filter(DocumentVersion.document_id == document_id).all()
    
    @staticmethod
    def get_document_version(db: Session, version_id: int) -> Optional[DocumentVersion]:
        """Get a single document version by ID"""
        return db.query(DocumentVersion).filter(DocumentVersion.id == version_id).first()
    
    @staticmethod
    def create_document_version(db: Session, version: DocumentVersionCreate) -> DocumentVersion:
        """Create a new document version"""
        # Get the document to update its latest version
        document = db.query(Document).filter(Document.id == version.document_id).first()
        if document:
            # Update the document's file path to the new version
            document.file_path = version.file_path
            db.commit()
        
        db_version = DocumentVersion(**version.dict())
        db.add(db_version)
        db.commit()
        db.refresh(db_version)
        return db_version
    
    @staticmethod
    async def upload_document_version(
        db: Session, 
        document_id: int,
        file: UploadFile, 
        notes: Optional[str] = None,
        uploaded_by: Optional[int] = None,
        upload_dir: str = "uploads"
    ) -> DocumentVersion:
        """Upload a new version of a document"""
        # Ensure upload directory exists
        os.makedirs(upload_dir, exist_ok=True)
        
        # Get the document
        document = DocumentService.get_document(db, document_id)
        if not document:
            raise ValueError(f"Document with ID {document_id} not found")
        
        # Get the latest version number
        versions = DocumentService.get_document_versions(db, document_id)
        version_number = 1
        if versions:
            version_number = max(v.version_number for v in versions) + 1
        
        # Generate file path
        file_extension = os.path.splitext(file.filename)[1]
        timestamp = date.today().strftime("%Y%m%d")
        file_name = f"{timestamp}_{document.name}_v{version_number}{file_extension}"
        file_path = os.path.join(upload_dir, file_name)
        
        # Save file
        with open(file_path, "wb") as f:
            content = await file.read()
            f.write(content)
        
        # Create version record
        version_data = {
            "document_id": document_id,
            "version_number": version_number,
            "file_path": file_path,
            "uploaded_by": uploaded_by,
            "notes": notes
        }
        
        version = DocumentVersionCreate(**version_data)
        return DocumentService.create_document_version(db, version)
    
    @staticmethod
    def update_document_version(db: Session, version_id: int, version: DocumentVersionUpdate) -> Optional[DocumentVersion]:
        """Update an existing document version"""
        db_version = DocumentService.get_document_version(db, version_id)
        if db_version:
            update_data = version.dict(exclude_unset=True)
            for key, value in update_data.items():
                setattr(db_version, key, value)
            
            db.commit()
            db.refresh(db_version)
        return db_version
    
    @staticmethod
    def delete_document_version(db: Session, version_id: int) -> bool:
        """Delete a document version"""
        db_version = DocumentService.get_document_version(db, version_id)
        if db_version:
            # Delete the file if it exists
            if os.path.exists(db_version.file_path):
                os.remove(db_version.file_path)
            
            db.delete(db_version)
            db.commit()
            return True
        return False
