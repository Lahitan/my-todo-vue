<script setup lang="ts">
import { ref, computed } from 'vue';
import { useTodos } from '@/composables/useTodos';
import useUserInfo from '@/composables/useUserInfo';
import TodoModal from '@/components/TodoModal.vue'; // Added back import
import AiMotivationModal from '@/components/AiMotivationModal.vue'; // Import new AI Motivation Modal
import {
  MagnifyingGlassIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from '@heroicons/vue/24/solid';

// state
const page = ref(1);
const limit = ref(10);
const search = ref('');
const filter = ref<'all' | 'completed' | 'pending'>('all');
const isAiModalOpen = ref(false); // State for AI Motivation Modal

// composables
const { data, isLoading, isError, error, refetch } = useTodos(page, limit);
const allTodos = computed(() => data.value?.data || []);
const totalPages = computed(() => data.value?.meta?.totalPages || 1);

console.log('Home.vue: isLoading', isLoading.value);
console.log('Home.vue: isError', isError.value);
console.log('Home.vue: error', error.value);
console.log('Home.vue: allTodos', allTodos.value);

const { id: userId, name: userName } = useUserInfo();
console.log('Home.vue: userId', userId.value);

// change user name
const handleChangeName = () => {
  const newName = window.prompt('Enter your new name:');
  if (newName) {
    localStorage.setItem('userName', newName);
    window.location.reload();
  }
};

// filter todos
const filteredTodos = computed(() => {
  console.log('Home.vue: Filtering todos...');
  const filtered = allTodos.value
    // .filter((todo: any) => {
    //   console.log('Home.vue: Todo owner', todo.owner, 'userId', userId.value);
    //   return todo.owner === userId.value;
    // }) // Access .value from userId
    .filter((todo: any) =>
      todo.name.toLowerCase().includes(search.value.toLowerCase())
    )
    .filter((todo: any) => {
      if (filter.value === 'completed') return todo.status === 'DONE';
      if (filter.value === 'pending') return todo.status !== 'DONE';
      return true;
    });
  console.log('Home.vue: filteredTodos', filtered);
  return filtered;
});

// Check if userId or userName are null/undefined
const isUserLoading = computed(() => !userId.value || !userName.value);
</script>

<template>
  <main class="container mx-auto p-4">
    <!-- Loading user info -->
    <div v-if="isUserLoading">
      <p>Loading user...</p>
    </div>

    <template v-else>
      <!-- Nav -->
      <nav
        class="flex justify-between items-center p-4 text-gray-600 rounded mb-6"
      >
        <div>
          <span class="mr-4 font-agbalumo text-base md:text-2xl">
            Welcome, {{ userName }}
          </span>
        </div>
        <button
          @click="handleChangeName"
          class="text-sm underline cursor-pointer font-poppins hover:text-purple-700 transition"
        >
          Change Name
        </button>
      </nav>

      <!-- Add Todo Modal -->
      <div class="mb-4">
        <TodoModal />
      </div>

      <!-- AI Motivation Button -->
      <div class="mb-4">
        <button
          @click="isAiModalOpen = true"
          class="bg-purple-800 text-white hover:bg-purple-700 cursor-pointer px-4 py-2 rounded-md flex items-center"
        >
          🤍 Get AI Motivation
        </button>
      </div>

      <!-- AI Motivation Modal -->
      <AiMotivationModal
        :isOpen="isAiModalOpen"
        @update:isOpen="isAiModalOpen = $event"
      />

      <!-- Search + Filter -->
      <div
        class="mb-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <!-- Search -->
        <div class="relative w-full max-w-md">
          <MagnifyingGlassIcon
            class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search Todos..."
            v-model="search"
            class="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <!-- Filter Buttons -->
        <div class="flex gap-2">
          <button
            @click="filter = 'all'"
            :class="[
              filter === 'all' ? 'bg-purple-800 text-white' : 'bg-gray-400',
              'px-4 py-2 rounded',
            ]"
          >
            All
          </button>
          <button
            @click="filter = 'completed'"
            :class="[
              filter === 'completed'
                ? 'bg-purple-800 text-white'
                : 'bg-gray-400',
              'px-4 py-2 rounded',
            ]"
          >
            Completed
          </button>
          <button
            @click="filter = 'pending'"
            :class="[
              filter === 'pending' ? 'bg-purple-800 text-white' : 'bg-gray-400',
              'px-4 py-2 rounded',
            ]"
          >
            Pending
          </button>
        </div>
      </div>

      <!-- Error -->
      <p v-if="isError">Error: {{ error?.message }}</p>

      <!-- Loading Skeleton -->
      <div v-if="isLoading" class="container mx-auto p-4">
        <h1 class="text-2xl font-bold mb-4">Todos</h1>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="n in 9"
            :key="n"
            class="p-4 bg-white rounded shadow space-y-2 animate-pulse"
          >
            <div class="h-6 w-3/4 bg-gray-300 rounded"></div>
            <div class="h-4 w-1/2 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>

      <!-- Todos List -->
      <template v-else>
        <p v-if="filteredTodos.length === 0 && search" class="text-gray-500">
          No Todos Found. Try a different search term.
        </p>

        <div
          v-else
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <router-link
            v-for="todo in filteredTodos"
            :key="todo.id"
            :to="`/todos/${todo.id}`"
          >
            <article
              class="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
            >
              <h3 class="text-sm md:text-lg font-semibold text-gray-600">
                {{ todo.name }}
              </h3>
              <p
                class="rounded-2xl w-1/2 md:w-1/3 mt-4 p-3 text-center font-poppins"
                :class="
                  todo.status === 'DONE'
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-gray-200 text-gray-700'
                "
              >
                {{ todo.status === 'DONE' ? 'Completed' : 'Pending' }}
              </p>
            </article>
          </router-link>
        </div>
      </template>

      <!-- Pagination (optional) -->
      <div class="mt-6 flex justify-between items-center">
        <button
          @click="page = Math.max(page - 1, 1)"
          :disabled="page === 1"
          class="px-6 py-2 bg-purple-900 text-white rounded hover:bg-purple-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLeftIcon class="w-4 h-4 inline-block mr-2" /> Prev
        </button>

        <p class="text-sm text-gray-600">Page {{ page }} of {{ totalPages }}</p>

        <button
          @click="page = Math.min(page + 1, totalPages)"
          :disabled="page === totalPages"
          class="px-6 py-2 bg-purple-900 text-white rounded hover:bg-purple-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowRightIcon class="w-4 h-4 inline-block mr-2" /> Next
        </button>
      </div>
    </template>
  </main>
</template>

<style scoped>
/* Add any specific styles here if needed */
</style>
