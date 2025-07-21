import { getSupabase } from '~/utils/supabase';
import {
  eventRequestSchema,
  type EventRequest,
} from '~/dtos/event/eventRequest';
import {
  type EventResponse as EventData,
} from '~/dtos/event/eventResponse';

interface ServiceResponse<T> {
  data: T[] | null;
  error: string | null;
}

export const eventService = {
  async getEvent(): Promise<ServiceResponse<EventData>> {
    try {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('event')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        return { data: null, error: error.message };
      }

      if (!data || data.length === 0) {
        return { data: null, error: null };
      }

      return { data: [data[0] as EventData], error: null };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      };
    }
  },

  async createEvent(
    eventData: EventRequest
  ): Promise<ServiceResponse<EventData>> {
    try {
      const validated = eventRequestSchema.safeParse(eventData);
      if (!validated.success) {
        return { data: null, error: 'Dados inválidos' };
      }

      const eventDataWithTimezone = {
        ...validated.data,
        event_date: validated.data.event_date
          ? validated.data.event_date + '-03:00'
          : null,
      };

      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('event')
        .insert([eventDataWithTimezone])
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: [data as EventData], error: null };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      };
    }
  },

  async updateEvent(
    id: number,
    eventData: Partial<EventRequest>
  ): Promise<ServiceResponse<EventData>> {
    try {
      const eventDataWithTimezone = {
        ...eventData,
        event_date: eventData.event_date
          ? eventData.event_date + '-03:00'
          : undefined,
        updated_at: new Date().toISOString(),
      };

      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('event')
        .update(eventDataWithTimezone)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: [data as EventData], error: null };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      };
    }
  },

  async upsertEvent(
    eventData: EventRequest
  ): Promise<ServiceResponse<EventData>> {
    try {
      const validated = eventRequestSchema.safeParse(eventData);
      if (!validated.success) {
        return { data: null, error: 'Dados inválidos' };
      }

      const supabase = getSupabase();

      const { data: existingEvent } = await supabase
        .from('event')
        .select('id')
        .limit(1);

      if (existingEvent && existingEvent.length > 0) {
        return this.updateEvent(existingEvent[0].id as number, validated.data);
      } else {
        return this.createEvent(validated.data);
      }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      };
    }
  },
};
