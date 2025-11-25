import { supabase } from "../config/supabase";

export const authService = {
  /**
   * Log in with email and password, then verify admin status.
   * Throws an error if auth fails OR if user is not an admin.
   */
  async login(email, password) {
    // 1. Authenticate with Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // 2. Verify "is_admin" status in the public.users table
    // Note: This column needs to exist in your database (we will address this in Sub-Phase 2.10)
    const { data: userData, error: profileError } = await supabase
      .from("users")
      .select("is_admin")
      .eq("id", data.user.id)
      .single();

    // If database query fails or is_admin is false/null
    if (profileError || !userData?.is_admin) {
      // Immediately sign out to kill the session
      await this.logout();
      throw new Error("Not authorized. Admin access required.");
    }

    return data;
  },

  /**
   * Sign out the current user
   */
  async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  /**
   * Get the current active session user from Supabase
   */
  async getCurrentUser() {
    // OLD: const { data: { user } } = await supabase.auth.getUser();

    // NEW: Checks local storage first, avoids network hang
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session?.user || null;
  },

  /**
   * Check if the currently logged-in user is an admin
   * Useful for session persistence checks
   */
  async isAdmin() {
    const user = await this.getCurrentUser();
    if (!user) return false;

    const { data, error } = await supabase
      .from("users")
      .select("is_admin")
      .eq("id", user.id)
      .single();

    if (error) return false;
    return data?.is_admin || false;
  },
};
