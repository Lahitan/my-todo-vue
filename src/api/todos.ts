// src/api/todos.ts
const BASE_URL = 'https://api.oluwasetemi.dev';

// ✅ Strong typing for a Todo
export interface Todo {
  id: string;
  name: string;
  description?: string | null;
  start?: string | null;
  end?: string | null;
  duration?: string | null;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'TODO' | 'DONE';
  archived?: boolean | null;
  isDefault?: boolean | null;
  parentId?: string | null;
  children?: string | null;
  owner?: string | null;
  tags?: string[] | null;
  completedAt?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface PaginatedTodos {
  data: Todo[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

// ✅ Fetch all todos
export async function fetchTodos(
  page = 1,
  limit = 10
): Promise<PaginatedTodos> {
  const url = `${BASE_URL}/tasks?page=${page}&limit=${limit}`;
  console.log('fetchTodos: Fetching from URL:', url);
  const res = await fetch(url);
  console.log('fetchTodos: Response status:', res.status);
  const data = await res.json();
  console.log('fetchTodos: Response data:', data);
  if (!res.ok) throw new Error(data.message || 'Failed to fetch todos');
  return data;
}

// ✅ Fetch single todo
export async function fetchTodo(id: string, ownerId?: string): Promise<Todo> {
  let url = `${BASE_URL}/tasks/${id}`;
  if (ownerId) {
    url += `?ownerId=${ownerId}`;
  }
  console.log('fetchTodo: Fetching from URL:', url);
  const res = await fetch(url);
  console.log('fetchTodo: Response status:', res.status);
  const data = await res.json();
  console.log('fetchTodo: Response data:', data);
  if (!res.ok) throw new Error(data.message || 'Todo not found');
  return data;
}

// ✅ Create new todo
export async function createTodo(newTodo: Partial<Todo>): Promise<Todo> {
  const res = await fetch(`${BASE_URL}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newTodo),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to create todo');
  }

  return res.json();
}

// ✅ Update todo
export async function updateTodo(
  id: string,
  updatedData: Partial<Todo>
): Promise<Todo> {
  const res = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedData),
  });

  if (!res.ok) throw new Error('Failed to update todo');
  return res.json();
}

// ✅ Delete todo
export async function deleteTodo(id: string): Promise<boolean> {
  const res = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: 'DELETE',
  });

  if (!res.ok) throw new Error('Failed to delete todo');
  return true;
}
