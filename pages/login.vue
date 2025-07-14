<template>
    <LoginForm @login="handleLogin" />
</template>

<script setup lang="ts">
import type { LoginRequest } from '~/dtos/login/loginRequest';
import Swal from 'sweetalert2';

definePageMeta({
    layout: 'texture',
})

const handleLogin = (form: LoginRequest) => {
    console.log(form)
    Swal.fire({
        title: 'Sucesso!',
        text: 'Login realizado com sucesso!',
        icon: 'success',
        toast: true,
        position: 'bottom-left',
        showConfirmButton: false,
        timer: 1500
    })
}

</script>
