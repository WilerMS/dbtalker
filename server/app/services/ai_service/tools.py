from typing import Any

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
    IF YOU HAVE MULTIPLE ROWS OF DATA FROM THE DATABASE, DO NOT WRITE THEM IN TEXT.
    USE THIS TOOL IMMEDIATELY AFTER RECEIVING THE SQL RESULTS.
    """

    columns: list[str] = Field(
        description=(
            "An array of human-readable column headers. "
            "Format in Title Case and keep them concise (e.g., ['Transaction Date', 'Customer Name', 'Total Amount'])."
        )
    )
    rows: list[dict[str, Any]] = Field(
        description=(
            "An array of JSON objects representing the rows of the table. "
            "CRITICAL: The keys in EACH dictionary MUST exactly match the exact strings defined in the 'columns' array. "
            "Ensure all numerical values are properly formatted (e.g., limiting decimals to 2 places, adding currency symbols). "
            "Handle missing data by providing a null value or the string '-'. "
            "Do NOT include nested objects or arrays inside the row values; use flat primitive types (string, number, boolean)."
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
