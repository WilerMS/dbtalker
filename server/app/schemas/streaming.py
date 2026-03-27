from typing import Literal, Union

from pydantic import BaseModel

from .chat import MessageType
from .widgets import MessageData


class SSEChunkBase(BaseModel):
    id: str


class SSEChunkIncoming(SSEChunkBase):
    event: Literal["incoming"]
    type: MessageType


class SSEChunkData(SSEChunkBase):
    event: Literal["data"]
    type: MessageType
    data: MessageData


class SSEChunkFinished(BaseModel):
    event: Literal["finished"]


SSEChunk = Union[SSEChunkIncoming, SSEChunkData, SSEChunkFinished]
