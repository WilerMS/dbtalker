import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateDatabase } from '../../services/dbService'
import type { UpdateDatabaseInput } from '../../types/database'
import { DATABASES_QUERY_KEY } from './useGetDatabases'

interface UpdateDatabaseVariables {
  id: string
  input: UpdateDatabaseInput
}

export const useUpdateDatabase = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, input }: UpdateDatabaseVariables) =>
      updateDatabase(id, input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: DATABASES_QUERY_KEY })
    },
  })
}
