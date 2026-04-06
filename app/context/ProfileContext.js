'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { createClient } from '../utils/supabase/client';

const ProfileContext = createContext(undefined);

export function ProfileProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [supabase] = useState(() => createClient()); // React 19: lazy initialization

  // Memoized fetch function (React 19 optimization)
  const fetchProfile = useCallback(async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle(); // Better than .single() for optional data

      if (error) throw error;
      
      if (data) {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setProfile(null);
    }
  }, [supabase]);

  useEffect(() => {
    let isMounted = true;

    const fetchUserAndProfile = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
if (error && error.name !== 'AuthSessionMissingError') throw error;
        
        if (isMounted && user) {
          setUser(user);
          await fetchProfile(user.id);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchUserAndProfile();

    // Auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return;

        const currentUser = session?.user ?? null;
        setUser(currentUser);
        
        if (currentUser) {
          await fetchProfile(currentUser.id);
        } else {
          setProfile(null);
        }

        // Ensure loading is false after auth change
        setLoading(false);
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [supabase, fetchProfile]);

  // Optimized update function with optimistic updates
  const updateProfile = useCallback((newProfileData) => {
    setProfile(prev => {
      if (!prev) return prev;
      return { ...prev, ...newProfileData };
    });
  }, []);

  // Refresh profile from database
  const refreshProfile = useCallback(async () => {
    if (!user) return;
    await fetchProfile(user.id);
  }, [user, fetchProfile]);

  const value = {
    user,
    profile,
    loading,
    updateProfile,
    refreshProfile
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  
  return context;
}