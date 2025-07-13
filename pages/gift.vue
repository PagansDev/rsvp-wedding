<template>
    <div class="max-w-2xl mx-auto py-6 px-2 flex flex-col gap-4">
        <h1 class="!text-lg font-bold text-center mb-4">Lista de Presentes</h1>
        <div class="flex flex-col items-center justify-center bg-white/50 shadow-lg rounded-lg p-4 leading-tight">
            <p class="text-center !text-xs mb-6">
                <span class="font-bold">Atenção:</span>
                <span>
                    Não é necessário nos comprar um presente, você pode nos presentear com qualquer valor no link abaixo.
                </span>
            </p>
            <NuxtLink to="https://link.mercadopago.com.br/isaepaulo" target="_blank"
                class="bg-white px-4 py-2 rounded-lg text-brand-400 hover:text-brand-300 transition-colors flex items-center gap-2">
                <Icon name="mdi:heart" size="20" />
                <span class="!text-xs">Doar qualquer valor</span>
            </NuxtLink>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <GiftCard v-for="gift in gifts" :key="gift.name" :name="gift.name" :is-available="gift.isAvailable"
                :image-url="gift.imageUrl" :price="gift.price" :payment-u-r-l="gift.paymentURL" :quantity="gift.quantity"
                :quantity-gifted="gift.quantityGifted" />
        </div>
    </div>
</template>

<script setup lang="ts">
import GiftCard from '~/components/GiftCard.vue'

const gifts = [
    {
        name: 'Varal mágico',
        isAvailable: true,
        imageUrl: 'https://m.media-amazon.com/images/I/514LzAL47NL._AC_UL320_.jpg',
        price: "175,99",
        paymentURL: 'https://mpago.la/2xV3BaN',
        quantity: 2,
        quantityGifted: 0,
    },
    {
        name: 'Edredon',
        isAvailable: true,
        imageUrl: 'https://www.havan.com.br/media/catalog/product/cache/b23e5304d11dff00750c3e92e4b038fa/e/d/edredom-king-100-poliester-plush-provence-havan-casa_1092575.webp',
        price: "299,99",
        paymentURL: '#',
        quantity: 2,
        quantityGifted: 0,
    },
    {
        name: 'Vibrador 30cm PRETO',
        isAvailable: true,
        imageUrl: '',
        price: "199,99",
        paymentURL: '#',
        quantity: 2,
        quantityGifted: 0,
    }
]

definePageMeta({
    layout: 'texture',
})
</script>
