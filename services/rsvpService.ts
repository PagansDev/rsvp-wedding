import { getSupabase } from '~/utils/supabase';
import { rsvpRequestSchema, type RsvpRequest } from '~/dtos/rsvp/rsvpRequest';
import { type RsvpResponse as RsvpData } from '~/dtos/rsvp/rsvpResponse';

interface ServiceResponse<T> {
  data: T[] | null;
  error: string | null;
}

export const rsvpService = {
  async getAllRsvps(): Promise<ServiceResponse<RsvpData>> {
    try {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('rsvp')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: data as RsvpData[], error: null };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      };
    }
  },

  async createRsvp(rsvpData: RsvpRequest): Promise<ServiceResponse<RsvpData>> {
    try {
      const validated = rsvpRequestSchema.safeParse(rsvpData);
      if (!validated.success) {
        return { data: null, error: 'Dados inválidos' };
      }

      const dbData = {
        name: validated.data.name,
        has_guest: validated.data.hasGuest,
        guest_name: validated.data.guestName || null,
        whatsapp: validated.data.whatsapp,
        document: validated.data.document || '',
        guest_document: validated.data.guestDocument || null,
      };

      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('rsvp')
        .insert([dbData])
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: [data as RsvpData], error: null };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      };
    }
  },

  async getRsvpStats(): Promise<{
    total: number;
    withGuests: number;
    withoutGuests: number;
  }> {
    try {
      const supabase = getSupabase();
      const { data, error } = await supabase.from('rsvp').select('has_guest');

      if (error) {
        return { total: 0, withGuests: 0, withoutGuests: 0 };
      }

      const total = data.length;
      const withGuests = data.filter((rsvp) => rsvp.has_guest).length;
      const withoutGuests = total - withGuests;

      return { total, withGuests, withoutGuests };
    } catch (error) {
      return { total: 0, withGuests: 0, withoutGuests: 0 };
    }
  },
};
