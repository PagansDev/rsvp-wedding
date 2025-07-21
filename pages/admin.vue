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

definePageMeta({
  layout: 'clean',
  middleware: ['auth']
});

const authStore = useAuthStore();

const handleLogout = async () => {
  await authStore.logout();
  await navigateTo('/login');
};
</script>