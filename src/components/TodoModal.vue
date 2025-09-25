<script setup lang="ts">
import { ref, type Ref } from 'vue';
import { createTodo, type TodoCreate, type Priority } from '@/api/todos';
import useUserInfo from '@/composables/useUserInfo';
import { useQueryClient } from '@tanstack/vue-query';

const emit = defineEmits();

const name = ref('');
const completed = ref(false);
const isOpen = ref(false);

const { id: userId } = useUserInfo();

const queryClient = useQueryClient();

const handleSubmit = async () => {
  if (name.value.trim() === '') return;

  if (!userId.value) {
    alert('User ID is not available. Cannot create todo.');
    return;
  }

  const newTodo: TodoCreate = {
    name: name.value.trim(),
    description: null,
    start: null,
    end: null,
    duration: null,
    priority: 'LOW' as Priority,
    status: completed.value ? 'DONE' : 'TODO',
    archived: false,
    isDefault: null,
    parentId: null,
    children: '',
    owner: userId.value,
    tags: null,
    completedAt: null,
  };

  try {
    await createTodo(newTodo);
    queryClient.invalidateQueries({ queryKey: ['todos'] });
    alert('Todo created! ✅');
    name.value = '';
    completed.value = false;
    isOpen.value = false;
  } catch (error) {
    alert('Failed to create todo. Please try again.');
  }
};
</script>

<template>
  <button
    @click="isOpen = true"
    class="bg-purple-900 text-white hover:bg-purple-800 cursor-pointer px-4 py-2 rounded-md flex items-center"
  >
    <span class="mr-2">+</span>
    Add Todo
  </button>

  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
  >
    <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold">Create a New Todo</h2>
        <button
          @click="isOpen = false"
          class="text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>
      </div>

      <div class="space-y-4 mb-4">
        <input
          type="text"
          placeholder="Enter todo..."
          v-model="name"
          class="w-full pl-4 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        <label class="flex items-center gap-2">
          <input type="checkbox" v-model="completed" class="form-checkbox" />
          <span class="text-sm text-gray-700">Mark as completed</span>
        </label>
      </div>

      <div class="flex justify-end">
        <button
          @click="handleSubmit"
          class="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
        >
          Create
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Add any specific styles here if needed */
</style>
