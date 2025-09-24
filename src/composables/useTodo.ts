import { useQuery } from '@tanstack/vue-query';
import { fetchTodo } from '@/api/todos';
import type { Ref } from 'vue';
import useUserInfo from '@/composables/useUserInfo'; // Import useUserInfo

export function useTodo(id: Ref<string | undefined>) {
  const { id: userId } = useUserInfo(); // Get userId
  return useQuery({
    queryKey: ['todo', id.value],
    queryFn: async () => {
      try {
        const fetchedTodo = await fetchTodo(
          id.value as string,
          userId.value as string
        );
        return fetchedTodo;
      } catch (e) {
        console.error('useTodo: Error fetching todo:', e);
        throw e;
      }
    },
    enabled: Boolean(id.value) && Boolean(userId.value), // Only enable when both id and userId are present
    // keepPreviousData: true,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    retry: 2,
    retryDelay: 1000,
    // onError: (error: Error) => {
    //   console.error('Error fetching todo:', error);
    // },
  });
}
