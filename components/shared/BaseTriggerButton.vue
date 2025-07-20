<template>
    <div class="flex flex-col items-center gap-2">
        <button :class="buttonClasses" @click="handleClick" class="!rounded-full !bg-brand-300">
            <Icon :name="icon" :size="iconSize" />
        </button>
        <span v-if="label" class="text-xs font-medium leading-tight text-center max-w-24">
            {{ label }}
        </span>
    </div>
</template>

<script setup lang="ts">
interface Props {
    icon: string
    modalType: 'drawer' | 'map'
    modalProps?: Record<string, any>
    label?: string
    size?: 'sm' | 'md' | 'lg'
    iconSize?: string | number
}

const props = withDefaults(defineProps<Props>(), {
    size: 'md',
    iconSize: '24',
    modalProps: () => ({})
})

const emit = defineEmits<{
    click: [event: MouseEvent]
}>()

const { openModal } = useModal()

const handleClick = (event: MouseEvent) => {
    openModal(props.modalType, props.modalProps)
    emit('click', event)
}

const buttonClasses = computed(() => [
    'inline-flex items-center justify-center rounded-full transition-all duration-200',
    'bg-[var(--color-brand-300)] text-white hover:opacity-90 hover:scale-105',
    'focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-300)] focus:ring-offset-2',
    'shadow-lg hover:shadow-xl cursor-pointer',
    // Size variants - mantendo tamanhos originais
    {
        'w-12 h-12 !p-2': props.size === 'sm',
        'w-16 h-16 !p-3': props.size === 'md',
        'w-20 h-20 !p-4': props.size === 'lg'
    }
])
</script>

<style scoped></style>