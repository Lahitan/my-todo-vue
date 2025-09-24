<script setup>
import { ref, watch } from 'vue';
import { useMutation, useQueryClient } from '@tanstack/vue-query';
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  DialogDescription,
  TransitionRoot,
  TransitionChild,
} from '@headlessui/vue';

const props = defineProps({
  isOpen: { type: Boolean, required: true },
  onClose: { type: Function, required: true },
  todo: { type: Object, required: true },
  onSave: { type: Function },
});

const name = ref('');
const completed = ref(false);
const queryClient = useQueryClient();

// Watch todo prop and update local state
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

const updateTodo = useMutation({
  mutationFn: async (updatedTodo) => {
    const res = await fetch(
      `https://api.oluwasetemi.dev/tasks/${updatedTodo.id}`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: updatedTodo.name,
          status: updatedTodo.status,
        }),
      }
    );
    if (!res.ok) throw new Error('Failed to update todo');
    return res.json();
  },
  onSuccess: (data) => {
    queryClient.invalidateQueries({ queryKey: ['todos'] });
    queryClient.invalidateQueries({ queryKey: ['todo', props.todo.id] });
    props.onClose();
    if (props.onSave) props.onSave(data);
  },
  onError: () => {
    alert('Failed to update todo. Please try again.');
  },
});

const handleSubmit = () => {
  if (!name.value.trim()) return;
  updateTodo.mutate({
    id: props.todo.id,
    name: name.value,
    status: completed.value ? 'DONE' : 'PENDING',
  });
};
</script>

<template>
  <TransitionRoot :show="isOpen" as="template">
    <Dialog as="div" class="relative z-10" @close="onClose">
      <div class="fixed inset-0 bg-black/30" />

      <div class="fixed inset-0 flex items-center justify-center p-4">
        <TransitionChild
          enter="ease-out duration-200"
          enter-from="opacity-0 translate-y-4 scale-95"
          enter-to="opacity-100 translate-y-0 scale-100"
          leave="ease-in duration-150"
          leave-from="opacity-100 translate-y-0 scale-100"
          leave-to="opacity-0 translate-y-4 scale-95"
        >
          <DialogPanel
            class="w-full max-w-md rounded-lg bg-white p-6 shadow-lg"
          >
            <DialogTitle class="text-lg font-semibold">Edit Todo</DialogTitle>
            <DialogDescription class="text-sm text-gray-500">
              Update the task name and status.
            </DialogDescription>

            <div class="space-y-4 mt-4">
              <input
                v-model="name"
                type="text"
                placeholder="Update todo..."
                class="w-full pl-3 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />

              <label class="flex items-center gap-2" for="completed">
                <input id="completed" v-model="completed" type="checkbox" />
                <span class="text-sm text-gray-500">Mark as completed</span>
              </label>
            </div>

            <div class="mt-6 flex justify-end">
              <button
                @click="handleSubmit"
                class="bg-purple-900 text-white px-4 py-2 rounded-md hover:bg-purple-800"
              >
                Save Changes
              </button>
            </div>
          </DialogPanel>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
