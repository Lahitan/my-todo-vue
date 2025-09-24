import { ref, onMounted } from 'vue';

export default function useUserId() {
  const userId = ref<string | null>(null);

  onMounted(() => {
    let storedId = localStorage.getItem('userId');
    if (!storedId) {
      storedId = crypto.randomUUID();
      localStorage.setItem('userId', storedId);
    }
    userId.value = storedId;
  });

  return userId;
}
