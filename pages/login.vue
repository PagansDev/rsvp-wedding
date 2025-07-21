<template>
  <div class="min-h-screen flex items-center justify-center px-4">
    <div class="max-w-md w-full bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Área Administrativa</h1>
        <p class="text-gray-600">Faça login para acessar o painel de controle</p>
      </div>
      
      <GoogleLoginButton 
        @success="handleLoginSuccess"
        @error="handleLoginError"
      />
      
      <div class="mt-6 text-center">
        <p class="text-sm text-gray-500">
          Apenas usuários autorizados podem acessar esta área
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Swal from 'sweetalert2';

definePageMeta({
  layout: 'texture',
  middleware: ['redirect-if-authenticated']
});

const handleLoginSuccess = () => {
  Swal.fire({
    title: 'Sucesso!',
    text: 'Login realizado com sucesso!',
    icon: 'success',
    toast: true,
    position: 'bottom-left',
    showConfirmButton: false,
    timer: 1500
  });
};

const handleLoginError = (errorMessage: string) => {
  Swal.fire({
    title: 'Erro!',
    text: errorMessage,
    icon: 'error',
    toast: true,
    position: 'bottom-left',
    showConfirmButton: false,
    timer: 3000
  });
};
</script>
