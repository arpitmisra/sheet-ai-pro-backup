'use client';

import { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, X, Minimize2, Maximize2 } from 'lucide-react';
import { getCurrentUser } from '@/lib/supabase/client';
import { useWebSocket } from '@/lib/hooks/useWebSocket';
import { formatDistanceToNow } from 'date-fns';

export default function ChatPanel({ sheetId, isOpen, onToggle }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);

  const { send, on, isConnected } = useWebSocket(
    sheetId,
    currentUser?.id,
    currentUser?.user_metadata?.full_name || currentUser?.email
  );

  useEffect(() => {
    loadUser();
    // Load persisted messages from localStorage
    loadPersistedMessages();
  }, []);

  useEffect(() => {
    if (isOpen && isConnected) {
      const unsubscribeChatMessage = on('CHAT_MESSAGE', (data) => {
        console.log('Received chat message:', data); // Debug log
        const newMsg = {
          userId: data.userId,
          userName: data.userName,
          message: data.message,
          timestamp: data.timestamp,
          id: `${data.userId}-${data.timestamp}`, // Better unique ID
        };
        
        setMessages((prev) => {
          const updated = [...prev, newMsg];
          // Persist messages to localStorage
          persistMessages(updated);
          return updated;
        });
      });

      // Listen for user join/leave events
      const unsubscribePresence = on('PRESENCE_UPDATE', (data) => {
        if (data.users && Array.isArray(data.users)) {
          // Check for new users (basic implementation)
          // This could be enhanced to show actual join/leave messages
          console.log('Users online:', data.users.map(u => u.userName));
        }
      });

      return () => {
        unsubscribeChatMessage();
        unsubscribePresence();
      };
    }
  }, [isOpen, isConnected, on]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadUser = async () => {
    const user = await getCurrentUser();
    setCurrentUser(user);
  };

  const loadPersistedMessages = () => {
    try {
      const saved = localStorage.getItem(`chat-${sheetId}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Only load messages from last 24 hours
        const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
        const recentMessages = parsed.filter(msg => msg.timestamp > oneDayAgo);
        setMessages(recentMessages);
      }
    } catch (error) {
      console.error('Error loading persisted messages:', error);
    }
  };

  const persistMessages = (msgs) => {
    try {
      // Keep only last 100 messages
      const limited = msgs.slice(-100);
      localStorage.setItem(`chat-${sheetId}`, JSON.stringify(limited));
    } catch (error) {
      console.error('Error persisting messages:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !isConnected || !currentUser) return;

    console.log('Sending chat message:', newMessage.trim()); // Debug log
    
    send('CHAT_MESSAGE', {
      message: newMessage.trim(),
    });
    
    setNewMessage('');
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 flex items-center justify-center z-40"
        title="Open Chat"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div 
      className={`fixed bottom-6 right-6 bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col z-40 transition-all ${
        isMinimized ? 'w-80 h-16' : 'w-96 h-[500px]'
      }`}
    >
      {/* Header */}
      <div className="px-4 py-3 border-b bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          <h3 className="font-semibold">Team Chat</h3>
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`} title={isConnected ? 'Connected' : 'Disconnected'} />
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 hover:bg-blue-500 rounded"
          >
            {isMinimized ? (
              <Maximize2 className="w-4 h-4" />
            ) : (
              <Minimize2 className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={onToggle}
            className="p-1 hover:bg-blue-500 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <MessageCircle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No messages yet</p>
                <p className="text-xs">Start the conversation!</p>
              </div>
            ) : (
              messages.map((msg) => {
                const isCurrentUser = msg.userId === currentUser?.id;
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[75%] rounded-lg px-3 py-2 ${
                        isCurrentUser
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-900 border border-gray-200'
                      }`}
                    >
                      {!isCurrentUser && (
                        <p className="text-xs font-semibold mb-1 text-gray-600">
                          {msg.userName}
                        </p>
                      )}
                      <p className="text-sm whitespace-pre-wrap break-words">
                        {msg.message}
                      </p>
                      <p
                        className={`text-xs mt-1 ${
                          isCurrentUser ? 'text-blue-200' : 'text-gray-400'
                        }`}
                      >
                        {formatDistanceToNow(new Date(msg.timestamp), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} className="p-3 border-t bg-white rounded-b-lg">
            {!isConnected && (
              <div className="mb-2 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
                Reconnecting to chat...
              </div>
            )}
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={isConnected ? "Type a message..." : "Connecting..."}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                disabled={!isConnected}
                maxLength={500}
              />
              <button
                type="submit"
                disabled={!isConnected || !newMessage.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
                title={isConnected ? "Send message" : "Chat disconnected"}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            {newMessage.length > 400 && (
              <div className="mt-1 text-xs text-gray-500">
                {500 - newMessage.length} characters remaining
              </div>
            )}
          </form>
        </>
      )}
    </div>
  );
}
