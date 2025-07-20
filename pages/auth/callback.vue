<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <div v-if="isLoading" class="mb-4">
        <div class="w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
      </div>

      <div v-if="error" class="mb-4">
        <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="heroicons:exclamation-triangle" class="w-6 h-6 text-red-500" />
        </div>
        <h2 class="text-xl font-semibold text-gray-900 mb-2">Erro na Autenticação</h2>
        <p class="text-gray-600 mb-6">{{ error }}</p>
        <button @click="goToLogin"
          class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
          Voltar ao Login
        </button>
      </div>

      <div v-if="isLoading && !error" class="mb-4">
        <h2 class="text-xl font-semibold text-gray-900 mb-2">Autenticando...</h2>
        <p class="text-gray-600">Aguarde enquanto processamos seu login</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/authStore';
import Swal from 'sweetalert2';

definePageMeta({
  layout: 'texture',
});

const authStore = useAuthStore();
const router = useRouter();

const isLoading = computed(() => authStore.getIsLoading);
const error = computed(() => authStore.getError);

const goToLogin = () => {
  router.push('/login');
};

onMounted(async () => {
  // Capture hash before Vue Router processes it
  const originalHash = window.location.hash;

  try {
    const success = await authStore.handleAuthCallback(originalHash);

    if (success) {
      await router.push('/admin');
    } else {
      const errorMessage = authStore.getError || 'Erro na autenticação';

      await Swal.fire({
        title: 'Acesso Negado',
        text: errorMessage,
        icon: 'error',
        confirmButtonText: 'OK',
        allowOutsideClick: false
      });

      await router.push('/login');
    }
  } catch (err) {
    console.error('Unexpected error:', err);

    await Swal.fire({
      title: 'Erro',
      text: 'Erro inesperado durante a autenticação',
      icon: 'error',
      confirmButtonText: 'OK',
      allowOutsideClick: false
    });

    await router.push('/login');
  }
});
</script>