<template>
    <div class="rounded-xl overflow-hidden bg-white/50 shadow flex flex-col h-full">
        <img :src="imageUrl || fallbackImage" :alt="name" class="w-full h-32 object-cover" />
        <div class="p-3 flex flex-col flex-1 justify-between">
            <div>
                <h2 class="font-semibold text-brand-900 text-base mb-1">{{ name }}</h2>
                <p class="text-sm text-brand-700">R$ {{ price }}</p>
                <p class="text-xs text-brand-700 mt-1">{{ quantityGifted }} / {{ quantity }} presenteado(s)</p>
            </div>
            <a v-if="isAvailable && quantityGifted < quantity" :href="paymentURL" target="_blank"
                class="mt-3 block text-center py-2 rounded-lg font-bold bg-brand-400 text-brand-900 hover:bg-brand-300 transition-colors">Presentear</a>
            <span v-else
                class="mt-3 block text-center py-2 rounded-lg font-bold bg-gray-200 text-gray-400 cursor-not-allowed">Indisponível</span>
        </div>
    </div>
</template>

<script setup lang="ts">

const fallbackImage = '/images/gift-placeholder.png'

defineProps<{
    name: string,
    isAvailable: boolean,
    imageUrl?: string,
    price: string,
    paymentURL: string,
    quantity: number,
    quantityGifted: number
}>()
</script>

<style scoped></style>