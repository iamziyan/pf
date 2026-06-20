const canvas = document.getElementById('code-rain');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const chars = '01{}[]<>/;=+*#ZiyanaliFinTechBCA';
const fontSize = 14;
const columns = canvas.width / fontSize;
const drops = [];

for (let x = 0; x < columns; x++) {
  drops[x] = 1;
}

function drawCode() {
  const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
  
  // Fade effect for trail
  ctx.fillStyle = isDark ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.05)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Text color based on theme
  ctx.fillStyle = isDark ? 'rgba(84, 131, 179, 0.15)' : 'rgba(5, 38, 89, 0.08)'; 
  ctx.font = fontSize + 'px monospace';

  for (let i = 0; i < drops.length; i++) {
    const text = chars[Math.floor(Math.random() * chars.length)];
    ctx.fillText(text, i * fontSize, drops[i] * fontSize);

    if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
      drops[i] = 0;
    }
    drops[i]++;
  }
}

setInterval(drawCode, 50);

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
