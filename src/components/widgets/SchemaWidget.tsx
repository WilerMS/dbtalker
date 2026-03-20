import type { JSX } from 'react'
import {
  Background,
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
  const nodes: Node<SchemaNodeData>[] = data.nodes.map((node, index) => ({
    ...node,
    type: 'table',
    className: 'schema-flow-node',
    style: {
      animationDelay: `${index * 140}ms`,
    },
  }))

  const edges: Edge[] = data.edges.map((edge) => ({
    ...edge,
    type: 'smoothstep',
    animated: true,
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: '#34d399',
    },
    style: {
      stroke: '#34d399',
      strokeWidth: 2.2,
      strokeLinecap: 'round',
    },
    labelStyle: {
      fill: '#d4d4d8',
      fontSize: 10.5,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
    },
    labelBgStyle: {
      fill: '#18181b',
      fillOpacity: 0.9,
      stroke: '#3f3f46',
      strokeWidth: 1,
    },
    labelBgBorderRadius: 6,
    pathOptions: {
      borderRadius: 16,
      offset: 18,
    },
  }))

  return (
    <div className="h-80 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950">
      <ReactFlow
        className="schema-flow"
        fitView
        fitViewOptions={{
          padding: 0.2,
          minZoom: 0.62,
          maxZoom: 1,
        }}
        minZoom={0.55}
        maxZoom={1.25}
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        panOnDrag
        zoomOnScroll={false}
        zoomActivationKeyCode="Control"
        preventScrolling={false}
        zoomOnDoubleClick={false}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#27272a" gap={20} />
      </ReactFlow>
    </div>
  )
}
