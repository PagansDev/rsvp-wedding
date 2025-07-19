<template>
    <div>
        <div class="flex items-center justify-between mb-4">
            <h2 class="!text-lg !font-semibold text-brand-600">Total de Confirmações</h2>
            <div class="flex items-center gap-2 p-4 bg-brand-300 rounded-lg shadow-lg border-1 border-brand-600">
                <Icon name="mdi:account-check" size="40" class="text-brand-50" />
                <span class="!text-2xl !font-bold text-brand-600">{{ totalRsvps }}</span>
            </div>
        </div>

        <div class="mb-4">
            <button @click="showAddForm = true"
                class="w-full p-3 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors flex items-center justify-center gap-2">
                <Icon name="mdi:plus" size="20" />
                Adicionar Confirmação Manual
            </button>
        </div>

        <AdminRsvpForm :show-form="showAddForm" :is-loading="isLoading" @submit="handleAddRsvp"
            @cancel="showAddForm = false" />

        <div class="flex flex-row gap-3 mb-4 border-b-2 border-brand-600 pb-3">
            <div class="flex flex-col basis-1/2 items-center gap-2 p-4 bg-brand-300 rounded-lg shadow-lg border-1 border-brand-600">
                <div class="font-bold text-sm text-brand-50 mb-1">Pessoas</div>
                <div class="flex flex-row gap-3 items-center justify-center">
                    <Icon name="mdi:account-group" size="40" class="text-brand-50" />
                    <div class="text-2xl font-bold text-brand-600">{{ totalGuests }}</div>
                </div>
            </div>
            <div class="flex flex-col items-center basis-1/2 gap-2 p-4 bg-brand-300 rounded-lg shadow-lg border-1 border-brand-600">
                <div class="font-bold text-sm text-brand-50 mb-1">Acompanhantes</div>
                <div class="flex flex-row gap-3 items-center justify-center">
                    <Icon name="mdi:account-multiple-plus" size="40" class="text-brand-50" />
                    <div class="text-2xl font-bold text-brand-600">{{ withGuests }}</div>
                </div>
            </div>
            
        </div>

        <!-- Loading state -->
        <div v-if="isLoading && !showAddForm" class="text-center py-8">
            <Icon name="mdi:loading" size="40" class="animate-spin text-brand-500 mx-auto mb-2" />
            <p class="text-gray-500">Carregando confirmações...</p>
        </div>

        <!-- Error state -->
        <div v-else-if="error" class="text-center py-8">
            <Icon name="mdi:alert-circle" size="40" class="text-rose-500 mx-auto mb-2" />
            <p class="text-rose-600">{{ error }}</p>
            <button @click="loadAll"
                class="mt-2 px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors">
                Tentar Novamente
            </button>
        </div>

        <!-- Empty state -->
        <div v-else-if="totalRsvps === 0" class="text-gray-400 text-center py-8">
            <Icon name="mdi:account-group-outline" size="40" class="mx-auto mb-2" />
            <p>Nenhum convidado encontrado.</p>
        </div>

        <!-- Guest List -->
        <div v-else class="space-y-3">
            <div v-for="rsvp in rsvps" :key="rsvp.id" class="bg-white rounded-lg shadow p-4">
                <div class="flex items-start justify-between">
                    <div class="flex-1">
                        <div class="flex items-center gap-2 mb-1">
                            <span class="font-medium text-gray-900">{{ rsvp.name }}</span>
                            <span v-if="rsvp.has_guest"
                                class="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                                + Acompanhante
                            </span>
                        </div>
                        <p class="text-sm text-gray-600 mb-1">{{ rsvp.whatsapp }}</p>
                        <p class="text-xs text-gray-500">CPF: {{ rsvp.document }}</p>

                        <div v-if="rsvp.has_guest && rsvp.guest_name" class="mt-2 pt-2 border-t border-gray-100">
                            <p class="text-sm text-gray-600">
                                <span class="font-medium">Acompanhante:</span> {{ rsvp.guest_name }}
                            </p>
                            <p v-if="rsvp.guest_document" class="text-xs text-gray-500">
                                CPF: {{ rsvp.guest_document }}
                            </p>
                        </div>
                    </div>

                    <div class="text-right text-xs text-gray-500">
                        {{ formatDate(rsvp.created_at) }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRsvps } from '~/composables/useRsvps';
import { type RsvpRequest } from '~/dtos/rsvp/rsvpRequest';

const { rsvps, isLoading, error, totalRsvps, withGuests, loadAll, createRsvp } = useRsvps();

const showAddForm = ref(false);

const totalGuests = computed(() => {
    return rsvps.value.reduce((acc, rsvp) => acc + 1 + (rsvp.has_guest ? 1 : 0), 0);
});

onMounted(() => {
    loadAll();
});

// Format date function
const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

// Handle manual RSVP addition
async function handleAddRsvp(rsvpData: RsvpRequest) {
    const success = await createRsvp(rsvpData);
    if (success) {
        showAddForm.value = false;
        await loadAll();
    }
}
</script>