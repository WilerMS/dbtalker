import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createDatabase } from '../../services/dbService'
import type { CreateDatabaseInput } from '../../types/database'
import { DATABASES_QUERY_KEY } from './useGetDatabases'

export const useCreateDatabase = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateDatabaseInput) => createDatabase(input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: DATABASES_QUERY_KEY })
    },
  })
}
