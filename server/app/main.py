from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.router import api_router
from app.utility.errors import ResourceNotFoundError

app = FastAPI(title="DBTalkie Backend", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(ResourceNotFoundError)
async def resource_not_found_exception_handler(
    _request: Request,
    exc: ResourceNotFoundError,
) -> JSONResponse:
    return JSONResponse(status_code=404, content={"detail": exc.detail})


app.include_router(api_router)
