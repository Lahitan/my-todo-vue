<script setup>
import Header from './Header.vue';
import Hero from './Hero.vue';
import Footer from './Footer.vue';
// useNavigate is not directly translated to a Vue equivalent in the layout itself
// If needed, useRouter from 'vue-router' could be used in child components for navigation
</script>

<template>
  <div className="min-h-screen bg-[#FBF9F9] font-poppins flex flex-col">
    <!-- Header Component -->
    <Header />

    <!-- Hero Section -->
    <Hero />

    <main className="container mx-auto p-4 flex-grow">
      <router-view />
    </main>

    <!-- Footer Component -->
    <Footer />
  </div>
</template>

<style scoped>
/* Add any specific styles here if needed */
</style>
