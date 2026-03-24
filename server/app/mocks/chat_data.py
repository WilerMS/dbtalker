from __future__ import annotations

from datetime import datetime

from app.models.database import (
    BarData,
    CompleteMessage,
    KpiData,
    LineData,
    LinePoint,
    MessageData,
    MessageType,
    SchemaColumn,
    SchemaData,
    SchemaEdge,
    SchemaNode,
    SchemaNodeData,
    TableData,
    TextData,
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
        return _WIDGET_INTRO_TEXTS.get(
            widget_type,
            "Aquí tienes el resultado de tu consulta.",
        )

    return (
        f"Base de datos '{database_id}' lista. "
        "Puedes pedirme cosas como: "
        '"muéstrame el schema", "enséñame un KPI", "quiero un gráfico de barras", '
        '"muéstrame la tendencia" o "dame una tabla".'
    )


_ALL_WIDGET_LABELS = (
    "schema (esquema), KPI (métricas clave), bar (barras), line (tendencia) y table (tabla)"
)


def generate_closing_text(shown_widget_type: MessageType) -> str:
    other_labels = {
        "schema": "KPI, bar, line y table",
        "kpi": "schema, bar, line y table",
        "bar": "schema, KPI, line y table",
        "line": "schema, KPI, bar y table",
        "table": "schema, KPI, bar y line",
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


_WELCOME_MESSAGES: dict[str, str] = {
    "db-postgres": (
        "¡Bienvenido a tu base de datos PostgreSQL! 🚀 "
        "Estoy listo para ayudarte a explorar tus datos operacionales de comercio. "
        "Prueba los diferentes tipos de widgets que puedo generar para ti: "
        'escribe "schema" para ver el diagrama de tablas y relaciones, '
        '"KPI" para obtener métricas clave de negocio, '
        '"bar" para un gráfico de barras, '
        '"tendencia" para una gráfica de líneas con evolución temporal, '
        'o "tabla" para explorar filas de datos directamente. '
        "Solo escríbelo en lenguaje natural — sin SQL."
    ),
    "db-mongodb": (
        "¡Bienvenido a tu base de datos MongoDB! "
        "Esta instancia contiene streams de eventos y registros de auditoría. "
        "Puedes testear todos los widgets disponibles: "
        'pídeme el "schema" para visualizar la estructura de tus colecciones, '
        '"KPI" para ver métricas de volumen de eventos, '
        '"bar" para comparar categorías, '
        '"line" para ver tendencias a lo largo del tiempo, '
        'o "table" para inspeccionar registros individuales. '
        "Combínalos en la misma conversación para un análisis completo."
    ),
    "db-sqlite": (
        "¡Bienvenido a tu snapshot local de analytics en SQLite! "
        "Este entorno es ideal para explorar los widgets de DBTalkie. "
        "Empieza por donde quieras: "
        '"schema" te muestra el modelo de datos, '
        '"KPI" te da un indicador clave al instante, '
        '"bar" o "line" generan gráficos automáticamente, '
        'y "tabla" lista los datos en formato tabular. '
        "No necesitas escribir SQL — solo descríbeme lo que quieres ver."
    ),
}

_DEFAULT_WELCOME_MESSAGE = (
    "¡Bienvenido a DBTalkie! "
    "Puedo generar diferentes tipos de visualizaciones a partir de tus datos. "
    'Prueba pidiendo un "schema", un "KPI", un gráfico de "barras", '
    'una "tendencia" o una "tabla" — todo en lenguaje natural, sin SQL.'
)


def get_welcome_message(database_id: str) -> str:
    return _WELCOME_MESSAGES.get(database_id, _DEFAULT_WELCOME_MESSAGE)


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
    else:
        raise ValueError(f"Unknown widget type: {widget_type}")


# ---------------------------------------------------------------------------
# Per-conversation message store
# ---------------------------------------------------------------------------

_messages_by_conversation: dict[str, list[CompleteMessage]] = {
    "conv-db-postgres-overview": [
        CompleteMessage(
            id="msg-postgres-overview-bot-1",
            role="bot",
            type="text",
            status="complete",
            data=TextData(
                text=(
                    "¡Bienvenido a la conversación de resumen de PostgreSQL! "
                    "Aquí puedes explorar el esquema, métricas clave y tendencias "
                    "de tu base de datos operacional de comercio."
                )
            ),
            timestamp=datetime(2026, 1, 15, 10, 0, 0),
        ),
        CompleteMessage(
            id="msg-postgres-overview-user-1",
            role="user",
            type="text",
            status="complete",
            data=TextData(text="Dame un resumen general del schema"),
            timestamp=datetime(2026, 1, 15, 10, 1, 0),
        ),
        CompleteMessage(
            id="msg-postgres-overview-bot-2",
            role="bot",
            type="text",
            status="complete",
            data=TextData(
                text=(
                    "A continuación te muestro el esquema completo de tu base de datos. "
                    "He identificado 9 tablas principales: users, orders, sessions, "
                    "order_items, products, payments, invoices, shipments y addresses, "
                    "todas conectadas a través de claves foráneas."
                )
            ),
            timestamp=datetime(2026, 1, 15, 10, 1, 5),
        ),
    ],
    "conv-db-postgres-weekly-kpi": [
        CompleteMessage(
            id="msg-postgres-kpi-bot-1",
            role="bot",
            type="text",
            status="complete",
            data=TextData(
                text=(
                    "Conversación de KPIs semanales. Aquí puedes consultar los "
                    "indicadores clave de rendimiento de tu base PostgreSQL."
                )
            ),
            timestamp=datetime(2026, 1, 16, 14, 0, 0),
        ),
        CompleteMessage(
            id="msg-postgres-kpi-user-1",
            role="user",
            type="text",
            status="complete",
            data=TextData(text="¿Cuáles son los ingresos de esta semana?"),
            timestamp=datetime(2026, 1, 16, 14, 1, 0),
        ),
        CompleteMessage(
            id="msg-postgres-kpi-bot-2",
            role="bot",
            type="text",
            status="complete",
            data=TextData(
                text=(
                    "Aquí tienes el KPI de ingresos mensuales extraído directamente "
                    "de tu base de datos. El valor actual refleja un crecimiento del "
                    "+12.4 % respecto al periodo anterior."
                )
            ),
            timestamp=datetime(2026, 1, 16, 14, 1, 8),
        ),
    ],
    "conv-db-postgres-schema-check": [
        CompleteMessage(
            id="msg-postgres-schema-bot-1",
            role="bot",
            type="text",
            status="complete",
            data=TextData(
                text=(
                    "Conversación de revisión de esquema y relaciones. "
                    "Puedo analizar tu modelo de datos, detectar posibles inconsistencias "
                    "y explicar las relaciones entre tablas."
                )
            ),
            timestamp=datetime(2026, 1, 17, 9, 0, 0),
        ),
        CompleteMessage(
            id="msg-postgres-schema-user-1",
            role="user",
            type="text",
            status="complete",
            data=TextData(text="Muéstrame las relaciones entre orders y payments"),
            timestamp=datetime(2026, 1, 17, 9, 1, 0),
        ),
        CompleteMessage(
            id="msg-postgres-schema-bot-2",
            role="bot",
            type="text",
            status="complete",
            data=TextData(
                text=(
                    "La tabla orders tiene una relación 1:n con payments (un pedido puede "
                    "tener múltiples intentos de pago), y payments tiene una relación 1:1 "
                    "con invoices (cada pago genera exactamente una factura)."
                )
            ),
            timestamp=datetime(2026, 1, 17, 9, 1, 12),
        ),
    ],
    "conv-db-postgres-sales-breakdown": [
        CompleteMessage(
            id="msg-postgres-sales-bot-1",
            role="bot",
            type="text",
            status="complete",
            data=TextData(
                text=(
                    "Análisis de ventas por categoría. Aquí exploraremos el desglose "
                    "de ventas usando gráficos de barras y tablas detalladas."
                )
            ),
            timestamp=datetime(2026, 1, 18, 15, 30, 0),
        ),
        CompleteMessage(
            id="msg-postgres-sales-user-1",
            role="user",
            type="text",
            status="complete",
            data=TextData(text="Dame un gráfico de barras de ventas por servicio"),
            timestamp=datetime(2026, 1, 18, 15, 31, 0),
        ),
        CompleteMessage(
            id="msg-postgres-sales-bot-2",
            role="bot",
            type="text",
            status="complete",
            data=TextData(
                text=(
                    "Este gráfico de barras muestra el volumen de solicitudes procesadas "
                    "agrupadas por servicio: Auth (72), Orders (93), Billing (51), "
                    "Search (68) y Sync (84)."
                )
            ),
            timestamp=datetime(2026, 1, 18, 15, 31, 10),
        ),
    ],
    "conv-db-mongodb-events-overview": [
        CompleteMessage(
            id="msg-mongodb-events-bot-1",
            role="bot",
            type="text",
            status="complete",
            data=TextData(
                text=(
                    "¡Bienvenido a MongoDB! Esta instancia contiene streams de eventos "
                    "y registros de auditoría. Puedo ayudarte a analizar patrones de eventos "
                    "y métricas de volumen."
                )
            ),
            timestamp=datetime(2026, 1, 15, 11, 0, 0),
        ),
        CompleteMessage(
            id="msg-mongodb-events-user-1",
            role="user",
            type="text",
            status="complete",
            data=TextData(text="¿Cuántos eventos se han registrado esta semana?"),
            timestamp=datetime(2026, 1, 15, 11, 1, 0),
        ),
        CompleteMessage(
            id="msg-mongodb-events-bot-2",
            role="bot",
            type="text",
            status="complete",
            data=TextData(
                text=(
                    "La siguiente gráfica de líneas representa la evolución de usuarios "
                    "activos (eventos procesados) a lo largo de la semana. Se aprecia "
                    "un crecimiento sostenido con un pico notable el jueves."
                )
            ),
            timestamp=datetime(2026, 1, 15, 11, 1, 9),
        ),
    ],
    "conv-db-mongodb-audit-analysis": [
        CompleteMessage(
            id="msg-mongodb-audit-bot-1",
            role="bot",
            type="text",
            status="complete",
            data=TextData(
                text=(
                    "Análisis de auditoría y seguridad. Aquí revisaremos los registros "
                    "de acceso, cambios de configuración y alertas de seguridad."
                )
            ),
            timestamp=datetime(2026, 1, 16, 16, 0, 0),
        ),
        CompleteMessage(
            id="msg-mongodb-audit-user-1",
            role="user",
            type="text",
            status="complete",
            data=TextData(text="Dame una tabla con el estado de los servicios"),
            timestamp=datetime(2026, 1, 16, 16, 1, 0),
        ),
        CompleteMessage(
            id="msg-mongodb-audit-bot-2",
            role="bot",
            type="text",
            status="complete",
            data=TextData(
                text=(
                    "Aquí tienes la tabla de estado de salud de tus servicios. "
                    "analytics-worker y search-api presentan degradación con latencias "
                    "de 242ms y 310ms respectivamente — requieren atención prioritaria."
                )
            ),
            timestamp=datetime(2026, 1, 16, 16, 1, 15),
        ),
    ],
    "conv-db-mongodb-performance-check": [
        CompleteMessage(
            id="msg-mongodb-perf-bot-1",
            role="bot",
            type="text",
            status="complete",
            data=TextData(
                text=(
                    "Conversación de rendimiento y optimización. Aquí analizaremos "
                    "tiempos de respuesta, índices y cuellos de botella en MongoDB."
                )
            ),
            timestamp=datetime(2026, 1, 17, 10, 30, 0),
        ),
        CompleteMessage(
            id="msg-mongodb-perf-user-1",
            role="user",
            type="text",
            status="complete",
            data=TextData(text="Muéstrame las métricas de rendimiento clave"),
            timestamp=datetime(2026, 1, 17, 10, 31, 0),
        ),
        CompleteMessage(
            id="msg-mongodb-perf-bot-2",
            role="bot",
            type="text",
            status="complete",
            data=TextData(
                text=(
                    "Ingresos mensuales: 2.48M (+12.4%). Este KPI refleja el volumen "
                    "de operaciones procesadas. La tendencia es positiva y los tiempos "
                    "de lectura están dentro de los umbrales aceptables."
                )
            ),
            timestamp=datetime(2026, 1, 17, 10, 31, 11),
        ),
    ],
    "conv-db-sqlite-snapshot-overview": [
        CompleteMessage(
            id="msg-sqlite-snapshot-bot-1",
            role="bot",
            type="text",
            status="complete",
            data=TextData(
                text=(
                    "¡Bienvenido al snapshot local de analytics en SQLite! "
                    "Este entorno es ideal para explorar datos históricos y generar "
                    "visualizaciones rápidas sin necesidad de escribir SQL."
                )
            ),
            timestamp=datetime(2026, 1, 15, 12, 0, 0),
        ),
        CompleteMessage(
            id="msg-sqlite-snapshot-user-1",
            role="user",
            type="text",
            status="complete",
            data=TextData(text="¿Qué tablas hay disponibles en este snapshot?"),
            timestamp=datetime(2026, 1, 15, 12, 1, 0),
        ),
        CompleteMessage(
            id="msg-sqlite-snapshot-bot-2",
            role="bot",
            type="text",
            status="complete",
            data=TextData(
                text=(
                    "El snapshot contiene las mismas 9 tablas del modelo operacional: "
                    "users, orders, sessions, order_items, products, payments, invoices, "
                    "shipments y addresses, con datos hasta la fecha de captura."
                )
            ),
            timestamp=datetime(2026, 1, 15, 12, 1, 8),
        ),
    ],
    "conv-db-sqlite-analytics": [
        CompleteMessage(
            id="msg-sqlite-analytics-bot-1",
            role="bot",
            type="text",
            status="complete",
            data=TextData(
                text=(
                    "Análisis y estadísticas de SQLite. Aquí generaremos gráficos "
                    "y tablas con los datos del snapshot local para identificar tendencias."
                )
            ),
            timestamp=datetime(2026, 1, 17, 11, 0, 0),
        ),
        CompleteMessage(
            id="msg-sqlite-analytics-user-1",
            role="user",
            type="text",
            status="complete",
            data=TextData(text="Dame una tendencia de usuarios activos"),
            timestamp=datetime(2026, 1, 17, 11, 1, 0),
        ),
        CompleteMessage(
            id="msg-sqlite-analytics-bot-2",
            role="bot",
            type="text",
            status="complete",
            data=TextData(
                text=(
                    "La gráfica de líneas muestra usuarios activos de lunes a domingo: "
                    "42 → 48 → 54 → 67 → 65 → 72 → 78. Crecimiento sostenido del 85% "
                    "de lunes a domingo con pico los fines de semana."
                )
            ),
            timestamp=datetime(2026, 1, 17, 11, 1, 13),
        ),
    ],
}


def get_messages_for_conversation(conversation_id: str, database_id: str) -> list[CompleteMessage]:
    """Return messages for a conversation, seeding a welcome message on first access."""
    if conversation_id not in _messages_by_conversation:
        welcome_text = get_welcome_message(database_id)
        _messages_by_conversation[conversation_id] = [
            CompleteMessage(
                id=f"welcome-{conversation_id}",
                role="bot",
                type="text",
                status="complete",
                data=TextData(text=welcome_text),
                timestamp=datetime.now(),
            )
        ]
    return _messages_by_conversation[conversation_id].copy()


def append_message_to_conversation(conversation_id: str, message: CompleteMessage) -> None:
    """Append a message to a conversation's history."""
    if conversation_id not in _messages_by_conversation:
        _messages_by_conversation[conversation_id] = []
    _messages_by_conversation[conversation_id].append(message)
