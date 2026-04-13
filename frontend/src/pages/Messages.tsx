import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import type { Message, Profile } from '@/types/database';
import { ArrowLeft, Loader2, MessageSquare, Send } from 'lucide-react';

type MessageWithUsers = Message & {
  sender?: Pick<Profile, 'id' | 'full_name' | 'role'> | null;
  receiver?: Pick<Profile, 'id' | 'full_name' | 'role'> | null;
};

type Conversation = {
  partner: Pick<Profile, 'id' | 'full_name' | 'role'>;
  lastMessage: MessageWithUsers;
  unreadCount: number;
};

type MessageGroup = {
  senderId: string;
  messages: MessageWithUsers[];
};

const getInitials = (name?: string | null) => {
  if (!name) return '?';
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
};

const formatTime = (value: string) =>
  new Date(value).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

const formatConversationTime = (value: string) =>
  new Date(value).toLocaleDateString([], { month: 'short', day: 'numeric' });

const truncate = (value: string, length: number) =>
  value.length > length ? `${value.slice(0, length - 1)}…` : value;

export default function Messages() {
  const navigate = useNavigate();
  const { otherId } = useParams<{ otherId?: string }>();
  const { profile } = useAuth();
  const [inboxMessages, setInboxMessages] = useState<MessageWithUsers[]>([]);
  const [loading, setLoading] = useState(true);

  const [otherProfile, setOtherProfile] = useState<Pick<Profile, 'id' | 'full_name' | 'role'> | null>(null);
  const [conversationMessages, setConversationMessages] = useState<MessageWithUsers[]>([]);
  const [conversationLoading, setConversationLoading] = useState(true);
  const [messageText, setMessageText] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const isConversation = Boolean(otherId);

  const fetchInbox = useCallback(async () => {
    if (!profile) return;

    setLoading(true);
    const { data } = await supabase
      .from('messages')
      .select('*, sender:profiles!sender_id(id, full_name, role), receiver:profiles!receiver_id(id, full_name, role)')
      .or(`sender_id.eq.${profile.id},receiver_id.eq.${profile.id}`)
      .order('created_at', { ascending: false });

    setInboxMessages((data || []) as MessageWithUsers[]);
    setLoading(false);
  }, [profile]);

  const fetchConversation = useCallback(async () => {
    if (!profile || !otherId) return;

    setConversationLoading(true);

    const [otherRes, messagesRes] = await Promise.all([
      supabase.from('profiles').select('id, full_name, role').eq('id', otherId).maybeSingle(),
      supabase
        .from('messages')
        .select('*')
        .or(
          `and(sender_id.eq.${profile.id},receiver_id.eq.${otherId}),` +
          `and(sender_id.eq.${otherId},receiver_id.eq.${profile.id})`
        )
        .order('created_at', { ascending: true }),
    ]);

    setOtherProfile((otherRes.data as Pick<Profile, 'id' | 'full_name' | 'role'> | null) || null);
    setConversationMessages((messagesRes.data || []) as MessageWithUsers[]);

    await supabase
      .from('messages')
      .update({ read: true })
      .eq('receiver_id', profile.id)
      .eq('sender_id', otherId)
      .eq('read', false);

    setConversationLoading(false);
  }, [otherId, profile]);

  useEffect(() => {
    if (!profile) return;

    if (isConversation) {
      void fetchConversation();
      return;
    }

    void fetchInbox();
  }, [fetchConversation, fetchInbox, isConversation, profile]);

  useEffect(() => {
    if (!isConversation) return;

    const interval = window.setInterval(() => {
      void fetchConversation();
    }, 10000);

    return () => window.clearInterval(interval);
  }, [fetchConversation, isConversation]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversationMessages, otherId]);

  const conversations = useMemo<Conversation[]>(() => {
    if (!profile) return [];

    const map = new Map<string, Conversation>();

    for (const message of inboxMessages) {
      const partner = message.sender_id === profile.id ? message.receiver : message.sender;
      if (!partner?.id) continue;

      const current = map.get(partner.id);
      const unreadIncrement = message.receiver_id === profile.id && !message.read && message.sender_id !== profile.id ? 1 : 0;

      if (!current) {
        map.set(partner.id, {
          partner,
          lastMessage: message,
          unreadCount: unreadIncrement,
        });
      } else {
        current.unreadCount += unreadIncrement;
      }
    }

    return Array.from(map.values()).sort((left, right) => {
      return new Date(right.lastMessage.created_at).getTime() - new Date(left.lastMessage.created_at).getTime();
    });
  }, [inboxMessages, profile]);

  const groupedMessages = useMemo<MessageGroup[]>(() => {
    const groups: MessageGroup[] = [];

    for (const message of conversationMessages) {
      const lastGroup = groups[groups.length - 1];
      if (!lastGroup || lastGroup.senderId !== message.sender_id) {
        groups.push({ senderId: message.sender_id, messages: [message] });
      } else {
        lastGroup.messages.push(message);
      }
    }

    return groups;
  }, [conversationMessages]);

  const autoSizeTextarea = () => {
    const element = textareaRef.current;
    if (!element) return;
    element.style.height = 'auto';
    element.style.height = `${Math.min(element.scrollHeight, 120)}px`;
  };

  const handleSend = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!profile || !otherId || !messageText.trim()) return;

    setSending(true);
    const { error } = await supabase.from('messages').insert({
      sender_id: profile.id,
      receiver_id: otherId,
      content: messageText.trim(),
      read: false,
    });

    if (!error) {
      setMessageText('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
      await fetchConversation();
    }

    setSending(false);
  };

  const roleLabel = otherProfile?.role === 'doctor' ? 'Doctor' : 'Patient';

  if (!profile) {
    return null;
  }

  return (
    <div className="min-h-screen w-full bg-fitness-background text-white relative overflow-x-hidden flex flex-col">
      <div className="absolute rounded-full mix-blend-overlay blur-3xl w-[500px] h-[500px] -top-64 -left-64 bg-fitness-primary/10 pointer-events-none" />
      <div className="absolute rounded-full mix-blend-overlay blur-3xl w-[600px] h-[600px] top-1/3 -right-96 bg-fitness-accent/10 pointer-events-none" />

      <Navbar />

      <main className="container mx-auto px-4 py-6 relative z-10 flex-1 min-h-0">
        {!isConversation ? (
          <div className="max-w-4xl mx-auto">
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold gradient-text">Messages</h1>
                <p className="text-gray-400 mt-1">Your recent conversations.</p>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-fitness-primary" />
              </div>
            ) : conversations.length === 0 ? (
              <Card className="fitness-card">
                <CardContent className="py-16 text-center">
                  <MessageSquare className="w-14 h-14 mx-auto mb-4 text-gray-500" />
                  <p className="font-semibold text-lg">No messages yet</p>
                  <p className="text-sm text-gray-400 mt-1">Start a conversation from My Doctors or your patient list.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-3">
                {conversations.map((conversation) => (
                  <button
                    key={conversation.partner.id}
                    type="button"
                    onClick={() => navigate(`/messages/${conversation.partner.id}`)}
                    className="text-left w-full"
                  >
                    <Card className="fitness-card hover:border-fitness-primary/40 transition-all">
                      <CardContent className="p-4 flex items-center gap-4">
                        <Avatar className="h-12 w-12 shrink-0">
                          <AvatarFallback className="bg-fitness-primary/20 text-fitness-primary font-bold">
                            {getInitials(conversation.partner.full_name)}
                          </AvatarFallback>
                        </Avatar>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-semibold truncate">{conversation.partner.full_name}</p>
                            <Badge variant="outline" className="border-white/10 bg-white/5 text-gray-300">
                              {conversation.partner.role === 'doctor' ? 'Doctor' : 'Patient'}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-400 truncate">
                            {truncate(conversation.lastMessage.content, 60)}
                          </p>
                        </div>

                        <div className="flex flex-col items-end gap-2 shrink-0">
                          <span className="text-xs text-gray-500">{formatConversationTime(conversation.lastMessage.created_at)}</span>
                          {conversation.unreadCount > 0 && (
                            <span className="min-w-5 h-5 px-1.5 rounded-full bg-red-500 text-white text-[10px] font-semibold flex items-center justify-center">
                              {conversation.unreadCount > 9 ? '9+' : conversation.unreadCount}
                            </span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="max-w-5xl mx-auto flex flex-col min-h-[calc(100vh-140px)]">
            <div className="mb-4 flex items-center gap-3">
              <Button variant="outline" size="icon" onClick={() => navigate('/messages')}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div className="flex items-center gap-3 min-w-0">
                <Avatar className="h-10 w-10 shrink-0">
                  <AvatarFallback className="bg-fitness-primary/20 text-fitness-primary font-bold">
                    {getInitials(otherProfile?.full_name)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-2xl font-bold truncate">{otherProfile?.full_name || 'Conversation'}</h1>
                    <Badge variant="outline" className="border-white/10 bg-white/5 text-gray-300">
                      {roleLabel}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-400">Private conversation</p>
                </div>
              </div>
            </div>

            <Card className="fitness-card flex-1 min-h-0 flex flex-col overflow-hidden">
              <CardContent className="p-0 flex flex-col flex-1 min-h-0">
                <div className="flex-1 min-h-0 overflow-y-auto px-4 py-5 space-y-4">
                  {conversationLoading ? (
                    <div className="flex justify-center py-20">
                      <Loader2 className="w-8 h-8 animate-spin text-fitness-primary" />
                    </div>
                  ) : conversationMessages.length === 0 ? (
                    <div className="py-20 text-center text-gray-400">
                      No messages in this conversation yet.
                    </div>
                  ) : (
                    groupedMessages.map((group) => {
                      const isMine = group.senderId === profile.id;
                      const sender = isMine ? profile : otherProfile;

                      return (
                        <div key={`${group.senderId}-${group.messages[0].created_at}`} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                          <div className="max-w-[min(85%,42rem)]">
                            {!isMine && (
                              <div className="mb-2 flex items-center gap-2">
                                <Avatar className="h-8 w-8 shrink-0">
                                  <AvatarFallback className="bg-white/10 text-gray-200 text-xs font-bold">
                                    {getInitials(sender?.full_name)}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-sm font-medium text-gray-300">{sender?.full_name}</span>
                              </div>
                            )}

                            <div className={`space-y-2 ${isMine ? 'items-end' : 'items-start'} flex flex-col`}>
                              {group.messages.map((message) => (
                                <div
                                  key={message.id}
                                  className={`rounded-2xl px-4 py-3 border ${
                                    isMine
                                      ? 'bg-fitness-primary/20 border-fitness-primary/30 rounded-tr-sm text-white'
                                      : 'bg-white/5 border-white/10 rounded-tl-sm text-gray-100'
                                  }`}
                                >
                                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
                                  <p className="text-xs text-gray-500 mt-2">{formatTime(message.created_at)}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={bottomRef} />
                </div>

                <form onSubmit={handleSend} className="border-t border-white/10 bg-black/10 p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                    <Textarea
                      ref={textareaRef}
                      value={messageText}
                      onChange={(event) => setMessageText(event.target.value)}
                      onInput={autoSizeTextarea}
                      placeholder="Write a message..."
                      rows={1}
                      className="min-h-[48px] max-h-[120px] resize-none bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                    />
                    <Button type="submit" disabled={!messageText.trim() || sending} className="bg-fitness-primary hover:bg-fitness-primary/90 sm:h-12">
                      {sending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                      Send
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}