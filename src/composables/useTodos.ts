import type { Ref } from 'vue';
import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryReturnType,
} from '@tanstack/vue-query';
import { fetchTodos, type PaginatedTodos, type Todo } from '@/api/todos'; // Import Todo interface

interface TodoUpdate {
  id: string;
  name: string;
  status: 'PENDING' | 'DONE';
}

interface TodoCreate {
  name: string;
  description: null;
  start: null;
  end: null;
  duration: null;
  priority: 'LOW';
  status: 'PENDING' | 'DONE' | 'TODO';
  archived: boolean;
  isDefault: null;
  parentId: null;
  children: string;
  owner: string | null;
  tags: null;
  completedAt: null;
}

export function useTodos(page: Ref<number>, limit: Ref<number>) {
  const queryClient = useQueryClient();

  const todosQuery = useQuery<PaginatedTodos, Error>({
    queryKey: ['todos', page, limit],
    queryFn: () => fetchTodos(page.value, limit.value),
    placeholderData: (previousData) => previousData,
  });

  const createTodoMutation = useMutation<any, Error, TodoCreate>({
    mutationFn: (newTodo) =>
      fetch('https://api.oluwasetemi.dev/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTodo),
      }).then((res) => {
        if (!res.ok) throw new Error('Failed to create todo');
        return res.json();
      }),
    onSuccess: (newTodoFromServer) => {
      queryClient.setQueryData<PaginatedTodos>(
        ['todos', page, limit],
        (oldData) => {
          if (!oldData) return oldData;

          // Create a new Todo object from the server response to ensure type compatibility
          const newTodo: Todo = { ...newTodoFromServer };

          // Prepend the new todo to the data array
          const updatedData = [
            newTodo,
            ...oldData.data.slice(0, limit.value - 1), // Keep the list within the limit
          ];

          return {
            ...oldData,
            data: updatedData,
            meta: {
              ...oldData.meta,
              total: oldData.meta.total + 1, // Increment total count
              // Recalculate totalPages if necessary, or let the API handle it on next full fetch
              // For now, simple increment might be enough for a quick visual update
            },
          };
        }
      );
      // Invalidate queries to ensure a full refetch happens eventually for accurate pagination, etc.
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  const updateTodoMutation = useMutation<any, Error, TodoUpdate>({
    mutationFn: (updatedTodo) =>
      fetch(`https://api.oluwasetemi.dev/tasks/${updatedTodo.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: updatedTodo.name,
          status: updatedTodo.status,
        }),
      }).then((res) => {
        if (!res.ok) throw new Error('Failed to update todo');
        return res.json();
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  const invalidateTodos = () => {
    queryClient.invalidateQueries({ queryKey: ['todos'] });
  };

  return {
    ...todosQuery,
    createTodoMutation,
    updateTodoMutation,
    invalidateTodos,
  };
}
