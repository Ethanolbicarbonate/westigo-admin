import { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import { authService } from '../services/authService';
import { supabase } from '../config/supabase';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let mounted = true;

    // Internal function to handle initial check
    async function initializeAuth() {
      try {
        const currentUser = await authService.getCurrentUser();
        
        if (mounted) {
          setUser(currentUser);
          
          if (currentUser) {
            const adminStatus = await authService.isAdmin();
            if (mounted) setIsAdmin(adminStatus);
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    // Run initial check
    initializeAuth();

    // Listen for Auth Changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        // 🛑 FIX: Ignore token refreshes to prevent random loading screens on tab switch
        if (event === 'TOKEN_REFRESHED') {
          return;
        }

        const currentUser = session?.user || null;
        setUser(currentUser);
        
        if (currentUser) {
          // Only show loading if we are actually signing in/changing users
          setLoading(true);
          
          try {
            const adminStatus = await authService.isAdmin();
            if (mounted) setIsAdmin(adminStatus);
          } catch (error) {
            console.error('Error checking admin status:', error);
            // Default to false on error to be safe
            if (mounted) setIsAdmin(false);
          } finally {
            // ✅ FIX: "finally" ensures the loading screen ALWAYS turns off
            if (mounted) setLoading(false);
          }
        } else {
          if (mounted) {
            setIsAdmin(false);
            setLoading(false);
          }
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const value = {
    user,
    loading,
    isAdmin,
    login: authService.login,
    logout: authService.logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}