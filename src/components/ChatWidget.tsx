"use client";

import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { MessageCircle, X, Send, Minimize2, User as UserIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import api from '@/lib/api';
import { ChatMessage, ChatSession } from '@/types/chat';

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:4000';

export default function ChatWidget() {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputMessage, setInputMessage] = useState('');
    const [socket, setSocket] = useState<Socket | null>(null);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [isJoining, setIsJoining] = useState(false);

    // Guest form state
    const [guestName, setGuestName] = useState('');
    const [guestEmail, setGuestEmail] = useState('');
    const [hasJoined, setHasJoined] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    // State for indicators
    const [isAdminOnline, setIsAdminOnline] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
        const storedSessionId = localStorage.getItem('chatSessionId');
        if (storedSessionId && !hasJoined) {
            // Validate if session is still valid?
            // We just set it, and if it fails (403 or 404), fetchHistory will catch it and clear it.
            setSessionId(storedSessionId);
            setHasJoined(true);
        }
    }, []); // Run ONCE on mount

    // Initialize Socket
    useEffect(() => {
        if (isOpen && !socket) {
            const newSocket = io(SOCKET_URL);
            setSocket(newSocket);

            newSocket.on('connect', () => {
                console.log('Connected to chat server');
            });

            newSocket.on('receive_message', (message: ChatMessage) => {
                setMessages(prev => [...prev, message]);
                setIsTyping(false); // Stop typing when message received
            });

            newSocket.on('admin_status', ({ online }) => {
                setIsAdminOnline(online);
            });

            newSocket.on('typing_status', ({ isTyping }) => {
                setIsTyping(isTyping);
            });

            return () => {
                newSocket.disconnect();
                setSocket(null);
            };
        }
    }, [isOpen]);

    // Session Management (Join & Fetch)
    useEffect(() => {
        if (socket && sessionId) {
            console.log(`Joining session: ${sessionId}`);
            socket.emit('join_session', sessionId);
            fetchHistory(sessionId);
        }
    }, [socket, sessionId]);

    const fetchHistory = async (id: string) => {
        try {
            const res = await api.get(`/chat/session/${id}`);
            if (res.data.success && res.data.session) {
                // If session is inactive? The backend doesn't explicitly return error for inactive unless we enforce it.
                // But update: backend now expires session if old.
                // If expire logic sets isActive=false, does getSession return it? Yes.
                // Check if active?
                const session = res.data.session;
                if (!session.isActive) {
                    // Session expired or closed
                    handleSessionEnded();
                } else {
                    setMessages(session.messages);
                }
            }
        } catch (err: any) {
            console.error('Failed to fetch chat history', err);
            if (err.response && (err.response.status === 403 || err.response.status === 401 || err.response.status === 404)) {
                handleSessionEnded();
            }
        }
    }

    const handleSessionEnded = () => {
        setSessionId(null);
        setHasJoined(false);
        setMessages([]);
        localStorage.removeItem('chatSessionId');
    };

    const startChat = async () => {
        if (isJoining) return;
        setIsJoining(true);

        try {
            const payload = user ? {} : { guestName, guestEmail };
            const endpoint = user ? '/chat/session/user' : '/chat/session/guest';

            const res = await api.post(endpoint, payload);

            if (res.data.success) {
                const newSessionId = res.data.sessionId;
                setSessionId(newSessionId);
                localStorage.setItem('chatSessionId', newSessionId);
                setHasJoined(true);
            }
        } catch (error) {
            console.error('Failed to start chat session', error);
        } finally {
            setIsJoining(false);
        }
    };

    const endChat = async () => {
        if (!sessionId) return;
        try {
            await api.post('/chat/session/end', { sessionId });
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

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="mb-4 w-96 max-w-[calc(100vw-2rem)] h-[500px] bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-4 bg-gradient-to-r from-violet-600 to-indigo-600 flex justify-between items-center text-white">
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
                className="w-14 h-14 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full shadow-2xl flex items-center justify-center text-white relative group"
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
