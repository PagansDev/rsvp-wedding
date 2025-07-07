<template>
    <div class="flex flex-col items-center m-4 p-4 bg-white rounded-lg">
        <form action="" class="flex flex-col justify-center gap-4">
            <div  class="flex flex-col gap-2">
                <label for="name">Nome Completo</label>
                <input type="text" id="name" placeholder="Digite seu nome completo">
                <div class="flex gap-2 w-full items-center">
                    <input type="checkbox"  v-model="hasGuest" id="hasGuest" name="hasGuest" class="w-8 h-8 basis-0.5">
                    <label for="hasGuest" class="text-sm">Vou levar um acompanhante</label>
                </div>
            </div>
            <div v-if="hasGuest" class="flex flex-col gap-2">
                <label for="email">Nome do Acompanhante</label>
                <input type="text" id="email" placeholder="Nome do Acompanhante">
            </div>

            <div>
                <label for="whatsapp">Número de WhatsApp</label>
                <input type="text" id="whatsapp" placeholder="Digite seu número de WhatsApp">                
            </div>
            <button type="submit">Enviar</button>
        </form>
    </div>
</template>

<script setup>

const hasGuest = ref(false)


</script>

<style scoped></style>