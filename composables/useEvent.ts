import { eventService, type Event } from '~/services/eventService';
import {
  eventRequestSchema,
  type EventRequest,
} from '~/dtos/event/eventRequest';
import Swal from 'sweetalert2';

export const useEvent = () => {
  const event = ref<Event | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const loadEvent = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await eventService.getEvent();
      if (response.error) {
        error.value = response.error;
        return;
      }
      event.value = response.data?.[0] || null;
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : 'Erro ao carregar evento';
    } finally {
      isLoading.value = false;
    }
  };

  const saveEvent = async (eventData: EventRequest) => {
    isLoading.value = true;
    error.value = null;

    try {
      const validated = eventRequestSchema.safeParse(eventData);
      if (!validated.success) {
        error.value = 'Dados inválidos';
        return false;
      }

      const response = await eventService.upsertEvent(validated.data);
      if (response.error) {
        error.value = response.error;
        return false;
      }

      if (response.data) {
        event.value = response.data[0];

        await Swal.fire({
          title: 'Sucesso!',
          text: 'Evento salvo com sucesso',
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
        err instanceof Error ? err.message : 'Erro ao salvar evento';
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const updateEvent = async (eventData: Partial<EventRequest>) => {
    if (!event.value?.id) {
      error.value = 'Evento não encontrado';
      return false;
    }

    isLoading.value = true;
    error.value = null;

    try {
      const response = await eventService.updateEvent(
        event.value.id,
        eventData
      );
      if (response.error) {
        error.value = response.error;
        return false;
      }

      if (response.data) {
        event.value = response.data[0];

        await Swal.fire({
          title: 'Sucesso!',
          text: 'Evento atualizado com sucesso',
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
        err instanceof Error ? err.message : 'Erro ao atualizar evento';
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    event: readonly(event),
    isLoading: readonly(isLoading),
    error: readonly(error),
    loadEvent,
    saveEvent,
    updateEvent,
  };
};
