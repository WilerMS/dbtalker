from __future__ import annotations

import asyncio
import json
import uuid
from collections.abc import AsyncGenerator
from datetime import datetime

from langchain_core.messages import (
    AIMessage,
    BaseMessage,
    HumanMessage,
    SystemMessage,
    ToolMessage,
)
from langchain_openai import ChatOpenAI
from pydantic import SecretStr, ValidationError
from sqlalchemy.exc import OperationalError as SQLAlchemyOperationalError

from app.config import settings
from app.schemas.chat import ChatMessage
from app.schemas.database import DatabaseRecord
from app.schemas.streaming import SSEChunk, SSEChunkData, SSEChunkIncoming
from app.schemas.widgets import CodeData, KpiData, QuestionData, TableData, TextData
from app.services.ai_service.agent_factory import AgentFactory
from app.services.ai_service.prompts import EXECUTIVE_ASSISTANT_PROMPT


class AIService:
    def __init__(self):
        self.llm = ChatOpenAI(
            model="gpt-4o-mini",
            temperature=0,
            api_key=SecretStr(settings.openai_api_key),
        )

    async def generate_dynamic_stream(
        self, history: list[ChatMessage], db_record: DatabaseRecord
    ) -> AsyncGenerator[SSEChunk, None]:
        try:
            llm_with_tools, sql_tools = AgentFactory.build_sql_agent(self.llm, db_record)
        except SQLAlchemyOperationalError:
            error_id = str(uuid.uuid4())
            yield SSEChunkIncoming(id=error_id, event="incoming", type="text")
            yield SSEChunkData(
                id=error_id,
                event="data",
                type="text",
                data=TextData(
                    text=(
                        "No pude conectarme a la base de datos configurada. "
                        "Verifica host, puerto y credenciales, y prueba nuevamente."
                    )
                ),
            )
            return

        # TODO: summarize history to save tokens in large conversations
        messages: list[BaseMessage] = self._build_history(history)

        iterations = 0
        max_iterations = 5

        while iterations < max_iterations:
            iterations += 1

            response = await llm_with_tools.ainvoke(messages)
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

                    # Backend tools
                    if tool_name in [t.name for t in sql_tools]:
                        tool_instance = next(t for t in sql_tools if t.name == tool_name)

                        print(
                            f"AI requested tool '{tool_name}' with args: {tool_args}"
                        )  # Debug log

                        # Send intermediate status
                        status_id = str(uuid.uuid4())
                        yield SSEChunkIncoming(
                            id=status_id,
                            event="incoming",
                            type="text",
                        )
                        yield SSEChunkData(
                            id=status_id,
                            event="data",
                            type="text",
                            data=TextData(text="Consultando la base de datos..."),
                        )

                        db_result = await tool_instance.ainvoke(tool_args)
                        messages.append(
                            ToolMessage(tool_call_id=tool_id, content=str(db_result))
                        )
                        continue

                    # Frontend tools (UI widgets)
                    if tool_name == "ShowKPI":
                        kpi_id = str(uuid.uuid4())
                        yield SSEChunkIncoming(id=kpi_id, event="incoming", type="kpi")

                        kpi_data = KpiData(
                            value=tool_args.get("value", "N/A"),
                            label=tool_args.get("label", "Metric"),
                            delta=tool_args.get("delta", ""),
                        )

                        await asyncio.sleep(1.7)

                        yield SSEChunkData(
                            id=kpi_id,
                            event="data",
                            type="kpi",
                            data=kpi_data,
                        )
                        messages.append(
                            ToolMessage(
                                tool_call_id=tool_id,
                                content="KPI widget rendered successfully.",
                            )
                        )
                        continue

                    if tool_name == "ShowTable":
                        print(f"Rendering table with args: {tool_args}")  # Debug log
                        table_id = str(uuid.uuid4())
                        yield SSEChunkIncoming(
                            id=table_id,
                            event="incoming",
                            type="table",
                        )

                        table_data = TableData(
                            title=tool_args.get("title", "Table Data"),
                            columns=tool_args.get("columns", []),
                            rows=tool_args.get("rows", []),
                        )

                        await asyncio.sleep(1.7)

                        yield SSEChunkData(
                            id=table_id,
                            event="data",
                            type="table",
                            data=table_data,
                        )

                        messages.append(
                            ToolMessage(
                                tool_call_id=tool_id,
                                content="Table widget rendered successfully.",
                            )
                        )
                        continue

                    if tool_name == "ShowQuestion":
                        try:
                            question_data = QuestionData.model_validate(tool_args)
                        except ValidationError as error:
                            messages.append(
                                ToolMessage(
                                    tool_call_id=tool_id,
                                    content=(
                                        "ShowQuestion payload invalid. "
                                        "You must send title, prompt, "
                                        "and exactly 3 options. "
                                        f"Validation details: {error}"
                                    ),
                                )
                            )
                            continue

                        question_id = str(uuid.uuid4())
                        yield SSEChunkIncoming(
                            id=question_id,
                            event="incoming",
                            type="question",
                        )
                        await asyncio.sleep(1.7)
                        yield SSEChunkData(
                            id=question_id,
                            event="data",
                            type="question",
                            data=question_data,
                        )

                        messages.append(
                            ToolMessage(
                                tool_call_id=tool_id,
                                content=(
                                    "Question widget rendered successfully "
                                    "with exactly 3 options."
                                ),
                            )
                        )
                        continue

                    if tool_name == "ShowCode":
                        try:
                            code_data = CodeData.model_validate(tool_args)
                        except ValidationError as error:
                            messages.append(
                                ToolMessage(
                                    tool_call_id=tool_id,
                                    content=(
                                        "ShowCode payload invalid. "
                                        "You must send title, language "
                                        "(sql/postgresql/mysql), and code. "
                                        f"Validation details: {error}"
                                    ),
                                )
                            )
                            continue

                        code_id = str(uuid.uuid4())
                        yield SSEChunkIncoming(
                            id=code_id,
                            event="incoming",
                            type="code",
                        )
                        await asyncio.sleep(1.7)
                        yield SSEChunkData(
                            id=code_id,
                            event="data",
                            type="code",
                            data=code_data,
                        )

                        messages.append(
                            ToolMessage(
                                tool_call_id=tool_id,
                                content="Code widget rendered successfully.",
                            )
                        )

                # Tools were executed. Continue so the AI can evaluate ToolMessages.
                continue

            # Break because final text (if any) was already emitted.
            break

    def _build_history(self, history: list[ChatMessage]) -> list[BaseMessage]:
        now = datetime.now().strftime("%Y-%m-%d")
        dynamic_system_prompt = EXECUTIVE_ASSISTANT_PROMPT.replace("%now%", now)

        messages: list[BaseMessage] = [SystemMessage(content=dynamic_system_prompt)]

        for msg in history:
            if msg.role == "user":
                messages.append(HumanMessage(content=msg.data.text))
                continue

            if msg.type == "text":
                messages.append(AIMessage(content=msg.data.text))
            elif msg.type == "kpi":
                content = (
                    "[System Note: Displayed KPI Widget to user -> "
                    f"Label: '{msg.data.label}', Value: '{msg.data.value}', "
                    f"Delta: '{msg.data.delta}']"
                )
                messages.append(AIMessage(content=content))
            elif msg.type == "table":
                rows_json = json.dumps(msg.data.rows, ensure_ascii=False)
                content = (
                    "[System Note: Displayed Table Widget to user -> "
                    f"Columns: {msg.data.columns}. "
                    f"Data: {rows_json}]"
                )
                messages.append(AIMessage(content=content))
            elif msg.type == "question":
                options_json = json.dumps(
                    [option.model_dump() for option in msg.data.options],
                    ensure_ascii=False,
                )
                content = (
                    "[System Note: Displayed Question Widget to user -> "
                    f"Title: '{msg.data.title}', Prompt: '{msg.data.prompt}', "
                    f"Options: {options_json}, Hint: '{msg.data.hint}']"
                )
                messages.append(AIMessage(content=content))
            elif msg.type == "code":
                content = (
                    "[System Note: Displayed Code Widget to user -> "
                    f"Title: '{msg.data.title}', Language: '{msg.data.language}', "
                    f"Code: {msg.data.code}]"
                )
                messages.append(AIMessage(content=content))
            else:
                content = (
                    f"[System Note: Displayed {msg.type} widget with data: "
                    f"{msg.data.model_dump_json()}]"
                )
                messages.append(AIMessage(content=content))

        return messages
