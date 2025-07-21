<template>
    <div>
        <div class="flex items-center justify-between mb-4">
            <h2 class="!text-lg !font-semibold text-brand-600">Total de Confirmações</h2>
            <div class="flex items-center gap-2 p-4 bg-brand-300 rounded-lg shadow-lg border-1 border-brand-600">
                <Icon name="mdi:account-check" size="40" class="text-brand-50" />
                <span class="!text-2xl !font-bold text-brand-600">{{ confirmedRsvps }}</span>
            </div>
        </div>

        <div class="mb-4">
            <button @click="showAddForm = true"
                class="w-full p-3 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors flex items-center justify-center gap-2">
                <Icon name="mdi:plus" size="20" />
                Adicionar Convidado
            </button>
        </div>

        <AdminRsvpForm :show-form="showAddForm" :is-loading="isLoading" @submit="handleAddRsvp"
            @cancel="showAddForm = false" />

        <div class="flex flex-row gap-3 mb-4 border-b-2 border-brand-600 pb-3">
            <div
                class="flex flex-col basis-1/2 items-center gap-2 p-4 bg-brand-300 rounded-lg shadow-lg border-1 border-brand-600">
                <div class="font-bold text-sm text-brand-50 mb-1">Pessoas</div>
                <div class="flex flex-row gap-3 items-center justify-center">
                    <Icon name="mdi:account-group" size="40" class="text-brand-50" />
                    <div class="text-2xl font-bold text-brand-600">{{ totalGuests }}</div>
                </div>
            </div>
            <div
                class="flex flex-col items-center basis-1/2 gap-2 p-4 bg-yellow-100 rounded-lg shadow-lg border-1 border-yellow-700">
                <div class="font-bold text-sm text-yellow-700 mb-1">Pendentes</div>
                <div class="flex flex-row gap-3 items-center justify-center">
                    <Icon name="mdi:clock" size="40" class="text-yellow-700" />
                    <div class="text-2xl font-bold text-yellow-700">{{ pendingRsvps }}</div>
                </div>
            </div>

        </div>

        <div class="mb-4">
            <div class="flex items-end gap-3">
                <div class="flex-1 relative">
                    <input v-model="searchTerm" type="text" placeholder="Buscar por nome..."
                        class="w-full !pl-10 !pr-2 !py-1 !text-sm !border !border-gray-300 !rounded !focus:ring-1 !focus:ring-brand-500 !focus:border-brand-500" />
                    <Icon name="mdi:magnify" size="16"
                        class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" />
                </div>
                <div class="flex gap-1">
                    <button @click="toggleStatusFilter" :class="[
                        'flex items-center justify-center w-8 h-8 !rounded !border transition-colors',
                        statusFilter === ''
                            ? '!bg-gray-100 !border-gray-300 !text-gray-600 !hover:bg-gray-200'
                            : statusFilter === 'confirmado'
                                ? '!bg-green-100 !border-green-300 !text-green-700 !hover:bg-green-200'
                                : '!bg-yellow-100 !border-yellow-300 !text-yellow-700 !hover:bg-yellow-200'
                    ]"
                        :title="statusFilter === '' ? 'Todos' : statusFilter === 'confirmado' ? 'Confirmados' : 'Pendentes'">
                        <Icon
                            :name="statusFilter === '' ? 'mdi:filter-off' : statusFilter === 'confirmado' ? 'mdi:check-circle' : 'mdi:clock'"
                            size="16" />
                    </button>
                    <button @click="toggleDateSort"
                        class="flex items-center justify-center w-8 h-8 !rounded !border transition-colors"
                        :title="dateSort === 'newest' ? 'Mais recentes' : 'Mais antigos'">
                        <Icon
                            :name="dateSort === 'newest' ? 'mdi:sort-calendar-descending' : 'mdi:sort-calendar-ascending'"
                            size="16" />
                    </button>
                </div>
            </div>
        </div>

        <div v-if="isLoading && !showAddForm" class="text-center py-8">
            <Icon name="mdi:loading" size="40" class="animate-spin text-brand-500 mx-auto mb-2" />
            <p class="text-gray-500">Carregando confirmações...</p>
        </div>

        <div v-else-if="error" class="text-center py-8">
            <Icon name="mdi:alert-circle" size="40" class="text-rose-500 mx-auto mb-2" />
            <p class="text-rose-600">{{ error }}</p>
            <button @click="fetchRsvps"
                class="mt-2 px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors">
                Tentar Novamente
            </button>
        </div>

        <div v-else-if="filteredAndSortedRsvps.length === 0" class="text-gray-400 text-center py-8">
            <Icon name="mdi:account-group-outline" size="40" class="mx-auto mb-2" />
            <p v-if="totalRsvps === 0">Nenhum convidado encontrado.</p>
            <p v-else>Nenhum convidado encontrado com os filtros aplicados.</p>
        </div>

        <div v-else class="space-y-3">
            <div v-if="hasActiveFilters" class="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <Icon name="mdi:filter" size="16" />
                <span>{{ activeFiltersText }}</span>
            </div>
            <div v-for="rsvp in filteredAndSortedRsvps" :key="rsvp.id" class="bg-white rounded-lg shadow p-4">
                <div class="flex items-start justify-between gap-3">
                    <div class="flex-1 min-w-0">
                        <div class="flex flex-wrap items-start gap-2 mb-2">
                            <h3 class="font-medium text-gray-900 text-sm leading-tight break-words">
                                {{ rsvp.name }}
                            </h3>
                            <div class="flex flex-wrap gap-1">
                                <span v-if="rsvp.has_guest"
                                    class="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full whitespace-nowrap">
                                    +convidado
                                </span>
                                <span :class="[
                                    'px-2 py-1 text-xs rounded-full whitespace-nowrap',
                                    rsvp.status === 'confirmado'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-yellow-100 text-yellow-700'
                                ]">
                                    {{ rsvp.status === 'confirmado' ? 'Confirmado' : 'Pendente' }}
                                </span>
                            </div>
                        </div>

                        <div class="space-y-1 mb-2">
                            <p class="text-sm text-gray-600">{{ rsvp.whatsapp }}</p>
                            <p class="text-xs text-gray-500">RG/CIN: {{ rsvp.document || 'Não informado' }}</p>
                        </div>

                        <div v-if="rsvp.has_guest && rsvp.guest_name" class="pt-2 border-t border-gray-100">
                            <p class="text-sm text-gray-600 mb-1">
                                <span class="font-medium">Acompanhante:</span> {{ rsvp.guest_name }}
                            </p>
                            <p v-if="rsvp.guest_document" class="text-xs text-gray-500">
                                RG/CIN: {{ rsvp.guest_document }}
                            </p>
                        </div>
                    </div>

                    <div class="flex flex-col items-end gap-3 flex-shrink-0">
                        <div class="text-right text-xs text-gray-500 whitespace-nowrap">
                            {{ formatDate(rsvp.created_at) }}
                        </div>

                        <div class="flex gap-2">
                            <button v-if="rsvp.status === 'pendente'" @click="handleConfirmRsvp(rsvp.id)"
                                class="flex items-center justify-center w-8 h-8 bg-green-600 text-white text-xs rounded-sm hover:bg-green-700 transition-colors">
                                <Icon name="mdi:check" size="16" />
                            </button>

                            <button @click="handleDeleteRsvp(rsvp.id)"
                                class="flex items-center justify-center w-8 h-8 !text-rose-700 !bg-transparent !border !border-rose-700 !rounded-sm">
                                <Icon name="mdi:delete" size="16" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRsvps } from '~/composables/useRsvps';
import { type RsvpRequest } from '~/dtos/rsvp/rsvpRequest';
import Swal from 'sweetalert2';

const { rsvps, isLoading, error, fetchRsvps, createRsvp, updateRsvpStatus, deleteRsvp } = useRsvps();

const showAddForm = ref(false);
const searchTerm = ref('');
const statusFilter = ref('');
const dateSort = ref('newest');

const totalRsvps = computed(() => rsvps.value.length);

const confirmedRsvps = computed(() => {
    return rsvps.value.filter(rsvp => rsvp.status === 'confirmado').length;
});

const totalGuests = computed(() => {
    const confirmedRsvpsList = rsvps.value.filter(rsvp => rsvp.status === 'confirmado');
    return confirmedRsvpsList.reduce((acc, rsvp) => acc + 1 + (rsvp.has_guest ? 1 : 0), 0);
});

const pendingRsvps = computed(() => {
    return rsvps.value.filter(rsvp => rsvp.status === 'pendente').length;
});

const filteredAndSortedRsvps = computed(() => {
    let filtered = rsvps.value;

    if (searchTerm.value) {
        const term = searchTerm.value.toLowerCase();
        filtered = filtered.filter(rsvp =>
            rsvp.name.toLowerCase().includes(term) ||
            (rsvp.guest_name && rsvp.guest_name.toLowerCase().includes(term))
        );
    }

    if (statusFilter.value) {
        filtered = filtered.filter(rsvp => rsvp.status === statusFilter.value);
    }

    filtered = [...filtered].sort((a, b) => {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return dateSort.value === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return filtered;
});

const hasActiveFilters = computed(() => {
    return searchTerm.value || statusFilter.value || dateSort.value !== 'newest';
});

const activeFiltersText = computed(() => {
    const filters = [];

    if (searchTerm.value) {
        filters.push(`Busca: "${searchTerm.value}"`);
    }

    if (statusFilter.value) {
        filters.push(statusFilter.value === 'confirmado' ? 'Confirmados' : 'Pendentes');
    }

    if (dateSort.value === 'oldest') {
        filters.push('Mais antigos');
    }

    return filters.join(' • ');
});

onMounted(() => {
    fetchRsvps();
});

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

async function handleAddRsvp(rsvpData: RsvpRequest) {
    const { success } = await createRsvp(rsvpData);
    if (success) {
        showAddForm.value = false;
        await fetchRsvps();
    }
}

async function handleConfirmRsvp(rsvpId: number) {
    const result = await Swal.fire({
        title: 'Confirmar RSVP',
        text: 'Deseja confirmar este RSVP?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#059669',
        cancelButtonColor: '#6b7280'
    });

    if (result.isConfirmed) {
        await updateRsvpStatus(rsvpId, 'confirmado');
    }
}

function toggleStatusFilter() {
    if (statusFilter.value === '') {
        statusFilter.value = 'confirmado';
    } else if (statusFilter.value === 'confirmado') {
        statusFilter.value = 'pendente';
    } else {
        statusFilter.value = '';
    }
}

function toggleDateSort() {
    dateSort.value = dateSort.value === 'newest' ? 'oldest' : 'newest';
}

async function handleDeleteRsvp(rsvpId: number) {
    const result = await Swal.fire({
        title: 'Deletar RSVP',
        text: 'Tem certeza que deseja deletar este RSVP? Esta ação não pode ser desfeita.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Deletar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#dc2626',
        cancelButtonColor: '#6b7280'
    });

    if (result.isConfirmed) {
        await deleteRsvp(rsvpId);
    }
}
</script>