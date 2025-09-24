export function getLocalTodos() {
  return JSON.parse(localStorage.getItem('localTodos') || '[]');
}

export function saveLocalTodos(todos: any[]) {
  localStorage.setItem('localTodos', JSON.stringify(todos));
}

export function deletLocalTodo(id: string) {
  const todos = getLocalTodos();
  const updated = todos.filter((todo: any) => todo.id !== id);
  saveLocalTodos(updated);
}

export function updateLocalTodo(updatedTodo: any) {
  const todos = getLocalTodos();
  const updatedTodos = todos.map((todo: any) =>
    String(todo.id) === String(updatedTodo.id) ? updatedTodo : todo
  );
  saveLocalTodos(updatedTodos);
}
