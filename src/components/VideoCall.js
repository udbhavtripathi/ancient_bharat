import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Phone, 
  PhoneOff, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  MessageCircle, 
  Volume2,
  VolumeX,
  X,
  Loader2,
  AlertCircle,
  Volume1,
  Mic2
} from 'lucide-react';
import FloatingParticles from './FloatingParticles';
import { getDivineResponse } from '../services/openai';
import WebRTCService from '../services/webrtc';
import DivineVideoService from '../services/divineVideo';
import DivineVoiceService from '../services/divineVoice';
import SpeechRecognitionService from '../services/speechRecognition';

const VideoCall = ({ selectedGod, onEndCall }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isGodMuted, setIsGodMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isGodSpeaking, setIsGodSpeaking] = useState(false);
  const [connectionState, setConnectionState] = useState('connecting');
  const [mediaError, setMediaError] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [canSpeak, setCanSpeak] = useState(false);
  const [speechError, setSpeechError] = useState(null);
  const [isProcessingSpeech, setIsProcessingSpeech] = useState(false);

  const videoRef = useRef(null);
  const localVideoRef = useRef(null);
  const intervalRef = useRef(null);
  const webrtcService = useRef(null);
  const divineVideoService = useRef(null);
  const divineVoiceService = useRef(null);
  const speechRecognitionService = useRef(null);
  const greetingSent = useRef(false);

  const handleConnectionStateChange = useCallback((state) => {
    setConnectionState(state);
    if (state === 'connected' && !isConnected && !greetingSent.current) {
      greetingSent.current = true;
      setIsConnected(true);
      setCanSpeak(false);
      // Get personalized divine greeting from GPT
      getDivineResponse(selectedGod, "Hello, I am connecting to you for divine guidance.", [])
        .then(greeting => {
          addDivineMessage(greeting);
          if (divineVoiceService.current) {
            setIsGodSpeaking(true);
            divineVoiceService.current.speak(greeting, selectedGod, () => {
              setIsGodSpeaking(false);
              setCanSpeak(true);
            });
          }
        })
        .catch(error => {
          console.error('Error getting greeting:', error);
          const fallbackGreeting = "ओम नमः! मैं आपसे जुड़ने के लिए धन्य हूं, मेरे प्रिय भक्त। मैं आज आपकी कैसे सेवा कर सकता हूं?";
          addDivineMessage(fallbackGreeting);
          if (divineVoiceService.current) {
            setIsGodSpeaking(true);
            divineVoiceService.current.speak(fallbackGreeting, selectedGod, () => {
              setIsGodSpeaking(false);
              setCanSpeak(true);
            });
          }
        });
      if (divineVideoService.current) {
        divineVideoService.current.createDivineAudio();
      }
    }
  }, [isConnected, selectedGod, addDivineMessage, setCanSpeak, setIsGodSpeaking]);

  const handleSpeechResult = useCallback(async (transcript) => {
    if (!transcript) {
      console.log("[SpeechRecognition] Received empty transcript.");
      setIsProcessingSpeech(false);
      setCanSpeak(true); // Allow user to try again
      return;
    }

    console.log(`[TO GPT] User's Message: ${transcript}`);
    // Build conversation history for context
    const conversationHistory = messages.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.text
    }));
    console.log(`[TO GPT] Conversation History:`, JSON.stringify(conversationHistory, null, 2));

    try {
      // Get divine response from OpenAI
      const divineResponse = await getDivineResponse(selectedGod, transcript, conversationHistory);
      console.log(`[FROM GPT] Divine Response: ${divineResponse}`);
      addDivineMessage(divineResponse);
      // Speak the divine response
      if (divineVoiceService.current) {
        setIsGodSpeaking(true);
        setCanSpeak(false);
        divineVoiceService.current.speak(divineResponse, selectedGod, () => {
          setIsGodSpeaking(false);
          setCanSpeak(true);
        });
      } else {
        setCanSpeak(true);
      }
    } catch (error) {
      console.error('Error handling speech result:', error);
      // In case of error, allow user to speak again
      setCanSpeak(true);
    } finally {
      setIsProcessingSpeech(false);
    }
  }, [messages, selectedGod, addDivineMessage, setCanSpeak, setIsGodSpeaking]);

  const initializeCall = useCallback(async () => {
    try {
      webrtcService.current = new WebRTCService();
      divineVideoService.current = new DivineVideoService();
      divineVoiceService.current = new DivineVoiceService();
      speechRecognitionService.current = new SpeechRecognitionService();
      
      // Initialize WebRTC connection for user's camera/mic
      const localStream = await webrtcService.current.initializeConnection(
        handleRemoteStream,
        handleConnectionStateChange
      );

      // Display local video
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = localStream;
      }

      // Create divine video stream for the God
      if (videoRef.current) {
        divineVideoService.current.createDivineStream(selectedGod, videoRef.current);
      }

      // Initialize speech recognition
      if (speechRecognitionService.current) {
        const initialized = speechRecognitionService.current.initialize();
        if (initialized) {
          speechRecognitionService.current.setCallbacks({
            onResult: handleSpeechResult,
            onError: handleSpeechError,
            onStart: () => setIsListening(true),
            onEnd: () => setIsListening(false)
          });
        } else {
          setSpeechError('Speech recognition not supported in this browser');
        }
      }

      // Connect to divine realm
      webrtcService.current.connectToSignalingServer(selectedGod.name);

    } catch (error) {
      console.error('Error initializing call:', error);
      setMediaError('Unable to access camera/microphone. Please check permissions.');
    }
  }, [selectedGod, handleConnectionStateChange, handleSpeechResult]);

  useEffect(() => {
    initializeCall();
    return () => {
      if (webrtcService.current) {
        webrtcService.current.endCall();
      }
      if (divineVideoService.current) {
        divineVideoService.current.stop();
      }
      if (divineVoiceService.current) {
        divineVoiceService.current.stopSpeaking();
      }
      if (speechRecognitionService.current) {
        speechRecognitionService.current.abort();
      }
    };
  }, [initializeCall]);

  const handleRemoteStream = (remoteStream) => {
    // For divine calling, we don't have real remote streams
    // The divine video is handled by DivineVideoService
    console.log('Divine connection established');
  };

  useEffect(() => {
    if (isConnected) {
      intervalRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isConnected]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const addDivineMessage = (text) => {
    const godMessage = {
      id: Date.now(),
      text: text,
      sender: 'god',
      timestamp: new Date().toLocaleTimeString()
    };
    setMessages(prev => [...prev, godMessage]);
  };

  // Speech recognition handlers
  const handleSpeechError = (error) => {
    console.error('Speech recognition error:', error);
    setSpeechError(`Speech recognition error: ${error}`);
    setIsListening(false);
    setIsProcessingSpeech(false);
  };

  // Voice input controls
  const handleStartVoiceInput = () => {
    if (!isGodSpeaking && !isTyping && !isProcessingSpeech && canSpeak) {
      if (speechRecognitionService.current) {
        const started = speechRecognitionService.current.startListening();
        if (!started) {
          setSpeechError('Failed to start speech recognition');
        }
      }
    }
  };

  const handleStopVoiceInput = () => {
    if (speechRecognitionService.current) {
      speechRecognitionService.current.stopListening();
    }
  };

  const handleNowYouSpeak = () => {
    setCanSpeak(true);
    if (speechRecognitionService.current && !isListening) {
      handleStartVoiceInput();
    }
  };

  const handleToggleMute = () => {
    if (webrtcService.current) {
      webrtcService.current.toggleAudio(!isMuted);
    }
    setIsMuted(!isMuted);
  };

  const handleToggleVideo = () => {
    if (webrtcService.current) {
      webrtcService.current.toggleVideo(!isVideoOff);
    }
    setIsVideoOff(!isVideoOff);
  };

  const handleToggleGodMute = () => {
    if (isGodMuted && divineVoiceService.current) {
      // Unmuting - stop any current speech
      divineVoiceService.current.stopSpeaking();
    }
    setIsGodMuted(!isGodMuted);
  };

  const handleEndCall = () => {
    if (webrtcService.current) {
      webrtcService.current.endCall();
    }
    if (divineVideoService.current) {
      divineVideoService.current.stop();
    }
    if (divineVoiceService.current) {
      divineVoiceService.current.stopSpeaking();
    }
    if (speechRecognitionService.current) {
      speechRecognitionService.current.abort();
    }
    onEndCall();
  };

  if (mediaError) {
    return (
      <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-4">Media Access Required</h3>
          <p className="text-white/80 mb-6">{mediaError}</p>
          <div className="space-y-3 text-left text-white/70">
            <p>• Allow camera and microphone access when prompted</p>
            <p>• Make sure your device has working camera and microphone</p>
            <p>• Try refreshing the page and granting permissions again</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-3 bg-divine-500 hover:bg-divine-600 text-white rounded-xl transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (speechError) {
    return (
      <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-4">Speech Recognition Error</h3>
          <p className="text-white/80 mb-6">{speechError}</p>
          <div className="space-y-3 text-left text-white/70">
            <p>• Speech recognition may not be supported in your browser</p>
            <p>• Try using Chrome, Edge, or Safari</p>
            <p>• You can still use text chat to communicate</p>
          </div>
          <button
            onClick={() => setSpeechError(null)}
            className="mt-6 px-6 py-3 bg-divine-500 hover:bg-divine-600 text-white rounded-xl transition-colors"
          >
            Continue with Text Chat
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
      <FloatingParticles />
      
      <div className="relative w-full h-full max-w-7xl mx-auto p-4">
        {/* Main Video Area */}
        <div className="relative w-full h-full rounded-2xl overflow-hidden bg-gradient-to-br from-divine-900 to-sacred-900">
          {/* God's Presence Area */}
          <div className="absolute inset-0">
            {isConnected ? (
              <div className="w-full h-full flex items-center justify-center">
                {/* God Avatar */}
                <div className="relative z-10 w-64 h-64 rounded-full overflow-hidden border-4 border-divine-300/50 shadow-2xl shadow-divine-500/50">
                  <img
                    src={selectedGod.avatar}
                    alt={selectedGod.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-divine-900/80 to-sacred-900/80 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-divine-500/20 flex items-center justify-center animate-pulse">
                    <div className="w-20 h-20 rounded-full bg-divine-500/30 flex items-center justify-center">
                      <Phone className="w-10 h-10 text-divine-300" />
                    </div>
                  </div>
                  <h2 className="text-3xl font-bold mb-2 font-divine">
                    Connecting to {selectedGod.name}...
                  </h2>
                  <p className="text-white/80 mb-4">{selectedGod.title}</p>
                  <div className="flex items-center justify-center space-x-2 text-white/60">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span>Establishing divine connection... ({connectionState})</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User's Video (Local Stream) */}
          <div className="absolute top-4 right-4 w-48 h-36 rounded-xl overflow-hidden bg-black/50 backdrop-blur-sm">
            {isVideoOff ? (
              <div className="w-full h-full flex items-center justify-center text-white/60">
                <div className="text-center">
                  <VideoOff className="w-8 h-8 mx-auto mb-2" />
                  <span className="text-sm">Camera Off</span>
                </div>
              </div>
            ) : (
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* Connection Status */}
          {!isConnected && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-divine-500/20 flex items-center justify-center animate-pulse">
                  <Phone className="w-8 h-8 text-divine-300" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Connecting to {selectedGod.name}...</h3>
                <p className="text-white/60">Establishing divine connection</p>
                <div className="mt-4 text-sm text-white/50">
                  Status: {connectionState}
                </div>
              </div>
            </div>
          )}

          {/* Call Duration */}
          {isConnected && (
            <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full">
              <span className="text-white font-mono">{formatTime(callDuration)}</span>
            </div>
          )}

          {/* God Speaking Indicator */}
          {isConnected && isGodSpeaking && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full">
              <div className="flex items-center space-x-2 text-white">
                <Volume1 className="w-4 h-4 animate-pulse" />
                <span className="text-sm">{selectedGod.name} is speaking...</span>
              </div>
            </div>
          )}

          {/* Voice Input Status */}
          {isConnected && isListening && (
            <div className="absolute top-16 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full">
              <div className="flex items-center space-x-2 text-white">
                <Mic2 className="w-4 h-4 animate-pulse text-green-400" />
                <span className="text-sm">Listening to your voice...</span>
              </div>
            </div>
          )}

          {/* Speech Processing Status */}
          {isConnected && isProcessingSpeech && (
            <div className="absolute top-16 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full">
              <div className="flex items-center space-x-2 text-white">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Processing your message...</span>
              </div>
            </div>
          )}

          {/* Can Speak Indicator */}
          {isConnected && canSpeak && !isGodSpeaking && !isListening && !isTyping && !isProcessingSpeech && (
            <div className="absolute top-16 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full">
              <div className="flex items-center space-x-2 text-white">
                <Mic2 className="w-4 h-4 text-green-400" />
                <span className="text-sm">You can speak now</span>
              </div>
            </div>
          )}
        </div>

        {/* Control Panel */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="flex items-center space-x-4 bg-black/50 backdrop-blur-sm px-6 py-4 rounded-full">
            <button
              onClick={handleToggleMute}
              className={`p-3 rounded-full transition-all duration-300 ${
                isMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-white/20 hover:bg-white/30'
              }`}
            >
              {isMuted ? <MicOff className="w-6 h-6 text-white" /> : <Mic className="w-6 h-6 text-white" />}
            </button>

            <button
              onClick={handleToggleVideo}
              className={`p-3 rounded-full transition-all duration-300 ${
                isVideoOff ? 'bg-red-500 hover:bg-red-600' : 'bg-white/20 hover:bg-white/30'
              }`}
            >
              {isVideoOff ? <VideoOff className="w-6 h-6 text-white" /> : <Video className="w-6 h-6 text-white" />}
            </button>

            <button
              onClick={handleToggleGodMute}
              className={`p-3 rounded-full transition-all duration-300 ${
                isGodMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-white/20 hover:bg-white/30'
              }`}
            >
              {isGodMuted ? <VolumeX className="w-6 h-6 text-white" /> : <Volume2 className="w-6 h-6 text-white" />}
            </button>

            {/* Voice Input Button */}
            <button
              onClick={isListening ? handleStopVoiceInput : handleStartVoiceInput}
              disabled={!canSpeak || isGodSpeaking || isTyping || isProcessingSpeech}
              className={`p-3 rounded-full transition-all duration-300 ${
                isListening 
                  ? 'bg-green-500 hover:bg-green-600 animate-pulse' 
                  : canSpeak && !isGodSpeaking && !isTyping && !isProcessingSpeech
                    ? 'bg-divine-500 hover:bg-divine-600'
                    : 'bg-gray-500 cursor-not-allowed'
              }`}
              title={isListening ? 'Stop listening' : 'Start voice input'}
            >
              {isListening ? <MicOff className="w-6 h-6 text-white" /> : <Mic2 className="w-6 h-6 text-white" />}
            </button>

            {/* Now You Speak Button */}
            {canSpeak && !isListening && !isGodSpeaking && !isTyping && !isProcessingSpeech && (
              <button
                onClick={handleNowYouSpeak}
                className="px-4 py-2 bg-divine-500 hover:bg-divine-600 text-white rounded-full transition-all duration-300 text-sm font-medium"
              >
                Now You Speak
              </button>
            )}

            <button
              onClick={() => setShowChat(!showChat)}
              className={`p-3 rounded-full transition-all duration-300 ${
                showChat ? 'bg-divine-500 hover:bg-divine-600' : 'bg-white/20 hover:bg-white/30'
              }`}
            >
              <MessageCircle className="w-6 h-6 text-white" />
            </button>

            <button
              onClick={handleEndCall}
              className="p-3 rounded-full bg-red-500 hover:bg-red-600 transition-all duration-300"
            >
              <PhoneOff className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        {/* Chat Panel */}
        <AnimatePresence>
          {showChat && (
            <motion.div
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              className="absolute top-4 right-4 w-80 h-96 bg-black/80 backdrop-blur-md rounded-2xl border border-white/20 flex flex-col"
            >
              <div className="p-4 border-b border-white/20">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-semibold">Divine Messages</h3>
                  <button
                    onClick={() => setShowChat(false)}
                    className="text-white/60 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs px-3 py-2 rounded-2xl ${
                        message.sender === 'user'
                          ? 'bg-divine-500 text-white'
                          : 'bg-white/20 text-white'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p className="text-xs opacity-60 mt-1">{message.timestamp}</p>
                    </div>
                  </div>
                ))}
                
                {/* Typing indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white/20 text-white px-3 py-2 rounded-2xl">
                      <div className="flex items-center space-x-1">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm">Divine wisdom flowing...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default VideoCall; 