'use client'
import { createClient } from './utils/supabase/client';
import { useEffect, useState } from 'react';

export default function Home() {
  const [recentActivity, setRecentActivity] = useState(null);
  const [upcomingActivity, setUpcomingActivity] = useState(null);
  const [msg, setMsg] = useState('');
  const [user, setUser] = useState(null);
  
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      // Get User
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      // 1. Get Most Recent Past Activity
      const { data: past } = await supabase
        .from('activities')
        .select('*')
        .eq('is_upcoming', false)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      if (past) setRecentActivity(past);

      // 2. Get Next Upcoming Activity
      const { data: coming } = await supabase
        .from('activities')
        .select('*')
        .eq('is_upcoming', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      if (coming) setUpcomingActivity(coming);
    };
    fetchData();
  }, []);

  const handleLike = async (activityId) => {
    if (!user) return alert("Please login to like!");
    
    const { error } = await supabase
      .from('likes')
      .insert([{ user_id: user.id, activity_id: activityId }]);

    if (error) {
      if (error.code === '23505') alert("You already liked this!");
      else alert("Error liking post");
    } else {
      alert("Liked!");
    }
  };

    const sendTelegramMessage = async (e) => {
    e.preventDefault();
    if (!msg) return;

    // 1. Optimistic UI: Clear the box immediately so it feels fast
    const originalMsg = msg;
    setMsg('');
    
    try {
      const response = await fetch('/api/telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: originalMsg,
          userEmail: user?.email // Send the user's email if they are logged in
        }),
      });

      if (!response.ok) throw new Error('Failed to send');

      alert("Message sent to Admin!");

    } catch (error) {
      alert("Failed to send message. Please try again.");
      setMsg(originalMsg); // Put the text back if it failed
    }
  };
  return (
    <main className="min-h-screen bg-base-200 pb-20">
      
      {/* SECTION 1: MOST RECENT ACTIVITY */}
      <div className="hero min-h-[60vh] bg-base-100">
        <div className="hero-content flex-col lg:flex-row gap-10">
          {recentActivity ? (
            <>
              {recentActivity.image_url && (
                <img src={recentActivity.image_url} className="max-w-sm rounded-lg shadow-2xl" />
              )}
              <div>
                <div className="badge badge-secondary mb-4">Latest Achievement</div>
                <h1 className="text-5xl font-bold">{recentActivity.title}</h1>
                <p className="py-6 whitespace-pre-wrap">{recentActivity.full_report || recentActivity.short_description}</p>
                <button 
                  onClick={() => handleLike(recentActivity.id)}
                  className="btn btn-primary"
                >
                  ❤️ Like Activity
                </button>
              </div>
            </>
          ) : (
            <div>
              <h1 className="text-5xl font-bold">Welcome to Qudwa</h1>
              <p className="py-6">No past activities reported yet. Admin, please post one!</p>
            </div>
          )}
        </div>
      </div>

      {/* SECTION 2: UPCOMING ACTIVITY */}
      {upcomingActivity && (
        <div className="container mx-auto mt-20 px-4">
          <div className="card w-full bg-primary text-primary-content shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-3xl">📅 Upcoming: {upcomingActivity.title}</h2>
              <p className="whitespace-pre-wrap text-lg opacity-90">{upcomingActivity.full_report || upcomingActivity.short_description}</p>
              <div className="card-actions justify-end mt-5">
                <button className="btn btn-white text-primary">Join Us</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: SEND MESSAGE TO ADMIN */}
      <div className="container mx-auto mt-20 max-w-2xl px-4">
        <h3 className="text-2xl font-bold mb-4 text-center">Contact the Admin</h3>
        <form onSubmit={sendTelegramMessage} className="join w-full">
          <input 
            className="input input-bordered join-item w-full" 
            placeholder="Type a message for the admin..." 
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
          />
          <button type="submit" className="btn btn-secondary join-item">Send</button>
        </form>
      </div>

    </main>
  );
}