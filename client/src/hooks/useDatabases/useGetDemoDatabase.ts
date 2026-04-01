import { useQuery } from '@tanstack/react-query'
import type { DatabaseRecord } from '../../types/database'
import { getDemoDatabase } from '../../services/dbService'

export const DATABASES_QUERY_KEY = ['databases'] as const

export const useGetDemoDatabase = () => {
  const query = useQuery<DatabaseRecord | null>({
    queryKey: [],
    queryFn: async () => {
      return await getDemoDatabase()
    },
  })

  return {
    database: query.data,
    ...query,
  }
}
