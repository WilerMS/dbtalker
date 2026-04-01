import { useAuth } from '@clerk/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteDatabase } from '../../services/dbService'
import { DATABASES_QUERY_KEY } from './useGetDatabases'

export const useDeleteDatabase = () => {
  const queryClient = useQueryClient()
  const { getToken } = useAuth()

  const query = useMutation({
    mutationFn: async (id: string) => {
      const token = (await getToken()) ?? undefined
      return deleteDatabase(id, token)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: DATABASES_QUERY_KEY })
    },
  })

  return {
    deleteDatabase: query.mutateAsync,
    ...query,
  }
}
