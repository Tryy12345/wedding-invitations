document.addEventListener('DOMContentLoaded', () => {

  /* ─────────────────────────────────────────────────
     ELEMENT REFERENCES
  ───────────────────────────────────────────────── */
  const video        = document.getElementById('heroVideo');
  const namesBlock   = document.getElementById('namesBlock');
  const scrollHint   = document.getElementById('scrollHint');
  const clickOverlay = document.getElementById('clickOverlay');
  const videoWrap    = document.querySelector('.video-wrap');

  /* ─────────────────────────────────────────────────
     STEP 1 — CLICK TO START
  ───────────────────────────────────────────────── */
  let videoStarted = false;

  function startExperience() {
    if (videoStarted) return;
    videoStarted = true;

    // Hide play overlay
    clickOverlay.classList.add('hidden');

    // Start video (user gesture required by browsers)
    if (video) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Blocked — video stays static, still fine
        });
      }
    }

    /* ─────────────────────────────────────────────
       STEP 2 — after 4 seconds: show names + unlock scroll
    ───────────────────────────────────────────── */
    setTimeout(() => {
      namesBlock.classList.add('visible');
      document.body.classList.add('scroll-enabled');
      scrollHint.classList.add('visible');
    }, 4000);
  }

  if (clickOverlay) {
    clickOverlay.addEventListener('click', startExperience);
  }

  /* ─────────────────────────────────────────────────
     HIDE SCROLL HINT WHEN USER SCROLLS
  ───────────────────────────────────────────────── */
  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      scrollHint.classList.remove('visible');
      scrollHint.classList.add('fade-out');
    }
  }, { passive: true });

  /* ─────────────────────────────────────────────────
     HERO PARALLAX
  ───────────────────────────────────────────────── */
  if (videoWrap) {
    window.addEventListener('scroll', () => {
      videoWrap.style.transform = `translateY(${window.scrollY * 0.35}px)`;
    }, { passive: true });
  }

  /* ─────────────────────────────────────────────────
     SCROLL REVEAL — .reveal elements
  ───────────────────────────────────────────────── */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* ─────────────────────────────────────────────────
     GALLERY ENTRANCE ANIMATION
  ───────────────────────────────────────────────── */
  const imageObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-frame');
          imageObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.25, rootMargin: '0px 0px -30px 0px' }
  );

  document.querySelectorAll('.framed-image').forEach((img, i) => {
    img.style.transitionDelay = `${i * 0.12}s`;
    imageObserver.observe(img);
  });

  /* ─────────────────────────────────────────────────
     COUNTDOWN — days, hours, minutes & seconds until wedding
     Change the date here to match the real wedding date
  ───────────────────────────────────────────────── */
  const weddingDate = new Date(2026, 9, 11, 18, 30, 0); // 11 October 2026 at 18:30  const daysEl      = document.getElementById('cnt-days');
  const hoursEl     = document.getElementById('cnt-hours');
  const minutesEl   = document.getElementById('cnt-minutes');
  const secondsEl   = document.getElementById('cnt-seconds');

  function updateCountdown() {
    if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;
    const diff = weddingDate - new Date();

    if (diff <= 0) {
      daysEl.textContent  = '000';
      hoursEl.textContent = '00';
      minutesEl.textContent = '00';
      secondsEl.textContent = '00';
      return;
    }

    const days  = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    daysEl.textContent  = days.toString().padStart(3, '0');
    hoursEl.textContent = hours.toString().padStart(2, '0');
    minutesEl.textContent = minutes.toString().padStart(2, '0');
    secondsEl.textContent = seconds.toString().padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1_000);

  /* ─────────────────────────────────────────────────
     SAVE THE DATE — scratch cards
  ───────────────────────────────────────────────── */
  const scratchCards = document.querySelectorAll('.eya-date-card[data-eya-scratch]');
  const saveDateSection = document.querySelector('.eya-save-date');

  if (scratchCards.length) {
    let clearedCount = 0;

    scratchCards.forEach((card) => {
      const canvas = card.querySelector('canvas');
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      let drawing = false;
      let cleared = false;
      let scratchPath = null;
      let cssWidth = 0;
      let cssHeight = 0;



      function createHeartPath(width, height, scale = 1) {
        const path = new Path2D();
        const w = width * scale;
        const h = height * scale;
        const ox = (width - w) / 2;
        const oy = (height - h) / 2;
        const X = p => ox + w * p;
        const Y = p => oy + h * p;

        path.moveTo(X(0.5), Y(0.92));
        path.bezierCurveTo(X(0.18), Y(0.72), X(0.05), Y(0.52), X(0.08), Y(0.32));
        path.bezierCurveTo(X(0.11), Y(0.12), X(0.29), Y(0.02), X(0.43), Y(0.16));
        path.bezierCurveTo(X(0.47), Y(0.20), X(0.49), Y(0.25), X(0.5), Y(0.30));
        path.bezierCurveTo(X(0.51), Y(0.25), X(0.53), Y(0.20), X(0.57), Y(0.16));
        path.bezierCurveTo(X(0.71), Y(0.02), X(0.89), Y(0.12), X(0.92), Y(0.32));
        path.bezierCurveTo(X(0.95), Y(0.52), X(0.82), Y(0.72), X(0.5), Y(0.92));
        path.closePath();

        return path;
      }

      function paintCoat() {
        ctx.globalCompositeOperation = 'source-over';
        ctx.clearRect(0, 0, cssWidth, cssHeight);

        const gradient = ctx.createLinearGradient(0, 0, cssWidth, cssHeight);
        gradient.addColorStop(0, '#fbf8f2');
        gradient.addColorStop(0.55, '#f2ece0');
        gradient.addColorStop(1, '#e5dbc9');

        ctx.save();
        ctx.clip(scratchPath);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, cssWidth, cssHeight);
        ctx.restore();
      }

      function sizeCanvas() {
        const rect = card.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;

        cssWidth = rect.width;
        cssHeight = rect.height;
        canvas.width = Math.round(cssWidth * dpr);
        canvas.height = Math.round(cssHeight * dpr);
        canvas.style.width = `${cssWidth}px`;
        canvas.style.height = `${cssHeight}px`;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        scratchPath = createHeartPath(cssWidth, cssHeight, 0.62);
        if (!cleared) paintCoat();
      }

      function scratchAt(x, y) {
        if (!scratchPath || !ctx.isPointInPath(scratchPath, x, y)) return;

        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(x, y, Math.max(8, cssWidth * 0.06), 0, Math.PI * 2);
        ctx.fill();
      }

      function checkCleared() {
        if (cleared || !canvas.width || !canvas.height || !cssWidth || !cssHeight) return;

        if (!scratchPath) return;

        const image = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = image.data;
        let transparent = 0;
        let scratchable = 0;

        const dpr = window.devicePixelRatio || 1;

        for (let y = 0; y < cssHeight; y += 4) {
          for (let x = 0; x < cssWidth; x += 4) {
            if (!ctx.isPointInPath(scratchPath, x, y)) continue;

            scratchable++;
            const pixelX = Math.min(canvas.width - 1, Math.round(x * dpr));
            const pixelY = Math.min(canvas.height - 1, Math.round(y * dpr));
            const alphaIndex = ((pixelY * canvas.width + pixelX) * 4) + 3;
            if (data[alphaIndex] < 40) transparent++;
          }
        }

        if (scratchable && transparent / scratchable > 0.55) {
          cleared = true;
          card.classList.add('cleared');
          clearedCount++;

          if (clearedCount >= scratchCards.length && saveDateSection) {
            saveDateSection.classList.add('cards-done');
          }
        }
      }

      function pointerPosition(event) {
        const rect = canvas.getBoundingClientRect();
        return {
          x: event.clientX - rect.left,
          y: event.clientY - rect.top
        };
      }

      canvas.addEventListener('pointerdown', (event) => {
        drawing = true;
        canvas.setPointerCapture?.(event.pointerId);
        const position = pointerPosition(event);
        scratchAt(position.x, position.y);
      });

      canvas.addEventListener('pointermove', (event) => {
        if (!drawing) return;
        const position = pointerPosition(event);
        scratchAt(position.x, position.y);
        checkCleared();
      });

      canvas.addEventListener('pointerup', () => {
        drawing = false;
        checkCleared();
      });

      canvas.addEventListener('pointercancel', () => {
        drawing = false;
      });

      if ('ResizeObserver' in window) {
        new ResizeObserver(sizeCanvas).observe(card);
      } else {
        window.addEventListener('resize', sizeCanvas);
      }

      sizeCanvas();
    });
  }

  /* ─────────────────────────────────────────────────
     INVITATION CARD — subtle entrance shimmer
  ───────────────────────────────────────────────── */
  const cardSection = document.getElementById('invitationCard');
  if (cardSection) {
    const cardObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Stagger child elements for a graceful entrance
            const children = entry.target.querySelectorAll(
              '.diwani-top, .families-row, .invite-body-text, .couple-visual-row, .blessing-line, .datetime-block, .venue-block, .welcome-note, .mixed-note, .children-note'
            );
            children.forEach((child, i) => {
              child.style.opacity    = '0';
              child.style.transform  = 'translateY(20px)';
              child.style.transition = `opacity 0.7s ease ${0.15 + i * 0.1}s, transform 0.7s ease ${0.15 + i * 0.1}s`;
              // Force reflow
              child.getBoundingClientRect();
              child.style.opacity   = '1';
              child.style.transform = 'translateY(0)';
            });
            cardObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );
    cardObserver.observe(cardSection);
  }


    /* ─────────────────────────────────────────────────
     PROGRAMME — reveal + liane animée
  ───────────────────────────────────────────────── */
  (function () {
    const revealEls = document.querySelectorAll('.reveal-step');
    const timeline  = document.getElementById('programTimeline');
    if (!revealEls.length && !timeline) return;

    if (!('IntersectionObserver' in window)) {
      revealEls.forEach(el => el.classList.add('is-visible'));
      if (timeline) timeline.classList.add('is-visible');
      return;
    }

    document.body.classList.add('js-timeline-ready');

    if (revealEls.length) {
      const stepObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          stepObserver.unobserve(entry.target);
        });
      }, { threshold: 0.18, rootMargin: '0px 0px -48px 0px' });

      revealEls.forEach((item, i) => {
        item.style.transitionDelay = `${Math.min(i * 90, 360)}ms`;
        stepObserver.observe(item);
      });
    }

    if (timeline) {
      const vineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          timeline.classList.add('is-visible');
          vineObserver.unobserve(timeline);
        });
      }, { threshold: 0.25, rootMargin: '0px 0px -80px 0px' });

      vineObserver.observe(timeline);
    }
  })();
});
