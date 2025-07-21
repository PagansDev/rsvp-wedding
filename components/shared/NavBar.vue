<template>
    <nav :class="navClasses">
        <div class="flex flex-col items-center justify-center gap-6">
            <div class="flex items-center justify-center gap-6">
                <template v-for="(button, index) in buttons" :key="index">
                    <!-- Navigation Button -->
                    <SharedBaseNavButton v-if="button.type === 'nav' && button.to" :icon="button.icon" :to="button.to"
                        :label="button.label" :size="buttonSize" @click="handleButtonClick(button, $event)" />
                    <!-- Trigger Button (Modal) -->
                    <SharedBaseTriggerButton v-else-if="button.type === 'trigger' && button.modalType"
                        :icon="button.icon" :modal-type="button.modalType" :modal-props="button.modalProps || {}"
                        :label="button.label" :size="buttonSize" @click="handleButtonClick(button, $event)" />
                </template>
            </div>
            <div class="flex items-center justify-center gap-6">
                <p class="text-sm text-center uppercase text-brand-200 font-bold animate-pulse">
                    Clique nos botões para interagir
                </p>
            </div>
        </div>

        <!-- Modals -->
        <SharedDrawerModal />
        <SharedMapModal />
    </nav>
</template>

<script setup lang="ts">
interface NavButton {
    type: 'nav' | 'trigger'
    icon: string
    label?: string
    // For nav buttons
    to?: string
    // For trigger buttons
    modalType?: 'drawer' | 'map'
    modalProps?: Record<string, any>
}

interface Props {
    buttons: NavButton[]
    position?: 'fixed' | 'relative' | 'sticky' | 'default'
    placement?: 'top' | 'bottom' | 'default'
    size?: 'sm' | 'md' | 'lg'
    variant?: 'default' | 'floating' | 'minimal'
}

const props = withDefaults(defineProps<Props>(), {
    position: 'default',
    placement: 'default',
    size: 'md',
    variant: 'floating'
})

const emit = defineEmits<{
    buttonClick: [button: NavButton, event: MouseEvent]
}>()

const buttonSize = computed(() => props.size)

const navClasses = computed(() => [
    'z-40 w-full transition-all duration-300',
    // Position
    {
        'fixed': props.position === 'fixed',
        'relative': props.position === 'relative',
        'sticky': props.position === 'sticky',
        '': props.position === 'default'
    },
    // Placement
    {
        'top-0 left-0 right-0': props.placement === 'top',
        'bottom-0 left-0 right-0': props.placement === 'bottom',
        '': props.placement === 'default'
    },
    // Variant styles
    {
        // Default variant
        'bg-white border-t border-gray-200 shadow-lg py-4 px-6': props.variant === 'default',
        // Floating variant
        'p-4': props.variant === 'floating',
        // Minimal variant
        'bg-transparent py-2 px-4': props.variant === 'minimal'
    }
])

const handleButtonClick = (button: NavButton, event: MouseEvent) => {
    emit('buttonClick', button, event)
}
</script>

<style scoped>
/* Additional styles for floating variant */
nav.floating-nav {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 24px;
    margin: 16px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

@media (max-width: 400px) {
    .flex.items-center.justify-center.gap-6 {
        gap: 0.75rem;
        /* gap-3 */
    }

    nav {
        padding: 0.75rem;
        /* p-3 */
    }

    nav.floating-nav {
        margin: 0.5rem;
        /* m-2 */
        border-radius: 1rem;
        /* rounded-2xl */
    }
}

@media (max-width: 360px) {
    .flex.items-center.justify-center.gap-6 {
        gap: 0.5rem;
        /* gap-2 */
    }

    nav {
        padding: 0.5rem;
        /* p-2 */
    }

    nav.floating-nav {
        margin: 0.25rem;
        /* m-1 */
    }
}
</style>