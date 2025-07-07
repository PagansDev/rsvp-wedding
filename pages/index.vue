<template>
    <div class="flex flex-col gap-8 min-h-dvh w-full p-2">

        <div class="ml-12 mt-20">
            <img src="../assets/images/logo.png" alt="Logo">

        </div>

        <div class="flex flex-col">

            <div class="flex flex-col gap-12">
                <p class="text-center text-sm uppercase">Convidam para a celebração do nosso casamento</p>
                <div class="flex flex-row gap-2 items-center justify-center">
                    <Icon name="mdi:calendar-check" size="20" />
                    <p class="text-center text-sm font-bold uppercase">sábado | 27/09/2025 | às 13:30</p>
                </div>

                <p class="text-center text-sm uppercase">"Para que todos vejam, e saibam, e considerem, e juntamente
                    entendam que a mão do Senhor fez isto." isaías 41:20</p>

            </div>

        </div>

        <SharedNavBar :buttons="navButtons" position="default" placement="default" variant="floating"/>

    </div>
</template>

<script setup>

definePageMeta({
  layout: 'default'
})

const navButtons = [
    {
        type: 'trigger',
        icon: 'mdi:map-marker',
        label: 'LOCAL DA CERIMÔNIA',
        modalType: 'map',
        modalProps: {
            title: 'Local da Cerimônia',
            embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d646.7159905809697!2d-47.50662316254872!3d-23.518899614417123!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94c58b3ff623c5cb%3A0x6b124c3445c116be!2sIgreja%20Evangelho%20Quadrangular!5e0!3m2!1spt-BR!2sbr!4v1751840109502!5m2!1spt-BR!2sbr'
        }
    },
    {
        type: 'trigger',
        icon: 'ph:cheers',
        label: 'LOCAL DA CELEBRAÇÃO',
        modalType: 'map',
        modalProps: {
            title: 'Local da Celebração',
            embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d647.1030137196235!2d-47.51104781816126!3d-23.439988113261965!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94c5f59da600c913%3A0x4429fd041fcd4a55!2sConquista%20Vila%20Acqua!5e0!3m2!1spt-BR!2sbr!4v1751840342228!5m2!1spt-BR!2sbr'
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
        <div class="text-center space-y-4">
          <p class="text-gray-600">Sua presença já é o nosso maior presente!</p>
          <p class="text-sm">Mas se quiser contribuir, ficaremos muito gratos:</p>
          <div class="bg-gray-50 p-4 rounded-lg">
            <p class="font-semibold">PIX: casamento@exemplo.com</p>
            <p class="text-sm text-gray-500">Paulo & Isa</p>
          </div>
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
]

onMounted(() => {
  document.body.classList.add('theme-bg')
})
onUnmounted(() => {
  document.body.classList.remove('theme-bg')
})

</script>

<style lang="scss" scoped></style>