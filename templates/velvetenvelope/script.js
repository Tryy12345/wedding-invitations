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
  const weddingDate = new Date(2027, 2, 23, 14, 0, 0); // 23 March 2027 at 14:00
  const daysEl      = document.getElementById('cnt-days');
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

});
