<template>
    <div>
        <!-- Loading state -->
        <div v-if="isLoading" class="text-center py-8">
            <Icon name="mdi:loading" size="40" class="animate-spin text-brand-500 mx-auto mb-2" />
            <p class="text-gray-500">Carregando dados do evento...</p>
        </div>

        <!-- Error state -->
        <div v-else-if="error" class="text-center py-8">
            <Icon name="mdi:alert-circle" size="40" class="text-rose-500 mx-auto mb-2" />
            <p class="text-rose-600">{{ error }}</p>
            <button @click="loadEvent"
                class="mt-2 px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors">
                Tentar Novamente
            </button>
        </div>

        <!-- Event Form -->
        <form v-else @submit.prevent="handleSaveEvent" class="flex flex-col gap-4 bg-white rounded-lg shadow p-4">
            <div>
                <label class="block text-sm font-medium mb-2 border-b-2 border-brand-600">Nome do Evento *</label>
                <input v-model="eventForm.name" type="text" required
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>

            <div>
                <label class="block text-sm font-medium mb-2 border-b-2 border-brand-600">Data do Evento *</label>
                <input v-model="eventForm.event_date" type="datetime-local" required
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>

            <div>
                <label class="block text-sm font-medium mb-2 border-b-2 border-brand-600">Texto do Convite</label>
                <textarea v-model="eventForm.invite_text" rows="3"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                    placeholder="Texto que aparecerá no convite..."></textarea>
            </div>

            <div>
                <label class="block text-sm font-medium mb-2 border-b-2 border-brand-600">Mensagem do Evento</label>
                <textarea v-model="eventForm.message" rows="3"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                    placeholder="Mensagem adicional sobre o evento..."></textarea>
            </div>

            <div>
                <label class="block text-sm font-medium mb-2 border-b-2 border-brand-600">Endereço 1 (Local da
                    Cerimônia)</label>
                <textarea v-model="eventForm.adress_1" rows="2"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                    placeholder="Endereço completo do local da cerimônia..."></textarea>
            </div>

            <div>
                <label class="block text-sm font-medium mb-2 border-b-2 border-brand-600">Endereço 2 (Local da
                    Celebração)</label>
                <textarea v-model="eventForm.adress_2" rows="2"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                    placeholder="Endereço completo do local da celebração..."></textarea>
            </div>

            <button type="submit" :disabled="isLoading"
                class="bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2">
                <Icon v-if="isLoading" name="mdi:loading" size="16" class="animate-spin" />
                {{ isLoading ? 'Salvando...' : 'Salvar Evento' }}
            </button>
        </form>

        <!-- Preview -->
        <div v-if="event" class="mt-6 bg-gray-50 rounded-lg p-4">
            <h3 class="font-semibold text-brand-600 mb-3">Preview do Evento</h3>
            <div class="space-y-2 text-sm">
                <p><strong>Nome:</strong> {{ event.name }}</p>
                <p><strong>Data:</strong> {{ formatEventDate(event.event_date) }}</p>
                <p v-if="event.invite_text"><strong>Convite:</strong> {{ event.invite_text }}</p>
                <p v-if="event.message"><strong>Mensagem:</strong> {{ event.message }}</p>
                <p v-if="event.adress_1"><strong>Endereço 1:</strong> {{ event.adress_1 }}</p>
                <p v-if="event.adress_2"><strong>Endereço 2:</strong> {{ event.adress_2 }}</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useEvent } from '~/composables/useEvent';
import { type EventRequest } from '~/dtos/event/eventRequest';
import { formatForInput } from '~/utils/dateUtils';

const { event, isLoading, error, loadEvent, saveEvent } = useEvent();

const eventForm = reactive<EventRequest>({
    name: '',
    event_date: '',
    invite_text: null,
    message: null,
    adress_1: null,
    adress_2: null
});


onMounted(async () => {
    await loadEvent();
    if (event.value) {
        Object.assign(eventForm, {
            name: event.value.name || '',
            event_date: event.value.event_date ? formatForInput(event.value.event_date) : '',
            invite_text: event.value.invite_text || null,
            message: event.value.message || null,
            adress_1: event.value.adress_1 || null,
            adress_2: event.value.adress_2 || null
        });
    }
});

async function handleSaveEvent() {
    const success = await saveEvent(eventForm);
    if (success) {
        await loadEvent();
        if (event.value) {
            Object.assign(eventForm, {
                name: event.value.name || '',
                event_date: event.value.event_date ? formatForInput(event.value.event_date) : '',
                invite_text: event.value.invite_text || null,
                message: event.value.message || null,
                adress_1: event.value.adress_1 || null,
                adress_2: event.value.adress_2 || null
            });
        }
    }
}



function formatEventDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}
</script>
