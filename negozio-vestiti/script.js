// Video play/pause control UX
const video = document.getElementById('heroVideo');
const btn = document.getElementById('videoControlBtn');
btn.addEventListener('click', function() {
    if (video.paused) {
        video.play();
        btn.innerHTML = '<i class="fas fa-pause"></i>';
        btn.setAttribute('aria-label', 'Pausa video');
    } else {
        video.pause();
        btn.innerHTML = '<i class="fas fa-play"></i>';
        btn.setAttribute('aria-label', 'Riproduci video');
    }
});

// Chat widget interaction
const chat = document.getElementById('chatWidget');
chat.addEventListener('click', function() {
    // Placeholder: luxury chat modal could be implemented here
    alert('Benvenuto nella chat Starpot! (Demo)');
});

// Animazione fade-in su scroll (per future sezioni)
function revealOnScroll() {
    const reveals = document.querySelectorAll('.reveal');
    for (let i = 0; i < reveals.length; i++) {
        const windowHeight = window.innerHeight;
        const elementTop = reveals[i].getBoundingClientRect().top;
        const elementVisible = 120;
        if (elementTop < windowHeight - elementVisible) {
            reveals[i].classList.add('active');
        }
    }
}
// Attiva subito su caricamento e su scroll
window.addEventListener('scroll', revealOnScroll);
window.addEventListener('DOMContentLoaded', revealOnScroll);

// Opening Space Scene Animation
window.addEventListener('DOMContentLoaded', function() {
    const opening = document.getElementById('opening-scene');
    const canvas = document.getElementById('stars-canvas');
    if (opening && canvas) {
        const ctx = canvas.getContext('2d');
        let w = window.innerWidth, h = window.innerHeight;
        canvas.width = w;
        canvas.height = h;

        // Responsive resize
        window.addEventListener('resize', () => {
            w = window.innerWidth;
            h = window.innerHeight;
            canvas.width = w;
            canvas.height = h;
        });

        // Starfield parameters
        const STAR_NUM = Math.floor(w / 4);
        const stars = [];
        for (let i = 0; i < STAR_NUM; i++) {
            stars.push({
                x: Math.random() * w,
                y: Math.random() * h,
                r: Math.random() * 1.2 + 0.3,
                speed: Math.random() * 0.7 + 0.2,
                alpha: Math.random() * 0.7 + 0.3
            });
        }

        function drawStars() {
            ctx.clearRect(0, 0, w, h);
            for (let s of stars) {
                ctx.save();
                ctx.globalAlpha = s.alpha;
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.r, 0, 2 * Math.PI);
                ctx.fillStyle = Math.random() > 0.7 ? '#4efcff' : '#fff';
                ctx.shadowColor = '#4efcff';
                ctx.shadowBlur = 8;
                ctx.fill();
                ctx.restore();

                // Move star downward (simulate "fly through")
                s.y += s.speed;
                if (s.y > h) {
                    s.y = 0;
                    s.x = Math.random() * w;
                }
            }
            requestAnimationFrame(drawStars);
        }
        drawStars();

        // Hide overlay after 2.5s
        setTimeout(() => {
            opening.classList.add('hide');
            setTimeout(() => { opening.style.display = 'none'; }, 1200);
        }, 2500);
    }
});

// --- MODERN ANIMATIONS ---

// Magnet hover effect for CTA
document.querySelectorAll('.cta').forEach(btn => {
    btn.addEventListener('mousemove', function(e) {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        gsap.to(btn, {
            x: x * 0.18,
            y: y * 0.18,
            scale: 1.06,
            rotate: x * 0.04,
            duration: 0.35,
            ease: "power2.out"
        });
        btn.classList.add('magnet-hover');
    });
    btn.addEventListener('mouseleave', function() {
        gsap.to(btn, {x: 0, y: 0, scale: 1, rotate: 0, duration: 0.45, ease: "power2.out"});
        btn.classList.remove('magnet-hover');
    });
});

// Hero SVG animation (orbit + glow)
function animateHeroSVG() {
    const orbit = document.querySelector('.svg-orbit');
    const dot = document.querySelector('.svg-dot');
    if (orbit && dot) {
        gsap.to(orbit, {
            rotate: 360,
            transformOrigin: "50% 50%",
            repeat: -1,
            duration: 16,
            ease: "linear"
        });
        gsap.to(dot, {
            motionPath: {
                path: orbit,
                align: orbit,
                alignOrigin: [0.5, 0.5],
                autoRotate: false
            },
            repeat: -1,
            duration: 16,
            ease: "linear"
        });
    }
}
animateHeroSVG();

// Parallax effect for hero content
function heroParallax() {
    if (window.gsap && window.ScrollTrigger) {
        gsap.to('.hero-content', {
            y: 60,
            opacity: 0.7,
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: 'bottom top',
                scrub: 0.8
            }
        });
        gsap.to('.hero-svg', {
            y: -40,
            opacity: 0.5,
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: 'bottom top',
                scrub: 0.8
            }
        });
    }
}
heroParallax();

// Catalogo items: staggered reveal with GSAP + ScrollTrigger
function catalogoReveal() {
    if (window.gsap && window.ScrollTrigger) {
        gsap.utils.toArray('.catalogo-item').forEach((item, i) => {
            gsap.fromTo(item, {
                opacity: 0,
                y: 60
            }, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                delay: i * 0.08,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: item,
                    start: "top 90%",
                    toggleActions: "play none none reverse"
                }
            });
        });
    }
}
catalogoReveal();

// Hero Title SplitText + GSAP Animation
function animateHeroTitle() {
    const title = document.getElementById('heroTitle');
    if (title && window.SplitText) {
        // Remove previous split if any
        title.innerHTML = title.textContent.trim();
        const split = new SplitText(title, {type: "chars,words"});
        gsap.fromTo(split.chars, {
            opacity: 0,
            y: -40
        }, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
            stagger: 0.07,
            delay: 0.3
        });
    } else if (title) {
        // Fallback: simple span split
        const text = title.textContent.trim();
        title.innerHTML = '';
        text.split('').forEach((char, i) => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char;
            title.appendChild(span);
        });
        gsap.to('#heroTitle span', {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
            stagger: 0.07,
            delay: 0.3
        });
    }
}
animateHeroTitle();

// About Section Animation
function aboutSectionAnimation() {
    if (window.gsap && window.ScrollTrigger) {
        gsap.from('.about-title', {
            opacity: 0,
            y: 40,
            duration: 0.8,
            scrollTrigger: {
                trigger: '.about-section',
                start: 'top 80%',
            }
        });
        gsap.from('.about-text', {
            opacity: 0,
            y: 40,
            duration: 0.8,
            delay: 0.2,
            scrollTrigger: {
                trigger: '.about-section',
                start: 'top 80%',
            }
        });
        gsap.from('.about-image img', {
            opacity: 0,
            scale: 0.92,
            duration: 0.8,
            delay: 0.3,
            scrollTrigger: {
                trigger: '.about-section',
                start: 'top 80%',
            }
        });
    }
}

// Testimonial Slider Animation
function testimonialSlider() {
    const slides = document.querySelectorAll('.testimonial-slide');
    const prev = document.querySelector('.testimonial-prev');
    const next = document.querySelector('.testimonial-next');
    let current = 0;

    function showSlide(idx) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === idx);
        });
    }
    showSlide(current);

    function goToSlide(dir) {
        slides[current].classList.remove('active');
        current = (current + dir + slides.length) % slides.length;
        slides[current].classList.add('active');
        gsap.fromTo(slides[current], {opacity: 0, y: 30}, {opacity: 1, y: 0, duration: 0.6, ease: "power2.out"});
    }

    if (prev && next) {
        prev.onclick = () => goToSlide(-1);
        next.onclick = () => goToSlide(1);
    }
}

// Newsletter Animation & Form
function newsletterAnimation() {
    if (window.gsap && window.ScrollTrigger) {
        gsap.from('.newsletter-title', {
            opacity: 0,
            y: 40,
            duration: 0.8,
            scrollTrigger: {
                trigger: '.newsletter-section',
                start: 'top 80%',
            }
        });
        gsap.from('.newsletter-text', {
            opacity: 0,
            y: 40,
            duration: 0.8,
            delay: 0.2,
            scrollTrigger: {
                trigger: '.newsletter-section',
                start: 'top 80%',
            }
        });
        gsap.from('.newsletter-form', {
            opacity: 0,
            y: 40,
            duration: 0.8,
            delay: 0.3,
            scrollTrigger: {
                trigger: '.newsletter-section',
                start: 'top 80%',
            }
        });
    }
    // Newsletter form handler
    const form = document.querySelector('.newsletter-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const input = form.querySelector('input[type="email"]');
            if (input && input.value) {
                form.reset();
                gsap.to(form, {opacity: 0, duration: 0.4});
                setTimeout(() => {
                    form.innerHTML = '<span style="color:#4efcff;font-weight:600;">Grazie per l’iscrizione!</span>';
                    gsap.to(form, {opacity: 1, duration: 0.4});
                }, 400);
            }
        });
    }
}

// Re-init animations after barba.js page transitions
function reinitAnimations() {
    animateHeroSVG();
    heroParallax();
    catalogoReveal();
    animateHeroTitle();
    revealOnScroll();
}

// --- BARBA.JS PAGE TRANSITIONS ---
if (window.barba) {
    barba.init({
        transitions: [{
            name: 'fade-slide',
            async leave(data) {
                await gsap.to(data.current.container, {
                    opacity: 0,
                    x: -60,
                    duration: 0.5,
                    ease: "power2.inOut"
                });
            },
            enter(data) {
                gsap.fromTo(data.next.container,
                    {opacity: 0, x: 60},
                    {opacity: 1, x: 0, duration: 0.5, ease: "power2.inOut"}
                );
                setTimeout(reinitAnimations, 100);
            },
            once(data) {
                gsap.fromTo(data.next.container,
                    {opacity: 0, x: 60},
                    {opacity: 1, x: 0, duration: 0.7, ease: "power2.inOut"}
                );
                setTimeout(reinitAnimations, 100);
            }
        }]
    });
}

// Custom Cursor
function initCustomCursor() {
    const cursor = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    
    document.addEventListener('mousemove', (e) => {
        gsap.to(cursor, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.1
        });
        gsap.to(cursorOutline, {
            x: e.clientX - 20,
            y: e.clientY - 20,
            duration: 0.15
        });
    });

    // Hover effect on interactive elements
    document.querySelectorAll('a, button, .catalogo-item').forEach(el => {
        el.addEventListener('mouseenter', () => {
            gsap.to(cursorOutline, {
                scale: 1.5,
                duration: 0.3
            });
        });
        el.addEventListener('mouseleave', () => {
            gsap.to(cursorOutline, {
                scale: 1,
                duration: 0.3
            });
        });
    });
}

// Sequence Loader System
class SequenceLoader {
    constructor() {
        this.loader = document.querySelector('.loader');
        this.opening = document.getElementById('opening-scene');
        this.main = document.querySelector('main');
        this.progress = 0;
        this.isLoading = true;
        this.assets = [];
        this.loadedAssets = 0;
    }

    init() {
        // Hide content initially
        this.main.style.visibility = 'hidden';
        this.main.style.opacity = '0';
        
        // Start loading sequence
        this.preloadAssets();
        this.updateLoader();
        this.watchLoadingState();
    }

    preloadAssets() {
        // Preload images
        document.querySelectorAll('img').forEach(img => {
            if (img.src) this.assets.push(img.src);
        });
        
        // Preload video with higher priority
        const video = document.getElementById('heroVideo');
        if (video) {
            this.assets.unshift('background.mp4'); // Add at start of array for priority
            video.addEventListener('loadeddata', () => this.assetLoaded());
        }

        // Start loading each asset
        this.assets.forEach(src => {
            if (src.includes('.mp4')) {
                this.preloadVideo(src);
            } else {
                this.preloadImage(src);
            }
        });
    }

    preloadImage(src) {
        const img = new Image();
        img.onload = () => this.assetLoaded();
        img.src = src;
    }

    preloadVideo(src) {
        const video = document.createElement('video');
        video.onloadeddata = () => this.assetLoaded();
        video.src = src;
    }

    assetLoaded() {
        this.loadedAssets++;
        this.progress = (this.loadedAssets / this.assets.length) * 100;
    }

    updateLoader() {
        if (!this.isLoading) return;

        const bar = document.querySelector('.loader-bar');
        const counter = document.querySelector('.loader-counter');
        
        if (this.progress >= 100) {
            this.completeLoading();
            return;
        }

        bar.style.width = `${this.progress}%`;
        counter.textContent = `${Math.round(this.progress)}%`;
        requestAnimationFrame(() => this.updateLoader());
    }

    watchLoadingState() {
        if (document.readyState === 'complete') {
            this.progress = Math.max(this.progress, 100);
        }
        
        if (this.isLoading) {
            requestAnimationFrame(() => this.watchLoadingState());
        }
    }

    completeLoading() {
        this.isLoading = false;

        // Sequence animation
        gsap.timeline()
            .to(this.loader, {
                opacity: 0,
                duration: 0.5,
                onComplete: () => {
                    this.loader.style.display = 'none';
                    this.opening.style.display = 'flex';
                }
            })
            .to(this.opening, {
                opacity: 1,
                duration: 0.5
            })
            .to(this.opening, {
                opacity: 0,
                duration: 0.5,
                delay: 2.5,
                onComplete: () => {
                    this.opening.style.display = 'none';
                    this.main.style.visibility = 'visible';
                }
            })
            .to(this.main, {
                opacity: 1,
                duration: 0.8,
                onComplete: () => {
                    // Initialize all animations after content is visible
                    initAnimations();
                }
            });
    }
}

// Performance Monitor
const performanceMonitor = {
    fps: 0,
    frameCount: 0,
    lastTime: performance.now(),

    init() {
        this.loop();
    },

    loop() {
        const currentTime = performance.now();
        this.frameCount++;

        if (currentTime - this.lastTime >= 1000) {
            this.fps = this.frameCount;
            this.frameCount = 0;
            this.lastTime = currentTime;
            
            if (this.fps < 30) {
                console.warn('Performance warning: FPS dropped below 30');
                this.optimizePerformance();
            }
        }

        requestAnimationFrame(() => this.loop());
    },

    optimizePerformance() {
        // Reduce animation complexity if needed
        document.body.classList.add('reduced-motion');
    }
};

// Ottimizzazione Video Background
function optimizeVideoPlayback() {
    const video = document.getElementById('heroVideo');
    if (!video) return;

    // Forza hardware acceleration e previene repaint
    video.style.transform = 'translate3d(0,0,0)';
    video.style.willChange = 'transform';
    video.style.backfaceVisibility = 'hidden';
    video.style.webkitBackfaceVisibility = 'hidden';

    // Imposta playbackRate a 1 (evita slow motion su device lenti)
    video.playbackRate = 1;

    // Tenta di forzare il decoding hardware (alcuni browser)
    if (video.readyState < 3) {
        video.load();
    }

    // Se il video va a scatti, prova a riavviare la riproduzione
    video.addEventListener('stalled', () => {
        video.pause();
        setTimeout(() => video.play(), 100);
    });

    // Se il video si blocca, prova a saltare avanti di 0.01s
    video.addEventListener('waiting', () => {
        if (!video.seeking) {
            try {
                video.currentTime += 0.01;
            } catch (e) {}
        }
        video.style.opacity = '0.8';
    });

    video.addEventListener('playing', () => {
        video.style.opacity = '1';
    });

    // Preload ottimizzato
    video.preload = 'auto';

    // Autoplay fix per alcuni browser mobile
    video.muted = true;
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');

    // Avvia il video appena possibile
    const playPromise = video.play();
    if (playPromise !== undefined) {
        playPromise.catch(() => {
            // Retry on user interaction
            document.body.addEventListener('pointerdown', () => {
                video.play();
            }, { once: true });
        });
    }
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    const loader = new SequenceLoader();
    loader.init();
    performanceMonitor.init();
});

// Estendi initAnimations
function initAnimations() {
    initCustomCursor();
    initQuickView();
    initCollectionsAnimation && initCollectionsAnimation();
    animateHeroSVG();
    heroParallax();
    catalogoReveal();
    animateHeroTitle();
    revealOnScroll();
    optimizeVideoPlayback();
    aboutSectionAnimation();
    testimonialSlider();
    newsletterAnimation();
}