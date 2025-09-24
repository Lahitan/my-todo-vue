import { ref, onMounted, computed } from 'vue';

interface UserInfo {
  id: string | null;
  name: string | null;
}

export default function useUserInfo() {
  const initialUserId = localStorage.getItem('userId');
  const initialUserName = localStorage.getItem('userName');

  const userInfo = ref<UserInfo>({
    id: initialUserId,
    name: initialUserName,
  });

  onMounted(() => {
    // Only generate userId or prompt for userName if they don't exist
    if (!userInfo.value.id) {
      const newUserId = crypto.randomUUID();
      localStorage.setItem('userId', newUserId);
      userInfo.value.id = newUserId;
      console.log('useUserInfo: Generated new userId:', newUserId);
    }

    if (!userInfo.value.name) {
      const newUserName = prompt('What is your name?') || '';
      localStorage.setItem('userName', newUserName);
      userInfo.value.name = newUserName;
      console.log('useUserInfo: Set new userName:', newUserName);
    }

    console.log(
      'useUserInfo: Final userInfo.value (onMounted):',
      userInfo.value
    );
  });

  const id = computed(() => {
    console.log('useUserInfo: Computed id:', userInfo.value.id);
    return userInfo.value.id;
  });
  const name = computed(() => {
    console.log('useUserInfo: Computed name:', userInfo.value.name);
    return userInfo.value.name;
  });

  return { id, name };
}
