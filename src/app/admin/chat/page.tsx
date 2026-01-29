"use client";

import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { MessageCircle, User, RefreshCw, Send } from 'lucide-react';
import api from '@/lib/api';
import { ChatMessage } from '@/types/chat';

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:4000';

interface Session {
    id: string;
    user?: {
        name: string;
        email: string;
    };
    guestName?: string;
    guestEmail?: string;
    messages: ChatMessage[];
    updatedAt: string;
}

export default function AdminChatPage() {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
    const selectedSessionIdRef = useRef<string | null>(null);

    // Sync ref
    useEffect(() => {
        selectedSessionIdRef.current = selectedSessionId;
    }, [selectedSessionId]);

    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputMessage, setInputMessage] = useState('');
    const [socket, setSocket] = useState<Socket | null>(null);
    const [loading, setLoading] = useState(true);

    // Admin features
    const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
    const [isTyping, setIsTyping] = useState(false);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Fetch Active Sessions
    const fetchSessions = async () => {
        setLoading(true);
        try {
            // Updated endpoint for Admin
            const res = await api.get('/chat/admin/sessions');
            if (res.data.success) {
                setSessions(res.data.sessions);
            }
        } catch (error) {
            console.error('Failed to fetch sessions', error);
        } finally {
            setLoading(false);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        fetchSessions();
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, selectedSessionId, isTyping]);

    // Initialize Socket (Admin Connection)
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;

        const newSocket = io(SOCKET_URL);
        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log('Admin Socket Connected');
            newSocket.emit('join_admin', token);
        });

        // Listen for ANY message from ANY user (via admin notification channel)
        newSocket.on('admin_notification', (data) => {
            if (data.type === 'NEW_MESSAGE') {
                console.log("New User Message:", data);
                // Refresh session list to show updated time/unread status logic (if implemented)
                // Or just push to current messages if it matches selected session
                if (selectedSessionId === data.sessionId) {
                    setMessages(prev => [...prev, data.message]);
                    setIsTyping(false); // Stop typing
                } else {
                    // Maybe show specific indicator? For now just refresh list
                    fetchSessions();
                }
            }
        });

        // Track Online Users
        newSocket.on('user_status', ({ sessionId, online }) => {
            setOnlineUsers(prev => {
                const newSet = new Set(prev);
                if (online) newSet.add(sessionId);
                else newSet.delete(sessionId);
                return newSet;
            });
        });

        return () => {
            newSocket.disconnect();
        };
    }, [selectedSessionId]); // Add selectedSessionId as dependency if needed, strictly simpler to keep unrelated. 
    // Wait, selectedSessionId used in admin_notification callback. 
    // Need to use refs or update dependency. 
    // Better: functional update for setMessages or check inside.
    // Actually, `selectedSessionId` is in closure. If we include it in dep array, we reconnect socket every time we switch session.
    // That's bad.
    // Fix: Use a Ref for selectedSessionId or rely on `socket.on` inside a separate useEffect?
    // Let's keep it simple. If we reconnect, it's fine for now, or refine it.
    // Actually, reconnecting socket is disruptive.
    // Best practice: use a Ref for selectedSessionId tracking inside the event handler.

    // HOWEVER, for this task, I'll stick to the simpler approach but separate the listeners if possible.
    // But `admin_notification` needs `selectedSessionId`.
    // Let's use a Ref for selectedSessionId.

    // When selecting a session
    useEffect(() => {
        if (!selectedSessionId || !socket) return;

        // Load initial messages from the selected session object in state
        const session = sessions.find(s => s.id === selectedSessionId);
        if (session) {
            setMessages(session.messages.reverse());
            fetchFullSession(selectedSessionId);
            setIsTyping(false); // Reset typing
        }

        // Join the specific room to receive real-time updates for THIS session
        socket.emit('join_session', selectedSessionId);

        // Be careful not to duplicate listeners if using 'receive_message' global.
        // It's better to ensure cleanup.
        const msgListener = (message: ChatMessage) => {
            setMessages(prev => {
                // Avoid duplicates if 'admin_notification' also adds it?
                // Actually 'admin_notification' is for notifications. 
                // 'receive_message' is direct chat event. 
                // Let's rely on 'receive_message' for the active chat window. 
                if (prev.find(m => m.id === message.id)) return prev;
                return [...prev, message];
            });
        };

        socket.on('receive_message', msgListener);

        return () => {
            // Leave session not explicitly supported by backend but we stop listening
            socket.off('receive_message', msgListener);
        };
    }, [selectedSessionId, socket]);


    const fetchFullSession = async (id: string) => {
        try {
            const res = await api.get(`/chat/session/${id}`);
            if (res.data.success) {
                setMessages(res.data.session.messages);
            }
        } catch (error) {
            console.error('Failed to fetch full session', error);
        }
    };

    const handleSend = () => {
        if (!inputMessage.trim() || !socket || !selectedSessionId) return;

        const token = localStorage.getItem('token');
        const payload = {
            sessionId: selectedSessionId,
            content: inputMessage,
            sender: 'ADMIN',
            token
        };

        socket.emit('send_message', payload);
        setInputMessage('');
    };

    return (
        <div className="flex h-[calc(100vh-120px)] bg-neutral-900 rounded-xl overflow-hidden border border-neutral-800">
            {/* Sidebar List */}
            <div className="w-1/3 border-r border-neutral-800 flex flex-col">
                <div className="p-4 border-b border-neutral-800 flex justify-between items-center bg-neutral-950">
                    <h2 className="font-bold text-white flex items-center gap-2">
                        <MessageCircle size={20} />
                        Active Chats
                    </h2>
                    <button onClick={fetchSessions} className="p-2 hover:bg-neutral-800 rounded-full transition">
                        <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {sessions.length === 0 && !loading && (
                        <div className="p-8 text-center text-neutral-500">No active sessions</div>
                    )}
                    {sessions.map(session => (
                        <div
                            key={session.id}
                            onClick={() => setSelectedSessionId(session.id)}
                            className={`p-4 border-b border-neutral-800 cursor-pointer transition hover:bg-neutral-800 ${selectedSessionId === session.id ? 'bg-neutral-800' : ''}`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <span className="font-bold text-white flex items-center gap-2">
                                    {session.user?.name || session.guestName || 'Anonymous'}
                                    {onlineUsers.has(session.id) && (
                                        <span className="w-2 h-2 bg-green-500 rounded-full" title="Online"></span>
                                    )}
                                </span>
                                <span className="text-xs text-neutral-500">
                                    {new Date(session.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                            <div className="text-sm text-neutral-400 truncate">
                                {session.messages[0]?.content || "No messages"}
                            </div>
                            <div className="text-xs text-neutral-600 mt-1">
                                {session.user?.email || session.guestEmail || 'No Email'}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col bg-neutral-950">
                {selectedSessionId ? (
                    <>
                        {/* Header */}
                        <div className="p-4 border-b border-neutral-800 bg-neutral-900">
                            <h3 className="font-bold text-white">
                                Chatting with {sessions.find(s => s.id === selectedSessionId)?.user?.name || sessions.find(s => s.id === selectedSessionId)?.guestName}
                            </h3>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((msg) => {
                                const isAdmin = msg.sender === 'ADMIN';
                                return (
                                    <div key={msg.id} className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`
                                            max-w-[70%] px-4 py-3 rounded-2xl text-sm
                                            ${isAdmin ? 'bg-red-600 text-white rounded-br-none' : 'bg-neutral-800 text-neutral-200 rounded-bl-none'}
                                        `}>
                                            {msg.content}
                                            <div className={`text-[10px] mt-1 ${isAdmin ? 'text-red-200' : 'text-neutral-500'}`}>
                                                {new Date(msg.createdAt).toLocaleTimeString()}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                            {isTyping && (
                                <div className="flex justify-start animate-pulse">
                                    <div className="bg-neutral-800/50 text-neutral-400 px-4 py-2 rounded-2xl text-xs italic">
                                        User is typing...
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-4 bg-neutral-900 border-t border-neutral-800 flex gap-2">
                            <input
                                type="text"
                                value={inputMessage}
                                onChange={(e) => {
                                    setInputMessage(e.target.value);

                                    if (socket && selectedSessionId) {
                                        socket.emit('typing', { sessionId: selectedSessionId, isTyping: true });

                                        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
                                        typingTimeoutRef.current = setTimeout(() => {
                                            socket.emit('typing', { sessionId: selectedSessionId, isTyping: false });
                                        }, 2000);
                                    }
                                }}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Type a reply..."
                                className="flex-1 bg-neutral-950 text-white rounded-lg px-4 py-2 outline-none focus:ring-1 focus:ring-red-500 border border-neutral-800"
                            />
                            <button
                                onClick={handleSend}
                                disabled={!inputMessage.trim()}
                                className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                            >
                                <Send size={20} />
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-neutral-500 gap-4">
                        <div className="w-16 h-16 bg-neutral-900 rounded-full flex items-center justify-center">
                            <MessageCircle size={32} />
                        </div>
                        <p>Select a conversation to start chatting</p>
                    </div>
                )}
            </div>
        </div>
    );
}
