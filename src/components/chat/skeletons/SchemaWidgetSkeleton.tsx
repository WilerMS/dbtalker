import type { JSX } from 'react'

interface SchemaWidgetSkeletonProps {
  isExpanded?: boolean
}

const schemaSkeletonNodes = [
  { left: '6%', top: '16%', width: '22%', height: '34%' },
  { left: '34%', top: '10%', width: '20%', height: '32%' },
  { left: '60%', top: '14%', width: '24%', height: '36%' },
  { left: '28%', top: '54%', width: '20%', height: '30%' },
  { left: '58%', top: '58%', width: '22%', height: '28%' },
]

export const SchemaWidgetSkeleton = ({
  isExpanded = false,
}: SchemaWidgetSkeletonProps): JSX.Element => {
  return (
    <div
      className={`flex flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/35 ${isExpanded ? 'h-[78vh]' : 'h-80'}`}
    >
      <div className="shrink-0 px-6 py-4">
        <div className="h-3 w-44 animate-pulse rounded-full bg-zinc-800" />
      </div>

      <div className="relative min-h-0 flex-1 overflow-hidden border-t border-zinc-800/70 bg-[radial-gradient(circle_at_20%_20%,rgba(24,24,27,0.72),transparent_35%),radial-gradient(circle_at_80%_75%,rgba(39,39,42,0.74),transparent_40%)]">
        {schemaSkeletonNodes.map((node, index) => (
          <div
            key={`schema-node-${index}`}
            className="absolute animate-pulse rounded-xl border border-zinc-700/80 bg-zinc-900/85 p-3"
            style={{
              left: node.left,
              top: node.top,
              width: node.width,
              height: node.height,
              animationDelay: `${index * 110}ms`,
            }}
          >
            <div className="h-2 w-16 rounded-full bg-emerald-500/45" />
            <div className="mt-3 h-3 w-2/3 rounded-full bg-zinc-700" />
            <div className="mt-3 space-y-2">
              <div className="h-2 rounded-full bg-zinc-800" />
              <div className="h-2 w-5/6 rounded-full bg-zinc-800" />
              <div className="h-2 w-2/3 rounded-full bg-zinc-800" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
