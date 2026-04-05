'use client'

import { useState, useEffect, useCallback, memo } from 'react';
import { FaComments, FaTimes } from 'react-icons/fa';
import { createClient } from '../utils/supabase/client';
import { useProfile } from '../context/ProfileContext';
import { motion, AnimatePresence } from 'framer-motion';
import ChatWindow from './ChatWindow';

const ChatIcon = memo(function ChatIcon() {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [supabase] = useState(() => createClient());
  const { user } = useProfile();

  useEffect(() => {
    if (!user) return;

    let isMounted = true;

    const fetchUnreadCount = async () => {
      try {
        const { data: conversations, error: convError } = await supabase
          .from('conversations')
          .select('id')
          .eq('user_id', user.id);

        if (convError) {
          console.error('Error fetching conversations:', convError);
          return;
        }

        if (!isMounted) return;

        if (!conversations || conversations.length === 0) {
          setUnreadCount(0);
          return;
        }

        const conversationIds = conversations.map((c) => c.id);

        const { count, error: countError } = await supabase
          .from('messages')
          .select('id', { count: 'exact', head: true })
          .in('conversation_id', conversationIds)
          .neq('sender_id', user.id)
          .eq('is_read', false)
          .eq('is_deleted', false);

        if (countError) {
          console.error('Error fetching unread count:', countError);
          return;
        }

        if (isMounted) {
          setUnreadCount(count || 0);
        }
      } catch (error) {
        console.error('Error fetching unread count:', error);
      }
    };

    fetchUnreadCount();

    const channel = supabase
      .channel(`user-unread-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
        },
        () => {
          fetchUnreadCount();
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      channel.unsubscribe();
    };
  }, [user, supabase]);

  const toggleChat = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleMessageRead = useCallback(() => {
    setUnreadCount((prev) => Math.max(0, prev - 1));
  }, []);

  if (!user) return null;

  return (
    <>
      <motion.button
        onClick={toggleChat}
        className="fixed bottom-6 left-6 z-50 btn btn-circle btn-lg btn-primary shadow-2xl text-white hover:scale-110 transition-transform"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        aria-label="فتح الدردشة"
      >
        {isOpen ? (
          <FaTimes className="text-2xl" />
        ) : (
          <>
            <FaComments className="text-2xl" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 badge badge-error badge-sm text-white font-bold">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </>
        )}
      </motion.button>

      <AnimatePresence mode="wait">
        {isOpen && (
          <ChatWindow
            onClose={toggleChat}
            onMessageRead={handleMessageRead}
          />
        )}
      </AnimatePresence>
    </>
  );
});

export default ChatIcon;