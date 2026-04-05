'use client'

import { useState, useEffect, useCallback, useRef, memo } from 'react';
import { createClient } from '@/app/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useProfile } from '@/app/context/ProfileContext';
import {
  FaComments,
  FaUser,
  FaPaperPlane,
  FaCheckDouble,
  FaCheck,
  FaSearch,
  FaTimes
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function AdminMessagesPage() {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);
  const [supabase] = useState(() => createClient());
  const router = useRouter();
  const { user, profile } = useProfile();

  useEffect(() => {
    if (profile && profile.role !== 'admin') {
      router.push('/dashboard');
    }
  }, [profile, router]);

  const scrollToBottom = useCallback((smooth = true) => {
    const container = messagesContainerRef.current;
    if (!container) return;

    container.scrollTo({
      top: container.scrollHeight,
      behavior: smooth ? 'smooth' : 'auto',
    });
  }, []);

  useEffect(() => {
    if (!user) return;

    const loadConversations = async () => {
      try {
        const { data: convos, error: convError } = await supabase
          .from('conversations')
          .select('*')
          .order('last_message_at', { ascending: false });

        if (convError) throw convError;

        if (!convos || convos.length === 0) {
          setConversations([]);
          setLoading(false);
          return;
        }

        const userIds = [...new Set(convos.map((c) => c.user_id).filter(Boolean))];

        const { data: profiles, error: profileError } = await supabase
          .from('profiles')
          .select('id, parent_name, avatar_url, parent_phone')
          .in('id', userIds);

        if (profileError) {
          console.error('Error loading profiles:', profileError);
        }

        const profileMap = {};
        (profiles || []).forEach((p) => {
          profileMap[p.id] = p;
        });

        const enhancedConvos = await Promise.all(
          convos.map(async (conv) => {
            const { count } = await supabase
              .from('messages')
              .select('id', { count: 'exact', head: true })
              .eq('conversation_id', conv.id)
              .neq('sender_id', user.id)
              .eq('is_read', false)
              .eq('is_deleted', false);

            return {
              ...conv,
              profiles: profileMap[conv.user_id] || null,
              unread_count: count || 0,
            };
          })
        );

        setConversations(enhancedConvos);
        setLoading(false);
      } catch (error) {
        console.error('Error loading conversations:', error);
        toast.error('حدث خطأ في تحميل المحادثات');
        setLoading(false);
      }
    };

    loadConversations();

    const channel = supabase
      .channel('admin-conversations')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations',
        },
        () => loadConversations()
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        () => loadConversations()
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [user, supabase]);

  useEffect(() => {
    if (!selectedConversation || !user) return;

    let isMounted = true;

    const loadMessages = async () => {
      try {
        const { data: msgs, error } = await supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', selectedConversation.id)
          .eq('is_deleted', false)
          .order('created_at', { ascending: true });

        if (error) throw error;
        if (!isMounted) return;

        setMessages(msgs || []);
        setTimeout(() => scrollToBottom(false), 30);

        const unreadMessages = (msgs || []).filter(
          (m) => m.sender_id !== user.id && !m.is_read
        );

        if (unreadMessages.length > 0) {
          await supabase
            .from('messages')
            .update({
              is_read: true,
              read_at: new Date().toISOString(),
            })
            .in('id', unreadMessages.map((m) => m.id));

          setConversations((prev) =>
            prev.map((c) =>
              c.id === selectedConversation.id ? { ...c, unread_count: 0 } : c
            )
          );
        }
      } catch (error) {
        console.error('Error loading messages:', error);
        toast.error('حدث خطأ في تحميل الرسائل');
      }
    };

    loadMessages();

    const channel = supabase
      .channel(`admin-conversation-${selectedConversation.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${selectedConversation.id}`,
        },
        async (payload) => {
          if (!isMounted) return;

          setMessages((prev) => {
            if (prev.some((m) => m.id === payload.new.id)) return prev;
            return [...prev, payload.new];
          });

          setTimeout(() => scrollToBottom(true), 30);

          if (payload.new.sender_id !== user.id) {
            await supabase
              .from('messages')
              .update({
                is_read: true,
                read_at: new Date().toISOString(),
              })
              .eq('id', payload.new.id);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${selectedConversation.id}`,
        },
        (payload) => {
          if (!isMounted) return;
          setMessages((prev) =>
            prev.map((m) => (m.id === payload.new.id ? payload.new : m))
          );
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      channel.unsubscribe();
    };
  }, [selectedConversation, user, supabase, scrollToBottom]);

  const handleSendMessage = useCallback(
    async (e) => {
      e.preventDefault();

      if (!newMessage.trim() || !selectedConversation || !user || sending) return;

      setSending(true);

      try {
        if (!selectedConversation.admin_id) {
          await supabase
            .from('conversations')
            .update({ admin_id: user.id })
            .eq('id', selectedConversation.id);
        }

        const { error } = await supabase.from('messages').insert([
          {
            conversation_id: selectedConversation.id,
            sender_id: user.id,
            content: newMessage.trim(),
            message_type: 'text',
          },
        ]);

        if (error) throw error;

        setNewMessage('');
        setTimeout(() => {
          scrollToBottom(true);
          inputRef.current?.focus();
        }, 50);
      } catch (error) {
        console.error('Error sending admin message:', error);
        toast.error('حدث خطأ في إرسال الرسالة');
      } finally {
        setSending(false);
      }
    },
    [newMessage, selectedConversation, user, sending, supabase, scrollToBottom]
  );

  const filteredConversations = conversations.filter((conv) => {
    const name = conv.profiles?.parent_name || '';
    const phone = conv.profiles?.parent_phone || '';
    return (
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      phone.includes(searchTerm)
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-32">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-primary" />
          <p className="mt-4 text-base-content/50">جاري تحميل المحادثات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 sm:pt-32 pb-20 px-2 sm:px-4 md:px-8" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-6 sm:mb-8 flex items-center gap-2 sm:gap-3">
          <FaComments className="text-2xl sm:text-3xl" /> الرسائل
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-1 bg-base-100 rounded-2xl shadow-lg border border-base-200 overflow-hidden flex flex-col max-h-[600px]">
            <div className="p-3 sm:p-4 border-b border-base-200 shrink-0">
              <div className="relative">
                <FaSearch className="absolute right-3 top-3 text-base-content/40" />
                <input
                  type="text"
                  placeholder="بحث..."
                  className="input input-bordered w-full pr-10 text-sm h-10 sm:h-12"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {filteredConversations.length === 0 ? (
                <div className="text-center py-8 px-4 text-base-content/50">
                  <FaComments className="text-3xl sm:text-4xl mx-auto mb-3 opacity-20" />
                  <p className="text-xs sm:text-sm">
                    {conversations.length === 0 ? 'لا توجد محادثات' : 'لا توجد نتائج'}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-base-200">
                  {filteredConversations.map((conv) => (
                    <ConversationItem
                      key={conv.id}
                      conversation={conv}
                      isSelected={selectedConversation?.id === conv.id}
                      onClick={() => setSelectedConversation(conv)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-2">
            {selectedConversation ? (
              <div className="bg-base-100 rounded-2xl shadow-lg border border-base-200 max-h-[600px] h-full flex flex-col overflow-hidden">
                <div className="p-3 sm:p-4 border-b border-base-200 flex items-center justify-between shrink-0 gap-2">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                    <div className="avatar placeholder shrink-0">
                      <div className="bg-primary/10 text-primary rounded-full w-10 sm:w-12 text-sm sm:text-base">
                        {selectedConversation.profiles?.avatar_url ? (
                          <img src={selectedConversation.profiles.avatar_url} alt="" />
                        ) : (
                          <FaUser />
                        )}
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-sm sm:text-base truncate">
                        {selectedConversation.profiles?.parent_name || 'مستخدم'}
                      </h3>
                      {selectedConversation.profiles?.parent_phone && (
                        <p className="text-[10px] sm:text-xs text-base-content/50 truncate">
                          {selectedConversation.profiles.parent_phone}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedConversation(null)}
                    className="btn btn-ghost btn-sm btn-circle lg:hidden"
                  >
                    <FaTimes className="text-sm" />
                  </button>
                </div>

                <div
                  ref={messagesContainerRef}
                  className="flex-1 p-3 sm:p-4 overflow-y-auto bg-base-200 space-y-3 overscroll-contain min-h-[200px]"
                >
                  {messages.length === 0 ? (
                    <div className="text-center py-10 text-base-content/50">
                      <FaComments className="text-3xl sm:text-4xl mx-auto mb-3 opacity-20" />
                      <p className="text-xs sm:text-sm">لا توجد رسائل بعد</p>
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <AdminMessageBubble
                        key={msg.id}
                        message={msg}
                        isOwn={msg.sender_id === user.id}
                      />
                    ))
                  )}
                </div>

                <form onSubmit={handleSendMessage} className="p-3 sm:p-4 border-t border-base-200 shrink-0 bg-base-100">
                  <div className="flex gap-2">
                    <input
                      ref={inputRef}
                      type="text"
                      placeholder="اكتب ردك..."
                      className="input input-bordered flex-1 text-sm h-10 sm:h-12"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      disabled={sending}
                    />
                    <button
                      type="submit"
                      className="btn btn-primary text-sm sm:text-base h-10 sm:h-12"
                      disabled={!newMessage.trim() || sending}
                    >
                      {sending ? (
                        <span className="loading loading-spinner loading-sm" />
                      ) : (
                        <>
                          <FaPaperPlane className="hidden sm:inline" /> 
                          <span className="hidden sm:inline">إرسال</span>
                          <FaPaperPlane className="sm:hidden" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="bg-base-100 rounded-2xl shadow-lg border border-base-200 max-h-[600px] h-full hidden lg:flex items-center justify-center">
                <div className="text-center text-base-content/50">
                  <FaComments className="text-4xl sm:text-5xl mx-auto mb-3 opacity-20" />
                  <p className="text-xs sm:text-base">اختر محادثة للبدء</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const ConversationItem = memo(function ConversationItem({ conversation, isSelected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-right p-4 transition-colors ${
        isSelected ? 'bg-primary/10 border-r-4 border-primary' : 'hover:bg-base-200'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="avatar placeholder">
          <div className="bg-primary/10 text-primary rounded-full w-12">
            {conversation.profiles?.avatar_url ? (
              <img src={conversation.profiles.avatar_url} alt="" />
            ) : (
              <FaUser />
            )}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="font-bold text-sm truncate">
              {conversation.profiles?.parent_name || 'مستخدم'}
            </p>
            {conversation.unread_count > 0 && (
              <div className="badge badge-primary badge-sm">
                {conversation.unread_count}
              </div>
            )}
          </div>

          <p className="text-xs text-base-content/50">
            {new Date(conversation.last_message_at).toLocaleDateString('ar', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
      </div>
    </button>
  );
});

const AdminMessageBubble = memo(function AdminMessageBubble({ message, isOwn }) {
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
              : 'bg-base-100 text-base-content rounded-br-sm border border-base-300'
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