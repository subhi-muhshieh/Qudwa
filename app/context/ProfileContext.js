'use client'
import { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '../utils/supabase/client';

const ProfileContext = createContext();

export function ProfileProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    let isMounted = true;

    const fetchUserAndProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (isMounted && user) {
          setUser(user);
          await fetchProfile(user.id);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    const fetchProfile = async (userId) => {
      try {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();
        
        if (isMounted && data) {
          setProfile(data);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchUserAndProfile();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (isMounted) {
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchProfile(session.user.id);
        } else {
          setProfile(null);
        }
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Function to update profile (called from Profile page)
  const updateProfile = (newProfileData) => {
    setProfile(prev => ({ ...prev, ...newProfileData }));
  };

  // Function to refresh profile from database
  const refreshProfile = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (data) {
      setProfile(data);
    }
  };

  return (
    <ProfileContext.Provider value={{ 
      user, 
      profile, 
      loading, 
      updateProfile,
      refreshProfile 
    }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}