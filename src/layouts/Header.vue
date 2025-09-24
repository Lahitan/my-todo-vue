<template>
  <header class="bg-white shadow-md p-4">
    <div
      class="container mx-auto flex items-center justify-center w-5/6 rounded-3xl border border-gray-300 p-1 shadow-lg bg-[#FBF9F9] gap-1"
    >
      <img :src="logo" alt="logo" class="w-7 h-6 object-cover rounded-md" />
      <p class="font-agbalumo text-gray-400 font-extrathin md:text-xl">
        My To-do App
      </p>
    </div>
  </header>
</template>

<script setup>
import logo from '/td-logo.svg';
</script>

<style scoped>
/* Add any specific styles here if needed */
</style>
