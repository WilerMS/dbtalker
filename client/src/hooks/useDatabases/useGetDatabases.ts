import { useQuery } from '@tanstack/react-query'
import type { DatabaseRecord } from '../../types/database'
import { listDatabases } from '../../services/dbService'

export const DATABASES_QUERY_KEY = ['databases'] as const

export const useGetDatabases = () => {
  const query = useQuery<DatabaseRecord[]>({
    queryKey: DATABASES_QUERY_KEY,
    queryFn: listDatabases,
  })

  return {
    databases: query.data,
    ...query,
  }
}
