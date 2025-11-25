import { supabase } from '../config/supabase';

export const authService = {
  // Login with email and password
  async login(email, password) {
    // TODO: Implement Supabase signInWithPassword
    console.log('Login requested for:', email);
    return { user: { email }, error: null }; // Mock response
  },

  // Logout
  async logout() {
    // TODO: Implement Supabase signOut
    console.log('Logout requested');
  },

  // Get current session
  async getSession() {
    // TODO: Implement getSession
    return null;
  },

  // Check if user is admin
  async isAdmin(userId) {
    // TODO: Query 'users' table for is_admin flag
    return false;
  }
};