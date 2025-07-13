<template>
    <NuxtLayout name="default">
        <div class="flex justify-center items-center min-h-screen p-4 bg-cover">
            <div class="w-full max-w-md flex flex-col items-center px-4 py-10 bg-white/50 rounded-lg shadow-lg gap-4">
                <h1 class="text-3xl font-bold text-brand-900 mb-4">Oops! Algo deu errado!</h1>
                <p class="text-brand-800 text-center mb-8 text-sm">
                    Desculpe, não foi possível encontrar a página ou ocorreu um erro inesperado.</p>
                <NuxtLink to="/"
                    class="block w-full text-center py-3 rounded-lg font-bold bg-brand-400 !text-brand-900 hover:bg-brand-300 transition-colors">
                    Voltar para a Home
                </NuxtLink>
                <NuxtLink :to="previousPage"
                    class="block w-full text-center py-3 rounded-lg font-bold bg-brand-200 !text-brand-800 hover:bg-brand-300 transition-colors">
                    Voltar para a Página anterior
                </NuxtLink>
            </div>
        </div>
    </NuxtLayout>
</template>

<script setup>
const previousPage = ref(null);

onMounted(() => {
    previousPage.value = window.history.state.back;
});

defineProps({
    error: {
        type: Object,
        required: true
    }
})

</script>