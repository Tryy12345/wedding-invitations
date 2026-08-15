document.addEventListener('DOMContentLoaded', () => {

  // ─── 1. NAMES APPEAR AT 5 s (sync with video) ───
  const video = document.getElementById('heroVideo');
  const namesBlock = document.getElementById('namesBlock');

  const showNames = () => {
    if (namesBlock) namesBlock.classList.add('visible');
    if (video) video.removeEventListener('timeupdate', onTimeUpdate);
  };

  const onTimeUpdate = () => {
    if (video && video.currentTime >= 5) showNames();
  };

  if (video) {
    video.addEventListener('timeupdate', onTimeUpdate);
    // Fallback if video error
    video.addEventListener('error', () => {
      setTimeout(showNames, 5500);
    });
  } else {
    // No video (dev mode)
    setTimeout(showNames, 5500);
  }

  // ─── 2. SCROLL REVEAL for sections ───
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    }
  );
  reveals.forEach(el => observer.observe(el));

  // ─── 3. GALLERY IMAGES WITH TILT ANIMATION ON SCROLL ───
  const framedImages = document.querySelectorAll('.framed-image');
  
  const imageObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const imgCard = entry.target;
          imgCard.classList.add('in-frame');
          imageObserver.unobserve(imgCard);
        }
      });
    },
    {
      threshold: 0.25,
      rootMargin: '0px 0px -30px 0px'
    }
  );
  
  framedImages.forEach((img, index) => {
    const randomDelay = Math.random() * 0.2;
    img.style.transitionDelay = `${randomDelay}s`;
    imageObserver.observe(img);
  });

  // ─── 4. HIDE SCROLL HINT ON SCROLL ───
  const scrollHint = document.getElementById('scrollHint');
  if (scrollHint) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 80) {
        scrollHint.style.opacity = '0';
        scrollHint.style.transition = 'opacity 0.5s';
      }
    }, { passive: true });
  }

  // ─── 5. LIGHT PARALLAX ON HERO VIDEO ───
  const videoWrap = document.querySelector('.video-wrap');
  if (videoWrap) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      videoWrap.style.transform = `translateY(${y * 0.35}px)`;
    }, { passive: true });
  }

  // ─── 6. BLACK WIDOW THEME - ADD RED GLOW EFFECT ON SCROLL ───
  const sections = document.querySelectorAll('.info-section');
  window.addEventListener('scroll', () => {
    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight - 100 && rect.bottom > 100;
      if (isVisible) {
        section.style.boxShadow = 'inset 0 0 30px rgba(139,0,0,0.08)';
      } else {
        section.style.boxShadow = 'none';
      }
    });
  });
});