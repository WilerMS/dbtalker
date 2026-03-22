from fastapi import FastAPI

from app.routes.router import api_router

app = FastAPI(title="DBTalker Backend", version="0.1.0")
app.include_router(api_router)
