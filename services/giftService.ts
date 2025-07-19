import { getSupabase } from '~/utils/supabase';
import { giftRequestSchema, type GiftRequest } from '~/dtos/gift/giftRequest';
import { type GiftResponse as GiftData } from '~/dtos/gift/giftResponse';

interface ServiceResponse<T> {
  data: T[] | null;
  error: string | null;
}

export const giftService = {
  async getAllGifts(): Promise<ServiceResponse<GiftData>> {
    try {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('gift')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: data as GiftData[], error: null };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      };
    }
  },

  async createGift(giftData: GiftRequest): Promise<ServiceResponse<GiftData>> {
    try {
      const validated = giftRequestSchema.safeParse(giftData);
      if (!validated.success) {
        return { data: null, error: 'Dados inválidos' };
      }

      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('gift')
        .insert([validated.data])
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: [data as GiftData], error: null };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      };
    }
  },

  async updateGift(
    id: number,
    giftData: Partial<GiftRequest>
  ): Promise<ServiceResponse<GiftData>> {
    try {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('gift')
        .update({ ...giftData, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: [data as GiftData], error: null };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      };
    }
  },

  async markGiftAsReceived(id: number): Promise<ServiceResponse<GiftData>> {
    try {
      const supabase = getSupabase();

      const { data: currentGift, error: fetchError } = await supabase
        .from('gift')
        .select('quantity_gifted, quantity')
        .eq('id', id)
        .single();

      if (fetchError) {
        return { data: null, error: fetchError.message };
      }

      const gift = currentGift as { quantity_gifted: number; quantity: number };

      if (gift.quantity_gifted >= gift.quantity) {
        return { data: null, error: 'Presente já foi completamente recebido' };
      }

      const { data, error } = await supabase
        .from('gift')
        .update({
          quantity_gifted: gift.quantity_gifted + 1,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: [data as GiftData], error: null };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      };
    }
  },
};
