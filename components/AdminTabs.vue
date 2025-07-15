<template>
    <div>
        <nav class="flex border-b-2 border-brand-300 mb-4 gap-2">
            <button v-for="tab in tabs" :key="tab.key"
                :class="['flex-1 py-3 text-center font-medium transition', { '!border-b-4 !border-brand-500 !bg-transparent !rounded-none !text-lg !text-brand-600': tab.key === selectedTab, '!text-gray-500 !bg-transparent !rounded-none !text-lg': tab.key !== selectedTab }]"
                @click="selectTab(tab.key)">
                {{ tab.label }}
            </button>
        </nav>
        <component :is="currentComponent" />
    </div>
</template>

<script setup lang="ts">
import AdminGuests from './AdminGuests.vue'
import AdminGifts from './AdminGifts.vue'
import AdminEvent from './AdminEvent.vue'

const tabs = [
    { key: 'guests', label: 'Convidados', component: AdminGuests },
    { key: 'gifts', label: 'Presentes', component: AdminGifts },
    { key: 'event', label: 'Evento', component: AdminEvent },
];

const route = useRoute();
const router = useRouter();

const selectedTab = ref('guests');

onMounted(() => {
    if (route.query.tab && tabs.some(tab => tab.key === route.query.tab)) {
        selectedTab.value = route.query.tab as string;
    }
});

function selectTab(tabKey: string) {
    selectedTab.value = tabKey;
    router.replace({ query: { ...route.query, tab: tabKey } });
}

const currentComponent = computed(() => {
    const found = tabs.find(tab => tab.key === selectedTab.value);
    return found ? found.component : AdminGuests;
});

const emit = defineEmits(['selectedTab']);

watch(selectedTab, (newValue) => {
    emit('selectedTab', newValue);
});
</script>

<style>
nav button {
    outline: none;
}

nav button:focus {
    background: #f3f4f6;
}
</style>
