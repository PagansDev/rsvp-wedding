<template>
    <div v-if="showForm" class="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 class="font-semibold text-brand-600 mb-3">Adicionar Confirmação Manual</h3>
        <form @submit.prevent="handleSubmit" class="space-y-3">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nome Completo *</label>
                <input v-model="form.name" type="text" required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">WhatsApp *</label>
                <input v-model="form.whatsapp" type="text" required placeholder="(11) 99999-9999"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">CPF</label>
                <input v-model="form.document" type="text" placeholder="000.000.000-00"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>

            <div class="flex items-center gap-2">
                <input type="checkbox" v-model="form.hasGuest" id="hasGuest" class="w-4 h-4" />
                <label for="hasGuest" class="text-sm text-gray-700">Vai levar acompanhante</label>
            </div>

            <div v-if="form.hasGuest" class="space-y-3">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Nome do Acompanhante</label>
                    <input v-model="form.guestName" type="text"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500" />
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">CPF do Acompanhante</label>
                    <input v-model="form.guestDocument" type="text" placeholder="000.000.000-00"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500" />
                </div>
            </div>

            <div class="flex gap-2">
                <button type="submit" :disabled="isLoading"
                    class="flex-1 px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                    <Icon v-if="isLoading" name="mdi:loading" size="16" class="animate-spin mr-2" />
                    {{ isLoading ? 'Salvando...' : 'Salvar Confirmação' }}
                </button>
                <button type="button" @click="cancelForm"
                    class="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors">
                    Cancelar
                </button>
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">
import { rsvpRequestSchema, type RsvpRequest } from '~/dtos/rsvp/rsvpRequest';
import Swal from 'sweetalert2';

interface Props {
    showForm: boolean;
    isLoading: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
    submit: [data: RsvpRequest];
    cancel: [];
}>();

const form = reactive<RsvpRequest>({
    name: '',
    hasGuest: false,
    whatsapp: '',
    guestName: '',
    document: '',
    guestDocument: ''
});

// Phone formatting
watch(() => form.whatsapp, () => {
    const digits = form.whatsapp.replace(/\D/g, '').slice(0, 11);
    const formatted = digits
        .replace(/^(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2');
    form.whatsapp = formatted;
});

async function handleSubmit() {
    const validated = rsvpRequestSchema.safeParse(form);

    if (!validated.success) {
        await Swal.fire({
            title: 'Erro',
            text: 'Por favor, preencha todos os campos obrigatórios corretamente',
            icon: 'error',
            toast: true,
            position: 'bottom-left',
            showConfirmButton: false,
            timer: 2000
        });
        return;
    }

    emit('submit', validated.data);
    resetForm();
}

function cancelForm() {
    emit('cancel');
    resetForm();
}

function resetForm() {
    Object.assign(form, {
        name: '',
        hasGuest: false,
        whatsapp: '',
        guestName: '',
        document: '',
        guestDocument: ''
    });
}
</script>