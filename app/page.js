'use client'
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { createClient } from './utils/supabase/client';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const supabase = createClient();
  const router = useRouter();

  // Redirect Logged-in users to Dashboard automatically
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        router.replace('/dashboard');
      }
    };
    checkUser();
  }, [router]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-between py-12 px-6 relative overflow-hidden font-sans">
        
      {/* 1. Background Decoration */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -ml-20 -mt-20 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-secondary/10 rounded-full blur-3xl -mr-20 -mb-20 pointer-events-none"></div>

      {/* 2. Top Text */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mt-8 z-10"
      >
        <h1 className="text-6xl md:text-7xl text-primary drop-shadow-sm" style={{ fontFamily: 'var(--font-nastaliq)' }}>
          قُدوَة
        </h1>
      </motion.div>

      {/* 3. Center Image */}
      <motion.div 
        className="relative w-full max-w-sm flex justify-center items-center z-10"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        <div className="absolute w-48 h-48 bg-blue-400/20 rounded-full blur-2xl animate-pulse"></div>
        <motion.img 
          src="/logo.png" 
          alt="Qudwa Logo"
          className="w-48 h-48 md:w-64 md:h-64 object-contain drop-shadow-2xl z-10"
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      {/* 4. Bottom Section */}
      <motion.div 
        className="w-full max-w-md text-center z-10 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        <h2 className="text-2xl md:text-3xl font-bold text-neutral mb-8 opacity-80" style={{ fontFamily: 'var(--font-slogan)' }}>
           جيلٌ يبني، أثرٌ يبقى
        </h2>

        <Link href="/login" className="block w-full">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn btn-primary w-full h-16 rounded-full text-xl text-white shadow-xl shadow-primary/30 border-none"
          >
            ابدأ رحلتك معنا
          </motion.button>
        </Link>

        <p className="mt-4 text-sm text-gray-400">انضم إلى مجتمعنا الخيري اليوم</p>
      </motion.div>

    </main>
  );
}