from typing import Literal, Union

from pydantic import BaseModel, Field


class TextData(BaseModel):
    text: str


class SchemaColumn(BaseModel):
    name: str
    type: str
    model_config = {"populate_by_name": True}
    is_primary_key: bool | None = Field(None, alias="isPrimaryKey")


class SchemaNodeData(BaseModel):
    label: str
    columns: list[SchemaColumn]


class SchemaNode(BaseModel):
    id: str
    position: dict[str, float]
    data: SchemaNodeData


class SchemaEdge(BaseModel):
    id: str
    source: str
    target: str
    label: str | None = None


class SchemaData(BaseModel):
    title: str
    nodes: list[SchemaNode]
    edges: list[SchemaEdge]


class KpiData(BaseModel):
    value: str | float | int
    label: str
    delta: str | None = None


class BarData(BaseModel):
    labels: list[str]
    values: list[float | int]
    title: str | None = None


class LinePoint(BaseModel):
    x: str
    y: float | int


class LineData(BaseModel):
    points: list[LinePoint]
    title: str | None = None


class TableRow(BaseModel):
    class Config:
        extra = "allow"

    pass


class TableData(BaseModel):
    title: str
    columns: list[str]
    rows: list[dict[str, str | float | int]]


CodeLanguage = Literal["sql", "postgresql", "mysql"]


class CodeData(BaseModel):
    title: str
    language: CodeLanguage
    code: str
    description: str | None = None


class QuestionOption(BaseModel):
    id: str
    label: str
    description: str | None = None


class QuestionData(BaseModel):
    title: str
    prompt: str
    options: list[QuestionOption] = Field(min_length=1, max_length=3)
    hint: str | None = None


# --- Message Data Union ---
MessageData = Union[
    TextData,
    SchemaData,
    KpiData,
    BarData,
    LineData,
    TableData,
    CodeData,
    QuestionData,
]
