import { useState, useEffect, useRef } from 'react';
import { AuthContext } from './AuthContext';
import { authService } from '../services/authService';
import { supabase } from '../config/supabase';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;

    // 1. Define the logic to process a session safely
    const handleSession = async (currentUser) => {
      if (!mounted.current) return;

      // Update user state immediately
      setUser(currentUser);

      if (currentUser) {
        // If we have a user, check admin status
        try {
          const adminStatus = await authService.isAdmin();
          if (mounted.current) setIsAdmin(adminStatus);
        } catch (error) {
          console.error('Admin check error:', error);
          if (mounted.current) setIsAdmin(false);
        }
      } else {
        // No user
        if (mounted.current) setIsAdmin(false);
      }

      // ALWAYS turn off loading when done
      if (mounted.current) setLoading(false);
    };

    // 2. Run Immediate Check (Fixes "Listener didn't fire" issue)
    const initAuth = async () => {
      try {
        // Use getSession instead of getUser to avoid network hangs on mobile
        const { data: { session } } = await supabase.auth.getSession();
        await handleSession(session?.user ?? null);
      } catch (err) {
        console.error('Init auth failed:', err);
        if (mounted.current) setLoading(false);
      }
    };

    initAuth();

    // 3. Listen for future changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        // We handle the initial load manually above, so we can ignore the initial event
        // OR just process updates. This is a simple way to keep sync.
        if (_event === 'SIGNED_IN' || _event === 'SIGNED_OUT') {
           setLoading(true); // Show spinner briefly during state change
           handleSession(session?.user ?? null);
        }
      }
    );

    // 4. SAFETY VALVE: Force stop loading after 6 seconds
    // This guarantees the app NEVER gets stuck on an infinite spinner
    const safetyTimeout = setTimeout(() => {
      if (loading && mounted.current) {
        console.warn('⚠️ Auth timed out! Forcing app load.');
        setLoading(false);
      }
    }, 6000);

    return () => {
      mounted.current = false;
      clearTimeout(safetyTimeout);
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