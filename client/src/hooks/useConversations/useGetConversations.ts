import { useAuth } from '@clerk/react'
import { useQuery } from '@tanstack/react-query'
import { getConversationsByDatabaseId } from '../../services/dbService'
import type { ConversationRecord } from '../../types/database'

export const CONVERSATIONS_QUERY_KEY = ['conversations'] as const

export const getConversationsQueryKey = (databaseId: string) =>
  [...CONVERSATIONS_QUERY_KEY, databaseId] as const

export const useGetConversations = (databaseId?: string) => {
  const { getToken } = useAuth()

  const query = useQuery<ConversationRecord[]>({
    queryKey: getConversationsQueryKey(databaseId ?? ''),
    queryFn: async () => {
      if (!databaseId) return Promise.resolve([])
      const token = (await getToken()) ?? undefined
      return getConversationsByDatabaseId(databaseId, token)
    },
    enabled: Boolean(databaseId),
    // Keep cached conversations fresh for the entire app session.
    // This prevents refetches when the aux panel re-mounts on hover.
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })

  return {
    conversations: query.data,
    ...query,
  }
}
