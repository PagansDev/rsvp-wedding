<template>
    <slot />
</template>

<script setup lang="ts">

onMounted(() => {
  document.body.classList.add('theme-bg')
})
onUnmounted(() => {
  document.body.classList.remove('theme-bg')
})

</script>

<style scoped>

</style>