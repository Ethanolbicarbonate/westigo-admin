import { supabase } from '../config/supabase';

const BUCKET_NAME = 'events'; // Ensure this bucket exists in Supabase

export const eventService = {
  // Fetch all events with location details (Space -> Facility)
  async getAll() {
    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        spaces (
          id,
          name,
          facilities (
            id,
            name
          )
        )
      `)
      .order('start_date', { ascending: true });
      
    if (error) throw error;
    return data;
  },

  // Create a new event
  async create(eventData) {
    const { data, error } = await supabase
      .from('events')
      .insert([eventData])
      .select()
      .single();
      
    if (error) throw error;
    return data;
  },

  // Update an existing event
  async update(id, eventData) {
    const { data, error } = await supabase
      .from('events')
      .update(eventData)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  },

  // Delete an event
  async delete(id) {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
  },

  // Upload event banner
  async uploadImage(file) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    return data.publicUrl;
  }
};