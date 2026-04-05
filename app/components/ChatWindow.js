'use client'

import { useState, useEffect, useCallback, useRef, memo } from 'react';
import { createClient } from '../utils/supabase/client';
import { useProfile } from '../context/ProfileContext';
import { motion } from 'framer-motion';
import {
  FaComments,
  FaTimes,
  FaPaperPlane,
  FaCircle,
  FaCheckDouble,
  FaCheck
} from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function ChatWindow({ onClose, onMessageRead }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [conversation, setConversation] = useState(null);
  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);
  const [supabase] = useState(() => createClient());
  const { user } = useProfile();

  const scrollMessagesToBottom = useCallback((smooth = true) => {
    const container = messagesContainerRef.current;
    if (!container) return;

    container.scrollTo({
      top: container.scrollHeight,
      behavior: smooth ? 'smooth' : 'auto',
    });
  }, []);

  useEffect(() => {
    if (!user) return;

    let isMounted = true;

   const initConversation = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        if (!session) throw new Error('لا توجد جلسة مستخدم نشطة');

        let conversationData = null;

        // 1. Use maybeSingle() to cleanly fetch one row (returns null instead of error if empty)
        const { data: existingConvo, error: fetchError } = await supabase
          .from('conversations')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;

        conversationData = existingConvo;

        // 2. If it truly doesn't exist, insert it
        if (!conversationData) {
          const { data: createdConv, error: createError } = await supabase
            .from('conversations')
            .insert([{ 
              user_id: user.id, 
              is_active: true,
              last_message_at: new Date().toISOString()
            }])
            .select()
            .maybeSingle();

          if (createError) {
            // Catch the React Strict Mode race condition gracefully
            if (createError.code === '23505' || createError.code === '409') {
              const { data: retryData } = await supabase
                .from('conversations')
                .select('*')
                .eq('user_id', user.id)
                .single();
              conversationData = retryData;
            } else {
              throw createError;
            }
          } else {
            conversationData = createdConv;
          }
        }

        if (!isMounted) return;
        setConversation(conversationData);

        // 3. Fetch the messages for this conversation
        const { data: msgs, error: messagesError } = await supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', conversationData.id)
          .eq('is_deleted', false)
          .order('created_at', { ascending: true });

        if (messagesError) throw messagesError;
        if (!isMounted) return;

        setMessages(msgs || []);
        setLoading(false);

        // 4. Mark unread messages as read
        const unreadMessages = (msgs || []).filter(
          (m) => m.sender_id !== user.id && !m.is_read
        );

        if (unreadMessages.length > 0) {
          const { error: readError } = await supabase
            .from('messages')
            .update({
              is_read: true,
              read_at: new Date().toISOString(),
            })
            .in('id', unreadMessages.map((m) => m.id));

          if (!readError) {
            unreadMessages.forEach(() => onMessageRead?.());
          }
        }

        setTimeout(() => scrollMessagesToBottom(false), 50);
      } catch (error) {
        console.error('Error initializing conversation:', error);
        if (isMounted) {
          toast.error('حدث خطأ في تحميل المحادثة');
          setLoading(false);
        }
      }
    };

    initConversation();

    return () => {
      isMounted = false;
    };
  }, [user, supabase, scrollMessagesToBottom, onMessageRead]);

  useEffect(() => {
    if (!conversation || !user) return;

    const messagesChannel = supabase
      .channel(`user-conversation-${conversation.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversation.id}`,
        },
        async (payload) => {
          setMessages((prev) => {
            if (prev.some((m) => m.id === payload.new.id)) return prev;
            return [...prev, payload.new];
          });

          setTimeout(() => scrollMessagesToBottom(true), 30);

          if (payload.new.sender_id !== user.id) {
            const { error } = await supabase
              .from('messages')
              .update({
                is_read: true,
                read_at: new Date().toISOString(),
              })
              .eq('id', payload.new.id);

            if (!error) {
              onMessageRead?.();
            }
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversation.id}`,
        },
        (payload) => {
          setMessages((prev) =>
            prev.map((msg) => (msg.id === payload.new.id ? payload.new : msg))
          );
        }
      )
      .subscribe();


    return () => {
      messagesChannel.unsubscribe();
    };
  }, [conversation, user, supabase, scrollMessagesToBottom, onMessageRead]);


  const handleSendMessage = useCallback(
    async (e) => {
      e.preventDefault();

      if (!newMessage.trim() || !conversation || !user || sending) return;

      const messageText = newMessage.trim();
      setSending(true);

      try {
        const { error } = await supabase.from('messages').insert([
          {
            conversation_id: conversation.id,
            sender_id: user.id,
            content: messageText,
            message_type: 'text',
          },
        ]);

        if (error) throw error;

        setNewMessage('');

        setTimeout(() => {
          scrollMessagesToBottom(true);
          inputRef.current?.focus();
        }, 50);
      } catch (error) {
        console.error('Error sending message:', error);
        toast.error('حدث خطأ في إرسال الرسالة');
      } finally {
        setSending(false);
      }
    },
    [newMessage, conversation, user, sending, supabase, scrollMessagesToBottom]
  );

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 100, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 100, scale: 0.9 }}
        className="fixed bottom-20 sm:bottom-24 left-2 sm:left-6 right-2 sm:right-auto z-50 w-full sm:w-96 max-w-[calc(100vw-1rem)] sm:max-w-none max-h-[calc(100vh-120px)] sm:max-h-[500px] bg-base-100 rounded-2xl shadow-2xl border border-base-300 flex items-center justify-center"
      >
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-primary" />
          <p className="mt-4 text-base-content/50 text-sm">جارٍ تحميل المحادثة...</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 100, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 100, scale: 0.9 }}
      className="fixed bottom-20 sm:bottom-24 left-2 sm:left-6 right-2 sm:right-auto z-50 w-full sm:w-96 max-w-[calc(100vw-1rem)] sm:max-w-none max-h-[calc(100vh-120px)] sm:max-h-[500px] bg-base-100 rounded-2xl shadow-2xl border border-base-300 flex flex-col overflow-hidden"
      dir="rtl"
    >
      <div className="bg-primary text-white p-3 sm:p-4 flex items-center justify-between shrink-0 gap-2">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="relative shrink-0">
            <FaComments className="text-lg sm:text-xl" />
            <FaCircle className="absolute -bottom-1 -right-1 text-success text-[8px] sm:text-[10px]" />
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-sm sm:text-base truncate">راسل الإدارة</h3>
            <p className="text-[10px] sm:text-xs opacity-80 truncate">نحن هنا للمساعدة</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="btn btn-ghost btn-sm btn-circle text-white hover:bg-white/20 shrink-0"
          aria-label="إغلاق"
        >
          <FaTimes className="text-sm sm:text-base" />
        </button>
      </div>

      <div
        ref={messagesContainerRef}
        className="flex-1 p-3 sm:p-4 overflow-y-auto bg-base-200 space-y-3 overscroll-contain min-h-[200px]"
      >
        {messages.length === 0 ? (
          <div className="text-center py-10">
            <FaComments className="text-4xl text-base-content/20 mx-auto mb-3" />
            <p className="text-base-content/50 text-sm">ابدأ المحادثة مع الإدارة</p>
            <p className="text-base-content/30 text-xs mt-2">سيتم الرد عليك في أقرب وقت</p>
          </div>
        ) : (
          messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              isOwn={msg.sender_id === user.id}
            />
          ))
        )}
      </div>


      <form onSubmit={handleSendMessage} className="p-3 sm:p-4 border-t border-base-300 bg-base-100 shrink-0">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            placeholder="اكتب رسالتك..."
            className="input input-bordered flex-1 text-sm sm:text-base h-10 sm:h-12"
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
            }}
            disabled={sending}
          />
          <button
            type="submit"
            className="btn btn-primary btn-square h-10 sm:h-12 w-10 sm:w-12 text-sm sm:text-base"
            disabled={!newMessage.trim() || sending}
          >
            {sending ? <span className="loading loading-spinner loading-sm" /> : <FaPaperPlane />}
          </button>
        </div>
      </form>
    </motion.div>
  );
}

const MessageBubble = memo(function MessageBubble({ message, isOwn }) {
  const formattedTime = new Date(message.created_at).toLocaleTimeString('ar', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
    >
      <div className="max-w-[75%]">
        <div
          className={`rounded-2xl px-4 py-2 ${
            isOwn
              ? 'bg-primary text-white rounded-bl-sm'
              : 'bg-base-100 text-base-content rounded-br-sm'
          }`}
        >
          <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
        </div>

        <div
          className={`flex items-center gap-1 mt-1 text-[10px] text-base-content/40 ${
            isOwn ? 'justify-end' : 'justify-start'
          }`}
        >
          <span>{formattedTime}</span>
          {isOwn &&
            (message.is_read ? (
              <FaCheckDouble className="text-primary" />
            ) : (
              <FaCheck className="text-base-content/30" />
            ))}
        </div>
      </div>
    </motion.div>
  );
});