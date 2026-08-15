/* ═══════════════════════════════════════════════════════
   WHISPERING ROSES — Arabic Wedding Invitation
   script.js (avec vidéo au clic + noms après 2 secondes)
═══════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ── ÉLÉMENTS DOM ──────────────────────────────────────
  const videoLayer = document.getElementById('videoLayer');
  const mainWrapper = document.getElementById('mainWrapper');
  const video = document.getElementById('heroVideo');
  const clickOverlay = document.getElementById('clickOverlay');
  const videoNames = document.getElementById('videoNames');
  const videoInstruction = document.getElementById('videoInstruction');

  let videoStarted = false;
  let namesShown = false;
  let transitionDone = false;

  document.documentElement.classList.add('video-locked');

  if (video) {
    video.load();
  }

  // ── FONCTION: DÉMARRER LA VIDÉO ───────────────────────
  function startVideo() {
    if (videoStarted) return;
    videoStarted = true;

    // Cacher l'overlay de clic
    if (clickOverlay) {
      clickOverlay.classList.add('hide');
    }

    // Lire la vidéo
    video.play().catch(err => {
      console.log('Auto-play prevented, user interaction needed');
    });

    // Après 2 secondes, afficher les noms
    setTimeout(() => {
      if (videoNames && !namesShown) {
        namesShown = true;
        videoNames.classList.add('show');
      }
    }, 2000);

    // Garder la dernière image fixe, puis laisser l'utilisateur défiler.
    video.addEventListener('ended', () => {
      if (!transitionDone) {
        transitionDone = true;
        transitionToMain();
      }
    }, { once: true });

    // Si la vidéo ne peut pas être lue, permettre quand même l'accès à l'invitation.
    video.addEventListener('error', () => {
      if (!transitionDone) {
        transitionDone = true;
        transitionToMain();
      }
    }, { once: true });
  }

  // ── FONCTION: TRANSITION VERS LE CONTENU PRINCIPAL ─────
  function transitionToMain() {
    // Transformer la vidéo en premier écran fixe dans le flux de la page.
    if (videoLayer) {
      videoLayer.classList.add('finished');
    }

    document.body.classList.add('video-finished');
    document.documentElement.classList.remove('video-locked');
    window.scrollTo(0, 0);

    if (videoInstruction) {
      videoInstruction.innerHTML = '<span class="finished-scroll-arrow">⌄</span><p>مرر للأسفل</p>';
    }

    // Afficher le contenu principal
    if (mainWrapper) {
      mainWrapper.classList.add('visible');
    }

    // Arrêter la vidéo
    if (video) {
      video.pause();
    }

    // Démarrer l'observation des éléments reveal
    initScrollReveal();
    
    // Démarrer le compteur
    initCountdown();
    
    // Démarrer les effets ripple
    initRippleEffects();
    
    // Démarrer le scroll-snap keyboard
    initKeyboardNavigation();
    
    console.log('🌹 باقة ورد هامسة — حفل زفاف يوسف وأميرة 🌹');
  }

  // ── CLIC SUR L'OVERLAY OU LA VIDÉO ────────────────────
  if (clickOverlay) {
    clickOverlay.addEventListener('click', startVideo);
  }
  
  if (video) {
    video.addEventListener('click', startVideo);
  }

  // ── 1. SCROLL REVEAL ──────────────────────────────────
  function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    const revealObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -20px 0px'
    });
    reveals.forEach(el => revealObs.observe(el));
  }

  // ── 2. COUNTDOWN TIMER ────────────────────────────────
  function initCountdown() {
    // Wedding date: July 1, 2025 at 21:30
    const weddingDate = new Date(2025, 6, 1, 21, 30, 0);

    const daysEl  = document.getElementById('cnt-days');
    const hoursEl = document.getElementById('cnt-hours');

    function updateCountdown() {
      const now  = new Date();
      const diff = weddingDate - now;

      if (diff <= 0) {
        if (daysEl)  daysEl.textContent  = '00';
        if (hoursEl) hoursEl.textContent = '00';
        return;
      }

      const days  = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

      if (daysEl)  daysEl.textContent  = days.toString().padStart(2, '0');
      if (hoursEl) hoursEl.textContent = hours.toString().padStart(2, '0');
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  // ── 3. RIPPLE EFFECT ON BUTTONS ───────────────────────
  function initRippleEffects() {
    const rippleTargets = document.querySelectorAll('.btn-call, .btn-wa, .map-btn');

    // Inject ripple keyframe once
    const style = document.createElement('style');
    style.textContent = `
      @keyframes ripple {
        from { transform: scale(1); opacity: 0.6; }
        to   { transform: scale(30); opacity: 0; }
      }
    `;
    document.head.appendChild(style);

    rippleTargets.forEach(btn => {
      btn.style.position = 'relative';
      btn.style.overflow = 'hidden';

      btn.addEventListener('click', (e) => {
        const ripple = document.createElement('span');
        const rect   = btn.getBoundingClientRect();

        Object.assign(ripple.style, {
          position:     'absolute',
          width:        '20px',
          height:       '20px',
          borderRadius: '50%',
          background:   'rgba(255,255,255,0.5)',
          pointerEvents:'none',
          animation:    'ripple 0.6s ease-out forwards',
          left: `${e.clientX - rect.left - 10}px`,
          top:  `${e.clientY - rect.top  - 10}px`,
        });

        btn.appendChild(ripple);
        setTimeout(() => ripple.remove(), 650);
      });
    });
  }

  // ── 4. SCROLL-SNAP KEYBOARD SUPPORT ──────────────────
  function initKeyboardNavigation() {
    const screens = document.querySelectorAll(
      '.screen-hero, .screen-names, .screen-date, .screen-venue, .screen-blessing'
    );
    let currentScreen = 0;

    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        currentScreen = Math.min(currentScreen + 1, screens.length - 1);
        screens[currentScreen].scrollIntoView({ behavior: 'smooth' });
      }
      if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        currentScreen = Math.max(currentScreen - 1, 0);
        screens[currentScreen].scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // Note: Les observers et compteurs seront initiés après la transition
  // Pour éviter les erreurs, on initialise les fonctions mais elles attendront
  // que les éléments existent dans le DOM
});
