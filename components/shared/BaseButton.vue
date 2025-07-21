<template>
    <button :class="buttonClasses" :disabled="disabled" @click="$emit('click', $event)">
        <Icon v-if="icon" :name="icon" :size="iconSize" />
        <slot />
    </button>
</template>

<script setup lang="ts">
interface Props {
    variant?: 'primary' | 'secondary' | 'outline'
    size?: 'sm' | 'md' | 'lg'
    disabled?: boolean
    icon?: string
    iconSize?: string | number
}

const props = withDefaults(defineProps<Props>(), {
    variant: 'primary',
    size: 'md',
    disabled: false,
    iconSize: '20'
})

defineEmits<{
    click: [event: MouseEvent]
}>()

const buttonClasses = computed(() => [
    'inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:opacity-50 disabled:pointer-events-none',
    // Size variants
    {
        'px-3 py-2 text-sm': props.size === 'sm',
        'px-4 py-2 text-base': props.size === 'md',
        'px-6 py-3 text-lg': props.size === 'lg'
    },
    // Color variants
    {
        'bg-[var(--color-brand-300)] text-white hover:opacity-90 focus:ring-[var(--color-brand-300)]': props.variant === 'primary',
        'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500': props.variant === 'secondary',
        'border border-[var(--color-brand-300)] text-[var(--color-brand-300)] hover:bg-[var(--color-brand-300)] hover:text-white focus:ring-[var(--color-brand-300)]': props.variant === 'outline'
    }
])
</script>

<style scoped></style>