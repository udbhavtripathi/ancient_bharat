export const gods = [
  {
    id: 1,
    name: "Lord Ganesha",
    sanskritName: "गणेश",
    title: "Remover of Obstacles",
    description: "The beloved elephant-headed God who removes obstacles and brings wisdom and good fortune.",
    specialties: ["Success", "Wisdom", "New Beginnings"],
    mantras: ["Om Gan Ganpataye Namo Namah", "Vakratunda Mahakaya"],
    category: "Primary",
  },
  {
    id: 2,
    name: "Lord Shiva",
    sanskritName: "शिव",
    title: "The Destroyer",
    description: "The supreme God of meditation, arts, yoga, and destruction of evil. He is one of the principal deities of Hinduism.",
    specialties: ["Meditation", "Transformation", "Inner Peace"],
    mantras: ["Om Namah Shivaya", "Om Tryambakam Yajamahe"],
    category: "Primary",
  },
  {
    id: 3,
    name: "Lord Vishnu",
    sanskritName: "विष्णु",
    title: "The Preserver",
    description: "The protector of the universe and the maintainer of cosmic order (dharma).",
    specialties: ["Protection", "Dharma", "Preservation"],
    mantras: ["Om Namo Narayanaya", "Hare Krishna Hare Rama"],
    category: "Primary",
  },
  {
    id: 4,
    name: "Goddess Lakshmi",
    sanskritName: "लक्ष्मी",
    title: "Goddess of Wealth",
    description: "The divine mother who bestows prosperity, wealth, and abundance in both material and spiritual forms.",
    specialties: ["Wealth", "Prosperity", "Abundance"],
    mantras: ["Om Shreem Mahalakshmiyei Namah", "Om Hreem Shreem Kleem"],
    category: "Primary",
  },
  {
    id: 5,
    name: "Lord Krishna",
    sanskritName: "कृष्ण",
    title: "The Divine Teacher",
    description: "The God of protection, compassion, tenderness, and love; he is one of the most widely revered and popular of all Indian divinities.",
    specialties: ["Love", "Guidance", "Devotion"],
    mantras: ["Hare Krishna Hare Rama", "Om Namo Bhagavate Vasudevaya"],
    category: "Primary",
  },
  {
    id: 6,
    name: "Goddess Saraswati",
    sanskritName: "सरस्वती",
    title: "Goddess of Knowledge",
    description: "The deity of knowledge, music, art, speech, wisdom, and learning.",
    specialties: ["Knowledge", "Music", "Arts"],
    mantras: ["Om Aim Saraswatyai Namah", "Om Hreem Saraswati Devyai"],
    category: "Secondary",
  },
  {
    id: 7,
    name: "Lord Hanuman",
    sanskritName: "हनुमान्",
    title: "The Devoted",
    description: "A divine vanara companion of the God Rama. Hanuman is one of the central characters of the Hindu epic Ramayana.",
    specialties: ["Devotion", "Strength", "Courage"],
    mantras: ["Om Hanumate Rudraatmakaaya Hum Phat", "Jai Hanuman"],
    category: "Secondary",
  },
  {
    id: 8,
    name: "Goddess Durga",
    sanskritName: "दुर्गा",
    title: "The Warrior Goddess",
    description: "The mother goddess, a central deity in Shaktism. She is a warrior goddess who combats evils and demonic forces.",
    specialties: ["Strength", "Protection", "Victory"],
    mantras: ["Om Dum Durgayei Namah", "Jai Maa Durga"],
    category: "Secondary",
  },
  {
    id: 9,
    name: "Lord Brahma",
    sanskritName: "ब्रह्मा",
    title: "The Creator",
    description: "The creator god in Hinduism. He is a member of the Trimurti, the trinity of supreme divinity that includes Vishnu and Shiva.",
    specialties: ["Creation", "Knowledge", "Cosmic Order"],
    mantras: ["Om Namo Rajo Gushebhya", "Om Brahmadevaya Namah"],
    category: "Primary",
  }
];

export const getGodById = (id) => {
  return gods.find(god => god.id === id);
};

export const getGodsByCategory = (category) => {
  return gods.filter(god => god.category === category);
}; 