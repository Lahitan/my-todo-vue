<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter, RouterLink } from 'vue-router';
import { useTodo } from '@/composables/useTodo';
import EditTodoModal from '@/components/EditTodoModal.vue';
import { useQueryClient } from '@tanstack/vue-query';
import useUserInfo from '@/composables/useUserInfo';

const route = useRoute();
const router = useRouter();
const queryClient = useQueryClient();

const id = ref(route.params.id);
const isEditing = ref(false);

const { id: userId } = useUserInfo();

console.log('TodoDetails: route.params.id =', route.params.id);
console.log('TodoDetails: id.value (from route) =', id.value);
console.log('TodoDetails: userId.value =', userId.value);

const { data: todo, isLoading, isError, error } = useTodo(id);

const handleDelete = async () => {
  const confirmDelete = window.confirm(
    'Are you sure you want to delete this todo?'
  );
  if (!confirmDelete) return;

  try {
    const response = await fetch(
      `https://api.oluwasetemi.dev/tasks/${id.value}`,
      {
        method: 'DELETE',
      }
    );

    if (!response.ok) {
      throw new Error('Failed to delete todo');
    }
    alert('Todo deleted successfully');
    queryClient.invalidateQueries({ queryKey: ['todos'] });
    router.push('/');
  } catch (err) {
    console.error('Error deleting todo:', err);
    alert('Failed to delete todo. Please try again.');
  }
};

const handleSave = async (updatedTodo) => {
  try {
    const res = await fetch(
      `https://api.oluwasetemi.dev/tasks/${updatedTodo.id}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: updatedTodo.name,
          status: updatedTodo.status,
        }),
      }
    );

    if (!res.ok) {
      throw new Error('Failed to update todo');
    }
    const data = await res.json();
    alert('Todo updated!');
    queryClient.invalidateQueries({ queryKey: ['todo', updatedTodo.id] });
    queryClient.invalidateQueries({ queryKey: ['todos'] });
    isEditing.value = false;
    router.push('/');
  } catch (err) {
    console.error(err);
    alert('Failed to update todo');
  }
};
</script>

<template>
  <main class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4 font-agbalumo">Todo Details</h1>

    <div v-if="isLoading" class="p-4 rounded shadow space-y-3">
      <div class="h-6 w-3/4 bg-gray-200 rounded animate-pulse"></div>
      <div class="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
      <div class="h-4 w-1/4 bg-gray-200 rounded animate-pulse"></div>
      <div class="h-4 w-1/4 bg-gray-200 rounded animate-pulse"></div>
      <div class="mt-4 h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
    </div>

    <div v-else-if="isError" class="text-red-500">
      <p>Error: {{ error?.message || 'Something went wrong.' }}</p>
      <router-link to="/">
        <button
          class="mt-4 bg-purple-900 text-white hover:bg-purple-800 px-4 py-2 rounded"
        >
          ← Back
        </button>
      </router-link>
    </div>

    <div v-else-if="!todo" class="text-gray-500">
      <p>No todo found with ID: {{ id }}</p>
      <router-link to="/">
        <button
          class="mt-4 bg-purple-900 text-white hover:bg-purple-800 px-4 py-2 rounded"
        >
          ← Back
        </button>
      </router-link>
    </div>

    <div v-else class="bg-purple-200 p-4 rounded shadow">
      <h2 class="md:text-xl font-semibold text-gray-600 font-popins">
        {{ todo.name || 'Untitled Todo' }}
      </h2>
      <p class="text-gray-500 font-poppins font-bold">
        {{ todo.status === 'DONE' ? 'Completed' : 'Pending' }}
      </p>

      <div class="flex flex-row gap-2">
        <button
          @click="handleDelete"
          class="mt-4 bg-gray-500 text-white hover:bg-gray-600 font-popins cursor-pointer px-4 py-2 rounded"
        >
          Delete Todo
        </button>

        <button
          @click="isEditing = true"
          class="mt-4 bg-purple-800 text-white hover:bg-purple-700 font-popins cursor-pointer px-4 py-2 rounded"
        >
          Edit Todo
        </button>
      </div>

      <EditTodoModal
        :isOpen="isEditing"
        @onClose="isEditing = false"
        :todo="todo"
        @onSave="handleSave"
      />
    </div>

    <div
      v-if="!isLoading && !isError && todo"
      class="mt-4 flex justify-between"
    >
      <router-link to="/">
        <button
          class="px-6 py-2 bg-purple-900 text-white hover:bg-purple-800 font-popins rounded"
        >
          ← Back
        </button>
      </router-link>
    </div>
  </main>
</template>

<style scoped>
/* Add any specific styles here if needed */
</style>
