import { supabase } from '../config/supabase';

const BUCKET_NAME = 'facilities';

export const facilityService = {
  // Fetch all facilities ordered by name
  async getAll() {
    const { data, error } = await supabase
      .from('facilities')
      .select('*')
      .order('name', { ascending: true });
      
    if (error) throw error;
    return data;
  },

  // Get a single facility by ID
  async getById(id) {
    const { data, error } = await supabase
      .from('facilities')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    return data;
  },

  // Create a new facility
  async create(facilityData) {
    const { data, error } = await supabase
      .from('facilities')
      .insert([facilityData])
      .select()
      .single();
      
    if (error) throw error;
    return data;
  },

  // Update an existing facility
  async update(id, facilityData) {
    const { data, error } = await supabase
      .from('facilities')
      .update(facilityData)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  },

  // Delete a facility
  async delete(id) {
    const { error } = await supabase
      .from('facilities')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
  },

  // Upload image to Supabase Storage and return Public URL
  async uploadImage(file) {
    // Generate a unique file name to avoid collisions
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${fileName}`;

    // 1. Upload file
    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) throw uploadError;

    // 2. Get Public URL
    const { data } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    return data.publicUrl;
  }
};