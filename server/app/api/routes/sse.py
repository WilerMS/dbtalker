import asyncio
from collections.abc import AsyncGenerator

from fastapi import APIRouter
from sse_starlette import EventSourceResponse

router = APIRouter(prefix="/sse", tags=["sse"])

async def event_generator() -> AsyncGenerator[dict[str, str], None]:
    counter = 0
    while True:
        yield {
            "event": "heartbeat",
            "id": str(counter),
            "data": f"backend-alive-{counter}",
        }
        counter += 1
        await asyncio.sleep(1)


@router.get("/stream")
async def stream_events() -> EventSourceResponse:
    return EventSourceResponse(event_generator())
