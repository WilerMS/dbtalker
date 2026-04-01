from pydantic import BaseModel, Field

from app.schemas.widgets import CodeLanguage


class ShowKPI(BaseModel):
    """
    Tool to render a single, high-impact Key Performance Indicator (KPI) widget in the UI.
    USE THIS WHEN the user asks for a specific metric, a total, or a high-level summary
    (e.g., 'What is the total revenue?', 'How many active users do we have?').
    DO NOT use this tool if the user asks for a list, a breakdown, or time-series data.
    """

    value: str = Field(
        description=(
            "The primary numeric value formatted for human readability. "
            "You MUST use standard abbreviations for large numbers (e.g., '2.4M' for millions, '150K' for thousands). "
            "Always include relevant symbols like currency or percentages (e.g., '$2.4M', '42%')."
        )
    )
    label: str = Field(
        description=(
            "A concise, descriptive title for the metric. "
            "Strictly keep it under 5 words (e.g., 'Monthly Recurring Revenue', 'Total Active Users')."
        )
    )
    delta: str = Field(
        description=(
            "The period-over-period change percentage. "
            "It MUST strictly follow this format: sign, number, and '%' symbol (e.g., '+12.5%', '-4.2%', '0%'). "
            "Return an exact empty string ('') ONLY if no historical data is available for comparison."
        )
    )


class ShowTable(BaseModel):
    """
    CRITICAL: YOU MUST USE THIS TOOL TO DISPLAY ANY TABULAR DATA, LISTS, OR MULTIPLE RECORDS.
    YOU MUST PROVIDE 'title', 'columns', AND 'rows'. DO NOT LEAVE 'rows' EMPTY.
    """

    title: str = Field(
        description="A short, descriptive title for the table (e.g., 'Latest Transactions')."
    )
    columns: list[str] = Field(
        description=(
            "An array of human-readable column headers. "
            "Format in Title Case (e.g., ['Transaction Date', 'Customer Name', 'Total Amount'])."
        )
    )
    rows: list[list[str]] = Field(
        description=(
            "An array of rows, where each row is an array of strings. "
            "CRITICAL: The length of each row array MUST exactly match the length of the 'columns' array. "
            "Ensure numerical values are formatted (e.g., '€250.00'). Use '-' for missing data."
        )
    )


class ShowBarChart(BaseModel):
    """
    Use this tool to render grouped or categorical comparisons as a bar chart.
    """

    title: str | None = Field(
        default=None,
        description=(
            "Optional chart title in the user's language. "
            "If omitted, the UI will use a generic label."
        ),
    )
    labels: list[str] = Field(
        min_length=1,
        description=(
            "Category labels for the x-axis in display order. "
            "Example: ['Enero', 'Febrero', 'Marzo']."
        ),
    )
    values: list[float] = Field(
        min_length=1,
        description=(
            "Numeric values aligned 1:1 with labels. "
            "Length MUST match labels exactly."
        ),
    )


class ShowLinePoint(BaseModel):
    x: str = Field(
        description=(
            "X-axis coordinate label for a single point, usually a date or time bucket."
        )
    )
    y: float = Field(description="Y-axis numeric value for the point.")


class ShowLineChart(BaseModel):
    """
    Use this tool to render trends over time or ordered sequences as a line chart.
    """

    title: str | None = Field(
        default=None,
        description=(
            "Optional chart title in the user's language. "
            "If omitted, the UI will use a generic label."
        ),
    )
    points: list[ShowLinePoint] = Field(
        min_length=2,
        description=(
            "Ordered sequence of points for the trend. "
            "Each point needs x and y. Use chronological order when applicable."
        ),
    )


class ShowQuestionOption(BaseModel):
    id: str = Field(
        description=(
            "A stable option identifier in snake_case or kebab-case "
            "(e.g., 'quick_summary' or 'quick-summary')."
        )
    )
    label: str = Field(
        description=(
            "The visible option text in the user's language. "
            "Keep it short and action-oriented."
        )
    )
    description: str | None = Field(
        default=None,
        description=(
            "Optional secondary helper text for this option in the user's language."
        ),
    )


class ShowQuestion(BaseModel):
    """
    Use this tool when you need a precise user decision before continuing.
    You MUST provide exactly 3 options.
    """

    title: str = Field(
        description=(
            "A compact title for the question card in the user's language "
            "(e.g., 'Necesito una aclaración')."
        )
    )
    prompt: str = Field(
        description=(
            "The question text shown to the user. "
            "It must be specific and decision-oriented."
        )
    )
    options: list[ShowQuestionOption] = Field(
        min_length=3,
        max_length=3,
        description=(
            "Exactly 3 answer choices. They must be clearly distinct and "
            "written in the user's language."
        ),
    )
    hint: str | None = Field(
        default=None,
        description="Optional hint shown below the options in the user's language.",
    )


class ShowCode(BaseModel):
    """
    Use this tool to render a SQL preview card for complex or high-risk queries.
    """

    title: str = Field(
        description=(
            "Short title for the code widget in the user's language "
            "(e.g., 'Consulta SQL propuesta')."
        )
    )
    language: CodeLanguage = Field(
        description="SQL dialect for syntax highlighting: sql, postgresql, or mysql."
    )
    code: str = Field(
        description=(
            "The SQL query text to show. It must be executable and aligned with the user goal."
        )
    )
    description: str | None = Field(
        default=None,
        description=(
            "Optional short explanation about what the query does, in the user's language."
        ),
    )


class QueryDatabaseInput(BaseModel):
    """Input schema for the query_database tool."""

    sql_query: str = Field(
        description=(
            "The raw, fully-formed SQL query to execute against the database. "
            "CRITICAL RULES FOR SQL: "
            "1. Write valid, optimized SQL. "
            "2. If the user asks for a list or table, you MUST include a LIMIT clause (e.g., LIMIT 50) to avoid huge payloads. "
            "3. Use appropriate aggregations (SUM, COUNT, AVG) if the user asks for a KPI or total metric."
        )
    )
