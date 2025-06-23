// Speech Recognition Service - Converts user's voice to text
class SpeechRecognitionService {
  constructor() {
    this.recognition = null;
    this.isListening = false;
    this.onResult = null;
    this.onError = null;
    this.onStart = null;
    this.onEnd = null;
    this.interimResults = true;
    this.continuous = false;
    this.maxAlternatives = 1;
    this.finalTranscript = '';
  }

  // Initialize speech recognition
  initialize() {
    try {
      // Check for browser support
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (!SpeechRecognition) {
        throw new Error('Speech recognition not supported in this browser');
      }

      this.recognition = new SpeechRecognition();
      this.configureRecognition();
      
      return true;
    } catch (error) {
      console.error('Speech recognition initialization failed:', error);
      return false;
    }
  }

  // Configure recognition settings
  configureRecognition() {
    if (!this.recognition) return;

    // Set recognition properties
    this.recognition.continuous = this.continuous;
    this.recognition.interimResults = this.interimResults;
    this.recognition.maxAlternatives = this.maxAlternatives;

    // Try to set language to Hindi first, then English
    const languages = ['hi-IN', 'en-IN', 'en-US', 'en-GB'];
    for (const lang of languages) {
      try {
        this.recognition.lang = lang;
        break;
      } catch (error) {
        console.warn(`Language ${lang} not supported, trying next...`);
      }
    }

    // Set up event handlers
    this.recognition.onstart = () => {
      this.isListening = true;
      console.log('Speech recognition started');
      if (this.onStart) this.onStart();
    };

    this.recognition.onresult = (event) => {
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          this.finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      
      console.log('Speech recognition result:', this.finalTranscript + interimTranscript);

      if (this.finalTranscript && this.onResult) {
        // This check is to ensure we only send a final, complete transcript
        if (event.results[event.results.length - 1].isFinal) {
          this.onResult(this.finalTranscript.trim());
          this.finalTranscript = ''; // Reset for next time
        }
      }
    };

    this.recognition.onerror = (event) => {
      this.isListening = false;
      console.error('Speech recognition error:', event.error);
      
      if (this.onError) {
        this.onError(event.error);
      }
    };

    this.recognition.onend = () => {
      this.isListening = false;
      console.log('Speech recognition ended');

      // If there's a final transcript, process it.
      if (this.finalTranscript && this.onResult) {
        this.onResult(this.finalTranscript.trim());
      }
      this.finalTranscript = ''; // Reset for next time

      if (this.onEnd) this.onEnd();
    };
  }

  // Start listening for speech
  startListening() {
    if (!this.recognition) {
      console.error('Speech recognition not initialized');
      return false;
    }

    if (this.isListening) {
      console.log('Already listening');
      return false;
    }

    try {
      this.recognition.start();
      return true;
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      return false;
    }
  }

  // Stop listening for speech
  stopListening() {
    if (!this.recognition || !this.isListening) {
      return false;
    }

    try {
      this.recognition.stop();
      return true;
    } catch (error) {
      console.error('Error stopping speech recognition:', error);
      return false;
    }
  }

  // Abort current recognition
  abort() {
    if (!this.recognition) {
      return false;
    }

    try {
      this.recognition.abort();
      this.isListening = false;
      return true;
    } catch (error) {
      console.error('Error aborting speech recognition:', error);
      return false;
    }
  }

  // Set callbacks
  setCallbacks(callbacks) {
    this.onResult = callbacks.onResult;
    this.onError = callbacks.onError;
    this.onStart = callbacks.onStart;
    this.onEnd = callbacks.onEnd;
  }

  // Check if currently listening
  isCurrentlyListening() {
    return this.isListening;
  }

  // Check if speech recognition is supported
  isSupported() {
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  }

  // Get available languages (for debugging)
  getAvailableLanguages() {
    return [
      'hi-IN', 'en-IN', 'en-US', 'en-GB', 'en-AU', 'en-CA',
      'hi', 'en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ja', 'ko', 'zh'
    ];
  }

  // Test speech recognition
  test() {
    if (!this.isSupported()) {
      console.error('Speech recognition not supported');
      return false;
    }

    this.setCallbacks({
      onResult: (transcript) => {
        console.log('Test result:', transcript);
        alert(`You said: ${transcript}`);
      },
      onError: (error) => {
        console.error('Test error:', error);
        alert(`Error: ${error}`);
      },
      onStart: () => {
        console.log('Test started');
        alert('Start speaking...');
      },
      onEnd: () => {
        console.log('Test ended');
      }
    });

    return this.startListening();
  }
}

export default SpeechRecognitionService; 