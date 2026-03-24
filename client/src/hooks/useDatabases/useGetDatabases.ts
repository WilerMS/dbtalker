import { useQuery } from '@tanstack/react-query'
import type { DatabaseRecord } from '../../types/database'
import { listDatabases } from '../../services/dbService'

export const DATABASES_QUERY_KEY = ['databases'] as const

export const useGetDatabases = () => {
  return useQuery<DatabaseRecord[]>({
    queryKey: DATABASES_QUERY_KEY,
    queryFn: listDatabases,
  })
}
