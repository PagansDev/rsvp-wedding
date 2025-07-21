<template>
  <div class="flex flex-col items-center gap-4">
    <button @click="handleGoogleLogin" :disabled="isLoading"
      class="flex items-center justify-center gap-3 px-6 py-3 bg-white border-2 border-gray-200 rounded-lg text-base font-medium text-gray-700 cursor-pointer transition-all duration-200 min-w-[240px] min-h-[48px] hover:bg-gray-50 hover:border-gray-300 hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed">
      <div v-if="isLoading" class="flex items-center justify-center">
        <div class="w-5 h-5 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
      <div v-else class="flex items-center gap-3">
        <Icon name="logos:google-icon" class="w-5 h-5" />
        <span>Entrar com Google</span>
      </div>
    </button>

    <div v-if="error" class="text-red-500 text-sm text-center max-w-[240px]">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/authStore';

interface Emits {
  success: [];
  error: [message: string];
}

const emit = defineEmits<Emits>();

const authStore = useAuthStore();

const isLoading = computed(() => authStore.getIsLoading);
const error = computed(() => authStore.getError);

const handleGoogleLogin = async () => {
  const success = await authStore.loginWithGoogle();

  if (success) {
    emit('success');
  } else if (authStore.getError) {
    emit('error', authStore.getError);
  }
};
</script>