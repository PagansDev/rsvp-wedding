import { rsvpService, type Rsvp } from '~/services/rsvpService';
import { rsvpRequestSchema, type RsvpRequest } from '~/dtos/rsvp/rsvpRequest';
import Swal from 'sweetalert2';

export const useRsvps = () => {
  const rsvps = ref<Rsvp[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const stats = ref({ total: 0, withGuests: 0, withoutGuests: 0 });

  const totalRsvps = computed(() => rsvps.value.length);
  const withGuests = computed(
    () => rsvps.value.filter((r) => r.has_guest).length
  );
  const withoutGuests = computed(() => totalRsvps.value - withGuests.value);

  const loadRsvps = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await rsvpService.getAllRsvps();
      if (response.error) {
        error.value = response.error;
        return;
      }
      rsvps.value = response.data || [];
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : 'Erro ao carregar confirmações';
    } finally {
      isLoading.value = false;
    }
  };

  const createRsvp = async (rsvpData: RsvpRequest) => {
    isLoading.value = true;
    error.value = null;

    try {
      const validated = rsvpRequestSchema.safeParse(rsvpData);
      if (!validated.success) {
        error.value = 'Dados inválidos';
        return false;
      }

      const response = await rsvpService.createRsvp(validated.data);
      if (response.error) {
        error.value = response.error;
        return false;
      }

      if (response.data) {
        rsvps.value.unshift(response.data[0]);

        await Swal.fire({
          title: 'Sucesso!',
          text: 'Confirmação adicionada com sucesso',
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
        err instanceof Error ? err.message : 'Erro ao criar confirmação';
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const loadStats = async () => {
    try {
      const response = await rsvpService.getRsvpStats();
      stats.value = response;
    } catch (err) {
      console.error('Erro ao carregar estatísticas:', err);
    }
  };

  const loadAll = async () => {
    await Promise.all([loadRsvps(), loadStats()]);
  };

  return {
    rsvps: readonly(rsvps),
    isLoading: readonly(isLoading),
    error: readonly(error),
    stats: readonly(stats),
    totalRsvps,
    withGuests,
    withoutGuests,
    loadRsvps,
    createRsvp,
    loadStats,
    loadAll,
  };
};
