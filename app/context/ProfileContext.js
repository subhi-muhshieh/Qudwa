'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { createClient } from '../utils/supabase/client';

const ProfileContext = createContext(undefined);

export function ProfileProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [supabase] = useState(() => createClient());

  // ✅ One-time cleanup for users whose session was corrupted by the
  // middleware bug (res being recreated inside cookie set/remove handlers).
  // Detects double-serialized tokens and clears them so Supabase can
  // establish a clean session on next login.
  useEffect(() => {
    try {
      Object.keys(localStorage)
        .filter(k => k.startsWith('sb-'))
        .forEach(key => {
          const raw = localStorage.getItem(key);
          if (!raw) return;
          try {
            const parsed = JSON.parse(raw);
            // If parsing once still yields a string, it was double-serialized
            if (typeof parsed === 'string') {
              localStorage.removeItem(key);
            }
          } catch {}
        });
    } catch {}
  }, []); // runs once on mount, then never again

  const fetchProfile = useCallback(async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) throw error;
      setProfile(data ?? null);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setProfile(null);
    }
  }, [supabase]);

 // استبدله بهذا الكود
useEffect(() => {
  let isMounted = true;

  // هون بنعتمد بس على الـ Listener لأنه هو لحاله بجيب أول Session
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    async (event, session) => {
      if (!isMounted) return;

      const currentUser = session?.user ?? null;

      // منحدث الحالة بس إذا في تغيير حقيقي أو أول ما يفتح التطبيق
      if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
        setUser(currentUser);
        
        if (currentUser) {
          await fetchProfile(currentUser.id);
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    }
  );

  return () => {
    isMounted = false;
    subscription.unsubscribe();
  };
}, [supabase, fetchProfile]);

  const updateProfile = useCallback((newProfileData) => {
    setProfile(prev => {
      if (!prev) return prev;
      return { ...prev, ...newProfileData };
    });
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!user) return;
    await fetchProfile(user.id);
  }, [user, fetchProfile]);

  const value = { user, profile, loading, updateProfile, refreshProfile };

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