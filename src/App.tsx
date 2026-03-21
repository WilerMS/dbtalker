import { type JSX } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'

import { DatabaseRoute } from './components/routes/DatabaseRoute'
import { listDatabases } from './services/dbService'
import type { DatabaseRecord } from './types/database'

const App = (): JSX.Element => {
  const { data: databases = [], isLoading: isLoadingDatabases } = useQuery<
    DatabaseRecord[]
  >({
    queryKey: ['databases'],
    queryFn: listDatabases,
  })

  if (isLoadingDatabases) {
    return (
      <div className="grid h-screen place-items-center bg-zinc-950 text-zinc-100">
        <p className="text-xs tracking-[0.2em] text-emerald-300 uppercase">
          Loading Databases
        </p>
      </div>
    )
  }

  if (databases.length === 0) {
    return (
      <div className="grid h-screen place-items-center bg-zinc-950 text-zinc-100">
        <p className="text-xs tracking-[0.2em] text-zinc-400 uppercase">
          No databases registered
        </p>
      </div>
    )
  }

  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to={`/${databases[0].id}`} replace />}
      />
      <Route path="/:id_db" element={<DatabaseRoute databases={databases} />} />
      <Route
        path="*"
        element={<Navigate to={`/${databases[0].id}`} replace />}
      />
    </Routes>
  )
}

export default App
