from fastapi import APIRouter

from app.routes.health import router as health_router
from app.routes.sse import router as sse_router

api_router = APIRouter()
api_router.include_router(health_router)
api_router.include_router(sse_router)
