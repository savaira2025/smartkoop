from sqlalchemy import Column, String, Boolean, Integer, ForeignKey, Date, Text
from sqlalchemy.orm import relationship
from app.db.database import Base
from app.models.base import BaseModel
from datetime import date

class Document(Base, BaseModel):
    """Document model for document management"""
    
    # Document information
    name = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    document_type = Column(String, nullable=False)  # contract, invoice, receipt, report, etc.
    upload_date = Column(Date, default=date.today, nullable=False)
    uploaded_by = Column(Integer, ForeignKey("user.id"), nullable=True)
    status = Column(String, default="active")  # active, archived
    
    # Related entity information
    related_entity_type = Column(String, nullable=True)  # member, customer, supplier, asset, etc.
    related_entity_id = Column(Integer, nullable=True)
    
    # Document metadata
    description = Column(Text, nullable=True)
    tags = Column(String, nullable=True)
    expiry_date = Column(Date, nullable=True)
    
    # Relationships
    user = relationship("User", backref="uploaded_documents")
    versions = relationship("DocumentVersion", back_populates="document", cascade="all, delete-orphan")


class DocumentVersion(Base, BaseModel):
    """Document version model for tracking document versions"""
    
    # Version information
    document_id = Column(Integer, ForeignKey("document.id"), nullable=False)
    version_number = Column(Integer, nullable=False)
    file_path = Column(String, nullable=False)
    upload_date = Column(Date, default=date.today, nullable=False)
    uploaded_by = Column(Integer, ForeignKey("user.id"), nullable=True)
    notes = Column(Text, nullable=True)
    
    # Relationships
    document = relationship("Document", back_populates="versions")
    user = relationship("User", backref="uploaded_versions")
