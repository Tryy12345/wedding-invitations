// ─── ENVELOPE OPEN ───────────────────────────────────────────────
function openEnvelope() {
  const envelope = document.getElementById('envelope');
  const envelopeScreen = document.getElementById('envelopeScreen');
  const invitation = document.getElementById('invitation');
  const hint = document.getElementById('envHint');

  if (envelope.classList.contains('open')) return;

  // 1. Flip flap open
  envelope.classList.add('open');
  if (hint) hint.style.opacity = '0';

  // 2. After flap opens, fade out envelope screen & reveal invitation
  setTimeout(() => {
    envelopeScreen.classList.add('hidden');
    invitation.classList.add('visible');
    
    // Show the couple image with animation after envelope opens
    const coupleImage = document.getElementById('heroCoupleImage');
    if (coupleImage) {
      coupleImage.classList.add('show');
    }
    
    document.body.style.overflow = 'auto';
  }, 700);
}

// Prevent scroll while envelope is shown
document.body.style.overflow = 'hidden';

// ─── SCROLL REVEAL ────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {

  // Reveal sections on scroll
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
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );
  reveals.forEach(el => observer.observe(el));

  // ─── GALLERY ANIMATION ───────────────────────────────────────────
  const framedImages = document.querySelectorAll('.framed-image');
  const imageObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-frame');
          imageObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2, rootMargin: '0px 0px -30px 0px' }
  );

  framedImages.forEach((img, index) => {
    img.style.transitionDelay = `${index * 0.12}s`;
    imageObserver.observe(img);
  });

  // ─── TIMELINE HOVER (RTL direction) ──────────────────────────────
  const timelineItems = document.querySelectorAll('.timeline-item');
  timelineItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
      item.style.transform = 'translateX(-10px)';
      item.style.transition = 'transform 0.3s ease';
    });
    item.addEventListener('mouseleave', () => {
      item.style.transform = 'translateX(0)';
    });
  });

  // ─── RSVP HEART HOVER ────────────────────────────────────────────
  const rsvpBtn = document.querySelector('.rsvp-btn');
  if (rsvpBtn) {
    rsvpBtn.addEventListener('mouseenter', () => {
      const heart = document.querySelector('.heart-divider');
      if (heart) {
        heart.style.transform = 'scale(1.2)';
        heart.style.transition = 'transform 0.3s ease';
      }
    });
    rsvpBtn.addEventListener('mouseleave', () => {
      const heart = document.querySelector('.heart-divider');
      if (heart) heart.style.transform = 'scale(1)';
    });
  }
});