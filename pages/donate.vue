<template>
    <div class="flex flex-col items-center justify-center min-h-dvh p-6">
        <div class="bg-white/70 rounded-xl shadow-lg p-8 max-w-md w-full flex flex-col items-center gap-6">
            <h1 class="text-2xl font-bold text-brand-600 text-center">Doação</h1>
            <p class="text-brand-500 text-center text-base">Se você deseja nos ajudar com uma doação, clique no botão
                abaixo para acessar nossa página de contribuição no Mercado Pago. Toda ajuda é muito bem-vinda e
                agradecemos de coração!</p>
            <a href="https://link.mercadopago.com.br/isaepaulo" target="_blank" rel="noopener noreferrer"
                class="block w-full text-center py-3 rounded-lg font-bold bg-brand-400 text-brand-900 hover:bg-brand-300 transition-colors text-lg mt-2">
                Fazer Doação
            </a>
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'texture',
})
</script>
