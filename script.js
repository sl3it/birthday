const canvas = document.getElementById('matrix');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const drops = Array(Math.floor(canvas.width / 18)).fill(1);

function drawMatrix() {
    ctx.fillStyle = "rgba(10, 10, 15, 0.1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#ff2d75";
    ctx.font = "14px monospace";
    
    drops.forEach((y, i) => {
        ctx.fillText('♥', i * 18, y * 18);
        if (y * 18 > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
    });
}
setInterval(drawMatrix, 60);

const starsContainer = document.getElementById('stars');
const starColors = ['star--white', 'star--pink', 'star--gold'];
for (let i = 0; i < 60; i++) {
    const star = document.createElement('div');
    const colorClass = starColors[Math.floor(Math.random() * starColors.length)];
    const starSize = 2 + Math.floor(Math.random() * 3);
    star.className = `star ${colorClass}`;
    star.style.cssText = `
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        width: ${starSize}px;
        height: ${starSize}px;
        animation-delay: ${Math.random() * 3}s;
        animation-duration: ${2 + Math.random() * 2}s;
    `;
    starsContainer.appendChild(star);
}

const bokehColors = ['rgba(255,45,117,0.25)', 'rgba(255,107,157,0.2)', 'rgba(255,215,0,0.15)'];
for (let i = 0; i < 8; i++) {
    const bokeh = document.createElement('div');
    bokeh.className = 'bokeh';
    const size = 10 + Math.random() * 20;
    bokeh.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        background: ${bokehColors[Math.floor(Math.random() * bokehColors.length)]};
        left: ${Math.random() * 100}%;
        bottom: -20px;
        animation-duration: ${10 + Math.random() * 15}s;
        animation-delay: ${Math.random() * 8}s;
    `;
    document.body.appendChild(bokeh);
}

const cursor = document.createElement('div');
cursor.className = 'custom-cursor';
document.body.appendChild(cursor);

let mouseX = 0, mouseY = 0;
let sparkleCounter = 0;
const MAX_SPARKLES = 10;
let activeSparkles = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.transform = `translate(${mouseX - 10}px, ${mouseY - 10}px)`;

    sparkleCounter++;
    if (sparkleCounter % 6 === 0 && activeSparkles < MAX_SPARKLES) {
        createSparkle(mouseX, mouseY);
    }
});

function createSparkle(x, y) {
    activeSparkles++;
    const sparkle = document.createElement('div');
    sparkle.className = 'cursor-sparkle';
    sparkle.textContent = '♥';
    const dx = (Math.random() - 0.5) * 30;
    const dy = (Math.random() - 0.5) * 30 - 15;
    sparkle.style.cssText = `
        left: ${x}px;
        top: ${y}px;
        font-size: ${8 + Math.random() * 8}px;
        --dx: ${dx}px;
        --dy: ${dy}px;
    `;
    document.body.appendChild(sparkle);
    setTimeout(() => {
        sparkle.remove();
        activeSparkles--;
    }, 700);
}

const displayBox = document.getElementById('display-box');
const introHeart = document.getElementById('intro-heart');
const mainContainer = document.getElementById('main-container');
const photoBook = document.getElementById('photo-book');
const currentPhoto = document.getElementById('current-photo');
const finalHeartContainer = document.getElementById('final-heart-container');

const photos = [
    'photo_2026-03-11_18-07-25.jpg',
    'photo_2026-03-11_18-07-41.jpg',
    'photo_2026-03-11_18-07-54.jpg',
    '1.jpg'
];
let currentPhotoIndex = 0;
let autoTransitionTimer = null;

window.addEventListener('load', () => {
    setTimeout(() => {
        startCountdown();
    }, 1000);
});

function startCountdown() {
    const phrases = ["3", "2", "1", "HAPPY", "BIRTHDAY", "ANITA"];
    let tl = gsap.timeline({
        onComplete: () => {
            displayBox.style.display = 'none';
            showIntroHeart();
        }
    });
    
    phrases.forEach(w => {
        tl.to(displayBox, {
            onStart: () => displayBox.innerText = w,
            opacity: 1,
            scale: 1.5,
            duration: 0.4
        })
        .to(displayBox, {
            opacity: 0,
            scale: 0.8,
            duration: 0.3,
            delay: 0.5
        });
    });
}

let heartAnimationId = null;

function showIntroHeart() {
    introHeart.style.display = 'block';
    const heartCtx = introHeart.getContext('2d');
    introHeart.width = 400;
    introHeart.height = 400;
    
    const heartPoints = [];
    
    for (let i = 0; i < 200; i++) {
        const t = (i / 200) * Math.PI * 2;
        const x = 16 * Math.pow(Math.sin(t), 3);
        const y = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
        heartPoints.push({ x: x * 10 + 200, y: y * 10 + 200 });
    }
    
    for (let py = 80; py < 320; py += 15) {
        for (let px = 80; px < 320; px += 15) {
            const dx = (px - 200) / 10;
            const dy = (py - 200) / 10;
            const dist = Math.sqrt(dx*dx + dy*dy);
            const angle = Math.atan2(dy, dx);
            const heartR = Math.sqrt(Math.abs(Math.cos(angle))) * 16;
            if (dist < heartR * 0.85) {
                heartPoints.push({ x: px, y: py });
            }
        }
    }
    
    let pulse = 0;
    
    function drawHeart() {
        heartCtx.clearRect(0, 0, 400, 400);
        
        heartCtx.shadowBlur = 20;
        heartCtx.shadowColor = "#ff2d75";
        heartCtx.fillStyle = "#ff2d75";
        heartCtx.font = "bold 14px monospace";
        
        pulse += 0.05;
        const scale = 1 + Math.sin(pulse) * 0.05;
        
        heartPoints.forEach((point) => {
            const x = 200 + (point.x - 200) * scale;
            const y = 200 + (point.y - 200) * scale;
            heartCtx.fillText('♥', x, y);
        });
        
        heartCtx.shadowBlur = 0;
        heartAnimationId = requestAnimationFrame(drawHeart);
    }
    
    drawHeart();

    const goToMain = () => {
        if (heartAnimationId) cancelAnimationFrame(heartAnimationId);
        gsap.to(introHeart, {
            scale: 0,
            opacity: 0,
            duration: 0.5,
            onComplete: () => {
                introHeart.style.display = 'none';
                showMainContent();
            }
        });
    };

    introHeart.onclick = goToMain;
    setTimeout(goToMain, 2500);
}

function showMainContent() {
    mainContainer.style.display = 'flex';

    gsap.fromTo(mainContainer.querySelector('.greeting-card'),
        {opacity: 0, y: -50, scale: 0.8},
        {opacity: 1, y: 0, scale: 1, duration: 1.5, ease: "back.out"}
    );

    gsap.to(mainContainer.querySelector('.sub-text'), {
        opacity: 1,
        duration: 1,
        delay: 1
    });

    setTimeout(() => {
        gsap.to(photoBook, {
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: "back.out"
        });
        
        initPhotoBook();
    }, 500);
}

function initPhotoBook() {
    const img = currentPhoto.querySelector('img');
    const pageIndicator = photoBook.querySelector('.page-indicator');
    
    photoBook.onclick = () => {
        currentPhoto.classList.add('flipping');
        
        setTimeout(() => {
            currentPhotoIndex = (currentPhotoIndex + 1) % photos.length;
            img.src = photos[currentPhotoIndex];
            
            pageIndicator.textContent = `${currentPhotoIndex + 1} / ${photos.length}`;
            
            currentPhoto.classList.remove('flipping');
            
            if (currentPhotoIndex === photos.length - 1) {
                setTimeout(() => {
                    showFinalHeart();
                }, 2000);
            }
        }, 400);
    };
}

function showFinalHeart() {
    gsap.to(mainContainer, {
        opacity: 0,
        scale: 0.5,
        duration: 1,
        onComplete: () => {
            mainContainer.style.display = 'none';
        }
    });
    
    finalHeartContainer.style.display = 'block';

    const photoCount = 30;
    const positions = getHeartPositions(photoCount);

    positions.forEach((pos, i) => {
        const photo = document.createElement('div');
        photo.className = 'final-photo';
        const photoSrc = photos[i % photos.length];
        photo.innerHTML = `<img src="${photoSrc}" alt="" loading="lazy">`;
        photo.style.left = `calc(50% + ${pos.x}px - 35px)`;
        photo.style.top = `calc(50% + ${pos.y}px - 45px)`;
        photo.style.transform = `rotate(${pos.rotation}deg)`;
        photo.style.zIndex = Math.floor(Math.random() * 10);
        finalHeartContainer.appendChild(photo);

        gsap.to(photo, {
            opacity: 1,
            scale: 1,
            duration: 0.8,
            delay: i * 0.08,
            ease: "back.out"
        });
    });

    setTimeout(startFireworks, 1500);
}

function getHeartPositions(count) {
    const positions = [];

    const layers = 3;
    const perLayer = Math.floor(count / layers);

    for (let layer = 0; layer < layers; layer++) {
        const layerCount = perLayer + (layer === layers - 1 ? count % layers : 0);
        const scale = 1 - layer * 0.15;

        for (let i = 0; i < layerCount; i++) {
            const t = (i / layerCount) * Math.PI * 2 + layer * 0.3;
            const x = 16 * Math.pow(Math.sin(t), 3);
            const y = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));

            positions.push({
                x: x * 18 * scale,
                y: y * 18 * scale,
                rotation: (Math.random() - 0.5) * 30 + layer * 5
            });
        }
    }

    return positions;
}

let fireworksInterval = null;

function startFireworks() {
    const colors = ['#ff2d75', '#ff6b9d', '#ffa0c9', '#ffffff', '#ffd700'];
    
    fireworksInterval = setInterval(() => {
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight * 0.6;
        const color = colors[Math.floor(Math.random() * colors.length)];
        createFirework(x, y, color);
    }, 1500);
}

function createFirework(x, y, color) {
    const count = 15;
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 5px;
            height: 5px;
            background: ${color};
            border-radius: 50%;
            left: ${x}px;
            top: ${y}px;
            box-shadow: 0 0 6px ${color};
            pointer-events: none;
            z-index: 999;
        `;
        document.body.appendChild(particle);
        
        const angle = (Math.PI * 2 / count) * i;
        const velocity = 2 + Math.random() * 3;
        
        gsap.to(particle, {
            x: Math.cos(angle) * velocity * 50,
            y: Math.sin(angle) * velocity * 50 + 20,
            opacity: 0,
            duration: 1,
            ease: "power2.out",
            onComplete: () => particle.remove()
        });
    }
}

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
