import { useAuth } from '@clerk/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteConversation } from '../../services/dbService'
import { getConversationsQueryKey } from './useGetConversations'

interface DeleteConversationMutationInput {
  databaseId: string
  conversationId: string
}

export const useDeleteConversation = () => {
  const queryClient = useQueryClient()
  const { getToken } = useAuth()

  const query = useMutation({
    mutationFn: async ({
      databaseId,
      conversationId,
    }: DeleteConversationMutationInput) => {
      const token = (await getToken()) ?? undefined
      return deleteConversation(databaseId, conversationId, token)
    },
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({
        queryKey: getConversationsQueryKey(variables.databaseId),
      })
    },
  })

  return {
    deleteConversation: query.mutateAsync,
    ...query,
  }
}
