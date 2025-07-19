<template>
    <div class="min-h-screen bg-gray-50">

        <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center justify-between mb-6">
                <h1 class="text-xl font-bold text-gray-900">
                    {{ isNew ? 'Novo Presente' : 'Editar Presente' }}
                </h1>
                <NuxtLink to="/admin?tab=gifts" class="text-gray-500 hover:text-gray-700">
                    <Icon name="mdi:close" size="24" />
                </NuxtLink>
            </div>

            <form @submit.prevent="handleSubmit" class="space-y-4 min-h-dvh">
                <div>
                    <label class="block text-sm font-medium mb-1 text-gray-700">Nome</label>
                    <input v-model="form.name" type="text" required
                        class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-500 focus:border-brand-500" />
                </div>

                <div>
                    <label class="block text-sm font-medium mb-1 text-gray-700">Preço (R$)</label>
                    <input v-model.number="form.price" type="number" step="0.01" min="0" required
                        class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-500 focus:border-brand-500" />
                </div>

                <div>
                    <label class="block text-sm font-medium mb-1 text-gray-700">URL da Imagem</label>
                    <input v-model="form.image_url" type="url"
                        class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-500 focus:border-brand-500" />
                </div>

                <div>
                    <label class="block text-sm font-medium mb-1 text-gray-700">URL de Pagamento</label>
                    <input v-model="form.payment_url" type="url" required
                        class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-500 focus:border-brand-500" />
                </div>

                <div>
                    <label class="block text-sm font-medium mb-1 text-gray-700">Quantidade Total</label>
                    <input v-model.number="form.quantity" type="number" min="1" required
                        class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-500 focus:border-brand-500" />
                </div>

                <div class="flex items-center gap-2">
                    <input v-model="form.is_available" type="checkbox" id="available"
                        class="rounded border-gray-300 text-brand-600 focus:ring-brand-500" />
                    <label for="available" class="text-sm font-medium text-gray-700">
                        Disponível para presentear
                    </label>
                </div>

                <div class="flex gap-3 pt-6">
                    <button type="submit" :disabled="loading"
                        class="flex-1 bg-brand-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed">
                        {{ loading ? 'Salvando...' : 'Salvar' }}
                    </button>

                    <button v-if="!isNew" type="button" @click="handleDelete" :disabled="loading"
                        class="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed">
                        Excluir
                    </button>
                </div>
            </form>
        </div>

    </div>
</template>

<script setup lang="ts">
import type { GiftRequest } from '~/dtos/gift/giftRequest';
import type { GiftResponse } from '~/dtos/gift/giftResponse';

const route = useRoute();
const router = useRouter();

const isNew = computed(() => route.params.id === 'new');
const loading = ref(false);

const form = ref<GiftRequest>({
    name: '',
    price: '',
    image_url: '',
    payment_url: '',
    external_reference: '',
    quantity: 1,
    quantity_gifted: 0,
    is_available: true
});

onMounted(async () => {
    if (!isNew.value) {
        await loadGift();
    }
});

async function loadGift() {
    try {
        loading.value = true;
        // TODO: Implementar chamada da API
        // const response = await $fetch<GiftResponse>(`/api/gifts/${route.params.id}`);

        // Mock data para teste
        const mockGift: GiftResponse = {
            id: Number(route.params.id),
            name: 'Panela de Pressão',
            price: '150.00',
            image_url: '/images/panela.jpg',
            payment_url: 'https://pix.example.com/panela',
            external_reference: 'panela-001',
            quantity: 2,
            quantity_gifted: 1,
            is_available: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        form.value = {
            name: mockGift.name,
            price: mockGift.price,
            image_url: mockGift.image_url || '',
            payment_url: mockGift.payment_url,
            external_reference: mockGift.external_reference,
            quantity: mockGift.quantity,
            quantity_gifted: mockGift.quantity_gifted,
            is_available: mockGift.is_available
        };
    } catch (error) {
        console.error('Erro ao carregar presente:', error);
        // TODO: Mostrar toast de erro
    } finally {
        loading.value = false;
    }
}

async function handleSubmit() {
    try {
        loading.value = true;

        if (isNew.value) {
            // TODO: Implementar criação
            // await $fetch('/api/gifts', { method: 'POST', body: form.value });
            console.log('Criando presente:', form.value);
        } else {
            // TODO: Implementar atualização
            // await $fetch(`/api/gifts/${route.params.id}`, { method: 'PUT', body: form.value });
            console.log('Atualizando presente:', form.value);
        }

        await router.push('/admin');
    } catch (error) {
        console.error('Erro ao salvar presente:', error);
        // TODO: Mostrar toast de erro
    } finally {
        loading.value = false;
    }
}

async function handleDelete() {
    if (!confirm('Tem certeza que deseja excluir este presente?')) {
        return;
    }

    try {
        loading.value = true;
        // TODO: Implementar exclusão
        // await $fetch(`/api/gifts/${route.params.id}`, { method: 'DELETE' });
        console.log('Excluindo presente:', route.params.id);

        await router.push('/admin');
    } catch (error) {
        console.error('Erro ao excluir presente:', error);
        // TODO: Mostrar toast de erro
    } finally {
        loading.value = false;
    }
}
</script>

<style scoped></style>