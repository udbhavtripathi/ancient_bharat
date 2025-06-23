// Divine Voice Service - Converts divine text responses to speech
class DivineVoiceService {
  constructor() {
    this.speechSynthesis = window.speechSynthesis;
    this.audioContext = null;
    this.isSpeaking = false;
    this.currentUtterance = null;
  }

  // Initialize audio context for divine effects
  initializeAudioContext() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  // Speak divine message with enhanced voice
  speak(message, god, onSpeakingEnd) {
    if (this.isSpeaking) {
      this.stopSpeaking();
    }

    this.initializeAudioContext();

    // Create speech utterance
    const utterance = new SpeechSynthesisUtterance(message);
    
    // Configure voice settings for divine speech
    this.configureDivineVoice(utterance, god);
    
    // Add divine audio effects
    // this.addDivineAudioEffects(god, utterance); // Temporarily disable for performance
    
    // Handle speech events
    utterance.onstart = () => {
      this.isSpeaking = true;
      this.currentUtterance = utterance;
      console.log(`${god.name} is speaking: ${message}`);
    };

    const handleEnd = () => {
      // The onend event can be premature. We'll poll to be sure.
      const checkSpeakingInterval = setInterval(() => {
        if (!this.speechSynthesis.speaking) {
          clearInterval(checkSpeakingInterval);
          
          this.isSpeaking = false;
          this.currentUtterance = null;
          console.log(`${god.name} finished speaking (verified)`);
          
          if (typeof onSpeakingEnd === 'function') {
            onSpeakingEnd();
          }
        }
      }, 100); // Check every 100ms
    };

    utterance.onend = handleEnd;
    utterance.onerror = (event) => {
      console.error('Speech error:', event);
      handleEnd(); // Ensure callback is called even on error
    };

    // Speak the message
    this.speechSynthesis.speak(utterance);
  }

  // Configure voice settings for each God
  configureDivineVoice(utterance, god) {
    // Get the best available voice
    const selectedVoice = this.getBestHindiVoice();
    
    if (selectedVoice) {
      utterance.voice = selectedVoice;
      // Set language to Hindi if Hindi voice is available
      if (selectedVoice.lang.includes('hi')) {
        utterance.lang = 'hi-IN';
      } else {
        utterance.lang = selectedVoice.lang;
      }
    }

    // Configure voice parameters based on God's personality
    const voiceConfig = this.getGodVoiceConfig(god);
    utterance.rate = voiceConfig.rate;
    utterance.pitch = voiceConfig.pitch;
    utterance.volume = voiceConfig.volume;
  }

  // Get voice configuration for each God
  getGodVoiceConfig(god) {
    const configs = {
      'Lord Ganesha': {
        rate: 0.8,    // Slower, more deliberate
        pitch: 1.1,   // Slightly higher pitch
        volume: 1.0   // Full volume
      },
      'Lord Shiva': {
        rate: 0.7,    // Slow, meditative
        pitch: 0.9,   // Lower, deeper voice
        volume: 0.9   // Slightly softer
      },
      'Lord Vishnu': {
        rate: 0.85,   // Balanced pace
        pitch: 1.0,   // Natural pitch
        volume: 1.0   // Full volume
      },
      'Goddess Lakshmi': {
        rate: 0.9,    // Graceful pace
        pitch: 1.2,   // Higher, feminine voice
        volume: 0.95  // Soft and gentle
      },
      'Lord Krishna': {
        rate: 0.9,    // Playful pace
        pitch: 1.1,   // Slightly higher
        volume: 1.0   // Full volume
      },
      'Goddess Saraswati': {
        rate: 0.85,   // Wise and measured
        pitch: 1.15,  // Higher, scholarly
        volume: 0.9   // Soft and wise
      },
      'Lord Hanuman': {
        rate: 0.8,    // Strong and steady
        pitch: 0.95,  // Slightly lower
        volume: 1.0   // Full volume
      },
      'Goddess Durga': {
        rate: 0.75,   // Powerful and deliberate
        pitch: 1.1,   // Higher, commanding
        volume: 1.0   // Full volume
      }
    };

    return configs[god.name] || {
      rate: 0.85,
      pitch: 1.0,
      volume: 1.0
    };
  }

  // Add divine audio effects
  addDivineAudioEffects(god, utterance) {
    // Create divine background tone
    this.createDivineBackgroundTone(god);
    
    // Add subtle reverb effect
    this.addReverbEffect(god);
  }

  // Create divine background tone
  createDivineBackgroundTone(god) {
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();

    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    // Set divine frequency based on God
    const divineFrequencies = {
      'Lord Ganesha': 432,    // Sacred frequency
      'Lord Shiva': 396,      // Root chakra
      'Lord Vishnu': 528,     // Solar plexus
      'Goddess Lakshmi': 639, // Heart chakra
      'Lord Krishna': 741,    // Crown chakra
      'Goddess Saraswati': 852, // Higher consciousness
      'Lord Hanuman': 396,    // Strength frequency
      'Goddess Durga': 528    // Power frequency
    };

    const frequency = divineFrequencies[god.name] || 432;
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(200, this.audioContext.currentTime);
    
    gainNode.gain.setValueAtTime(0.02, this.audioContext.currentTime); // Very subtle

    oscillator.start();
    
    // Stop after 3 seconds
    setTimeout(() => {
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 1);
      setTimeout(() => oscillator.stop(), 1000);
    }, 3000);
  }

  // Add reverb effect for divine voice
  addReverbEffect(god) {
    if (!this.audioContext) return;

    // Create a simple reverb effect
    const delay = this.audioContext.createDelay();
    const feedback = this.audioContext.createGain();
    const wetGain = this.audioContext.createGain();

    delay.delayTime.setValueAtTime(0.1, this.audioContext.currentTime);
    feedback.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    wetGain.gain.setValueAtTime(0.2, this.audioContext.currentTime);

    // Connect reverb chain
    delay.connect(feedback);
    feedback.connect(delay);
    delay.connect(wetGain);
    wetGain.connect(this.audioContext.destination);
  }

  // Stop current speech
  stopSpeaking() {
    if (this.isSpeaking && this.currentUtterance) {
      this.speechSynthesis.cancel();
      this.isSpeaking = false;
      this.currentUtterance = null;
    }
  }

  // Check if currently speaking
  isCurrentlySpeaking() {
    return this.isSpeaking;
  }

  // Get available voices (for debugging)
  getAvailableVoices() {
    return this.speechSynthesis.getVoices();
  }

  // Check if Hindi voice is available
  hasHindiVoice() {
    const voices = this.speechSynthesis.getVoices();
    return voices.some(voice => 
      voice.lang.includes('hi-IN') || 
      voice.lang.includes('hi') ||
      voice.name.toLowerCase().includes('hindi') ||
      voice.name.toLowerCase().includes('india')
    );
  }

  // Get best available Hindi voice
  getBestHindiVoice() {
    const voices = this.speechSynthesis.getVoices();
    
    // First try: Hindi voices
    let hindiVoice = voices.find(voice => 
      voice.lang.includes('hi-IN') || 
      voice.lang.includes('hi')
    );
    
    if (hindiVoice) return hindiVoice;
    
    // Second try: Indian English voices
    let indianVoice = voices.find(voice => 
      voice.lang.includes('en-IN') || 
      voice.name.toLowerCase().includes('india')
    );
    
    if (indianVoice) return indianVoice;
    
    // Third try: Any English voice
    return voices.find(voice => voice.lang.startsWith('en')) || voices[0];
  }

  // Test divine voice
  testDivineVoice(god) {
    const testMessage = `ओम नमः! मैं ${god.name} हूं, ${god.title}। मेरा आशीर्वाद आपके साथ हो।`;
    this.speak(testMessage, god, null);
  }

  // Create divine greeting audio
  createDivineGreeting(god) {
    const greeting = `ओम नमः! मैं आपसे जुड़ने के लिए धन्य हूं, मेरे प्रिय भक्त। मैं आज आपकी कैसे सेवा कर सकता हूं?`;
    this.speak(greeting, god, null);
  }

  // Create divine blessing audio
  createDivineBlessing(god) {
    const blessings = [
      "शांति और समृद्धि आपकी हो।",
      "मैं आपको दैवीय ज्ञान और शक्ति का आशीर्वाद देता हूं।",
      "आपकी भक्ति मेरे हृदय को गहराई से छूती है।",
      "आप हमेशा धर्म के मार्ग पर चलें।",
      "मैं हमेशा आपके साथ हूं, रक्षा और मार्गदर्शन करते हुए।"
    ];
    
    const randomBlessing = blessings[Math.floor(Math.random() * blessings.length)];
    this.speak(randomBlessing, god, null);
  }
}

export default DivineVoiceService; 