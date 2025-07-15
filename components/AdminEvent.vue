<template>
    <form class="flex flex-col gap-4 bg-white rounded-lg shadow p-4">
        <div>
            <label class="block text-sm font-medium mb-2 border-b-2 border-brand-600">Nome do Evento</label>
            <input v-model="event.name" class="input" type="text" />
        </div>
        <div>
            <label class="block text-sm font-medium mb-2 border-b-2 border-brand-600">Mensagem do Evento 1</label>
            <input v-model="event.first_message" class="input" type="text" />
        </div>

        <div>
            <label class="block text-sm font-medium mb-2 border-b-2 border-brand-600">Mensagem do Evento 2</label>
            <input v-model="event.second_message" class="input" type="text" />
        </div>
        <div>
            <label class="block text-sm font-medium mb-2 border-b-2 border-brand-600">Data do Evento</label>
            <input v-model="event.date" class="input" type="date" />
        </div>
        <div>
            <label class="block text-sm font-medium mb-2 border-b-2 border-brand-600">Endereço URL 1</label>
            <input v-model="event.url1" class="input" type="url" />
        </div>
        <div>
            <label class="block text-sm font-medium mb-2 border-b-2 border-brand-600">Endereço URL 2</label>
            <input v-model="event.url2" class="input" type="url" />
        </div>
        <button type="button" class="bg-brand-600 text-white px-4 py-2 rounded" @click="saveEvent">Save</button>
    </form>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const event = ref({
    name: '',
    first_message: '',
    second_message: '',
    date: '',
    url1: '',
    url2: ''
});

function saveEvent() {
    // Lógica de salvar (mock)
    alert('Event saved!');
}
</script>
