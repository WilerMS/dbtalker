import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createConversation } from '../../services/dbService'
import type { CreateConversationInput } from '../../types/database'
import { getConversationsQueryKey } from './useGetConversations'

export const useCreateConversation = (databaseId?: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: CreateConversationInput) => {
      if (!databaseId) {
        throw new Error('A databaseId is required to create a conversation.')
      }

      return createConversation(databaseId, input)
    },
    onSuccess: async () => {
      if (!databaseId) {
        return
      }

      await queryClient.invalidateQueries({
        queryKey: getConversationsQueryKey(databaseId),
      })
    },
  })
}
