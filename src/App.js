import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GodSelection from './components/GodSelection';
import VideoCall from './components/VideoCall';
import FloatingParticles from './components/FloatingParticles';

function App() {
  const [selectedGod, setSelectedGod] = useState(null);
  const [isInCall, setIsInCall] = useState(false);

  const handleSelectGod = (god) => {
    setSelectedGod(god);
    setIsInCall(true);
  };

  const handleEndCall = () => {
    setIsInCall(false);
    setSelectedGod(null);
  };

  return (
    <div className="App min-h-screen relative overflow-hidden">
      <FloatingParticles />
      
      <AnimatePresence mode="wait">
        {!isInCall ? (
          <motion.div
            key="selection"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <GodSelection onSelectGod={handleSelectGod} />
          </motion.div>
        ) : (
          <motion.div
            key="call"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <VideoCall 
              selectedGod={selectedGod} 
              onEndCall={handleEndCall} 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App; 