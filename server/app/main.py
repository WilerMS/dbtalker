import asyncio
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.router import api_router
from app.core.database import init_db, seed_db
from app.utility.errors import ResourceNotFoundError


@asynccontextmanager
async def lifespan(_app: FastAPI):
    # Retry a few times so startup is resilient when DB takes extra seconds.
    for attempt in range(5):
        try:
            await init_db()
            await seed_db()
            break
        except Exception:
            if attempt == 4:
                raise
            await asyncio.sleep(1)

    yield


app = FastAPI(title="DBTalkie Backend", version="0.1.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
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
