import { supabase } from '../config/supabase';

export const eventService = {
  // Fetch all events
  async getAll() {
    // TODO: Fetch events
    console.log('Fetching all events...');
    return [];
  },

  // Create a new event
  async create(eventData) {
    // TODO: Insert into 'events'
    console.log('Creating event:', eventData);
  },

  // Update an event
  async update(id, eventData) {
    // TODO: Update 'events'
    console.log(`Updating event ${id}:`, eventData);
  },

  // Delete an event
  async delete(id) {
    // TODO: Delete from 'events'
    console.log(`Deleting event ${id}`);
  }
};