import type {
  BarData,
  KpiData,
  LineData,
  Message,
  MessageData,
  MessageType,
  PreviewWidgetType,
  SchemaData,
  TableData,
  TextData,
} from '../types/chat'

const waitForLatency = async (): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 800))
}

const loremIpsumPreviewText =
  'El esquema de su base de datos incluye tablas para usuarios, órdenes, productos, pagos y envíos, con relaciones claras entre ellas. Por ejemplo, la tabla de órdenes se relaciona con usuarios a través de user_id y con productos a través de order_items. Esto permite consultas complejas para obtener insights valiosos sobre el comportamiento de los clientes y el rendimiento del negocio.'

const schemaPreviewData: SchemaData = {
  title: 'Database Schema',
  nodes: [
    {
      id: 'users',
      position: { x: 40, y: 190 },
      data: {
        label: 'users',
        columns: [
          { name: 'id', type: 'uuid', isPrimaryKey: true },
          { name: 'email', type: 'varchar' },
          { name: 'created_at', type: 'timestamp' },
        ],
      },
    },
    {
      id: 'orders',
      position: { x: 380, y: 80 },
      data: {
        label: 'orders',
        columns: [
          { name: 'id', type: 'uuid', isPrimaryKey: true },
          { name: 'user_id', type: 'uuid' },
          { name: 'total', type: 'numeric' },
        ],
      },
    },
    {
      id: 'sessions',
      position: { x: 380, y: 300 },
      data: {
        label: 'sessions',
        columns: [
          { name: 'id', type: 'uuid', isPrimaryKey: true },
          { name: 'user_id', type: 'uuid' },
          { name: 'last_seen_at', type: 'timestamp' },
        ],
      },
    },
    {
      id: 'order_items',
      position: { x: 730, y: 78 },
      data: {
        label: 'order_items',
        columns: [
          { name: 'id', type: 'uuid', isPrimaryKey: true },
          { name: 'order_id', type: 'uuid' },
          { name: 'product_id', type: 'uuid' },
          { name: 'qty', type: 'int' },
        ],
      },
    },
    {
      id: 'products',
      position: { x: 1060, y: 78 },
      data: {
        label: 'products',
        columns: [
          { name: 'id', type: 'uuid', isPrimaryKey: true },
          { name: 'sku', type: 'varchar' },
          { name: 'price', type: 'numeric' },
          { name: 'inventory', type: 'int' },
        ],
      },
    },
    {
      id: 'payments',
      position: { x: 730, y: 275 },
      data: {
        label: 'payments',
        columns: [
          { name: 'id', type: 'uuid', isPrimaryKey: true },
          { name: 'order_id', type: 'uuid' },
          { name: 'provider', type: 'varchar' },
          { name: 'status', type: 'varchar' },
        ],
      },
    },
    {
      id: 'invoices',
      position: { x: 1060, y: 275 },
      data: {
        label: 'invoices',
        columns: [
          { name: 'id', type: 'uuid', isPrimaryKey: true },
          { name: 'payment_id', type: 'uuid' },
          { name: 'issued_at', type: 'timestamp' },
          { name: 'currency', type: 'char(3)' },
        ],
      },
    },
    {
      id: 'shipments',
      position: { x: 730, y: 472 },
      data: {
        label: 'shipments',
        columns: [
          { name: 'id', type: 'uuid', isPrimaryKey: true },
          { name: 'order_id', type: 'uuid' },
          { name: 'carrier', type: 'varchar' },
          { name: 'delivered_at', type: 'timestamp' },
        ],
      },
    },
    {
      id: 'addresses',
      position: { x: 380, y: 490 },
      data: {
        label: 'addresses',
        columns: [
          { name: 'id', type: 'uuid', isPrimaryKey: true },
          { name: 'user_id', type: 'uuid' },
          { name: 'city', type: 'varchar' },
          { name: 'country', type: 'varchar' },
        ],
      },
    },
  ],
  edges: [
    { id: 'users-orders', source: 'users', target: 'orders', label: '1:n' },
    {
      id: 'users-sessions',
      source: 'users',
      target: 'sessions',
      label: '1:n',
    },
    {
      id: 'users-addresses',
      source: 'users',
      target: 'addresses',
      label: '1:n',
    },
    {
      id: 'orders-items',
      source: 'orders',
      target: 'order_items',
      label: '1:n',
    },
    {
      id: 'products-items',
      source: 'products',
      target: 'order_items',
      label: '1:n',
    },
    {
      id: 'orders-payments',
      source: 'orders',
      target: 'payments',
      label: '1:n',
    },
    {
      id: 'payments-invoices',
      source: 'payments',
      target: 'invoices',
      label: '1:1',
    },
    {
      id: 'orders-shipments',
      source: 'orders',
      target: 'shipments',
      label: '1:n',
    },
    {
      id: 'addresses-shipments',
      source: 'addresses',
      target: 'shipments',
      label: '1:n',
    },
  ],
}

const kpiPreviewData: KpiData = {
  value: '2.48M',
  label: 'Monthly Revenue',
  delta: '+12.4%',
}

const barPreviewData: BarData = {
  title: 'Requests by Service',
  labels: ['Auth', 'Orders', 'Billing', 'Search', 'Sync'],
  values: [72, 93, 51, 68, 84],
}

const linePreviewData: LineData = {
  title: 'Weekly Active Users',
  points: [
    { x: 'Mon', y: 42 },
    { x: 'Tue', y: 48 },
    { x: 'Wed', y: 54 },
    { x: 'Thu', y: 67 },
    { x: 'Fri', y: 65 },
    { x: 'Sat', y: 72 },
    { x: 'Sun', y: 78 },
  ],
}

const tablePreviewData: TableData = {
  columns: ['service', 'status', 'latency_ms'],
  rows: [
    { service: 'auth-api', status: 'healthy', latency_ms: 83 },
    { service: 'orders-api', status: 'healthy', latency_ms: 117 },
    { service: 'analytics-worker', status: 'degraded', latency_ms: 242 },
    { service: 'billing-api', status: 'healthy', latency_ms: 95 },
    { service: 'search-api', status: 'degraded', latency_ms: 310 },
  ],
}

const buildBotMessage = (type: MessageType, data: MessageData): Message => {
  return {
    id: crypto.randomUUID(),
    role: 'bot',
    type,
    data,
    timestamp: new Date(),
  }
}

const buildTextMessage = (text: string): Message => {
  const data: TextData = { text }

  return buildBotMessage('text', data)
}

const buildWidgetMessage = (widgetType: PreviewWidgetType): Message => {
  switch (widgetType) {
    case 'schema':
      return buildBotMessage('schema', schemaPreviewData)
    case 'kpi':
      return buildBotMessage('kpi', kpiPreviewData)
    case 'bar':
      return buildBotMessage('bar', barPreviewData)
    case 'line':
      return buildBotMessage('line', linePreviewData)
    case 'table':
      return buildBotMessage('table', tablePreviewData)
  }
}

export const getInitialMessages = async (
  databaseId: string,
): Promise<Message[]> => {
  await waitForLatency()

  return [
    buildTextMessage(
      `KubePath listo para ${databaseId}. Pide un esquema, una metrica o una tabla y te respondo con un widget en el feed.`,
    ),
    buildWidgetMessage('schema'),
  ]
}

export const getAssistantResponse = async (
  query: string,
  databaseId: string,
): Promise<Message> => {
  await waitForLatency()

  const normalizedQuery = query.toLowerCase()

  if (normalizedQuery.includes('schema') || normalizedQuery.includes('tabla')) {
    return buildWidgetMessage('schema')
  }

  if (
    normalizedQuery.includes('kpi') ||
    normalizedQuery.includes('revenue') ||
    normalizedQuery.includes('ingresos')
  ) {
    return buildWidgetMessage('kpi')
  }

  if (
    normalizedQuery.includes('trend') ||
    normalizedQuery.includes('line') ||
    normalizedQuery.includes('tendencia')
  ) {
    return buildWidgetMessage('line')
  }

  if (
    normalizedQuery.includes('bar') ||
    normalizedQuery.includes('services') ||
    normalizedQuery.includes('servicios')
  ) {
    return buildWidgetMessage('bar')
  }

  if (
    normalizedQuery.includes('table') ||
    normalizedQuery.includes('rows') ||
    normalizedQuery.includes('filas')
  ) {
    return buildWidgetMessage('table')
  }

  return buildTextMessage(
    `Base ${databaseId} lista. Prueba con: "muestrame el schema", "ensename un KPI" o "quiero una tabla".`,
  )
}

export const getPreviewWidget = async (
  widgetType: PreviewWidgetType,
): Promise<Message> => {
  await waitForLatency()

  return buildWidgetMessage(widgetType)
}

export const getPreviewTextMessage = async (): Promise<Message> => {
  await waitForLatency()

  return buildTextMessage(loremIpsumPreviewText)
}
