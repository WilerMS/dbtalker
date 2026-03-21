import type { JSX } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import type { DatabaseRecord } from '../types/database'
import { useChat } from '../hooks/useChat'
import { AppLayout } from '../components/layout/AppLayout'

interface DatabaseRouteProps {
  databases: DatabaseRecord[]
}

export const DatabaseRoute = ({
  databases,
}: DatabaseRouteProps): JSX.Element => {
  const navigate = useNavigate()
  const { id_db } = useParams<{ id_db: string }>()
  const fallbackDatabaseId = databases[0].id

  const hasMatchingDatabase = databases.some(
    (database) => database.id === id_db,
  )
  const selectedDatabaseId =
    hasMatchingDatabase && id_db ? id_db : fallbackDatabaseId
  const chat = useChat(selectedDatabaseId)

  if (!hasMatchingDatabase || !id_db) {
    return <Navigate to={`/${fallbackDatabaseId}`} replace />
  }

  return (
    <AppLayout
      {...chat}
      databases={databases}
      selectedDatabaseId={selectedDatabaseId}
      onSelectDatabase={(databaseId) => {
        navigate(`/${databaseId}`)
      }}
    />
  )
}
