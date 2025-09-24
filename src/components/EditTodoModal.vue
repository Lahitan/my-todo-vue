<script setup>
import { ref, watch } from 'vue';
import { useTodos } from '@/composables/useTodos'; // Assuming useTodos exists and has update functionality

const props = defineProps({
  isOpen: Boolean,
  onClose: Function,
  todo: Object,
  onSave: Function,
});

const name = ref('');
const completed = ref(false);

const { updateTodoMutation, invalidateTodos } = useTodos(); // Destructure updateTodoMutation and invalidateTodos from useTodos

watch(
  () => props.todo,
  (newTodo) => {
    if (newTodo) {
      name.value = newTodo.name || '';
      completed.value = newTodo.status === 'DONE';
    }
  },
  { immediate: true }
);

const handleSubmit = async () => {
  if (!name.value.trim()) return;

  try {
    await updateTodoMutation.mutateAsync({
      id: props.todo.id,
      name: name.value,
      status: completed.value ? 'DONE' : 'PENDING',
    });
    invalidateTodos(); // Invalidate queries after successful update
    props.onClose();
    if (props.onSave) props.onSave();
  } catch (error) {
    alert('Failed to update todo. Please try again.');
  }
};
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
  >
    <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold">Edit Todo</h2>
        <button @click="onClose" class="text-gray-500 hover:text-gray-700">
          &times;
        </button>
      </div>
      <p class="text-gray-600 mb-4">Update the task name and status.</p>

      <div class="space-y-4 mb-4">
        <input
          type="text"
          placeholder="Update todo..."
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
          Save Changes
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Add any specific styles here if needed */
</style>
