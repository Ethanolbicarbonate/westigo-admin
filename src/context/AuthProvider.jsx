import { useState, useEffect, useRef } from 'react';
import { AuthContext } from './AuthContext';
import { authService } from '../services/authService';
import { supabase } from '../config/supabase';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // 1. New Ref to track the user ID without triggering re-renders
  const lastUserId = useRef(null);

  useEffect(() => {
    let mounted = true;

    // Internal function to handle initial check
    async function initializeAuth() {
      try {
        const currentUser = await authService.getCurrentUser();
        
        if (mounted) {
          // Update the ref so we don't re-trigger in the subscription
          lastUserId.current = currentUser?.id || null;
          
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

        if (event === 'TOKEN_REFRESHED') return;

        const currentUser = session?.user || null;

        // 🛑 FIX: Check if identity actually changed
        // If the user ID matches what we already have, it's just a session update (like tab focus).
        // Update the user object (for new tokens) but DO NOT trigger loading/admin check.
        if (currentUser?.id === lastUserId.current) {
          setUser(currentUser);
          return; 
        }

        // Identity changed (Login or Logout) -> Update ref and proceed
        lastUserId.current = currentUser?.id || null;
        setUser(currentUser);
        
        if (currentUser) {
          setLoading(true);
          
          try {
            const adminStatus = await authService.isAdmin();
            if (mounted) setIsAdmin(adminStatus);
          } catch (error) {
            console.error('Error checking admin status:', error);
            if (mounted) setIsAdmin(false);
          } finally {
            if (mounted) setLoading(false);
          }
        } else {
          // Handle Logout
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