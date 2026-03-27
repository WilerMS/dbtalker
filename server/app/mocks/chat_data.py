from __future__ import annotations

from app.models.database import (
    BarData,
    CodeData,
    KpiData,
    LineData,
    LinePoint,
    MessageData,
    MessageType,
    QuestionData,
    QuestionOption,
    SchemaColumn,
    SchemaData,
    SchemaEdge,
    SchemaNode,
    SchemaNodeData,
    TableData,
)

_WIDGET_INTRO_TEXTS: dict[str, str] = {
    "schema": (
        "A continuación te muestro el esquema completo de tu base de datos. "
        "He analizado su estructura y he identificado todas las tablas, columnas, tipos de datos y relaciones entre entidades. "
        "Puedes explorar visualmente cómo se conectan las tablas a través de claves foráneas, "
        "lo que te ayudará a entender el modelo de datos antes de lanzar cualquier consulta. "
    ),
    "kpi": (
        "Aquí tienes el KPI de ingresos mensuales extraído directamente de tu base de datos. "
        "El valor actual refleja un crecimiento del +12.4 % respecto al periodo anterior, "
        "lo que representa una tendencia positiva y sostenida para el negocio. "
        "Este indicador se calcula agregando las transacciones completadas del mes en curso "
        "y comparándolas con el mismo periodo del mes anterior. "
    ),
    "bar": (
        "Este gráfico de barras muestra el volumen de solicitudes procesadas agrupadas por servicio. "
        "Puedes identificar rápidamente cuáles son los servicios con mayor carga operativa "
        "y detectar posibles cuellos de botella en tu arquitectura. "
        "Los datos se han agregado sobre el último intervalo de tiempo registrado en la base de datos. "
    ),
    "line": (
        "La siguiente gráfica de líneas representa la evolución de usuarios activos a lo largo de la semana. "
        "Se aprecia un crecimiento sostenido desde el lunes hasta el domingo, "
        "con un repunte especialmente notable a partir del jueves. "
        "Este tipo de análisis temporal permite detectar patrones de uso, "
        "identificar los días de mayor actividad y anticipar picos de carga futuros. "
    ),
    "table": (
        "Aquí tienes la tabla de estado de salud de los servicios de tu infraestructura. "
        "Incluye la latencia actual en milisegundos y el estado operativo de cada servicio, "
        "lo que te permite detectar de un vistazo cuáles están funcionando correctamente "
        "y cuáles presentan degradación de rendimiento. "
        "Los servicios marcados como 'degraded' requieren atención prioritaria, "
        "ya que su latencia supera los umbrales aceptables definidos para el sistema."
    ),
    "code": (
        "Generé el snippet SQL correspondiente a tu consulta. "
        "Puedes revisarlo, copiarlo y adaptarlo para ejecutar exactamente el análisis que quieres. "
        "Incluye joins, filtros y agregaciones listos para usarse en tu base de datos."
    ),
    "question": (
        "Antes de continuar, necesito una pequeña aclaración para ajustar mejor el análisis. "
        "Elige una de las opciones y continuaré con el siguiente paso automáticamente."
    ),
}

SCHEMA_PREVIEW_DATA = SchemaData(
    title="Database Schema",
    nodes=[
        SchemaNode(
            id="users",
            position={"x": 40, "y": 190},
            data=SchemaNodeData(
                label="users",
                columns=[
                    SchemaColumn(name="id", type="uuid", isPrimaryKey=True),
                    SchemaColumn(name="email", type="varchar", isPrimaryKey=False),
                    SchemaColumn(name="created_at", type="timestamp", isPrimaryKey=False),
                ],
            ),
        ),
        SchemaNode(
            id="orders",
            position={"x": 380, "y": 80},
            data=SchemaNodeData(
                label="orders",
                columns=[
                    SchemaColumn(name="id", type="uuid", isPrimaryKey=True),
                    SchemaColumn(name="user_id", type="uuid", isPrimaryKey=False),
                    SchemaColumn(name="total", type="numeric", isPrimaryKey=False),
                ],
            ),
        ),
        SchemaNode(
            id="sessions",
            position={"x": 380, "y": 300},
            data=SchemaNodeData(
                label="sessions",
                columns=[
                    SchemaColumn(name="id", type="uuid", isPrimaryKey=True),
                    SchemaColumn(name="user_id", type="uuid", isPrimaryKey=False),
                    SchemaColumn(
                        name="last_seen_at", type="timestamp", isPrimaryKey=False
                    ),
                ],
            ),
        ),
        SchemaNode(
            id="order_items",
            position={"x": 730, "y": 78},
            data=SchemaNodeData(
                label="order_items",
                columns=[
                    SchemaColumn(name="id", type="uuid", isPrimaryKey=True),
                    SchemaColumn(name="order_id", type="uuid", isPrimaryKey=False),
                    SchemaColumn(name="product_id", type="uuid", isPrimaryKey=False),
                    SchemaColumn(name="qty", type="int", isPrimaryKey=False),
                ],
            ),
        ),
        SchemaNode(
            id="products",
            position={"x": 1060, "y": 78},
            data=SchemaNodeData(
                label="products",
                columns=[
                    SchemaColumn(name="id", type="uuid", isPrimaryKey=True),
                    SchemaColumn(name="sku", type="varchar", isPrimaryKey=False),
                    SchemaColumn(name="price", type="numeric", isPrimaryKey=False),
                    SchemaColumn(name="inventory", type="int", isPrimaryKey=False),
                ],
            ),
        ),
        SchemaNode(
            id="payments",
            position={"x": 730, "y": 275},
            data=SchemaNodeData(
                label="payments",
                columns=[
                    SchemaColumn(name="id", type="uuid", isPrimaryKey=True),
                    SchemaColumn(name="order_id", type="uuid", isPrimaryKey=False),
                    SchemaColumn(name="provider", type="varchar", isPrimaryKey=False),
                    SchemaColumn(name="status", type="varchar", isPrimaryKey=False),
                ],
            ),
        ),
        SchemaNode(
            id="invoices",
            position={"x": 1060, "y": 275},
            data=SchemaNodeData(
                label="invoices",
                columns=[
                    SchemaColumn(name="id", type="uuid", isPrimaryKey=True),
                    SchemaColumn(name="payment_id", type="uuid", isPrimaryKey=False),
                    SchemaColumn(name="issued_at", type="timestamp", isPrimaryKey=False),
                    SchemaColumn(name="currency", type="char(3)", isPrimaryKey=False),
                ],
            ),
        ),
        SchemaNode(
            id="shipments",
            position={"x": 730, "y": 472},
            data=SchemaNodeData(
                label="shipments",
                columns=[
                    SchemaColumn(name="id", type="uuid", isPrimaryKey=True),
                    SchemaColumn(name="order_id", type="uuid", isPrimaryKey=False),
                    SchemaColumn(name="carrier", type="varchar", isPrimaryKey=False),
                    SchemaColumn(
                        name="delivered_at", type="timestamp", isPrimaryKey=False
                    ),
                ],
            ),
        ),
        SchemaNode(
            id="addresses",
            position={"x": 380, "y": 490},
            data=SchemaNodeData(
                label="addresses",
                columns=[
                    SchemaColumn(name="id", type="uuid", isPrimaryKey=True),
                    SchemaColumn(name="user_id", type="uuid", isPrimaryKey=False),
                    SchemaColumn(name="city", type="varchar", isPrimaryKey=False),
                    SchemaColumn(name="country", type="varchar", isPrimaryKey=False),
                ],
            ),
        ),
    ],
    edges=[
        SchemaEdge(id="users-orders", source="users", target="orders", label="1:n"),
        SchemaEdge(id="users-sessions", source="users", target="sessions", label="1:n"),
        SchemaEdge(id="users-addresses", source="users", target="addresses", label="1:n"),
        SchemaEdge(id="orders-items", source="orders", target="order_items", label="1:n"),
        SchemaEdge(
            id="products-items", source="products", target="order_items", label="1:n"
        ),
        SchemaEdge(id="orders-payments", source="orders", target="payments", label="1:n"),
        SchemaEdge(
            id="payments-invoices", source="payments", target="invoices", label="1:1"
        ),
        SchemaEdge(
            id="orders-shipments", source="orders", target="shipments", label="1:n"
        ),
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

CODE_PREVIEW_DATA = CodeData(
    title="SQL generado",
    language="sql",
    description="Consulta para obtener ingresos semanales y variacion vs semana anterior.",
    code=(
        "WITH weekly_revenue AS (\n"
        "  SELECT\n"
        "    date_trunc('week', paid_at) AS week_start,\n"
        "    SUM(total_amount) AS revenue\n"
        "  FROM orders\n"
        "  WHERE status = 'paid'\n"
        "  GROUP BY 1\n"
        "), ranked AS (\n"
        "  SELECT\n"
        "    week_start,\n"
        "    revenue,\n"
        "    LAG(revenue) OVER (ORDER BY week_start) AS prev_revenue\n"
        "  FROM weekly_revenue\n"
        ")\n"
        "SELECT\n"
        "  week_start,\n"
        "  revenue,\n"
        "  ROUND(((revenue - prev_revenue) / NULLIF(prev_revenue, 0)) * 100, 2) AS wow_delta_pct\n"
        "FROM ranked\n"
        "ORDER BY week_start DESC\n"
        "LIMIT 8;"
    ),
)

QUESTION_PREVIEW_DATA = QuestionData(
    title="Necesito una confirmación",
    prompt="¿Qué enfoque quieres que priorice para la siguiente respuesta?",
    options=[
        QuestionOption(
            id="focus-speed",
            label="Priorizar rapidez",
            description="Entrego un resumen ejecutivo con los hallazgos más importantes.",
        ),
        QuestionOption(
            id="focus-detail",
            label="Priorizar detalle",
            description="Incluyo breakdown por tabla, supuestos y explicación técnica.",
        ),
        QuestionOption(
            id="focus-sql",
            label="Priorizar SQL",
            description="Genero consulta lista para ejecutar junto con una breve interpretación.",
        ),
    ],
    hint="Puedes cambiar de opción en cualquier momento.",
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
    if "sql" in q or "query" in q or "consulta" in q or "snippet" in q:
        return "code"
    if "question" in q or "pregunta" in q:
        return "question"

    return None


def generate_text_for_widget(widget_type: MessageType | None, database_id: str) -> str:
    if widget_type:
        return _WIDGET_INTRO_TEXTS.get(
            widget_type,
            "Aquí tienes el resultado de tu consulta.",
        )

    return (
        f"Base de datos '{database_id}' lista. "
        "Puedes pedirme cosas como: "
        '"muéstrame el schema", "enséñame un KPI", "quiero un gráfico de barras", '
        '"muéstrame la tendencia", "dame una tabla" o "genera la consulta SQL".'
    )


_ALL_WIDGET_LABELS = (
    "schema (esquema), KPI (métricas clave), bar (barras), line (tendencia), "
    "table (tabla), code (snippet SQL) y question (preguntas guiadas)"
)


def generate_closing_text(shown_widget_type: MessageType) -> str:
    other_labels = {
        "schema": "KPI, bar, line, table, code y question",
        "kpi": "schema, bar, line, table, code y question",
        "bar": "schema, KPI, line, table, code y question",
        "line": "schema, KPI, bar, table, code y question",
        "table": "schema, KPI, bar, line, code y question",
        "code": "schema, KPI, bar, line, table y question",
        "question": "schema, KPI, bar, line, table y code",
    }
    others = other_labels.get(shown_widget_type, _ALL_WIDGET_LABELS)
    return (
        f"¿Te ha resultado útil? Esto es solo una muestra de lo que puedo hacer por ti. "
        f"Además de este widget, también soy capaz de generar: {others}. "
        "Cada visualización se adapta automáticamente a los datos de tu base de datos, "
        "sin necesidad de escribir una sola línea de SQL. "
        "Puedes combinar varias consultas en la misma conversación: por ejemplo, "
        "pídeme primero el esquema para entender la estructura, luego un KPI para ver métricas clave, "
        "y finalmente una tabla o gráfico para explorar los datos en detalle. "
        "Solo escribe lo que necesitas en lenguaje natural y lo genero al instante."
    )


def get_widget_data_by_type(widget_type: MessageType) -> MessageData:
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
    elif widget_type == "code":
        return CODE_PREVIEW_DATA
    elif widget_type == "question":
        return QUESTION_PREVIEW_DATA
    else:
        raise ValueError(f"Unknown widget type: {widget_type}")
