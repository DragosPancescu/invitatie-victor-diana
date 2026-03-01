// ── Generate paper noise texture via canvas ──
(function generateNoiseTexture() {
    const size = 200;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    const imageData = ctx.createImageData(size, size);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        const v = Math.random() * 255;
        data[i] = v;
        data[i + 1] = v;
        data[i + 2] = v;
        data[i + 3] = 255;
    }
    ctx.putImageData(imageData, 0, 0);
    document.documentElement.style.setProperty(
        '--noise-texture',
        'url(' + canvas.toDataURL('image/png') + ')'
    );
})();

const scene = document.getElementById('scene');
const muteBtn = document.getElementById('muteBtn');
let isMuted = false;
let isOpen = false;

// ── Petals ──
function createPetal() {
    const petal = document.createElement('div');
    petal.className = 'petal';

    const x = Math.random() * window.innerWidth;
    const size = 8 + Math.random() * 12;
    const duration = 6 + Math.random() * 6;
    const drift = (Math.random() - 0.5) * 200;
    const spin = (Math.random() - 0.5) * 720;
    const delay = Math.random() * 0.5;
    const hue = 15 + Math.random() * 20;
    const sat = 40 + Math.random() * 30;
    const light = 82 + Math.random() * 12;

    petal.style.cssText = `
        left: ${x}px;
        width: ${size}px;
        height: ${size * 1.3}px;
        background: radial-gradient(ellipse at 30% 30%,
            hsl(${hue}, ${sat}%, ${light}%),
            hsl(${hue + 5}, ${sat - 10}%, ${light - 10}%));
        --drift: ${drift}px;
        --spin: ${spin}deg;
        animation-duration: ${duration}s;
        animation-delay: ${delay}s;
    `;

    document.body.appendChild(petal);
    requestAnimationFrame(() => petal.classList.add('active'));
    setTimeout(() => petal.remove(), (duration + delay) * 1000 + 100);
}

let petalInterval = null;

function startPetals() {
    if (petalInterval) return;
    for (let i = 0; i < 8; i++) setTimeout(createPetal, i * 150);
    petalInterval = setInterval(createPetal, 400);
}

function stopPetals() {
    if (petalInterval) {
        clearInterval(petalInterval);
        petalInterval = null;
    }
}

// ── Music (MP3) ──
const bgMusic = new Audio('resources/married-life.mp3');
bgMusic.loop = true;
bgMusic.volume = 0.5;

function startMusic() {
    bgMusic.play().catch(() => {});
}

function stopMusic() {
    bgMusic.pause();
    bgMusic.currentTime = 0;
}

// ── Mute Toggle ──
muteBtn.addEventListener('click', () => {
    isMuted = !isMuted;
    bgMusic.muted = isMuted;
    muteBtn.innerHTML = isMuted
        ? '<svg viewBox="0 0 24 24"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>'
        : '<svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>';
});

// ── Click ──
scene.addEventListener('click', (e) => {
    if (e.target.closest('.confirm-btn')) return;

    if (!isOpen) {
        scene.classList.add('open');
        startPetals();
        startMusic();
        muteBtn.classList.add('visible');
        isOpen = true;
    } else {
        scene.classList.remove('open');
        stopPetals();
        stopMusic();
        muteBtn.classList.remove('visible');
        isOpen = false;
    }
});
