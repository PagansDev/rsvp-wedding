<template>
  <div class="flex justify-between items-center p-4 bg-brand-500">
    <h1 class="text-brand-50 !text-lg font-bold">Painel de Controle</h1>
    <button @click="handleLogout" class="text-brand-50 hover:text-brand-100 transition-colors">
      <Icon name="mdi:logout" size="24" />
    </button>
  </div>
  <div class="max-w-md mx-auto p-4 pt-2 pb-10">
    <AdminTabs />
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/authStore';
import Swal from 'sweetalert2';

definePageMeta({
  layout: 'clean',
  middleware: ['auth']
});

const authStore = useAuthStore();
const router = useRouter();

// Check if user is authorized
onMounted(async () => {
  if (!authStore.isUserAuthorized) {
    await Swal.fire({
      title: 'Acesso Negado',
      text: 'Você não tem permissão para acessar esta área',
      icon: 'error',
      confirmButtonText: 'OK',
      allowOutsideClick: false
    });

    await authStore.logout();
    await router.push('/login');
  }
});

const handleLogout = async () => {
  await authStore.logout();
  await navigateTo('/login');
};
</script>