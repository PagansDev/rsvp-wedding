<template>
    <div class="flex flex-col items-center m-4 p-4 bg-white rounded-lg">
        <form @submit.prevent="handleSubmit" class="flex flex-col justify-center gap-4">
            <div class="flex flex-col gap-2">
                <label for="name">Nome Completo</label>
                <input type="text" id="name" placeholder="Digite seu nome completo" v-model="form.name">
                <p v-if="errors.name" class="text-red-500 text-xs">{{ errors.name }}</p>
                <label for="document">RG/CIN <span class="text-xs text-gray-500">(será usado para acesso ao
                        evento)</span></label>
                <input type="text" id="document" placeholder="Digite seu RG ou CIN" v-model="form.document">
                <p v-if="errors.document" class="text-red-500 text-xs">{{ errors.document }}</p>
                <div class="flex gap-2 w-full items-center">
                    <input type="checkbox" v-model="form.hasGuest" id="hasGuest" name="hasGuest"
                        class="w-8 h-8 basis-0.5">
                    <label for="hasGuest" class="text-sm">Vou levar um acompanhante</label>
                </div>
            </div>

            <div v-if="form.hasGuest" class="flex flex-col gap-2">
                <label for="guestName">Nome do Acompanhante</label>
                <input type="text" id="guestName" placeholder="Nome do Acompanhante" v-model="form.guestName" />
                <p v-if="errors.guestName" class="text-red-500 text-xs">{{ errors.guestName }}</p>
            </div>
            <div v-if="form.hasGuest">
                <label for="guestDocument">RG/CIN do Acompanhante <span class="text-xs text-gray-500">(será usado para
                        acesso ao evento)</span></label>
                <input type="text" id="guestDocument" placeholder="Digite o RG ou CIN do acompanhante"
                    v-model="form.guestDocument">
                <p v-if="errors.guestDocument" class="text-red-500 text-xs">{{ errors.guestDocument }}</p>
            </div>

            <div>
                <label for="whatsapp">Número de WhatsApp</label>
                <input type="text" id="whatsapp" placeholder="Digite seu número de WhatsApp" v-model="form.whatsapp">
                <p v-if="errors.whatsapp" class="text-red-500 text-xs">{{ errors.whatsapp }}</p>
            </div>

            <button :disabled="Object.keys(errors).length > 0 || isLoading" @click="handleSubmit"
                :class="isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-brand-400 hover:bg-brand-300'">
                <Icon name="mdi:loading" size="20" class="animate-spin" v-if="isLoading" />
                {{ isLoading ? 'Enviando' : 'Enviar' }}
            </button>
        </form>
    </div>
</template>

<script setup lang="ts">
import { rsvpRequestSchema, type RsvpRequest } from '~/dtos/rsvp/rsvpRequest'
import Swal from 'sweetalert2'

const emit = defineEmits(['rsvpSubmit'])

const { formData, saveFormData } = useRsvps()

const form = reactive<RsvpRequest>({
    name: formData.value.name || '',
    hasGuest: formData.value.hasGuest || false,
    whatsapp: formData.value.whatsapp || '',
    guestName: formData.value.guestName || '',
    document: formData.value.document || '',
    guestDocument: formData.value.guestDocument || '',
})

watch(form, (newForm) => {
    saveFormData(newForm)
}, { deep: true })

const errors = reactive<Record<string, string>>({})

watch(() => form.name, () => {
    if (errors.name) delete errors.name
})

watch(() => form.whatsapp, () => {
    if (errors.whatsapp) delete errors.whatsapp

    if (!form.whatsapp) return

    const digits = form.whatsapp.replace(/\D/g, '').slice(0, 11)

    const formatted = digits
        .replace(/^(\d{2})(\d)/, '($1) $2')       // (XX) X...
        .replace(/(\d{5})(\d)/, '$1-$2')          // ...X XXXX-XXXX

    form.whatsapp = formatted
})

watch(() => form.document, () => {
    if (errors.document) delete errors.document

    if (!form.document) return

    const digits = form.document.replace(/\D/g, '')

    if (digits.length <= 9) {
        const formatted = digits
            .replace(/^(\d{2})(\d)/, '$1.$2')
            .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
            .replace(/\.(\d{3})(\d)/, '.$1-$2')
        form.document = formatted
    }
    else if (digits.length <= 11) {
        const formatted = digits
            .replace(/^(\d{3})(\d)/, '$1.$2')
            .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
            .replace(/\.(\d{3})(\d)/, '.$1-$2')
        form.document = formatted
    }
})

watch(() => form.guestDocument, () => {
    if (errors.guestDocument) delete errors.guestDocument

    if (!form.guestDocument) return

    const digits = form.guestDocument.replace(/\D/g, '')

    if (digits.length <= 9) {
        const formatted = digits
            .replace(/^(\d{2})(\d)/, '$1.$2')
            .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
            .replace(/\.(\d{3})(\d)/, '.$1-$2')
        form.guestDocument = formatted
    }
    else if (digits.length <= 11) {
        const formatted = digits
            .replace(/^(\d{3})(\d)/, '$1.$2')
            .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
            .replace(/\.(\d{3})(\d)/, '.$1-$2')
        form.guestDocument = formatted
    }
})

const isLoading = ref(false)

const handleSubmit = () => {
    const validated = rsvpRequestSchema.safeParse(form)

    if (!validated.success) {
        Object.keys(errors).forEach((key) => delete errors[key])

        const fieldErrors = validated.error.flatten().fieldErrors

        for (const key in fieldErrors) {
            errors[key as keyof RsvpRequest] = fieldErrors[key as keyof RsvpRequest]?.[0] || 'Campo inválido'
        }

        Swal.fire({
            title: 'Ops',
            text: 'Por favor, preencha todos os campos corretamente',
            icon: 'error',
            toast: true,
            position: 'bottom-left',
            showConfirmButton: false,
            timer: 3000
        })
        return
    }

    isLoading.value = true
    emit('rsvpSubmit', validated.data)
    isLoading.value = false
}
</script>

<style scoped></style>