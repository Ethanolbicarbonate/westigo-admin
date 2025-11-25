import { supabase } from '../config/supabase';

export const facilityService = {
  // Fetch all facilities
  async getAll() {
    const { data, error } = await supabase
      .from('facilities')
      .select('*');
      
    if (error) throw error;
    return data;
  },

  // Create a new facility
  async create(facilityData) {
    // TODO: Insert into 'facilities'
    console.log('Creating facility:', facilityData);
  },

  // Update an existing facility
  async update(id, facilityData) {
    // TODO: Update 'facilities' where id matches
    console.log(`Updating facility ${id}:`, facilityData);
  },

  // Delete a facility
  async delete(id) {
    // TODO: Delete from 'facilities'
    console.log(`Deleting facility ${id}`);
  }
};