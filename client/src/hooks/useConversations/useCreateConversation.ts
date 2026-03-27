import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createConversation } from '../../services/dbService'
import type { CreateConversationInput } from '../../types/database'
import { getConversationsQueryKey } from './useGetConversations'

export const useCreateConversation = () => {
  const queryClient = useQueryClient()

  const query = useMutation({
    mutationFn: async ({ database_id, title }: CreateConversationInput) => {
      return createConversation(database_id, { title, database_id })
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
