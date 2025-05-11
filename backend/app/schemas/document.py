from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import date

# Base schemas for Document
class DocumentBase(BaseModel):
    name: str
    file_path: str
    document_type: str
    upload_date: date = Field(default_factory=date.today)
    uploaded_by: Optional[int] = None
    status: Optional[str] = Field(default="active")
    related_entity_type: Optional[str] = None
    related_entity_id: Optional[int] = None
    description: Optional[str] = None
    tags: Optional[str] = None
    expiry_date: Optional[date] = None

class DocumentCreate(DocumentBase):
    pass

class DocumentUpdate(BaseModel):
    name: Optional[str] = None
    document_type: Optional[str] = None
    status: Optional[str] = None
    related_entity_type: Optional[str] = None
    related_entity_id: Optional[int] = None
    description: Optional[str] = None
    tags: Optional[str] = None
    expiry_date: Optional[date] = None

# Base schemas for DocumentVersion
class DocumentVersionBase(BaseModel):
    document_id: int
    version_number: int
    file_path: str
    upload_date: date = Field(default_factory=date.today)
    uploaded_by: Optional[int] = None
    notes: Optional[str] = None

class DocumentVersionCreate(DocumentVersionBase):
    pass

class DocumentVersionUpdate(BaseModel):
    notes: Optional[str] = None

# Response schemas
class DocumentVersion(DocumentVersionBase):
    id: int
    created_at: date
    updated_at: Optional[date] = None

    class Config:
        orm_mode = True

class Document(DocumentBase):
    id: int
    created_at: date
    updated_at: Optional[date] = None
    versions: List[DocumentVersion] = []

    class Config:
        orm_mode = True
