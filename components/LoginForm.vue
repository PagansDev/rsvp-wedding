<template>
    <div class="flex flex-col justify-center items-center gap-4 min-h-dvh p-4">
        <form class="flex flex-col gap-4 w-full bg-white shadow-lg rounded-lg p-4">
            <div class="flex items-center gap-2 justify-center">
                <Icon name="mdi:login" size="20" class="text-brand-400" />
                <h1 class="!text-lg font-bold text-center">Painel</h1>
            </div>
            <label for="user" class="w-full">Usuário</label>
            <input type="text" id="user" placeholder="Usuário" v-model="form.user" />
            <p class="text-red-500 text-sm" v-if="errors.user">{{ errors.user }}</p>
            <label for="password" class="w-full">Senha</label>
            <input type="password" id="password" placeholder="Senha" v-model="form.password" />
            <p class="text-red-500 text-sm" v-if="errors.password">{{ errors.password }}</p>
            <button @click="handleLogin" type="button" class="bg-brand-400 text-white px-4 py-2 rounded-md w-full flex items-center justify-center gap-2">
                <Icon v-if="isLoading" name="mdi:loading" size="20" class="text-white animate-spin" />
                <Icon v-else name="mdi:login" size="20" class="text-white" />
                Entrar
            </button>
        </form>

    </div>
</template>

<script setup lang="ts">
import { loginRequestSchema, type LoginRequest } from '~/dtos/login/loginRequest'
import Swal from 'sweetalert2'

const isLoading = ref(false)

const emit = defineEmits(['login'])

const form = reactive < LoginRequest > ({
    user: '',
    password: ''
})

const errors = reactive < Record < string, string>> ({})

watch(() => form.user, () => {
  if (errors.user) delete errors.user
})

watch(() => form.password, () => {
  if (errors.password) delete errors.password
})

const handleLogin = () => {
    const validated = loginRequestSchema.safeParse(form)

    if (!validated.success) {
        Object.keys(errors).forEach((key) => delete errors[key])

        const fieldErrors = validated.error.flatten().fieldErrors

        for (const key in fieldErrors) {
            errors[key as keyof LoginRequest] = fieldErrors[key as keyof LoginRequest]?.[0] || 'Campo inválido'
        }

        Swal.fire({
            title: 'Ops!',
            text: 'Por favor, preencha todos os campos corretamente!',
            icon: 'error',
            toast: true,
            position: 'bottom-left',
            showConfirmButton: false,
            timer: 2000
        })
        return
    }

    isLoading.value = true
    setTimeout(() => {
        isLoading.value = false
        emit('login', form)
    }, 2000)
}

</script>
