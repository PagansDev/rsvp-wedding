<template>
    <div>
        <!-- Estatísticas -->
        <div class="flex gap-3 mb-4">
            <div class="flex-1 p-4 text-center bg-brand-300 rounded-lg shadow-lg border-1 border-brand-600">
                <span class="font-bold text-sm text-brand-50 mb-1">Total de Presentes</span>
                <div class="flex items-center justify-center gap-2">
                    <Icon name="mdi:gift" size="40" class="text-brand-50" />
                    <span class="text-2xl font-bold text-brand-600">{{ gifts.length }}</span>
                </div>
            </div>
            <div class="flex-1 p-4 text-center bg-brand-300 rounded-lg shadow-lg border-1 border-brand-600">
                <span class="font-bold text-sm text-brand-50 mb-1">Recebidos</span>
                <div class="flex items-center justify-center gap-2">
                    <Icon name="mdi:tooltip-check" size="40" class="text-brand-50" />
                    <span class="text-2xl font-bold text-brand-600">{{ receivedCount }}</span>
                </div>
            </div>
        </div>

        <div v-if="gifts.length === 0" class="text-gray-400 text-center py-8">Nenhum presente encontrado.</div>

        <div v-else class="space-y-3">
            <div v-for="gift in gifts" :key="gift.id" class="bg-white rounded-lg shadow p-4">

                <!-- Informações básicas -->
                <div class="flex items-start justify-between mb-3">
                    <div class="flex-1">
                        <h3 class="font-medium text-gray-900">{{ gift.name }}</h3>
                        <p class="text-sm text-gray-600 mt-1">{{ gift.description }}</p>
                        <p class="text-sm font-medium text-brand-600 mt-1">R$ {{ gift.price.toFixed(2) }}</p>
                    </div>

                    <!-- Status badge -->
                    <span :class="getStatusBadgeClass(gift)" class="px-2 py-1 text-xs font-medium rounded-full">
                        {{ getStatusText(gift) }}
                    </span>
                </div>

                <!-- Contadores e progresso -->
                <div class="mb-3">
                    <div class="flex items-center justify-between text-sm text-gray-600 mb-1">
                        <span>Presenteados: {{ gift.quantityGifted }} / {{ gift.quantity }}</span>
                        <span>{{ Math.round((gift.quantityGifted / gift.quantity) * 100) }}%</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                        <div class="bg-brand-500 h-2 rounded-full transition-all duration-300"
                            :style="{ width: (gift.quantityGifted / gift.quantity) * 100 + '%' }"></div>
                    </div>
                </div>

                <!-- Ações -->
                <div class="flex justify-between gap-2">
                    <NuxtLink :to="`/gifts/${gift.id}`"
                        class="flex items-center justify-center text-brand-600 border border-brand-600 px-3 p-2 rounded text-sm font-medium hover:bg-brand-50 transition-colors text-center">
                        <Icon name="mdi:square-edit-outline" size="30" class="inline mr-1" />
                    </NuxtLink>

                    <button v-if="gift.quantityGifted < gift.quantity" @click="markAsReceived(gift)"
                        class="px-3 py-1 bg-green-600 text-white rounded text-sm font-medium hover:bg-green-700 transition-colors">
                        <Icon name="mdi:check" size="14" class="inline mr-1" />
                        Confirmar Recebimento
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
interface Gift {
    id: number;
    name: string;
    description: string;
    price: number;
    imageUrl?: string;
    paymentURL: string;
    quantity: number;
    quantityGifted: number;
    isAvailable: boolean;
}

// Estado dos presentes (simulação - depois integrar com store/composable)
const gifts = ref<Gift[]>([
    {
        id: 1,
        name: 'Panela de Pressão',
        description: 'Panela de pressão 5 litros inox',
        price: 150.00,
        imageUrl: '/images/panela.jpg',
        paymentURL: 'https://pix.example.com/panela',
        quantity: 2,
        quantityGifted: 1,
        isAvailable: true
    },
    {
        id: 2,
        name: 'Jogo de Toalhas',
        description: 'Jogo de toalhas 100% algodão brancas',
        price: 89.90,
        imageUrl: '/images/toalhas.jpg',
        paymentURL: 'https://pix.example.com/toalhas',
        quantity: 3,
        quantityGifted: 3,
        isAvailable: true
    },
    {
        id: 3,
        name: 'Liquidificador',
        description: 'Liquidificador 3 velocidades 1000W',
        price: 199.99,
        imageUrl: '/images/liquidificador.jpg',
        paymentURL: 'https://pix.example.com/liquidificador',
        quantity: 1,
        quantityGifted: 0,
        isAvailable: false
    },
]);

// Computadas para estatísticas
const receivedCount = computed(() =>
    gifts.value.filter(g => g.quantityGifted >= g.quantity).length
);

// Funções de status
function getStatusText(gift: Gift): string {
    if (!gift.isAvailable) return 'Indisponível';
    if (gift.quantityGifted >= gift.quantity) return 'Esgotado';
    return 'Disponível';
}

function getStatusBadgeClass(gift: Gift): string {
    const baseClass = 'px-2 py-1 text-xs font-medium rounded-full';
    if (!gift.isAvailable) return `${baseClass} bg-gray-100 text-gray-600`;
    if (gift.quantityGifted >= gift.quantity) return `${baseClass} bg-red-100 text-red-600`;
    return `${baseClass} bg-green-100 text-green-600`;
}

function markAsReceived(gift: Gift) {
    if (gift.quantityGifted < gift.quantity) {
        gift.quantityGifted++;
    }
}
</script>