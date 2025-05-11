from fastapi import APIRouter

from app.api.api_v1.endpoints import members, customers, assets, accounting, documents, projects
# Import other endpoint modules as they are created
from app.api.api_v1.endpoints import sales, suppliers, purchases
# from app.api.api_v1.endpoints import auth

api_router = APIRouter()

# Include routers for different endpoints
api_router.include_router(members.router, prefix="/members", tags=["members"])
api_router.include_router(customers.router, prefix="/customers", tags=["customers"])
api_router.include_router(projects.router, prefix="/projects", tags=["projects"])
api_router.include_router(assets.router, prefix="/assets", tags=["assets"])
api_router.include_router(accounting.router, prefix="/accounting", tags=["accounting"])
api_router.include_router(documents.router, prefix="/documents", tags=["documents"])
api_router.include_router(sales.router, prefix="/sales", tags=["sales"])
api_router.include_router(suppliers.router, prefix="/suppliers", tags=["suppliers"])
api_router.include_router(purchases.router, prefix="/purchases", tags=["purchases"])
# api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
