import { supabase, isSupabaseConfigured } from './supabase';

export const getBunpouExplanation = async (bunpou: string): Promise<string | null> => {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('study')
        .select('text')
        .eq('bunpou', bunpou)
        .maybeSingle();

      if (error) {
        console.error('Error fetching bunpou explanation:', error);
        return null;
      }
      
      return data?.text || null;
    } catch (err) {
      console.error('Unexpected error fetching bunpou:', err);
      return null;
    }
  }
  
  // Local fallback if Supabase is not configured
  return "Supabase belum dikonfigurasi. Tambahkan URL dan Key di .env untuk mengambil data dari tabel 'study'.";
};
