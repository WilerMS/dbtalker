from __future__ import annotations

import asyncio
import json
import os
import uuid
from collections.abc import AsyncGenerator

from langchain_core.messages import (
    AIMessage,
    BaseMessage,
    HumanMessage,
    SystemMessage,
    ToolMessage,
)
from langchain_openai import ChatOpenAI
from pydantic import SecretStr

from app.schemas.chat import ChatMessage, UserMessage
from app.schemas.streaming import SSEChunk, SSEChunkData, SSEChunkIncoming
from app.schemas.widgets import KpiData, TableData, TextData
from app.services.ai_service.prompts import EXECUTIVE_ASSISTANT_PROMPT
from app.services.ai_service.tools import dbtalkie_tools, query_database


class AIService:
    def __init__(self):
        api_key = os.getenv("OPENAI_API_KEY")
        self.llm = ChatOpenAI(
            model="gpt-4o-mini",
            temperature=0,
            api_key=SecretStr(api_key) if api_key else None,
        )
        self.llm_with_tools = self.llm.bind_tools(dbtalkie_tools)

    async def generate_dynamic_stream(
        self, user_message: UserMessage, history: list[ChatMessage], database_id: str
    ) -> AsyncGenerator[SSEChunk, None]:

        # 1. Construir el contexto para la IA
        messages: list[BaseMessage] = self._build_history(history, user_message)

        ITERATIONS = 0
        MAX_ITERATIONS = 5

        while ITERATIONS < MAX_ITERATIONS:
            ITERATIONS += 1

            # 2. La IA decide
            response = await self.llm_with_tools.ainvoke(messages)
            messages.append(response)

            if response.content and isinstance(response.content, str):
                text_id = str(uuid.uuid4())
                yield SSEChunkIncoming(id=text_id, event="incoming", type="text")
                await asyncio.sleep(1.7)

                yield SSEChunkData(
                    id=text_id,
                    event="data",
                    type="text",
                    data=TextData(text=response.content),
                )

            if response.tool_calls:
                for tool_call in response.tool_calls:
                    tool_name = tool_call["name"]
                    tool_args = tool_call["args"]
                    tool_id = tool_call["id"]

                    # * Backend Tools
                    if tool_name == "query_database":
                        db_result = query_database.invoke(tool_args)
                        messages.append(
                            ToolMessage(tool_call_id=tool_id, content=db_result)
                        )

                    # * Frontend Tools (UI Widgets)
                    elif tool_name == "ShowKPI":
                        kpi_id = str(uuid.uuid4())
                        yield SSEChunkIncoming(id=kpi_id, event="incoming", type="kpi")

                        kpi_data = KpiData(
                            value=tool_args.get("value", "N/A"),
                            label=tool_args.get("label", "Metric"),
                            delta=tool_args.get("delta", ""),
                        )

                        await asyncio.sleep(1.7)

                        yield SSEChunkData(
                            id=kpi_id, event="data", type="kpi", data=kpi_data
                        )

                        # Acknowledge to the AI that the widget was rendered successfully
                        messages.append(
                            ToolMessage(
                                tool_call_id=tool_id,
                                content="Widget successfully rendered on the screen.",
                            )
                        )

                    elif tool_name == "ShowTable":
                        table_id = str(uuid.uuid4())
                        yield SSEChunkIncoming(
                            id=table_id, event="incoming", type="table"
                        )

                        table_data = TableData(
                            title=tool_args.get("title", "Table"),
                            columns=tool_args.get("columns", []),
                            rows=tool_args.get("rows", []),
                        )

                        await asyncio.sleep(1.7)

                        yield SSEChunkData(
                            id=table_id, event="data", type="table", data=table_data
                        )

                        messages.append(
                            ToolMessage(
                                tool_call_id=tool_id,
                                content="Table successfully rendered on the screen.",
                            )
                        )

                # Tools were executed. Continue the while loop so the AI can evaluate the new ToolMessages.
                continue
            else:
                # We break the loop because the final text (if any) was already yielded in step 2.
                break

    def _build_history(
        self, history: list[ChatMessage], user_message: UserMessage
    ) -> list[BaseMessage]:

        messages: list[BaseMessage] = [SystemMessage(content=EXECUTIVE_ASSISTANT_PROMPT)]

        for msg in history:
            if msg.role == "user":
                messages.append(HumanMessage(content=msg.data.text))
                continue

            if msg.type == "text":
                messages.append(AIMessage(content=msg.data.text))
            elif msg.type == "kpi":
                content = (
                    f"[System Note: Displayed KPI Widget to user -> "
                    f"Label: '{msg.data.label}', Value: '{msg.data.value}', "
                    f"Delta: '{msg.data.delta}']"
                )
                messages.append(AIMessage(content=content))
            elif msg.type == "table":
                rows_json = json.dumps(msg.data.rows, ensure_ascii=False)
                content = (
                    f"[System Note: Displayed Table Widget to user -> "
                    f"Columns: {msg.data.columns}. "
                    f"Data: {rows_json}]"
                )
                messages.append(AIMessage(content=content))
            else:
                # TODO: Add more widget types here
                content = f"[System Note: Displayed {msg.type} widget with data: {msg.data.model_dump_json()}]"
                messages.append(AIMessage(content=content))

        messages.append(HumanMessage(content=user_message.data.text))

        return messages
