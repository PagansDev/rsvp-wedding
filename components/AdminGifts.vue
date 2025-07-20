<template>
    <div>
        <!-- Statistics -->
        <div class="flex gap-3 mb-4">
            <div class="flex-1 p-4 text-center bg-brand-300 rounded-lg shadow-lg border-1 border-brand-600">
                <span class="font-bold text-sm text-brand-50 mb-1">Total de Presentes</span>
                <div class="flex items-center justify-center gap-2">
                    <Icon name="mdi:gift" size="40" class="text-brand-50" />
                    <span class="text-2xl font-bold text-brand-600">{{ totalGifts }}</span>
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

        <!-- Add Gift Button -->
        <div class="mb-4">
            <button @click="showAddForm = true"
                class="w-full p-3 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors flex items-center justify-center gap-2">
                <Icon name="mdi:plus" size="20" />
                Adicionar Novo Presente
            </button>
        </div>

        <!-- Add Gift Form -->
        <div v-if="showAddForm" class="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 class="font-semibold text-brand-600 mb-3">Novo Presente</h3>
            <form @submit.prevent="handleAddGift" class="space-y-3">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Nome do Presente *</label>
                    <input v-model="newGift.name" type="text" required
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500" />
                </div>

                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Preço</label>
                        <input v-model="newGift.price" type="text" placeholder="R$ 0,00"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Quantidade</label>
                        <input v-model.number="newGift.quantity" type="number" min="1" required
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500" />
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">URL da Imagem</label>
                    <input v-model="newGift.image_url" type="url" placeholder="https://..."
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500" />
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">URL de Pagamento</label>
                    <input v-model="newGift.payment_url" type="url" placeholder="https://..."
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500" />
                </div>

                <div class="flex gap-2">
                    <button type="submit" :disabled="isLoading"
                        class="flex-1 px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                        <Icon v-if="isLoading" name="mdi:loading" size="16" class="animate-spin mr-2" />
                        {{ isLoading ? 'Salvando...' : 'Salvar Presente' }}
                    </button>
                    <button type="button" @click="cancelAdd"
                        class="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors">
                        Cancelar
                    </button>
                </div>
            </form>
        </div>

        <!-- Loading state -->
        <div v-if="isLoading && !showAddForm" class="text-center py-8">
            <Icon name="mdi:loading" size="40" class="animate-spin text-brand-500 mx-auto mb-2" />
            <p class="text-gray-500">Carregando presentes...</p>
        </div>

        <!-- Error state -->
        <div v-else-if="error" class="text-center py-8">
            <Icon name="mdi:alert-circle" size="40" class="text-rose-500 mx-auto mb-2" />
            <p class="text-rose-600">{{ error }}</p>
            <button @click="loadGifts"
                class="mt-2 px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors">
                Tentar Novamente
            </button>
        </div>

        <!-- Empty state -->
        <div v-else-if="totalGifts === 0" class="text-gray-400 text-center py-8">
            <Icon name="mdi:gift-outline" size="40" class="mx-auto mb-2" />
            <p>Nenhum presente encontrado.</p>
        </div>

        <!-- Gift List -->
        <div v-else class="space-y-3">
            <div v-for="gift in gifts" :key="gift.id" class="bg-white rounded-lg shadow p-4">
                <!-- Basic Information -->
                <div class="flex items-start justify-between mb-3">
                    <div class="flex-1">
                        <h3 class="font-medium text-gray-900">{{ gift.name }}</h3>
                        <p v-if="gift.price" class="text-sm font-medium text-brand-600 mt-1">R$ {{ gift.price }}</p>
                    </div>

                    <!-- Status badge -->
                    <span :class="getStatusBadgeClass(gift)" class="px-2 py-1 text-xs font-medium rounded-full">
                        {{ getStatusText(gift) }}
                    </span>
                </div>

                <!-- Counters and progress -->
                <div class="mb-3">
                    <div class="flex items-center justify-between text-sm text-gray-600 mb-1">
                        <span>Presenteados: {{ gift.quantity_gifted }} / {{ gift.quantity }}</span>
                        <span>{{ Math.round((gift.quantity_gifted / gift.quantity) * 100) }}%</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                        <div class="bg-brand-500 h-2 rounded-full transition-all duration-300"
                            :style="{ width: (gift.quantity_gifted / gift.quantity) * 100 + '%' }"></div>
                    </div>
                </div>

                <!-- Actions -->
                <div class="flex justify-between gap-2">
                    <div class="flex gap-2">
                        <NuxtLink :to="`/gifts/${gift.id}`"
                            class="flex items-center justify-center text-brand-600 border border-brand-600 px-3 p-2 rounded text-sm font-medium hover:bg-brand-50 transition-colors text-center">
                            <Icon name="mdi:square-edit-outline" size="20" />
                        </NuxtLink>
                        <button @click="handleDeleteGift(gift.id, gift.name)"
                            class=" flex items-center justify-center px-3 py-1 !bg-transparent border-1 !border-rose-700 !rounded-sm">
                            <Icon name="mdi:delete" size="20" class="text-rose-700" />
                        </button>
                    </div>

                    <div class="flex gap-2">
                        <button v-if="gift.quantity_gifted < gift.quantity" @click="markAsReceived(gift.id)"
                            class="px-3 py-1 bg-green-600 text-white rounded text-sm font-medium hover:bg-green-700 transition-colors">
                            <Icon name="mdi:check" size="14" class="inline mr-1" />
                            Confirmar Recebimento
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useGifts } from '~/composables/useGifts';
import { type GiftRequest } from '~/dtos/gift/giftRequest';
import Swal from 'sweetalert2';

const {
    gifts,
    isLoading,
    error,
    totalGifts,
    receivedCount,
    loadGifts,
    createGift,
    markAsReceived,
    deleteGift
} = useGifts();

const showAddForm = ref(false);
const newGift = reactive<GiftRequest>({
    name: '',
    external_reference: null,
    price: null,
    image_url: null,
    payment_url: null,
    quantity: 1,
    quantity_gifted: 0,
    is_available: true
});

onMounted(() => {
    loadGifts();
});

// Status Functions
function getStatusText(gift: any): string {
    if (!gift.is_available) return 'Indisponível';
    if (gift.quantity_gifted >= gift.quantity) return 'Esgotado';
    return 'Disponível';
}

function getStatusBadgeClass(gift: any): string {
    const baseClass = 'px-2 py-1 text-xs font-medium rounded-full';
    if (!gift.is_available) return `${baseClass} bg-gray-100 text-gray-600`;
    if (gift.quantity_gifted >= gift.quantity) return `${baseClass} bg-red-100 text-red-600`;
    return `${baseClass} bg-green-100 text-green-600`;
}

async function handleAddGift() {
    const success = await createGift(newGift);
    if (success) {
        showAddForm.value = false;
        resetForm();
    }
}

function cancelAdd() {
    showAddForm.value = false;
    resetForm();
}

function resetForm() {
    Object.assign(newGift, {
        name: '',
        external_reference: null,
        price: null,
        image_url: null,
        payment_url: null,
        quantity: 1,
        quantity_gifted: 0,
        is_available: true
    });
}

async function handleDeleteGift(giftId: number, giftName: string) {
    const result = await Swal.fire({
        title: 'Confirmar Exclusão',
        text: `Tem certeza que deseja excluir o presente "${giftName}"?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sim, excluir!',
        cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
        await deleteGift(giftId);
    }
}
</script>