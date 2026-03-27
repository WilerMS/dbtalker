from fastapi import APIRouter

from app.api.chat import router as chat_router
from app.api.conversation_routes import router as conversation_router
from app.api.db_routes import router as databases_router
from app.api.health import router as health_router

api_router = APIRouter()

api_router.include_router(health_router)
api_router.include_router(databases_router)
api_router.include_router(conversation_router)
api_router.include_router(chat_router)
