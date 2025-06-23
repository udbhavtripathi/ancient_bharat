# Ancient Bharat - Divine Calling Platform

A modern web application that allows Hindus to connect with their Gods through a video calling interface. This spiritual platform provides an immersive experience for divine conversations and prayers.

## 🌟 Features

### Divine Selection Interface
- **Comprehensive God Database**: 8 major Hindu deities including Lord Ganesha, Shiva, Vishnu, and more
- **Advanced Search**: Search by name, Sanskrit name, or divine titles
- **Category Filtering**: Filter between Primary and Secondary deities
- **Beautiful Cards**: Each God displayed with avatar, Sanskrit name, and specialties

### Video Calling Experience
- **Realistic Interface**: Video calling simulation with connection states
- **Interactive Controls**: Mute, video toggle, volume controls
- **Divine Chat**: Text messaging with automatic divine responses
- **Call Duration**: Real-time call timer
- **Responsive Design**: Works on desktop and mobile devices

### Visual Effects
- **Floating Particles**: Animated divine particles throughout the interface
- **Smooth Animations**: Framer Motion powered transitions
- **Divine Color Scheme**: Sacred orange and blue gradients
- **Glass Morphism**: Modern backdrop blur effects

## 🚀 Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ancient_bharat
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

## 🛠️ Technology Stack

- **Frontend Framework**: React 18
- **Styling**: Tailwind CSS with custom divine theme
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Build Tool**: Create React App

## 📱 Usage

### Selecting a God
1. Browse through the available deities on the main page
2. Use the search bar to find specific Gods
3. Filter by category (Primary/Secondary deities)
4. Click on any God card to initiate a call

### During the Call
1. **Connection**: Wait for the divine connection to establish
2. **Controls**: Use the bottom control panel for:
   - Mute/unmute your microphone
   - Toggle video on/off
   - Mute/unmute the God's voice
   - Open/close chat panel
   - End the call
3. **Chat**: Send prayers and receive divine responses
4. **Duration**: Monitor your call time in the top-left corner

## 🎨 Design Philosophy

The application combines modern web design with traditional Hindu spiritual aesthetics:

- **Sacred Colors**: Orange (divine) and blue (sacred) color schemes
- **Sanskrit Integration**: Original Sanskrit names alongside English
- **Respectful Representation**: Careful portrayal of divine beings
- **Accessibility**: Clear, readable interface for all users

## 📁 Project Structure

```
src/
├── components/
│   ├── FloatingParticles.js    # Animated particle effects
│   ├── GodCard.js             # Individual God selection cards
│   ├── GodSelection.js        # Main selection interface
│   └── VideoCall.js           # Video calling simulation
├── data/
│   └── gods.js                # God database and information
├── App.js                     # Main application component
├── index.js                   # Application entry point
└── index.css                  # Global styles and Tailwind imports
```

## 🎯 Available Deities

### Primary Deities
- **Lord Ganesha** - Remover of Obstacles
- **Lord Shiva** - The Destroyer
- **Lord Vishnu** - The Preserver
- **Goddess Lakshmi** - Goddess of Wealth
- **Lord Krishna** - The Divine Teacher
- **Goddess Saraswati** - Goddess of Knowledge

### Secondary Deities
- **Lord Hanuman** - The Divine Servant
- **Goddess Durga** - The Invincible

## 🔧 Customization

### Adding New Gods
Edit `src/data/gods.js` to add new deities:

```javascript
{
  id: 9,
  name: "New God Name",
  sanskritName: "संस्कृत नाम",
  title: "Divine Title",
  description: "Description of the God",
  avatar: "image-url",
  videoUrl: "video-url",
  specialties: ["Specialty1", "Specialty2"],
  mantras: ["Mantra1", "Mantra2"],
  color: "divine", // or "sacred"
  category: "Primary" // or "Secondary"
}
```

### Styling Customization
- Modify `tailwind.config.js` for color scheme changes
- Update `src/index.css` for custom animations and effects
- Adjust component styles in individual component files

## 🌐 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## 📄 License

This project is created for educational and spiritual purposes. Please use respectfully and in accordance with Hindu traditions.

## 🙏 Acknowledgments

- Hindu scriptures and traditions for divine knowledge
- Modern web technologies for bringing spirituality to the digital age
- The open-source community for amazing tools and libraries

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for improvements.

---

**Om Namah Shivaya** 🙏

*May this platform bring peace and spiritual connection to all who use it.* 