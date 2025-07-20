<template>
    <div class="flex flex-col md:justify-center md:items-center gap-8 min-h-dvh w-full p-2 relative">

        <div class="absolute top-4 left-4 flex justify-center items-center rounded-full bg-brand-400/10 text-white p-3">
            <NuxtLink to="/login" class="flex items-center gap-2">
                <Icon name="mdi:login" size="20" />
            </NuxtLink>
        </div>

        <div class="ml-12 mt-20 md:mt-32 md:ml-0">
            <img src="../assets/images/logo.png" alt="Logo">
        </div>

        <div v-if="isLoading" class="flex flex-col items-center gap-4">
            <Icon name="mdi:loading" size="40" class="animate-spin text-brand-500" />
            <p class="text-gray-500">Carregando dados do evento...</p>
        </div>

        <div v-else-if="error" class="flex flex-col items-center gap-4">
            <Icon name="mdi:alert-circle" size="40" class="text-rose-500" />
            <p class="text-rose-600">{{ error }}</p>
        </div>

        <div v-else-if="event" class="flex flex-col">
            <div class="flex flex-col gap-12">
                <p v-if="event.invite_text" class="text-center text-sm font-bold uppercase text-brand-600">
                    {{ event.invite_text }}
                </p>

                <div class="flex flex-row gap-2 items-center justify-center">
                    <Icon name="mdi:calendar-check" size="20" />
                    <p class="text-center text-sm font-bold uppercase">
                        {{ formatEventDate(event.event_date) }}
                    </p>
                </div>

                <p v-if="event.message" class="text-center text-sm italic">{{ event.message }}</p>

            </div>
        </div>

        <SharedNavBar :buttons="navButtons" position="default" placement="default" variant="floating" />

    </div>
</template>

<script setup>
import { useEvent } from '~/composables/useEvent';
import { formatForDisplay } from '~/utils/dateUtils';

definePageMeta({
    layout: 'default'
})

const { event, isLoading, error, loadEvent } = useEvent();

const formatEventDate = (dateString) => {
    return formatForDisplay(dateString);
};

const navButtons = computed(() => [
    {
        type: 'trigger',
        icon: 'mdi:map-marker',
        label: 'LOCAL DA CERIMÔNIA',
        modalType: 'map',
        modalProps: {
            title: 'Local da Cerimônia',
            embedUrl: event.value?.adress_1
        }
    },
    {
        type: 'trigger',
        icon: 'ph:cheers',
        label: 'LOCAL DA CELEBRAÇÃO',
        modalType: 'map',
        modalProps: {
            title: 'Local da Celebração',
            embedUrl: event.value?.adress_2
        }
    },
    {
        type: 'trigger',
        icon: 'mdi:gift',
        label: 'LISTA DE PRESENTES',
        modalType: 'drawer',
        modalProps: {
            title: 'Lista de Presentes',
            content: `
            <p class="text-brand-800 text-center mb-8 text-sm">Se você quiser nos ajudar a construir nosso futuro, pode
                contribuir com nossa lista de presentes ou fazer uma doação para nossa nova jornada.</p>
        <div class="w-full flex flex-col gap-4">
                <a href="/gift"
                    class="block w-full text-center py-3 rounded-lg font-bold bg-brand-400 !text-brand-900 hover:bg-brand-300 transition-colors">
                    Lista de Presentes</a>
                <a href="/donate"
                    class="block w-full text-center py-3 rounded-lg font-bold bg-brand-200 text-brand-800 hover:bg-brand-100 transition-colors">
                    Contribuição
                </a>
            </div>
      `
        }
    },
    {
        type: 'nav',
        icon: 'mdi:check-circle',
        label: 'CONFIRMAÇÃO DE PRESENÇA',
        to: '/rsvp'
    }
]);

onMounted(async () => {
    document.body.classList.add('theme-bg')
    await loadEvent();
})
onUnmounted(() => {
    document.body.classList.remove('theme-bg')
})

</script>