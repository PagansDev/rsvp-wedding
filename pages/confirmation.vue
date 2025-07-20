<template>
    <div class="flex justify-center items-center min-h-screen p-4">
        <div class="relative w-full max-w-md flex flex-col items-center px-4 py-10 bg-white/50 rounded-lg shadow-lg">
            <!-- Título -->
            <h2 class="!text-2xl font-bold text-brand-400 mt-2 mb-6">Obrigado!</h2>
            <!-- Mensagem principal -->
            <h1 class="!text-2xl font-bold !text-brand-900 text-center mb-4">Sua confirmação foi<br>recebida</h1>
            <!-- Texto explicativo -->
            <p class="text-brand-800 text-center mb-2 text-sm">Estamos muito felizes em saber que você estará conosco
                neste dia especial. Sua presença é muito importante para nós!</p>
            <p class="text-brand-800 text-center mb-8 text-sm">Se você quiser nos ajudar a construir nosso futuro, pode
                contribuir com nossa lista de presentes ou fazer uma contribuição para nossa nova jornada.</p>
            <!-- Botões -->
            <div class="w-full flex flex-col gap-4">
                <NuxtLink to="/gift"
                    class="block w-full text-center py-3 rounded-lg font-bold bg-brand-400 !text-brand-900 hover:bg-brand-300 transition-colors">
                    Lista de Presentes</NuxtLink>
                <NuxtLink to="/donate"
                    class="block w-full text-center py-3 rounded-lg font-bold bg-brand-200 text-brand-800 hover:bg-brand-100 transition-colors">
                    Contribuição
                </NuxtLink>
            </div>
        </div>
    </div>
</template>

<script setup>
definePageMeta({
    layout: 'texture'
})
</script>

<style scoped>
/**** Nenhum estilo extra necessário, tudo via Tailwind e main.css ****/
</style>