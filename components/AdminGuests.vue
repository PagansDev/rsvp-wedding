<template>
    <div>
        <div class="flex items-center justify-between mb-4">
            <h2 class="!text-lg !font-semibold text-brand-600">Total de Confirmações</h2>
            <div class="flex items-center gap-2 p-4 bg-brand-300 rounded-lg shadow-lg border-1 border-brand-600">
                <Icon name="mdi:account-check" size="40" class="text-brand-50" />
                <span class="!text-2xl !font-bold text-brand-600">{{ rsvps.length }}</span>
            </div>
        </div>
        <div v-if="rsvps.length === 0" class="text-gray-400 text-center py-8">Nenhum convidado encontrado.</div>
        <div v-else class="space-y-3">
            <div v-for="rsvp in rsvps" :key="rsvp.id" class="bg-white rounded-lg shadow p-4 flex flex-col">
                <span class="font-medium text-gray-900">{{ rsvp.name }}</span>
                <span class="text-gray-500 text-sm">{{ rsvp.email }}</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
// Simulação de dados, depois integrar com store/composable
const rsvps = ref([
    { id: 1, name: 'Ana Silva', email: 'ana@email.com' }
]);
</script>