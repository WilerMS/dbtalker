import { useQuery } from '@tanstack/react-query'
import { getConversationsByDatabaseId } from '../../services/dbService'
import type { ConversationRecord } from '../../types/database'

export const CONVERSATIONS_QUERY_KEY = ['conversations'] as const

export const getConversationsQueryKey = (databaseId: string) =>
  [...CONVERSATIONS_QUERY_KEY, databaseId] as const

export const useGetConversations = (databaseId?: string) => {
  const query = useQuery<ConversationRecord[]>({
    queryKey: getConversationsQueryKey(databaseId ?? ''),
    queryFn: () => {
      if (!databaseId) {
        return Promise.resolve([])
      }

      return getConversationsByDatabaseId(databaseId)
    },
    enabled: Boolean(databaseId),
  })

  return {
    conversations: query.data,
    isLoadingConversations: query.isLoading,
    isErrorConversations: query.isError,
    refetchConversations: query.refetch,
  }
}
