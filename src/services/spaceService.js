import { supabase } from '../config/supabase';

const BUCKET_NAME = 'spaces';

export const spaceService = {
  // Fetch all spaces, joining with parent facility to get the name
  async getAll() {
    const { data, error } = await supabase
      .from('spaces')
      .select('*, facilities(name)')
      .order('name', { ascending: true });
      
    if (error) throw error;
    return data;
  },

  // Fetch spaces for a specific facility
  async getByFacilityId(facilityId) {
    const { data, error } = await supabase
      .from('spaces')
      .select('*')
      .eq('parent_facility_id', facilityId)
      .order('name', { ascending: true });

    if (error) throw error;
    return data;
  },

  // Create a new space
  async create(spaceData) {
    const { data, error } = await supabase
      .from('spaces')
      .insert([spaceData])
      .select()
      .single();
      
    if (error) throw error;
    return data;
  },

  // Update a space
  async update(id, spaceData) {
    const { data, error } = await supabase
      .from('spaces')
      .update(spaceData)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  },

  // Delete a space
  async delete(id) {
    const { error } = await supabase
      .from('spaces')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
  },

  // Upload image to 'spaces' bucket
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