import type { JSX } from 'react'
import { Outlet } from 'react-router-dom'

import { SidePanel } from '../sidepanel/SidePanel'

export const AppLayout = (): JSX.Element => {
  return (
    <div className="relative flex h-screen overflow-hidden text-zinc-100">
      <SidePanel />
      <main className="min-h-0 flex-1">
        <Outlet />
      </main>
    </div>
  )
}
