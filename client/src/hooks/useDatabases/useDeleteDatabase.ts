import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteDatabase } from '../../services/dbService'
import { DATABASES_QUERY_KEY } from './useGetDatabases'

export const useDeleteDatabase = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteDatabase(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: DATABASES_QUERY_KEY })
    },
  })
}
