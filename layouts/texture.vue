<template>
  <NuxtLink to="/">
    <div class="flex flex-row gap-2 items-center p-4 bg-brand-400 h-20">
      <Icon name="mdi:arrow-left" size="40" class="text-brand-50" />
      <span class="text-lg text-brand-50 font-bold">Voltar</span>
    </div>
  </NuxtLink>
  <slot />
</template>

<script setup lang="ts">

onMounted(() => {
  document.body.classList.remove('theme-bg')
  document.body.classList.add('texture-bg')
})
onUnmounted(() => {
  document.body.classList.remove('texture-bg')
})

</script>

<style scoped></style>