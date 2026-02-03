'use client'
import { createClient } from './utils/supabase/client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Added this
import { FaHeart, FaPaperPlane, FaCalendarAlt, FaStar, FaArrowLeft } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function Home() {
  const [recentActivity, setRecentActivity] = useState(null);
  const [upcomingActivity, setUpcomingActivity] = useState(null);
  const [msg, setMsg] = useState('');
  const [user, setUser] = useState(null);
  // We start loading as TRUE. The page is hidden until we confirm the user.
  const [loading, setLoading] = useState(true); 
  
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const checkUserAndFetchData = async () => {
      // 1. Check if user is logged in
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        // If NO user, kick them to login immediately
        router.replace('/login');
        return; // Stop here, don't fetch data
      }

      // If YES user, save them and fetch data
      setUser(user);

      // Fetch Past Activity
      const { data: past } = await supabase.from('activities').select('*').eq('is_upcoming', false).order('created_at', { ascending: false }).limit(1).single();
      if (past) setRecentActivity(past);

      // Fetch Upcoming Activity
      const { data: coming } = await supabase.from('activities').select('*').eq('is_upcoming', true).order('created_at', { ascending: false }).limit(1).single();
      if (coming) setUpcomingActivity(coming);
      
      // Stop loading only after we are sure user is logged in
      setLoading(false);
    };

    checkUserAndFetchData();
  }, [router]);

  const handleLike = async (activityId) => {
    // No need to check !user here anymore, because they can't be here if they aren't logged in
    const { error } = await supabase.from('likes').insert([{ user_id: user.id, activity_id: activityId }]);
    
    if (error) {
      if (error.code === '23505') toast('لقد أعجبك هذا المنشور مسبقاً!', { icon: '✨' });
      else toast.error("حدث خطأ ما");
    } else {
      toast.success("شكراً لتفاعلك معنا!");
    }
  };

  const sendTelegramMessage = (e) => {
    e.preventDefault();
    if (!msg) return;

    // REPLACE WITH YOUR USERNAME
    const telegramUsername = 'SubhiQudwa'; 
    const url = `https://t.me/${telegramUsername}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
    toast.success("جاري فتح تيليجرام...");
    setMsg('');
  };

  // While checking user, show a full screen loader so they don't see the home page
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="flex flex-col items-center gap-4">
            <span className="loading loading-ring loading-lg text-primary scale-150"></span>
            <span className="text-primary font-bold animate-pulse">جاري التحقق...</span>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen pt-32 pb-20 px-4 md:px-10">
      
      {/* BRAND HEADER */}
      <div className="text-center mb-20 mt-6">
        <h2 
          className="text-4xl md:text-6xl text-accent font-black tracking-wide leading-tight drop-shadow-sm" 
          style={{ fontFamily: 'var(--font-slogan)' }} 
        >
          جيلٌ يبني، أثرٌ يبقى
        </h2>
        <div className="w-24 h-2 bg-primary/20 mx-auto mt-6 rounded-full"></div>
      </div>

      {/* SECTION 1: HERO */}
      <div className="max-w-6xl mx-auto mb-24">
        <div className="glass-panel p-2 rounded-[2.5rem] shadow-sm">
          <div className="bg-white/60 rounded-[2rem] overflow-hidden p-6 md:p-10 flex flex-col lg:flex-row-reverse gap-10 items-start transition-all">
            
            {recentActivity ? (
              <>
                {recentActivity.image_url && (
                  <div className="w-full lg:w-1/2 relative">
                      <div className="absolute inset-0 bg-primary/10 rounded-3xl transform translate-x-2 translate-y-2 -z-10"></div>
                      <img src={recentActivity.image_url} className="rounded-3xl shadow-lg w-full object-cover h-[350px] md:h-[400px]" />
                  </div>
                )}
                
                <div className="w-full lg:w-1/2 text-right">
                  <div className="badge badge-secondary badge-outline mb-6 p-4 text-sm gap-2 font-bold bg-white/50 border-secondary/30">
                    <FaStar /> آخر الإنجازات
                  </div>
                  <h1 className="text-3xl lg:text-5xl font-bold mb-6 text-neutral leading-tight">
                    {recentActivity.title}
                  </h1>
                  <p className="text-lg text-neutral/70 leading-relaxed mb-8 pl-4 border-l-4 border-primary/20">
                    {recentActivity.full_report || recentActivity.short_description}
                  </p>
                  <div className="flex gap-4">
                      <button 
                        onClick={() => handleLike(recentActivity.id)} 
                        className="btn btn-primary rounded-2xl px-8 text-white shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-1 transition-all"
                      >
                          <FaHeart /> أعجبني
                      </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="w-full text-center py-20">
                <h1 className="text-3xl font-bold opacity-20 text-neutral">بانتظار إضافة نشاطات...</h1>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* SECTION 2: UPCOMING */}
      {upcomingActivity && (
        <div className="max-w-4xl mx-auto mb-24 relative group">
          <div className="absolute inset-0 bg-secondary/30 rounded-[2.5rem] blur-2xl transform group-hover:scale-105 transition duration-500"></div>
          
          <div className="card w-full bg-gradient-to-br from-primary to-accent text-white shadow-2xl overflow-hidden rounded-[2.5rem] relative z-10">
            <div className="card-body p-8 md:p-12 text-right relative">
                
                <div className="flex items-center gap-3 text-blue-100 mb-4 opacity-90">
                    <FaCalendarAlt className="text-xl" />
                    <span className="font-bold tracking-widest text-sm uppercase">النشاط القادم</span>
                </div>
                
                <h2 className="card-title text-3xl md:text-5xl font-bold mb-6">{upcomingActivity.title}</h2>
                <p className="text-lg md:text-xl opacity-90 mb-10 font-light leading-relaxed">
                  {upcomingActivity.full_report || upcomingActivity.short_description}
                </p>
                
                <div className="card-actions justify-end border-t border-white/20 pt-6">
                    <button className="btn btn-ghost bg-white/20 text-white hover:bg-white hover:text-primary border-none rounded-2xl px-8 gap-3 h-12">
                        للمزيد من التفاصيل <FaArrowLeft />
                    </button>
                </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: CONTACT */}
      <div className="max-w-2xl mx-auto text-center mt-20">
        <h3 className="text-2xl font-bold mb-8 text-neutral opacity-80">تواصل مباشر مع الإدارة</h3>
        
        <form onSubmit={sendTelegramMessage} className="relative group">
            <div className="relative flex items-center bg-white rounded-2xl border border-blue-100 p-2 shadow-lg hover:shadow-xl focus-within:ring-2 ring-primary/20 transition-all">
                <input 
                    className="input bg-transparent border-none focus:outline-none w-full pr-6 text-lg placeholder:text-gray-300 text-right text-neutral" 
                    placeholder="اكتب رسالتك أو اقتراحك هنا..." 
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
                />
                <button type="submit" className="btn btn-primary rounded-xl px-6 h-12 min-h-0 text-white shadow-md hover:scale-105 transition-transform">
                    <FaPaperPlane className="transform scale-x-[-1]" />
                </button>
            </div>
        </form>
        <p className="mt-4 text-sm text-neutral/40">يتم إرسال الرسائل بشكل آمن وفوري</p>
      </div>

    </main>
  );
}