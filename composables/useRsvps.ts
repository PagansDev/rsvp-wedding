import { rsvpService } from '~/services/rsvpService';
import type { RsvpRequest } from '~/dtos/rsvp/rsvpRequest';
import type { RsvpResponse } from '~/dtos/rsvp/rsvpResponse';
import Swal from 'sweetalert2';

export const useRsvps = () => {
  const rsvps = ref<RsvpResponse[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const formData = ref<RsvpRequest>({
    name: '',
    hasGuest: false,
    whatsapp: '',
    guestName: '',
    document: '',
    guestDocument: '',
  });

  const saveFormData = (data: RsvpRequest) => {
    formData.value = { ...data };
  };

  const clearFormData = () => {
    formData.value = {
      name: '',
      hasGuest: false,
      whatsapp: '',
      guestName: '',
      document: '',
      guestDocument: '',
    };
  };

  const fetchRsvps = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      const { data, error: serviceError } = await rsvpService.getAllRsvps();

      if (serviceError) {
        error.value = serviceError;
        return;
      }

      rsvps.value = data || [];
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : 'Erro ao carregar RSVPs';
    } finally {
      isLoading.value = false;
    }
  };

  const createRsvp = async (rsvpData: RsvpRequest) => {
    isLoading.value = true;
    error.value = null;

    try {
      const { data, error: serviceError } = await rsvpService.createRsvp(
        rsvpData
      );

      if (serviceError) {
        error.value = serviceError;
        return { success: false, error: serviceError };
      }

      if (data && data.length > 0) {
        rsvps.value.unshift(data[0]);
      }

      return { success: true, data };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Erro ao criar RSVP';
      error.value = errorMessage;
      return { success: false, error: errorMessage };
    } finally {
      isLoading.value = false;
    }
  };

  const updateRsvpStatus = async (rsvpId: number, status: string) => {
    try {
      const { data, error: serviceError } = await rsvpService.updateRsvpStatus(
        rsvpId,
        status
      );

      if (serviceError) {
        await Swal.fire({
          title: 'Erro!',
          text: serviceError,
          icon: 'error',
          toast: true,
          position: 'bottom-left',
          showConfirmButton: false,
          timer: 3000,
        });
        return { success: false, error: serviceError };
      }

      if (data && data.length > 0) {
        const index = rsvps.value.findIndex((rsvp) => rsvp.id === rsvpId);
        if (index !== -1) {
          rsvps.value[index] = data[0];
        }
      }

      await Swal.fire({
        title: 'Sucesso!',
        text: `Status atualizado para ${status}`,
        icon: 'success',
        toast: true,
        position: 'bottom-left',
        showConfirmButton: false,
        timer: 1500,
      });

      return { success: true, data };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Erro ao atualizar status';
      await Swal.fire({
        title: 'Erro!',
        text: errorMessage,
        icon: 'error',
        toast: true,
        position: 'bottom-left',
        showConfirmButton: false,
        timer: 3000,
      });
      return { success: false, error: errorMessage };
    }
  };

  const deleteRsvp = async (rsvpId: number) => {
    try {
      const { error: serviceError } = await rsvpService.deleteRsvp(rsvpId);

      if (serviceError) {
        await Swal.fire({
          title: 'Erro!',
          text: serviceError,
          icon: 'error',
          toast: true,
          position: 'bottom-left',
          showConfirmButton: false,
          timer: 3000,
        });
        return { success: false, error: serviceError };
      }

      rsvps.value = rsvps.value.filter((rsvp) => rsvp.id !== rsvpId);

      await Swal.fire({
        title: 'Sucesso!',
        text: 'RSVP removido com sucesso',
        icon: 'success',
        toast: true,
        position: 'bottom-left',
        showConfirmButton: false,
        timer: 1500,
      });

      return { success: true };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Erro ao deletar RSVP';
      await Swal.fire({
        title: 'Erro!',
        text: errorMessage,
        icon: 'error',
        toast: true,
        position: 'bottom-left',
        showConfirmButton: false,
        timer: 3000,
      });
      return { success: false, error: errorMessage };
    }
  };

  const getRsvpStats = async () => {
    try {
      return await rsvpService.getRsvpStats();
    } catch (err) {
      console.error('Erro ao buscar estatísticas:', err);
      return { total: 0, withGuests: 0, withoutGuests: 0 };
    }
  };

  return {
    rsvps: readonly(rsvps),
    isLoading: readonly(isLoading),
    error: readonly(error),
    formData: readonly(formData),
    saveFormData,
    clearFormData,
    fetchRsvps,
    createRsvp,
    updateRsvpStatus,
    deleteRsvp,
    getRsvpStats,
  };
};
