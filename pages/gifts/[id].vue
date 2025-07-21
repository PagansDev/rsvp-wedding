<template>
    <div class="min-h-screen bg-gray-50">

        <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center justify-between mb-6">
                <h1 class="text-xl font-bold text-gray-900">
                    Editar Presente
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

                <div class="flex items-center justify-start gap-2">
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
                </div>
            </form>
        </div>

    </div>
</template>

<script setup lang="ts">
import type { GiftRequest } from '~/dtos/gift/giftRequest';
import { giftService } from '~/services/giftService';
import Swal from 'sweetalert2';

const route = useRoute();
const router = useRouter();

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
    await loadGift();
});

async function loadGift() {
    try {
        loading.value = true;
        const id = Number(route.params.id);
        const { data, error } = await giftService.getGiftById(id);
        if (error) throw new Error(error);
        if (!data || data.length === 0) throw new Error('Presente não encontrado');

        const gift = data[0];
        form.value = {
            name: gift.name,
            price: gift.price,
            image_url: gift.image_url || '',
            payment_url: gift.payment_url,
            external_reference: gift.external_reference,
            quantity: gift.quantity,
            quantity_gifted: gift.quantity_gifted,
            is_available: gift.is_available
        };
    } catch (error) {
        console.error('Erro ao carregar presente:', error);
        await Swal.fire({
            title: 'Erro!',
            text: error instanceof Error ? error.message : 'Erro ao carregar presente',
            icon: 'error',
            toast: true,
            position: 'bottom-left',
            showConfirmButton: false,
            timer: 3000
        });
    } finally {
        loading.value = false;
    }
}

async function handleSubmit() {
    try {
        loading.value = true;

        const id = Number(route.params.id);
        const { error } = await giftService.updateGift(id, form.value);
        if (error) throw new Error(error);

        await Swal.fire({
            title: 'Sucesso!',
            text: 'Presente atualizado com sucesso!',
            icon: 'success',
            toast: true,
            position: 'bottom-left',
            showConfirmButton: false,
            timer: 1500
        });

        await router.push('/admin?tab=gifts');
    } catch (error) {
        console.error('Erro ao salvar presente:', error);
        await Swal.fire({
            title: 'Erro!',
            text: error instanceof Error ? error.message : 'Erro ao salvar presente',
            icon: 'error',
            toast: true,
            position: 'bottom-left',
            showConfirmButton: false,
            timer: 3000
        });
    } finally {
        loading.value = false;
    }
}
</script>

<style scoped></style>