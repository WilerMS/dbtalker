from pydantic import BaseModel, Field


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
