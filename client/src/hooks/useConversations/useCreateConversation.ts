import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createConversation } from '../../services/dbService'
import type { CreateConversationInput } from '../../types/database'
import { getConversationsQueryKey } from './useGetConversations'

interface CreateConversationMutationInput extends CreateConversationInput {
  databaseId: string
}

export const useCreateConversation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      databaseId,
      ...input
    }: CreateConversationMutationInput) => {
      return createConversation(databaseId, input)
    },
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({
        queryKey: getConversationsQueryKey(variables.databaseId),
      })
    },
  })
}
