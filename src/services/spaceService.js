import { supabase } from '../config/supabase';

export const spaceService = {
  // Fetch all spaces
  async getAll() {
    // TODO: Fetch spaces (possibly joined with parent facility name)
    console.log('Fetching all spaces...');
    return [];
  },

  // Create a new space
  async create(spaceData) {
    // TODO: Insert into 'spaces'
    console.log('Creating space:', spaceData);
  },

  // Update a space
  async update(id, spaceData) {
    // TODO: Update 'spaces'
    console.log(`Updating space ${id}:`, spaceData);
  },

  // Delete a space
  async delete(id) {
    // TODO: Delete from 'spaces'
    console.log(`Deleting space ${id}`);
  }
};