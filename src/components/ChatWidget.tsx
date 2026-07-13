"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { type Socket } from 'socket.io-client';
import { MessageCircle, X, Send, Minimize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import api from '@/lib/api';
import { ChatMessage } from '@/types/chat';
import { useUIStore } from '@/lib/uiStore';
import { usePathname } from 'next/navigation';
import { createAppSocket } from '@/lib/socket';

export default function ChatWidget() {
    const { user } = useAuth();
    const { isMobileSummaryExpanded } = useUIStore();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputMessage, setInputMessage] = useState('');
    const [socket, setSocket] = useState<Socket | null>(null);
    const socketRef = useRef<Socket | null>(null);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [sessionToken, setSessionToken] = useState<string | null>(null);
    const [isJoining, setIsJoining] = useState(false);
    const joiningRef = useRef(false);

    // Guest form state
    const [guestName, setGuestName] = useState('');
    const [guestEmail, setGuestEmail] = useState('');
    const [hasJoined, setHasJoined] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    // State for indicators
    const [isAdminOnline, setIsAdminOnline] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleSessionEnded = useCallback(() => {
        setSessionId(null);
        setSessionToken(null);
        setHasJoined(false);
        setMessages([]);
        localStorage.removeItem('chatSessionId');
        localStorage.removeItem('chatSessionToken');
    }, []);

    const fetchHistory = useCallback(async (id: string, token?: string | null) => {
        try {
            const res = await api.get(`/chat/session/${id}`, {
                params: !user && token ? { token } : undefined
            });
            if (res.data.success && res.data.session) {
                const session = res.data.session;
                if (!session.isActive) {
                    handleSessionEnded();
                } else {
                    setMessages(session.messages);
                }
            }
        } catch (err: unknown) {
            console.error('Failed to fetch chat history', err);
            if (typeof err === 'object' && err !== null && 'response' in err) {
                const status = (err as { response?: { status?: number } }).response?.status;
                if (status === 403 || status === 401 || status === 404) {
                    handleSessionEnded();
                }
            }
        }
    }, [handleSessionEnded, user]);

    const startChat = useCallback(async () => {
        if (joiningRef.current) return;
        joiningRef.current = true;
        setIsJoining(true);

        try {
            const payload = user ? {} : { guestName, guestEmail };
            const endpoint = user ? '/chat/session/user' : '/chat/session/guest';

            const res = await api.post(endpoint, payload);

            if (res.data.success) {
                const newSessionId = res.data.sessionId;
                const newSessionToken = res.data.sessionToken || null;
                setSessionId(newSessionId);
                setSessionToken(newSessionToken);
                localStorage.setItem('chatSessionId', newSessionId);
                if (newSessionToken) {
                    localStorage.setItem('chatSessionToken', newSessionToken);
                }
                setHasJoined(true);
            }
        } catch (error) {
            console.error('Failed to start chat session', error);
        } finally {
            joiningRef.current = false;
            setIsJoining(false);
        }
    }, [guestEmail, guestName, user]);

    // Scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen, isTyping]);

    // Check for existing session in localStorage
    // Check for existing session in localStorage
    useEffect(() => {
        // If user logs in, we should check if the current session is valid for them.
        // For simplicity, if we have a user, we should try to fetch THEIR active session from server
        // instead of relying on localStorage which might be a guest session.
        if (user) {
            if (!hasJoined) {
                startChat();
            }
        } else {
            // Guest mode: check local storage
            const storedSessionId = localStorage.getItem('chatSessionId');
            const storedSessionToken = localStorage.getItem('chatSessionToken');
            if (storedSessionId && !hasJoined) {
                setSessionId(storedSessionId);
                setSessionToken(storedSessionToken);
                setHasJoined(true);
            }
        }
    }, [hasJoined, startChat, user]); // Run when user/session state changes

    // Socket only after chat session started — not while guest form is open
    useEffect(() => {
        if (!isOpen || !hasJoined) {
            socketRef.current?.disconnect();
            socketRef.current = null;
            setSocket(null);
            setIsAdminOnline(false);
            return;
        }

        const newSocket = createAppSocket();
        socketRef.current = newSocket;
        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log('Connected to chat server');
        });

        newSocket.on('connect_error', (err) => {
            console.error('Chat socket error:', err.message);
            setIsAdminOnline(false);
        });

        newSocket.on('receive_message', (message: ChatMessage) => {
            setMessages((prev) => [...prev, message]);
            setIsTyping(false);
        });

        newSocket.on('admin_status', ({ online }) => {
            setIsAdminOnline(online);
        });

        newSocket.on('typing_status', ({ isTyping: typing }) => {
            setIsTyping(typing);
        });

        return () => {
            newSocket.disconnect();
            socketRef.current = null;
            setSocket(null);
            setIsAdminOnline(false);
        };
    }, [isOpen, hasJoined]);

    // Session Management (Join & Fetch)
    useEffect(() => {
        if (socket && sessionId) {
            console.log(`Joining session: ${sessionId}`);
            socket.emit('join_session', sessionId);
            fetchHistory(sessionId, sessionToken);
        }
    }, [fetchHistory, sessionId, sessionToken, socket]);

    const endChat = async () => {
        if (!sessionId) return;
        try {
            await api.post('/chat/session/end', {
                sessionId,
                sessionToken: !user ? sessionToken : undefined
            });
            handleSessionEnded();
        } catch (error) {
            console.error('Failed to end session', error);
        }
    };

    const handleSend = () => {
        if (!inputMessage.trim() || !socket || !sessionId) return;

        const token = localStorage.getItem('token');
        const payload = {
            sessionId,
            content: inputMessage,
            sender: user ? 'USER' : 'USER',
            token
        };

        socket.emit('send_message', payload);
        setInputMessage('');
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSend();
    };

    const pathname = usePathname();
    const isOrderPage = pathname?.startsWith('/order/');

    return (
        <div className={`fixed right-4 lg:right-6 z-60 flex flex-col items-end transition-all duration-300 ${
            isOrderPage 
                ? (isMobileSummaryExpanded ? 'bottom-[360px]' : 'bottom-22 lg:bottom-6') 
                : 'bottom-24 lg:bottom-6'
        }`}>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="mb-4 w-96 max-w-[calc(100vw-2rem)] h-[500px] bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-4 bg-linear-to-r from-violet-600 to-indigo-600 flex justify-between items-center text-white">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-white/20 rounded-full">
                                    <MessageCircle size={18} />
                                </div>
                                <div className="font-bold">
                                    Customer Support
                                    {isAdminOnline ? (
                                        <span className="ml-2 text-[10px] bg-green-500 text-white px-2 py-0.5 rounded-full inline-block align-middle">Online</span>
                                    ) : (
                                        <span className="ml-2 text-[10px] bg-gray-500 text-white px-2 py-0.5 rounded-full inline-block align-middle">Offline</span>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                {hasJoined && (
                                    <button
                                        onClick={endChat}
                                        className="text-white/70 hover:text-white px-2 py-1 text-xs bg-red-500/20 hover:bg-red-500/40 rounded transition mr-1"
                                        title="End Session"
                                    >
                                        End
                                    </button>
                                )}
                                <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded transition">
                                    <Minimize2 size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Body */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-900/95 scrollbar-thin scrollbar-thumb-violet-600/50">
                            {!hasJoined ? (
                                <div className="flex flex-col gap-4 h-full justify-center">
                                    <p className="text-gray-300 text-center mb-2">
                                        {user ? `Welcome back, ${user.name}!` : 'Please fill in your details to start chatting.'}
                                    </p>
                                    {!user && (
                                        <>
                                            <input
                                                type="text"
                                                placeholder="Name"
                                                className="bg-white/5 border border-white/10 rounded px-4 py-2 text-white outline-none focus:border-violet-500"
                                                value={guestName}
                                                onChange={e => setGuestName(e.target.value)}
                                            />
                                            <input
                                                type="email"
                                                placeholder="Email (Optional)"
                                                className="bg-white/5 border border-white/10 rounded px-4 py-2 text-white outline-none focus:border-violet-500"
                                                value={guestEmail}
                                                onChange={e => setGuestEmail(e.target.value)}
                                            />
                                        </>
                                    )}
                                    <button
                                        onClick={startChat}
                                        disabled={isJoining || (!user && !guestName)}
                                        className="bg-violet-600 hover:bg-violet-700 text-white py-3 rounded-lg font-bold transition disabled:opacity-50"
                                    >
                                        {isJoining ? 'Starting...' : 'Start Chat'}
                                    </button>
                                </div>
                            ) : (
                                <>
                                    {messages.map((msg, idx) => {
                                        const isMe = msg.sender === 'USER';
                                        return (
                                            <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                                {!isMe && (
                                                    <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center mr-2 text-xs font-bold text-white shadow-lg">CS</div>
                                                )}
                                                <div className={`
                                                    max-w-[75%] px-4 py-2 rounded-2xl text-sm shadow-md
                                                    ${isMe ? 'bg-violet-600 text-white rounded-br-none' : 'bg-gray-800 text-gray-200 rounded-bl-none'}
                                                `}>
                                                    {msg.content}
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <div ref={messagesEndRef} />
                                </>
                            )}
                        </div>

                        {/* Footer */}
                        {hasJoined && (
                            <div className="p-3 bg-gray-800/50 border-t border-white/5 flex gap-2">
                                <input
                                    type="text"
                                    value={inputMessage}
                                    onChange={(e) => {
                                        setInputMessage(e.target.value);

                                        // Emit typing
                                        if (socket && sessionId) {
                                            socket.emit('typing', { sessionId, isTyping: true });

                                            // Clear prev timeout
                                            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

                                            // Set new timeout to stop typing
                                            typingTimeoutRef.current = setTimeout(() => {
                                                socket.emit('typing', { sessionId, isTyping: false });
                                            }, 2000);
                                        }
                                    }}
                                    onKeyDown={handleKeyPress}
                                    placeholder="Type a message..."
                                    className="flex-1 bg-gray-900/50 text-white rounded-full px-4 py-2 outline-none focus:ring-2 focus:ring-violet-500/50 border border-white/5"
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!inputMessage.trim()}
                                    className="p-2 bg-violet-600 text-white rounded-full hover:bg-violet-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-violet-600/20"
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                        )}


                        {/* Typing Indicator */}
                        {isTyping && (
                            <div className="px-4 py-2 text-xs text-violet-400 italic animate-pulse">
                                Support is typing...
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>


            {/* Toggle Button */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className="w-14 h-14 bg-linear-to-r from-violet-600 to-indigo-600 rounded-full shadow-2xl flex items-center justify-center text-white relative group"
            >
                {isOpen ? <X size={24} /> : <MessageCircle size={28} />}

                {/* Online Status Indicator (Badge) */}
                {isAdminOnline && (
                    <span className="absolute top-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></span>
                )}
            </motion.button>
        </div >
    );
}
