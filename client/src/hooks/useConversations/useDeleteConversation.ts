import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteConversation } from '../../services/dbService'
import { getConversationsQueryKey } from './useGetConversations'

interface DeleteConversationMutationInput {
  databaseId: string
  conversationId: string
}

export const useDeleteConversation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      databaseId,
      conversationId,
    }: DeleteConversationMutationInput) => {
      return deleteConversation(databaseId, conversationId)
    },
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({
        queryKey: getConversationsQueryKey(variables.databaseId),
      })
    },
  })
}
