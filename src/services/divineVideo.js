// Divine Video Service - Simulates divine video streams
// Since we can't have real video from Gods, we'll create divine visual effects

class DivineVideoService {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.animationId = null;
    this.isPlaying = false;
  }

  // Create a divine video stream for a specific God
  createDivineStream(god, videoElement) {
    if (!videoElement) return;

    // Create canvas for divine effects
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.canvas.width = 1280;
    this.canvas.height = 720;

    // Create MediaStream from canvas
    const stream = this.canvas.captureStream(30); // 30 FPS

    // Set the stream as source for video element
    videoElement.srcObject = stream;

    // Start divine animation
    this.startDivineAnimation(god);

    return stream;
  }

  startDivineAnimation(god) {
    this.isPlaying = true;
    this.animate(god);
  }

  animate(god) {
    if (!this.isPlaying) return;

    const ctx = this.ctx;
    const canvas = this.canvas;
    const time = Date.now() * 0.001;

    // Clear canvas
    ctx.fillStyle = `rgba(0, 0, 0, 0.1)`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Create divine background based on God
    this.createDivineBackground(god, time);

    // Add God's avatar in center
    this.drawGodAvatar(god);

    // Add divine particles
    this.drawDivineParticles(time);

    // Add Sanskrit text
    this.drawSanskritText(god, time);

    // Add divine glow effects
    this.addDivineGlow(god, time);

    this.animationId = requestAnimationFrame(() => this.animate(god));
  }

  createDivineBackground(god, time) {
    const ctx = this.ctx;
    const canvas = this.canvas;

    // Create gradient based on God's color
    const gradient = ctx.createRadialGradient(
      canvas.width / 2, canvas.height / 2, 0,
      canvas.width / 2, canvas.height / 2, canvas.width / 2
    );

    if (god.color === 'divine') {
      gradient.addColorStop(0, 'rgba(242, 117, 10, 0.3)');
      gradient.addColorStop(0.5, 'rgba(227, 93, 5, 0.2)');
      gradient.addColorStop(1, 'rgba(188, 69, 8, 0.1)');
    } else {
      gradient.addColorStop(0, 'rgba(14, 165, 233, 0.3)');
      gradient.addColorStop(0.5, 'rgba(2, 132, 199, 0.2)');
      gradient.addColorStop(1, 'rgba(3, 105, 161, 0.1)');
    }

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add animated waves
    ctx.strokeStyle = god.color === 'divine' ? 'rgba(242, 117, 10, 0.1)' : 'rgba(14, 165, 233, 0.1)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let x = 0; x < canvas.width; x += 20) {
      const y = canvas.height / 2 + Math.sin(x * 0.01 + time) * 50;
      if (x === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();
  }

  drawGodAvatar(god) {
    const ctx = this.ctx;
    const canvas = this.canvas;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Create circular avatar background
    ctx.beginPath();
    ctx.arc(centerX, centerY, 120, 0, 2 * Math.PI);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.fill();
    ctx.strokeStyle = god.color === 'divine' ? '#f2750a' : '#0ea5e9';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Add God's name
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = 'bold 48px Poppins, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(god.name, centerX, centerY + 20);

    // Add Sanskrit name
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '32px Poppins, sans-serif';
    ctx.fillText(god.sanskritName, centerX, centerY + 60);

    // Add title
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = '24px Poppins, sans-serif';
    ctx.fillText(god.title, centerX, centerY + 90);
  }

  drawDivineParticles(time) {
    const ctx = this.ctx;
    const canvas = this.canvas;

    for (let i = 0; i < 50; i++) {
      const x = (Math.sin(time + i) * canvas.width / 2) + canvas.width / 2;
      const y = (Math.cos(time + i * 0.5) * canvas.height / 2) + canvas.height / 2;
      const size = Math.sin(time + i) * 3 + 2;

      ctx.beginPath();
      ctx.arc(x, y, size, 0, 2 * Math.PI);
      ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + Math.sin(time + i) * 0.2})`;
      ctx.fill();
    }
  }

  drawSanskritText(god, time) {
    const ctx = this.ctx;
    const canvas = this.canvas;

    // Draw mantras
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = '20px Poppins, sans-serif';
    ctx.textAlign = 'center';

    god.mantras.forEach((mantra, index) => {
      const y = 100 + index * 40;
      const x = canvas.width / 2 + Math.sin(time + index) * 20;
      ctx.fillText(mantra, x, y);
    });
  }

  addDivineGlow(god, time) {
    const ctx = this.ctx;
    const canvas = this.canvas;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Create pulsing glow effect
    const glowSize = 150 + Math.sin(time * 2) * 20;
    const gradient = ctx.createRadialGradient(
      centerX, centerY, 0,
      centerX, centerY, glowSize
    );

    if (god.color === 'divine') {
      gradient.addColorStop(0, 'rgba(242, 117, 10, 0.1)');
      gradient.addColorStop(1, 'rgba(242, 117, 10, 0)');
    } else {
      gradient.addColorStop(0, 'rgba(14, 165, 233, 0.1)');
      gradient.addColorStop(1, 'rgba(14, 165, 233, 0)');
    }

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  stop() {
    this.isPlaying = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }

  // Create a simple divine audio tone
  createDivineAudio() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(432, audioContext.currentTime); // Divine frequency
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);

    oscillator.start();
    
    // Fade out after 2 seconds
    setTimeout(() => {
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 2);
      setTimeout(() => oscillator.stop(), 2000);
    }, 2000);

    return oscillator;
  }
}

export default DivineVideoService; 