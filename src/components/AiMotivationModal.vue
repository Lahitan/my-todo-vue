<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
  >
    <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold">AI Summary & Motivation</h2>
        <button @click="closeModal" class="text-gray-500 hover:text-gray-700">
          &times;
        </button>
      </div>

      <div v-if="isLoading" class="text-center text-gray-500">
        Loading motivation...
      </div>
      <div v-else-if="error" class="text-red-500">
        Error: {{ error.message }}
      </div>
      <div v-else>
        <p class="text-gray-700 whitespace-pre-wrap">{{ motivationText }}</p>
      </div>

      <div class="flex justify-end mt-4">
        <button
          @click="closeModal"
          class="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits(['update:isOpen']);

const isLoading = ref(false);
const error = ref<Error | null>(null);
const motivationText = ref(
  'This is a placeholder for your AI-generated summary and motivation. Please add your AI API key and integrate with a service like OpenAI or Google Gemini.'
);

const closeModal = () => {
  emit('update:isOpen', false);
};

const fetchMotivation = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    // TODO: Replace with actual AI API call
    // Example using a placeholder:
    await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API delay
    motivationText.value =
      'This app helps you organize tasks and boost productivity. Stay focused on your goals, one todo at a time!';
    // Placeholder for actual AI API call integration
    const API_KEY = import.meta.env.VITE_GEMINI_API_KEY; // Replace with your actual Gemini API Key (e.g., from .env file)
    console.log('AiMotivationModal: API_KEY value:', API_KEY);
    if (!API_KEY) {
      throw new Error('Gemini API Key is not configured.');
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: 'Summarize a todo application and provide a short, motivating quote about productivity. Keep it concise, around 100 words.',
                },
              ],
            },
          ],
          generationConfig: {
            maxOutputTokens: 150,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error?.message || 'Failed to fetch AI motivation'
      );
    }

    const data = await response.json();
    motivationText.value = data.candidates[0].content.parts[0].text;
  } catch (e: any) {
    error.value = e;
  } finally {
    isLoading.value = false;
  }
};

watch(
  () => props.isOpen,
  (newVal) => {
    if (newVal) {
      fetchMotivation();
    }
  }
);
</script>

<style scoped>
/* Add any specific styles here if needed */
</style>
