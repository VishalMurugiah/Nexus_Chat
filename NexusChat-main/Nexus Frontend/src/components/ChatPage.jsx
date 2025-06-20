import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import useChatContext from "../context/ChatContext";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import toast from "react-hot-toast";
import { baseURL } from "../config/AxiosHelper";
import { getMessagess } from "../services/RoomService";
import { timeAgo } from "../config/helper";

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [stompClient, setStompClient] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);
  const chatBoxRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const { roomId, currentUser, connected, setConnected, setRoomId, setCurrentUser } = useChatContext();

  useEffect(() => {
    if (!connected) {
      navigate("/");
    }
  }, [connected, roomId, currentUser]);

  // Load messages when component mounts
  useEffect(() => {
    async function loadMessages() {
      try {
        const messages = await getMessagess(roomId);
        setMessages(messages);
      } catch (error) {
        console.error("Error loading messages:", error);
      }
    }
    if (connected) {
      loadMessages();
    }
  }, [roomId, connected]);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scroll({
        top: chatBoxRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  // Initialize WebSocket connection
  useEffect(() => {
    const connectWebSocket = () => {
      const sock = new SockJS(`${baseURL}/chat`);
      const client = Stomp.over(sock);

      client.connect({}, () => {
        setStompClient(client);
        toast.success("Connected to Nexus!");

        client.subscribe(`/topic/room/${roomId}`, (message) => {
          console.log("Received message:", message);
          const newMessage = JSON.parse(message.body);
          setMessages((prev) => [...prev, newMessage]);
        });
      });
    };

    if (connected && !stompClient) {
      connectWebSocket();
    }

    return () => {
      if (stompClient) {
        stompClient.disconnect();
        setStompClient(null);
      }
    };
  }, [roomId, connected, stompClient]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = async () => {
    if (stompClient && connected && input.trim() && !isSending) {
      setIsSending(true);
      console.log("Sending message:", input);

      const message = {
        sender: currentUser,
        content: input,
        roomId: roomId,
      };

      try {
        stompClient.send(
          `/app/sendMessage/${roomId}`,
          {},
          JSON.stringify(message)
        );
        setInput("");
      } catch (error) {
        console.error("Error sending message:", error);
        toast.error("Failed to send message!");
      } finally {
        setIsSending(false);
      }
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const leaveRoom = () => {
    if (stompClient) {
      stompClient.disconnect();
    }
    setStompClient(null);
    setConnected(false);
    setRoomId("");
    setCurrentUser("");
    toast.success("Left the room");
    navigate("/");
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    return timeAgo(timestamp);
  };

  const getMessageStyle = (sender) => {
    return sender === currentUser ? 'ml-auto' : 'mr-auto';
  };

  const getMessageColor = (sender) => {
    if (sender === currentUser) {
      return isDarkMode 
        ? 'bg-gradient-to-r from-purple-600 to-pink-600' 
        : 'bg-gradient-to-r from-blue-500 to-purple-500';
    }
    return isDarkMode 
      ? 'bg-gradient-to-r from-gray-700 to-gray-600' 
      : 'bg-gradient-to-r from-gray-200 to-gray-300';
  };

  return (
    <div className={`min-h-screen relative overflow-hidden transition-all duration-1000 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800' 
        : 'bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-200'
    }`}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Orbs */}
        <div className={`absolute top-20 left-20 w-72 h-72 rounded-full blur-3xl opacity-10 animate-pulse ${
          isDarkMode ? 'bg-purple-500' : 'bg-blue-400'
        }`}></div>
        <div className={`absolute bottom-20 right-20 w-96 h-96 rounded-full blur-3xl opacity-10 animate-pulse delay-1000 ${
          isDarkMode ? 'bg-cyan-500' : 'bg-purple-400'
        }`}></div>
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full blur-3xl opacity-5 animate-spin-slow ${
          isDarkMode ? 'bg-pink-500' : 'bg-indigo-400'
        }`}></div>
        
        {/* Grid Pattern */}
        <div className={`absolute inset-0 opacity-3 ${isDarkMode ? 'bg-white' : 'bg-gray-800'}`} 
             style={{
               backgroundImage: `radial-gradient(circle, ${isDarkMode ? '#ffffff' : '#1f2937'} 1px, transparent 1px)`,
               backgroundSize: '30px 30px'
             }}>
        </div>
        
        {/* Scanning Lines */}
        <div className={`absolute inset-0 opacity-10 ${isDarkMode ? 'bg-gradient-to-r from-transparent via-cyan-500 to-transparent' : 'bg-gradient-to-r from-transparent via-blue-500 to-transparent'} animate-scan`}></div>
      </div>

      {/* Header */}
      <div className={`relative z-20 ${
        isDarkMode 
          ? 'bg-black/30 border-purple-500/20' 
          : 'bg-white/30 border-blue-300/20'
      } backdrop-blur-xl border-b px-6 py-4`}>
        <div className="flex items-center justify-between">
          {/* Room Info */}
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 rounded-xl ${
              isDarkMode 
                ? 'bg-gradient-to-br from-purple-600 to-pink-600' 
                : 'bg-gradient-to-br from-blue-500 to-purple-600'
            } flex items-center justify-center shadow-lg backdrop-blur-sm border border-white/20`}>
              <span className="text-white font-bold text-lg">💬</span>
            </div>
            <div>
              <h1 className={`text-xl font-bold ${
                isDarkMode ? 'text-white' : 'text-gray-800'
              } tracking-wide`}>
                <span className={`bg-gradient-to-r ${
                  isDarkMode 
                    ? 'from-purple-400 via-pink-400 to-cyan-400' 
                    : 'from-blue-600 via-purple-600 to-pink-600'
                } bg-clip-text text-transparent`}>
                  NEXUS: {roomId}
                </span>
              </h1>
              <p className={`text-sm ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              } flex items-center space-x-2`}>
                <span className={`w-2 h-2 rounded-full ${
                  stompClient ? 'bg-green-500' : 'bg-red-500'
                } animate-pulse`}></span>
                <span>Neural Link: {currentUser}</span>
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-4">
            {/* Dark/Light Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className={`relative w-12 h-6 rounded-full transition-all duration-500 transform hover:scale-110 ${
                isDarkMode ? 'bg-gradient-to-r from-purple-600 to-pink-600' : 'bg-gradient-to-r from-yellow-400 to-orange-500'
              } shadow-lg backdrop-blur-sm border border-white/20`}
            >
              <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full transition-all duration-500 transform ${
                isDarkMode ? 'translate-x-6 bg-white' : 'translate-x-0 bg-gray-800'
              } shadow-lg flex items-center justify-center`}>
                {isDarkMode ? (
                  <span className="text-xs">🌙</span>
                ) : (
                  <span className="text-xs">☀️</span>
                )}
              </div>
            </button>

            {/* Leave Room Button */}
            <button
              onClick={leaveRoom}
              className={`px-6 py-3 rounded-xl font-bold text-white transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                isDarkMode 
                  ? 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500' 
                  : 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-400 hover:to-pink-400'
              } shadow-lg hover:shadow-2xl backdrop-blur-sm border border-white/20 overflow-hidden group`}
            >
              <span className="relative z-10 tracking-wide">🚪 Exit Portal</span>
            </button>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="relative z-10 h-[calc(100vh-140px)] flex flex-col pb-24">
        {/* Messages Container */}
        <div ref={chatBoxRef} className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-transparent">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className={`text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <div className={`w-24 h-24 mx-auto mb-4 rounded-full ${
                  isDarkMode 
                    ? 'bg-gradient-to-br from-purple-600/20 to-pink-600/20' 
                    : 'bg-gradient-to-br from-blue-500/20 to-purple-600/20'
                } flex items-center justify-center backdrop-blur-sm border border-white/10`}>
                  <span className="text-4xl">💭</span>
                </div>
                <p className="text-lg font-medium tracking-wide">Neural space is quiet...</p>
                <p className="text-sm opacity-70">Send your first transmission</p>
              </div>
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.sender === currentUser ? 'justify-end' : 'justify-start'} animate-fade-in-up`}
              >
                <div className={`max-w-xs lg:max-w-md px-6 py-4 rounded-2xl ${getMessageColor(message.sender)} ${
                  message.sender === currentUser ? 'ml-auto' : 'mr-auto'
                } shadow-lg backdrop-blur-sm border border-white/20 transform hover:scale-105 transition-all duration-300`}>
                  {message.sender !== currentUser && (
                    <div className={`text-xs font-semibold mb-2 ${
                      isDarkMode ? 'text-gray-200' : 'text-white'
                    } opacity-80 tracking-wide`}>
                      {message.sender}
                    </div>
                  )}
                  <div className="text-white font-medium leading-relaxed">
                    {message.content}
                  </div>
                  <div className={`text-xs mt-2 ${
                    message.sender === currentUser 
                      ? 'text-purple-200' 
                      : isDarkMode ? 'text-gray-300' : 'text-gray-100'
                  } opacity-70`}>
                    {formatTime(message.timeStamp)}
                  </div>
                </div>
              </div>
            ))
          )}
          
          {/* Typing Indicator - Removed for now */}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className={`fixed bottom-0 left-0 right-0 z-20 p-6 ${
          isDarkMode 
            ? 'bg-black/40 border-purple-500/20' 
            : 'bg-white/40 border-blue-300/20'
        } backdrop-blur-xl border-t`}>
          <div className="flex items-end space-x-4">
            {/* Message Input */}
            <div className="flex-1 relative">
              <div className={`absolute inset-0 rounded-2xl opacity-20 ${
                isDarkMode 
                  ? 'bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-cyan-500/20' 
                  : 'bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20'
              } animate-gradient-xy`}></div>
              
              <textarea
                value={input}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Transmit your neural thoughts..."
                rows="1"
                className={`relative w-full px-6 py-4 rounded-2xl resize-none transition-all duration-300 ${
                  isDarkMode 
                    ? 'bg-gray-800/60 border-purple-500/30 text-white placeholder-gray-400' 
                    : 'bg-white/60 border-blue-300/30 text-gray-800 placeholder-gray-500'
                } backdrop-blur-sm border-2 focus:outline-none focus:border-purple-400 focus:shadow-lg focus:shadow-purple-500/25 transform hover:scale-[1.02] scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-transparent`}
                style={{ 
                  minHeight: '56px',
                  maxHeight: '120px'
                }}
              />
            </div>

            {/* Attachment Button */}
            <button
              className={`p-4 rounded-2xl transition-all duration-300 transform hover:scale-110 active:scale-95 ${
                isDarkMode 
                  ? 'bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500' 
                  : 'bg-gradient-to-r from-gray-300 to-gray-400 hover:from-gray-200 hover:to-gray-300'
              } shadow-lg hover:shadow-2xl backdrop-blur-sm border border-white/20 overflow-hidden group`}
            >
              <span className="relative z-10 text-xl">📎</span>
            </button>

            {/* Send Button */}
            {/* Send Button */}
            <button
              onClick={sendMessage}
              disabled={!input.trim() || !stompClient || isSending}
              className={`p-4 rounded-2xl font-bold text-white transition-all duration-300 transform hover:scale-110 active:scale-95 ${
                (!input.trim() || !stompClient || isSending)
                  ? 'bg-gray-500 cursor-not-allowed opacity-50'
                  : isDarkMode 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500' 
                    : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400'
              } shadow-lg hover:shadow-2xl backdrop-blur-sm border border-white/20 overflow-hidden group`}
            >
              <span className="relative z-10 text-xl">
                {isSending ? '⏳' : '🚀'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes gradient-xy {
          0%, 100% { transform: translate(0%, 0%) rotate(0deg); }
          25% { transform: translate(100%, 0%) rotate(90deg); }
          50% { transform: translate(100%, 100%) rotate(180deg); }
          75% { transform: translate(0%, 100%) rotate(270deg); }
        }
        
        @keyframes scan {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .animate-gradient-xy {
          animation: gradient-xy 4s ease infinite;
        }
        
        .animate-scan {
          animation: scan 3s linear infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out;
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        /* Custom Scrollbar */
        .scrollbar-thin {
          scrollbar-width: thin;
        }
        
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: rgba(147, 51, 234, 0.5);
          border-radius: 10px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: rgba(147, 51, 234, 0.7);
        }
      `}</style>
    </div>
  );
};

export default ChatPage;
