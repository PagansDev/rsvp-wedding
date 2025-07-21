<template>
    <div class="max-w-2xl mx-auto py-6 px-2 flex flex-col gap-4">
        <h1 class="!text-lg font-bold text-center">Lista de Presentes</h1>

            <div class="flex flex-row gap-2 bg-brand-400 p-4 rounded-lg justify-between shadow-lg">
                <p class="!text-xs !text-brand-50">
                    <strong>Atenção:</strong> Não é necessário nos comprar um presente, você pode nos presentear contribuindo com qualquer valor.
                </p>
                <NuxtLink to="https://link.mercadopago.com.br/isaepaulo" target="_blank"
                    class="bg-white px-4 py-2 rounded-lg text-brand-400 hover:text-brand-300 transition-colors flex items-center gap-2 mx-auto !text-xs">
                    <Icon name="mdi:heart" size="20" />
                    Contribuir
                </NuxtLink>
            </div>

        <!-- Loading state -->
        <div v-if="isLoading" class="text-center py-8">
            <Icon name="mdi:loading" size="40" class="animate-spin text-brand-500 mx-auto mb-2" />
            <p class="text-gray-500">Carregando presentes...</p>
        </div>

        <!-- Error state -->
        <div v-else-if="error" class="text-center py-8">
            <Icon name="mdi:alert-circle" size="40" class="text-rose-500 mx-auto mb-2" />
            <p class="text-rose-600">{{ error }}</p>
        </div>

        <!-- Empty state -->
        <div v-else-if="gifts.length === 0" class="text-gray-400 text-center py-8">
            <Icon name="mdi:gift-outline" size="40" class="mx-auto mb-2" />
            <p>Nenhum presente disponível no momento.</p>
        </div>

        <!-- Gifts grid -->
        <div v-else class="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <GiftCard v-for="gift in gifts" :key="gift.id" :name="gift.name"
                :is-available="gift.is_available && gift.quantity_gifted < gift.quantity" :image-url="gift.image_url"
                :price="gift.price" :payment-u-r-l="gift.payment_url" :quantity="gift.quantity"
                :quantity-gifted="gift.quantity_gifted" />
        </div>
    </div>
</template>

<script setup lang="ts">
import GiftCard from '~/components/GiftCard.vue'
import { useGifts } from '~/composables/useGifts';

const { gifts, isLoading, error, loadGifts } = useGifts();

onMounted(() => {
    loadGifts();
});

definePageMeta({
    layout: 'texture',
})
</script>
