import type { JSX } from 'react'
import {
  Background,
  Controls,
  MarkerType,
  ReactFlow,
  type Edge,
  type Node,
} from 'reactflow'

import { SchemaTableNode } from './SchemaTableNode'
import type { SchemaData, SchemaNodeData } from '../../types/chat'

interface SchemaWidgetProps {
  data: SchemaData
}

const nodeTypes = {
  table: SchemaTableNode,
}

export const SchemaWidget = ({ data }: SchemaWidgetProps): JSX.Element => {
  const nodes: Node<SchemaNodeData>[] = data.nodes.map((node) => ({
    ...node,
    type: 'table',
  }))

  const edges: Edge[] = data.edges.map((edge) => ({
    ...edge,
    animated: true,
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: '#34d399',
    },
    style: {
      stroke: '#34d399',
      strokeWidth: 2,
    },
    labelStyle: {
      fill: '#a1a1aa',
      fontSize: 10,
      textTransform: 'uppercase',
    },
  }))

  return (
    <div className="h-80 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950">
      <ReactFlow
        fitView
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#27272a" gap={20} />
        <Controls className="!border-zinc-800 !bg-zinc-900 !text-zinc-100" />
      </ReactFlow>
    </div>
  )
}
