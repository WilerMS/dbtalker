import { useState, type JSX } from 'react'
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
  isExpanded?: boolean
}

const nodeTypes = {
  table: SchemaTableNode,
}

export const SchemaWidget = ({
  data,
  isExpanded = false,
}: SchemaWidgetProps): JSX.Element => {
  const [isInteractive, setIsInteractive] = useState(false)
  const interactiveEnabled = isExpanded && isInteractive

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
    <div
      className={`overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 ${isExpanded ? 'h-[78vh]' : 'h-80'}`}
    >
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
        nodesDraggable={interactiveEnabled}
        nodesConnectable={interactiveEnabled}
        elementsSelectable={interactiveEnabled}
        panOnDrag={isExpanded ? interactiveEnabled : true}
        zoomOnScroll={interactiveEnabled}
        zoomActivationKeyCode="Control"
        preventScrolling={false}
        zoomOnDoubleClick={interactiveEnabled}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#27272a" gap={20} />
        {isExpanded ? (
          <Controls
            position="top-right"
            showInteractive
            onInteractiveChange={setIsInteractive}
            className="rounded-xl border border-zinc-800 bg-zinc-900/90 text-zinc-200 shadow-[0_0_18px_rgba(52,211,153,0.18)] backdrop-blur-sm"
          />
        ) : null}
      </ReactFlow>
    </div>
  )
}
