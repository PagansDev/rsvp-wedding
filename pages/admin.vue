<template>
    <div class="flex justify-between items-center p-4 bg-brand-500">
        <h1 class="text-brand-50 !text-lg font-bold">Painel de Controle</h1>
        <NuxtLink to="/" class="text-brand-50">
            <Icon name="mdi:logout" size="24" />
        </NuxtLink>
    </div>
    <div class="max-w-md mx-auto p-4 pt-2 pb-10">
        <AdminTabs />
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'clean',
})
</script>