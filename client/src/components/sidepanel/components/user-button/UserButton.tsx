import { useState } from 'react'
import { useUser, useClerk } from '@clerk/react'
import { SidePanelItemButton } from '../SidePanelItemButton'
import { AuxPanelWrapper } from '../AuxPanelWrapper'

export const UserButton = () => {
  const { user, isSignedIn } = useUser()
  const { openUserProfile, signOut } = useClerk()
  const [panelOpen, setPanelOpen] = useState(false)

  const [anchorRect, setAnchorRect] = useState<DOMRect | undefined>()

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!panelOpen) {
      setAnchorRect(e.currentTarget.getBoundingClientRect())
    }
    setPanelOpen((v) => !v)
  }

  const handleClosePanel = () => setPanelOpen(false)

  if (!isSignedIn || !user) return null

  return (
    <>
      <SidePanelItemButton
        title={
          user.fullName || user.primaryEmailAddress?.emailAddress || 'User'
        }
        onClick={handleButtonClick}
        style={{ padding: 0 }}
      >
        <img
          src={user.imageUrl}
          alt="User avatar"
          className="size-8 rounded-full border border-zinc-700 object-cover"
        />
      </SidePanelItemButton>

      <AuxPanelWrapper
        isOpen={panelOpen}
        anchorRect={anchorRect}
        onMouseEnter={() => {}}
        onMouseLeave={handleClosePanel}
        minHeight={180}
      >
        <header className="flex items-center gap-3 border-b border-zinc-800/80 px-4 py-3">
          <img
            src={user.imageUrl}
            alt="User avatar"
            className="size-10 rounded-full border border-zinc-700 object-cover"
          />
          <div className="min-w-0 space-y-1">
            <h3 className="line-clamp-2 text-sm font-medium text-zinc-100">
              {user.fullName || user.primaryEmailAddress?.emailAddress}
            </h3>
            <p className="text-[10px] tracking-[0.14em] text-zinc-500 uppercase">
              {user.primaryEmailAddress?.emailAddress}
            </p>
          </div>
        </header>
        <div className="flex flex-1 flex-col justify-end">
          <div className="flex flex-col gap-2 p-3">
            <button
              type="button"
              className="flex w-full cursor-pointer items-center gap-2 rounded-lg border border-zinc-700/80 bg-zinc-900/50 px-3 py-2 text-xs font-medium text-zinc-300 transition-all duration-300 ease-out hover:border-emerald-400/25 hover:bg-emerald-400/8 hover:text-zinc-100 hover:shadow-[0_0_14px_rgba(52,211,153,0.1)] focus-visible:border-emerald-400/25 focus-visible:bg-emerald-400/8 focus-visible:text-zinc-100 focus-visible:shadow-[0_0_14px_rgba(52,211,153,0.1)] focus-visible:outline-none"
              onClick={() => {
                openUserProfile()
                handleClosePanel()
              }}
            >
              Manage account
            </button>
            <button
              type="button"
              className="flex w-full cursor-pointer items-center gap-2 rounded-lg border border-zinc-700/80 bg-zinc-900/50 px-3 py-2 text-xs font-medium text-rose-300 transition-all duration-300 ease-out hover:border-rose-400/55 hover:bg-zinc-900/50 hover:text-rose-200 hover:shadow-[0_0_16px_rgba(244,63,94,0.3),inset_0_0_0_1px_rgba(225,29,72,0.22)] focus-visible:outline-none"
              onClick={() => {
                signOut()
                handleClosePanel()
              }}
            >
              Sign out
            </button>
          </div>
        </div>
      </AuxPanelWrapper>
    </>
  )
}
