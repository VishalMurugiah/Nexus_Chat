import React, { useState, useEffect } from "react";
import chatIcon from "../assets/chat.png";
import toast from "react-hot-toast";
import { createRoomApi, joinChatApi } from "../services/RoomService";
import useChatContext from "../context/ChatContext";
import { useNavigate } from "react-router";
const JoinCreateChat = () => {
  const [detail, setDetail] = useState({
    roomId: "",
    userName: "",
  });

  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);

  const { roomId, userName, setRoomId, setCurrentUser, setConnected } =
    useChatContext();
  const navigate = useNavigate();

  useEffect(() => {
    // Add some floating particles animation
    const createParticles = () => {
      const particles = [];
      for (let i = 0; i < 50; i++) {
        particles.push({
          id: i,
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          size: Math.random() * 3 + 1,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5,
        });
      }
      return particles;
    };
    
    const particles = createParticles();
    
    const animateParticles = () => {
      particles.forEach(particle => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        if (particle.x < 0 || particle.x > window.innerWidth) particle.speedX *= -1;
        if (particle.y < 0 || particle.y > window.innerHeight) particle.speedY *= -1;
      });
    };
    
    const interval = setInterval(animateParticles, 50);
    return () => clearInterval(interval);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  function handleFormInputChange(event) {
    setDetail({
      ...detail,
      [event.target.name]: event.target.value,
    });
  }

  function validateForm() {
    if (detail.roomId === "" || detail.userName === "") {
      toast.error("Invalid Input !!");
      return false;
    }
    return true;
  }

  async function joinChat() {
    if (validateForm()) {
      setIsLoading(true);
      try {
        const room = await joinChatApi(detail.roomId);
        toast.success("Joined successfully!");
        setCurrentUser(detail.userName);
        setRoomId(room.roomId);
        setConnected(true);
        navigate("/chat");
      } catch (error) {
        if (error.status == 400) {
          toast.error(error.response.data);
        } else {
          toast.error("Error in joining room");
        }
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }
  }

  async function createRoom() {
    if (validateForm()) {
      setIsLoading(true);
      try {
        const response = await createRoomApi(detail.roomId);
        toast.success("Room Created Successfully!");
        setCurrentUser(detail.userName);
        setRoomId(response.roomId);
        setConnected(true);
        navigate("/chat");
      } catch (error) {
        console.log(error);
        if (error.status == 400) {
          toast.error("Room already exists!");
        } else {
          toast.error("Error in creating room");
        }
      } finally {
        setIsLoading(false);
      }
    }
  }

  return (
    <div className={`min-h-screen relative overflow-hidden transition-all duration-1000 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800' 
        : 'bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-200'
    }`}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Orbs */}
        <div className={`absolute top-20 left-20 w-72 h-72 rounded-full blur-3xl opacity-20 animate-pulse ${
          isDarkMode ? 'bg-purple-500' : 'bg-blue-400'
        }`}></div>
        <div className={`absolute bottom-20 right-20 w-96 h-96 rounded-full blur-3xl opacity-20 animate-pulse delay-1000 ${
          isDarkMode ? 'bg-cyan-500' : 'bg-purple-400'
        }`}></div>
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full blur-3xl opacity-10 animate-spin-slow ${
          isDarkMode ? 'bg-pink-500' : 'bg-indigo-400'
        }`}></div>
        
        {/* Grid Pattern */}
        <div className={`absolute inset-0 opacity-5 ${isDarkMode ? 'bg-white' : 'bg-gray-800'}`} 
             style={{
               backgroundImage: `radial-gradient(circle, ${isDarkMode ? '#ffffff' : '#1f2937'} 1px, transparent 1px)`,
               backgroundSize: '50px 50px'
             }}>
        </div>
        
        {/* Scanning Lines */}
        <div className={`absolute inset-0 opacity-20 ${isDarkMode ? 'bg-gradient-to-r from-transparent via-cyan-500 to-transparent' : 'bg-gradient-to-r from-transparent via-blue-500 to-transparent'} animate-scan`}></div>
      </div>

      {/* Dark/Light Mode Toggle */}
      <div className="absolute top-8 right-8 z-50">
        <button
          onClick={toggleDarkMode}
          className={`relative w-16 h-8 rounded-full transition-all duration-500 transform hover:scale-110 ${
            isDarkMode ? 'bg-gradient-to-r from-purple-600 to-pink-600' : 'bg-gradient-to-r from-yellow-400 to-orange-500'
          } shadow-lg backdrop-blur-sm border border-white/20`}
        >
          <div className={`absolute top-1 left-1 w-6 h-6 rounded-full transition-all duration-500 transform ${
            isDarkMode ? 'translate-x-8 bg-white' : 'translate-x-0 bg-gray-800'
          } shadow-lg flex items-center justify-center`}>
            {isDarkMode ? (
              <span className="text-xs">🌙</span>
            ) : (
              <span className="text-xs">☀️</span>
            )}
          </div>
        </button>
      </div>

      {/* Main Content */}
      <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
        <div className={`relative p-10 w-full max-w-md transition-all duration-700 transform hover:scale-105 ${
          isDarkMode 
            ? 'bg-black/40 border-purple-500/30 shadow-2xl shadow-purple-500/20' 
            : 'bg-white/40 border-blue-300/30 shadow-2xl shadow-blue-500/20'
        } backdrop-blur-xl border rounded-3xl overflow-hidden`}>
          
          {/* Holographic Border Effect */}
          <div className={`absolute inset-0 rounded-3xl opacity-50 ${
            isDarkMode 
              ? 'bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-cyan-500/20' 
              : 'bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20'
          } animate-gradient-xy`}></div>
          
          {/* Inner Glow */}
          <div className={`absolute inset-1 rounded-3xl ${
            isDarkMode 
              ? 'bg-gradient-to-br from-gray-900/60 to-purple-900/60' 
              : 'bg-gradient-to-br from-white/60 to-blue-50/60'
          } backdrop-blur-sm`}></div>

          <div className="relative z-10">
            {/* Logo Section */}
            <div className="relative mb-8">
              <div className={`absolute inset-0 rounded-full blur-xl opacity-60 ${
                isDarkMode ? 'bg-purple-500' : 'bg-blue-500'
              } animate-pulse`}></div>
              <div className={`relative w-24 h-24 mx-auto rounded-full p-4 ${
                isDarkMode 
                  ? 'bg-gradient-to-br from-purple-600 to-pink-600' 
                  : 'bg-gradient-to-br from-blue-500 to-purple-600'
              } shadow-2xl backdrop-blur-sm border border-white/20`}>
                <img src={chatIcon} className="w-full h-full object-contain filter drop-shadow-lg" alt="Chat" />
              </div>
            </div>

            {/* Title */}
            <h1 className={`text-3xl font-bold text-center mb-8 ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            } tracking-wide`}>
              <span className={`bg-gradient-to-r ${
                isDarkMode 
                  ? 'from-purple-400 via-pink-400 to-cyan-400' 
                  : 'from-blue-600 via-purple-600 to-pink-600'
              } bg-clip-text text-transparent animate-pulse`}>
                NEXUS CHAT
              </span>
            </h1>

            {/* Form Fields */}
            <div className="space-y-6">
              {/* Username Input */}
              <div className="relative">
                <label className={`block font-semibold mb-3 ${
                  isDarkMode ? 'text-gray-200' : 'text-gray-700'
                } tracking-wide text-sm uppercase`}>
                  Neural Identity
                </label>
                <div className="relative">
                  <input
                    onChange={handleFormInputChange}
                    onFocus={() => setFocusedInput('userName')}
                    onBlur={() => setFocusedInput(null)}
                    value={detail.userName}
                    type="text"
                    name="userName"
                    placeholder="Enter your neural signature..."
                    className={`w-full px-6 py-4 rounded-2xl transition-all duration-300 ${
                      isDarkMode 
                        ? 'bg-gray-800/60 border-purple-500/30 text-white placeholder-gray-400' 
                        : 'bg-white/60 border-blue-300/30 text-gray-800 placeholder-gray-500'
                    } backdrop-blur-sm border-2 focus:outline-none ${
                      focusedInput === 'userName' 
                        ? (isDarkMode ? 'focus:border-purple-400 focus:shadow-lg focus:shadow-purple-500/25' : 'focus:border-blue-400 focus:shadow-lg focus:shadow-blue-500/25')
                        : ''
                    } transform hover:scale-105`}
                  />
                  <div className={`absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 ${
                    focusedInput === 'userName' ? 'opacity-100' : ''
                  } ${isDarkMode ? 'bg-purple-500/10' : 'bg-blue-500/10'} pointer-events-none`}></div>
                </div>
              </div>

              {/* Room ID Input */}
              <div className="relative">
                <label className={`block font-semibold mb-3 ${
                  isDarkMode ? 'text-gray-200' : 'text-gray-700'
                } tracking-wide text-sm uppercase`}>
                  Quantum Room Portal
                </label>
                <div className="relative">
                  <input
                    name="roomId"
                    onChange={handleFormInputChange}
                    onFocus={() => setFocusedInput('roomId')}
                    onBlur={() => setFocusedInput(null)}
                    value={detail.roomId}
                    type="text"
                    placeholder="Enter dimensional coordinates..."
                    className={`w-full px-6 py-4 rounded-2xl transition-all duration-300 ${
                      isDarkMode 
                        ? 'bg-gray-800/60 border-purple-500/30 text-white placeholder-gray-400' 
                        : 'bg-white/60 border-blue-300/30 text-gray-800 placeholder-gray-500'
                    } backdrop-blur-sm border-2 focus:outline-none ${
                      focusedInput === 'roomId' 
                        ? (isDarkMode ? 'focus:border-purple-400 focus:shadow-lg focus:shadow-purple-500/25' : 'focus:border-blue-400 focus:shadow-lg focus:shadow-blue-500/25')
                        : ''
                    } transform hover:scale-105`}
                  />
                  <div className={`absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 ${
                    focusedInput === 'roomId' ? 'opacity-100' : ''
                  } ${isDarkMode ? 'bg-purple-500/10' : 'bg-blue-500/10'} pointer-events-none`}></div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 mt-8">
              <button
                onClick={joinChat}
                disabled={isLoading}
                className={`relative px-8 py-4 rounded-2xl font-bold text-white transition-all duration-300 transform hover:scale-110 active:scale-95 ${
                  isDarkMode 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500' 
                    : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400'
                } shadow-lg hover:shadow-2xl backdrop-blur-sm border border-white/20 ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                } overflow-hidden group`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <span className="relative z-10 tracking-wide">
                  {isLoading ? '🔄 Connecting...' : '🚀 Join Portal'}
                </span>
              </button>
              
              <button
                onClick={createRoom}
                disabled={isLoading}
                className={`relative px-8 py-4 rounded-2xl font-bold text-white transition-all duration-300 transform hover:scale-110 active:scale-95 ${
                  isDarkMode 
                    ? 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500' 
                    : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400'
                } shadow-lg hover:shadow-2xl backdrop-blur-sm border border-white/20 ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                } overflow-hidden group`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <span className="relative z-10 tracking-wide">
                  {isLoading ? '⚡ Generating...' : '✨ Create Portal'}
                </span>
              </button>
            </div>

            {/* Footer */}
            <div className={`text-center mt-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
              <p className="tracking-wider">Enter the next dimension of communication</p>
            </div>
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
        
        .animate-gradient-xy {
          animation: gradient-xy 4s ease infinite;
        }
        
        .animate-scan {
          animation: scan 3s linear infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default JoinCreateChat;
