import { giftService, type Gift } from '~/services/giftService';
import { giftRequestSchema, type GiftRequest } from '~/dtos/gift/giftRequest';
import Swal from 'sweetalert2';

export const useGifts = () => {
  const gifts = ref<Gift[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const totalGifts = computed(() => gifts.value.length);
  const receivedCount = computed(
    () => gifts.value.filter((g) => g.quantity_gifted >= g.quantity).length
  );
  const availableCount = computed(
    () =>
      gifts.value.filter(
        (g) => g.is_available && g.quantity_gifted < g.quantity
      ).length
  );

  const loadGifts = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await giftService.getAllGifts();
      if (response.error) {
        error.value = response.error;
        return;
      }
      gifts.value = response.data || [];
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : 'Erro ao carregar presentes';
    } finally {
      isLoading.value = false;
    }
  };

  const createGift = async (giftData: GiftRequest) => {
    isLoading.value = true;
    error.value = null;

    try {
      const validated = giftRequestSchema.safeParse(giftData);
      if (!validated.success) {
        error.value = 'Dados inválidos';
        return false;
      }

      const response = await giftService.createGift(validated.data);
      if (response.error) {
        error.value = response.error;
        return false;
      }

      if (response.data) {
        gifts.value.unshift(response.data[0]);

        await Swal.fire({
          title: 'Sucesso!',
          text: 'Presente adicionado com sucesso',
          icon: 'success',
          toast: true,
          position: 'bottom-left',
          showConfirmButton: false,
          timer: 2000,
        });
      }

      return true;
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : 'Erro ao criar presente';
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const markAsReceived = async (giftId: number) => {
    try {
      const response = await giftService.markGiftAsReceived(giftId);
      if (response.error) {
        await Swal.fire({
          title: 'Erro',
          text: response.error,
          icon: 'error',
          toast: true,
          position: 'bottom-left',
          showConfirmButton: false,
          timer: 2000,
        });
        return false;
      }

      if (response.data) {
        const index = gifts.value.findIndex((g) => g.id === giftId);
        if (index !== -1) {
          gifts.value[index] = response.data[0];
        }

        await Swal.fire({
          title: 'Sucesso!',
          text: 'Recebimento confirmado',
          icon: 'success',
          toast: true,
          position: 'bottom-left',
          showConfirmButton: false,
          timer: 2000,
        });
      }

      return true;
    } catch (err) {
      await Swal.fire({
        title: 'Erro',
        text:
          err instanceof Error ? err.message : 'Erro ao confirmar recebimento',
        icon: 'error',
        toast: true,
        position: 'bottom-left',
        showConfirmButton: false,
        timer: 2000,
      });
      return false;
    }
  };

  const updateGift = async (giftId: number, giftData: Partial<GiftRequest>) => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await giftService.updateGift(giftId, giftData);
      if (response.error) {
        error.value = response.error;
        return false;
      }

      if (response.data) {
        const index = gifts.value.findIndex((g) => g.id === giftId);
        if (index !== -1) {
          gifts.value[index] = response.data[0];
        }

        await Swal.fire({
          title: 'Sucesso!',
          text: 'Presente atualizado com sucesso',
          icon: 'success',
          toast: true,
          position: 'bottom-left',
          showConfirmButton: false,
          timer: 2000,
        });
      }

      return true;
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : 'Erro ao atualizar presente';
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    gifts: readonly(gifts),
    isLoading: readonly(isLoading),
    error: readonly(error),
    totalGifts,
    receivedCount,
    availableCount,
    loadGifts,
    createGift,
    markAsReceived,
    updateGift,
  };
};
