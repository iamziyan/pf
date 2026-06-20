/**
 * theme.js
 * Governs root theme settings (Light/Dark mode) initialized from localStorage or system preferences,
 * and handles theme toggling + swing animation driven by the cinematic interactive lamp.
 */

// Synthesize a realistic mechanical "Tak" light switch click using Web Audio API
function playLampClick() {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const filter = audioCtx.createBiquadFilter();

    // "Tak" synthesis: sharp, hollow, fast decay
    osc.type = 'triangle'; 
    osc.frequency.setValueAtTime(800, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.04);

    // Highpass filter to cut the mud and make it crisp
    filter.type = 'highpass';
    filter.frequency.value = 1000; 

    // Instant attack, ultra-fast decay
    gain.gain.setValueAtTime(0.8, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.06);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(audioCtx.currentTime);
    osc.stop(audioCtx.currentTime + 0.06);
  } catch (e) {
    console.error("Audio play failed", e);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const interactiveLamp = document.getElementById('interactive-lamp');
  const htmlRoot = document.documentElement;

  // 1. Initialize theme on load (from localStorage or system)
  const savedTheme = localStorage.getItem('theme') || 
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  setTheme(savedTheme);

  if (!interactiveLamp) return;

  // 2. Toggle theme with interactive lamp
  function toggleThemeWithLamp() {
    playLampClick();

    // Trigger swing animation
    interactiveLamp.classList.remove('swinging');
    void interactiveLamp.offsetWidth; // Force reflow to restart animation
    interactiveLamp.classList.add('swinging');
    
    // Determine and set next theme
    const currentTheme = htmlRoot.getAttribute('data-theme') || 'dark';
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
  }

  // 3. SetTheme helper
  function setTheme(theme) {
    htmlRoot.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Update aria attributes on lamp if present
    if (interactiveLamp) {
      interactiveLamp.setAttribute('aria-label', 
        theme === 'dark' ? 'Light is on. Click to turn off.' : 'Light is off. Click to turn on.'
      );
    }
  }

  // 4. Bind event listeners
  interactiveLamp.addEventListener('click', toggleThemeWithLamp);
  
  interactiveLamp.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleThemeWithLamp();
    }
  });

  // Clean up swing class after animation ends
  interactiveLamp.addEventListener('animationend', () => {
    interactiveLamp.classList.remove('swinging');
  });
});
