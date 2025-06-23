import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Phone } from 'lucide-react';
import FloatingParticles from './FloatingParticles';
import { gods } from '../data/gods';

const GodSelection = ({ onSelectGod }) => {
  const [filteredGods, setFilteredGods] = useState(gods);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All Gods');

  useEffect(() => {
    let result = gods;
    if (activeFilter !== 'All Gods') {
      result = result.filter(god => god.category === activeFilter.replace(' Deities', ''));
    }
    if (searchTerm) {
      result = result.filter(god =>
        god.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        god.sanskritName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        god.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredGods(result);
  }, [searchTerm, activeFilter]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <FloatingParticles />
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold font-divine mb-2">Ancient Bharat</h1>
        <p className="text-lg text-white/80">Divine Calling Platform</p>
      </div>

      <div className="mb-8 p-4 bg-black/20 backdrop-blur-sm rounded-2xl flex items-center justify-between gap-4 sticky top-8 z-20">
        <div className="relative flex-grow">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-white/10 text-white placeholder-white/50 rounded-lg pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          {['All Gods', 'Primary Deities', 'Secondary Deities'].map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeFilter === filter ? 'bg-orange-500 text-white' : 'bg-white/10 hover:bg-white/20'}`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
        initial="hidden"
        animate="visible"
      >
        {filteredGods.map((god) => (
          <motion.div
            key={god.id}
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            className="bg-black/30 p-6 rounded-2xl border border-white/10 cursor-pointer flex flex-col justify-between hover:border-orange-500/50 hover:bg-black/50 transition-all"
            onClick={() => onSelectGod(god)}
          >
            <div>
              <h3 className="text-xl font-bold font-divine text-white">{god.name}</h3>
              <p className="text-orange-300/80 text-sm mb-3">{god.title}</p>
              <p className="text-white/70 text-sm h-20">{god.description}</p>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {god.specialties.slice(0, 2).map(specialty => (
                  <span key={specialty} className="px-2 py-1 bg-white/10 text-xs rounded-full">
                    {specialty}
                  </span>
                ))}
              </div>
              <Phone className="w-5 h-5 text-orange-400" />
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default GodSelection; 