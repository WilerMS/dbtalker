from __future__ import annotations

from app.models.database import (
    BarData,
    KpiData,
    LineData,
    LinePoint,
    MessageType,
    SchemaColumn,
    SchemaData,
    SchemaEdge,
    SchemaNode,
    SchemaNodeData,
    TableData,
)

LOREM_IPSUM_PREVIEW_TEXT = (
    "El esquema de su base de datos incluye tablas para usuarios, órdenes, productos, "
    "pagos y envíos, con relaciones claras entre ellas. Por ejemplo, la tabla de órdenes "
    "se relaciona con usuarios a través de user_id y con productos a través de order_items. "
    "Esto permite consultas complejas para obtener insights valiosos sobre el comportamiento "
    "de los clientes y el rendimiento del negocio."
)

SCHEMA_PREVIEW_DATA = SchemaData(
    title="Database Schema",
    nodes=[
        SchemaNode(
            id="users",
            position={"x": 40, "y": 190},
            data=SchemaNodeData(
                label="users",
                columns=[
                    SchemaColumn(name="id", type="uuid", is_primary_key=True),
                    SchemaColumn(name="email", type="varchar"),
                    SchemaColumn(name="created_at", type="timestamp"),
                ],
            ),
        ),
        SchemaNode(
            id="orders",
            position={"x": 380, "y": 80},
            data=SchemaNodeData(
                label="orders",
                columns=[
                    SchemaColumn(name="id", type="uuid", is_primary_key=True),
                    SchemaColumn(name="user_id", type="uuid"),
                    SchemaColumn(name="total", type="numeric"),
                ],
            ),
        ),
        SchemaNode(
            id="sessions",
            position={"x": 380, "y": 300},
            data=SchemaNodeData(
                label="sessions",
                columns=[
                    SchemaColumn(name="id", type="uuid", is_primary_key=True),
                    SchemaColumn(name="user_id", type="uuid"),
                    SchemaColumn(name="last_seen_at", type="timestamp"),
                ],
            ),
        ),
        SchemaNode(
            id="order_items",
            position={"x": 730, "y": 78},
            data=SchemaNodeData(
                label="order_items",
                columns=[
                    SchemaColumn(name="id", type="uuid", is_primary_key=True),
                    SchemaColumn(name="order_id", type="uuid"),
                    SchemaColumn(name="product_id", type="uuid"),
                    SchemaColumn(name="qty", type="int"),
                ],
            ),
        ),
        SchemaNode(
            id="products",
            position={"x": 1060, "y": 78},
            data=SchemaNodeData(
                label="products",
                columns=[
                    SchemaColumn(name="id", type="uuid", is_primary_key=True),
                    SchemaColumn(name="sku", type="varchar"),
                    SchemaColumn(name="price", type="numeric"),
                    SchemaColumn(name="inventory", type="int"),
                ],
            ),
        ),
        SchemaNode(
            id="payments",
            position={"x": 730, "y": 275},
            data=SchemaNodeData(
                label="payments",
                columns=[
                    SchemaColumn(name="id", type="uuid", is_primary_key=True),
                    SchemaColumn(name="order_id", type="uuid"),
                    SchemaColumn(name="provider", type="varchar"),
                    SchemaColumn(name="status", type="varchar"),
                ],
            ),
        ),
        SchemaNode(
            id="invoices",
            position={"x": 1060, "y": 275},
            data=SchemaNodeData(
                label="invoices",
                columns=[
                    SchemaColumn(name="id", type="uuid", is_primary_key=True),
                    SchemaColumn(name="payment_id", type="uuid"),
                    SchemaColumn(name="issued_at", type="timestamp"),
                    SchemaColumn(name="currency", type="char(3)"),
                ],
            ),
        ),
        SchemaNode(
            id="shipments",
            position={"x": 730, "y": 472},
            data=SchemaNodeData(
                label="shipments",
                columns=[
                    SchemaColumn(name="id", type="uuid", is_primary_key=True),
                    SchemaColumn(name="order_id", type="uuid"),
                    SchemaColumn(name="carrier", type="varchar"),
                    SchemaColumn(name="delivered_at", type="timestamp"),
                ],
            ),
        ),
        SchemaNode(
            id="addresses",
            position={"x": 380, "y": 490},
            data=SchemaNodeData(
                label="addresses",
                columns=[
                    SchemaColumn(name="id", type="uuid", is_primary_key=True),
                    SchemaColumn(name="user_id", type="uuid"),
                    SchemaColumn(name="city", type="varchar"),
                    SchemaColumn(name="country", type="varchar"),
                ],
            ),
        ),
    ],
    edges=[
        SchemaEdge(id="users-orders", source="users", target="orders", label="1:n"),
        SchemaEdge(id="users-sessions", source="users", target="sessions", label="1:n"),
        SchemaEdge(id="users-addresses", source="users", target="addresses", label="1:n"),
        SchemaEdge(id="orders-items", source="orders", target="order_items", label="1:n"),
        SchemaEdge(id="products-items", source="products", target="order_items", label="1:n"),
        SchemaEdge(id="orders-payments", source="orders", target="payments", label="1:n"),
        SchemaEdge(id="payments-invoices", source="payments", target="invoices", label="1:1"),
        SchemaEdge(id="orders-shipments", source="orders", target="shipments", label="1:n"),
        SchemaEdge(
            id="addresses-shipments",
            source="addresses",
            target="shipments",
            label="1:n",
        ),
    ],
)

KPI_PREVIEW_DATA = KpiData(value="2.48M", label="Monthly Revenue", delta="+12.4%")

BAR_PREVIEW_DATA = BarData(
    title="Requests by Service",
    labels=["Auth", "Orders", "Billing", "Search", "Sync"],
    values=[72, 93, 51, 68, 84],
)

LINE_PREVIEW_DATA = LineData(
    title="Weekly Active Users",
    points=[
        LinePoint(x="Mon", y=42),
        LinePoint(x="Tue", y=48),
        LinePoint(x="Wed", y=54),
        LinePoint(x="Thu", y=67),
        LinePoint(x="Fri", y=65),
        LinePoint(x="Sat", y=72),
        LinePoint(x="Sun", y=78),
    ],
)

TABLE_PREVIEW_DATA = TableData(
    title="Service Health",
    columns=["service", "status", "latency_ms"],
    rows=[
        {"service": "auth-api", "status": "healthy", "latency_ms": 83},
        {"service": "orders-api", "status": "healthy", "latency_ms": 117},
        {"service": "analytics-worker", "status": "degraded", "latency_ms": 242},
        {"service": "billing-api", "status": "healthy", "latency_ms": 95},
        {"service": "search-api", "status": "degraded", "latency_ms": 310},
    ],
)


def detect_widget_type(query: str) -> MessageType | None:
    q = query.lower()

    if "schema" in q or "tabla" in q:
        return "schema"
    if "kpi" in q or "revenue" in q or "ingresos" in q:
        return "kpi"
    if "trend" in q or "line" in q or "tendencia" in q:
        return "line"
    if "bar" in q or "services" in q or "servicios" in q:
        return "bar"
    if "table" in q or "rows" in q or "filas" in q:
        return "table"

    return None


def generate_text_for_widget(widget_type: MessageType | None, database_id: str) -> str:
    if widget_type:
        return LOREM_IPSUM_PREVIEW_TEXT

    return (
        f"Base {database_id} lista. Prueba con: "
        '"muestrame el schema", "ensename un KPI" o "quiero una tabla".'
    )


def get_widget_data_by_type(widget_type: MessageType):
    if widget_type == "schema":
        return SCHEMA_PREVIEW_DATA
    elif widget_type == "kpi":
        return KPI_PREVIEW_DATA
    elif widget_type == "bar":
        return BAR_PREVIEW_DATA
    elif widget_type == "line":
        return LINE_PREVIEW_DATA
    elif widget_type == "table":
        return TABLE_PREVIEW_DATA
    else:
        raise ValueError(f"Unknown widget type: {widget_type}")
