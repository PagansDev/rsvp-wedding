<template>
    <RsvpForm @rsvpSubmit="handleRsvpSubmit" />
</template>

<script setup lang="ts">
import type { RsvpRequest } from '~/dtos/rsvp/rsvpRequest';
import Swal from 'sweetalert2'

const router = useRouter()

const handleRsvpSubmit = (form: RsvpRequest) => {

    // TODO: Implement API call
    Swal.fire({
        title: 'Sucesso!',
        text: 'RSVP enviado com sucesso!',
        icon: 'success',
        toast: true,
        position: 'bottom-left',
        showConfirmButton: false,
        timer: 1500
    }).then(() => {
        router.push('/confirmation')
    })
}

definePageMeta({
  layout: 'texture'
})


</script>