<template>
    <RsvpForm @rsvpSubmit="handleRsvpSubmit" />
</template>

<script setup lang="ts">
import type { RsvpRequest } from '~/dtos/rsvp/rsvpRequest';
import Swal from 'sweetalert2'

const router = useRouter()
const { createRsvp, clearFormData } = useRsvps()

const formatWhatsApp = (whatsapp: string) => {
    return whatsapp || 'Não informado'
}

const formatDocument = (document: string | null | undefined) => {
    return document || 'Não informado'
}

const formatGuestInfo = (hasGuest: boolean, guestName: string | null | undefined) => {
    if (!hasGuest) return 'Não'
    return guestName || 'Nome não informado'
}

const handleRsvpSubmit = async (form: RsvpRequest) => {
    const previewHtml = `
        <div class="text-left space-y-3">
            <div class="border-b pb-2">
                <strong>Nome:</strong> ${form.name}
            </div>
            <div class="border-b pb-2">
                <strong>WhatsApp:</strong> ${formatWhatsApp(form.whatsapp)}
            </div>
            <div class="border-b pb-2">
                <strong>RG/CIN:</strong> ${formatDocument(form.document)}
            </div>
            ${form.hasGuest ? `
                <div class="border-b pb-2">
                    <strong>Nome do acompanhante:</strong> ${form.guestName || 'Não informado'}
                </div>
                <div class="border-b pb-2">
                    <strong>RG/CIN do acompanhante:</strong> ${formatDocument(form.guestDocument)}
                </div>
            ` : ''}
        </div>
    `

    const result = await Swal.fire({
        title: 'Confirmar RSVP',
        html: previewHtml,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Editar',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        reverseButtons: true
    })

    if (result.isDismissed || result.dismiss === Swal.DismissReason.cancel) {
        return
    }

    try {
        const { success, error } = await createRsvp(form);

        if (!success) {
            await Swal.fire({
                title: 'Erro!',
                text: error,
                icon: 'error',
                toast: true,
                position: 'bottom-left',
                showConfirmButton: false,
                timer: 3000
            });
            return;
        }

        clearFormData();

        await Swal.fire({
            title: 'Sucesso!',
            text: 'RSVP enviado com sucesso!',
            icon: 'success',
            toast: true,
            position: 'bottom-left',
            showConfirmButton: false,
            timer: 1500
        });

        router.push('/confirmation');
    } catch (error) {
        await Swal.fire({
            title: 'Erro!',
            text: error instanceof Error ? error.message : 'Erro ao enviar RSVP',
            icon: 'error',
            toast: true,
            position: 'bottom-left',
            showConfirmButton: false,
            timer: 3000
        });
    }
}

definePageMeta({
    layout: 'texture'
})
</script>