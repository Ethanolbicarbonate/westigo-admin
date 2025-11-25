import { useState, useEffect, useRef } from 'react';
import { AuthContext } from './AuthContext';
import { authService } from '../services/authService';
import { supabase } from '../config/supabase';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  
  const lastUserId = useRef(null);

  useEffect(() => {
    let mounted = true;

    // Listen for Auth Changes (This handles Initial Load AND Updates)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        // Ignore token refreshes to prevent flickering
        if (event === 'TOKEN_REFRESHED') return;

        const currentUser = session?.user || null;

        // Avoid duplicate processing if the user hasn't changed
        if (currentUser?.id === lastUserId.current) {
          // Just update the object reference, don't re-run admin checks
          setUser(currentUser);
          return; 
        }

        // Update Ref and State
        lastUserId.current = currentUser?.id || null;
        setUser(currentUser);
        
        if (currentUser) {
          setLoading(true);
          try {
            // Check Admin Status
            const adminStatus = await authService.isAdmin();
            if (mounted) setIsAdmin(adminStatus);
          } catch (error) {
            console.error('Error checking admin status:', error);
            if (mounted) setIsAdmin(false);
          } finally {
            if (mounted) setLoading(false);
          }
        } else {
          // Not logged in
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