import { supabase } from "../config/supabase";

export const authService = {
  async login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    const { data: userData, error: profileError } = await supabase
      .from("users")
      .select("is_admin")
      .eq("id", data.user.id)
      .single();

    if (profileError || !userData?.is_admin) {
      await this.logout();
      throw new Error("Not authorized. Admin access required.");
    }

    return data;
  },

  async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getCurrentUser() {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session?.user || null;
  },

  async isAdmin() {
    const user = await this.getCurrentUser();
    if (!user) return false;

    // Create a timeout promise that rejects after 5 seconds
    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Request timed out")), 5000)
    );

    try {
      // Run the Database Query
      const dbQuery = supabase
        .from("users")
        .select("is_admin")
        .eq("id", user.id)
        .single();

      // Race: Whichever finishes first wins
      const { data, error } = await Promise.race([dbQuery, timeout]);

      if (error) return false;
      return data?.is_admin || false;
    } catch (error) {
      console.error("Admin check failed or timed out:", error);
      return false; // Fail safe so the app loads (even if access is denied)
    }
  },
};
