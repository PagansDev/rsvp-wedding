<template>
    <Teleport to="body">
        <Transition name="modal">
            <div v-if="isOpen && modalType === 'drawer'" class="fixed inset-0 z-50" @click="handleBackdropClick">
                <!-- Backdrop -->
                <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

                <!-- Drawer -->
                <div class="absolute bottom-0 left-0 right-0">
                    <div ref="drawerRef" class="bg-brand-50 rounded-t-2xl shadow-2xl max-h-[85vh] overflow-hidden"
                        @click.stop>
                        <!-- Drag indicator and header -->
                        <div class="flex flex-col items-center p-4 border-b border-gray-200">
                            <div class="w-12 h-1 bg-brand-300 rounded-full cursor-grab active:cursor-grabbing mb-3"
                                @mousedown="startDrag" @touchstart="startDrag"></div>

                            <!-- Close button -->
                            <button @click="closeModal"
                                class="absolute top-4 right-4 p-2 rounded-full !bg-transparent hover:bg-gray-100 transition-colors">
                                <Icon name="mdi:close" size="20" class="text-gray-500" />
                            </button>

                            <!-- Title -->
                            <h3 v-if="modalProps.title" class="text-lg font-semibold text-gray-900">
                                {{ modalProps.title }}
                            </h3>
                        </div>

                        <!-- Content -->
                        <div class="p-6 overflow-y-auto max-h-[calc(85vh-5rem)]">
                            <!-- Content from props -->
                            <div v-if="modalProps.content" v-html="modalProps.content"></div>

                            <!-- Slot content -->
                            <slot v-else :props="modalProps" />

                            <!-- Fallback content -->
                            <div v-if="!modalProps.content && !$slots.default" class="text-center text-gray-500">
                                <Icon name="mdi:information-outline" size="48" class="mx-auto mb-4" />
                                <p>Nenhum conteúdo disponível</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
import { useModal } from '@/composables/Modal';

const { isOpen, modalType, modalProps, closeModal } = useModal();

// Debug logs
watch([isOpen, modalType], ([newIsOpen, newModalType]) => {
    console.log('DrawerModal: Estado mudou', { isOpen: newIsOpen, modalType: newModalType, modalProps: modalProps.value });
}, { immediate: true });

const drawerRef = ref<HTMLElement>();
const isDragging = ref(false);
const startY = ref(0);
const currentY = ref(0);

const handleBackdropClick = () => {
    closeModal();
};

const startDrag = (e: MouseEvent | TouchEvent) => {
    isDragging.value = true;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    startY.value = clientY;
    currentY.value = clientY;

    // Add event listeners
    document.addEventListener('mousemove', handleDrag);
    document.addEventListener('mouseup', endDrag);
    document.addEventListener('touchmove', handleDrag);
    document.addEventListener('touchend', endDrag);
};

const handleDrag = (e: MouseEvent | TouchEvent) => {
    if (!isDragging.value || !drawerRef.value) return;

    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    currentY.value = clientY;

    const deltaY = currentY.value - startY.value;
    if (deltaY > 0) {
        drawerRef.value.style.transform = `translateY(${deltaY}px)`;
    }
};

const endDrag = () => {
    if (!isDragging.value || !drawerRef.value) return;

    const deltaY = currentY.value - startY.value;

    // Close if dragged down more than 150px
    if (deltaY > 150) {
        closeModal();
    } else {
        // Reset position
        drawerRef.value.style.transform = 'translateY(0)';
    }

    isDragging.value = false;

    // Remove event listeners
    document.removeEventListener('mousemove', handleDrag);
    document.removeEventListener('mouseup', endDrag);
    document.removeEventListener('touchmove', handleDrag);
    document.removeEventListener('touchend', endDrag);
};

// Cleanup on unmount
onUnmounted(() => {
    document.removeEventListener('mousemove', handleDrag);
    document.removeEventListener('mouseup', endDrag);
    document.removeEventListener('touchmove', handleDrag);
    document.removeEventListener('touchend', endDrag);
});
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
    transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}

.modal-enter-from .bg-white,
.modal-leave-to .bg-white {
    transform: translateY(100%);
}
</style>