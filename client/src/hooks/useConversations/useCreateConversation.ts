import { useAuth } from '@clerk/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createConversation } from '../../services/dbService'
import type { CreateConversationInput } from '../../types/database'
import { getConversationsQueryKey } from './useGetConversations'

export const useCreateConversation = () => {
  const queryClient = useQueryClient()
  const { getToken } = useAuth()

  const query = useMutation({
    mutationFn: async ({ database_id, title }: CreateConversationInput) => {
      const token = (await getToken()) ?? undefined
      return createConversation(database_id, { title, database_id }, token)
    },
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({
        queryKey: getConversationsQueryKey(variables.database_id),
      })
    },
  })

  return {
    createConversation: query.mutateAsync,
    ...query,
  }
}
