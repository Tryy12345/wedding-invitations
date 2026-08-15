/* ============================================================
   GARDENWED – JavaScript
   - Countdown timer
   - Venue day tabs
   - FAQ accordion
   ============================================================ */

/* ---- COUNTDOWN ---- */
(function () {
  const weddingDate = new Date('2027-03-23T14:00:00');
  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');

  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  function pad(n, len) {
    return String(n).padStart(len || 2, '0');
  }

  function updateTimer() {
    const now  = new Date();
    const diff = weddingDate - now;

    if (diff <= 0) {
      daysEl.textContent = '000';
      hoursEl.textContent = '00';
      minutesEl.textContent = '00';
      secondsEl.textContent = '00';
      return;
    }

    const totalSec = Math.floor(diff / 1000);
    const secs     = totalSec % 60;
    const totalMin = Math.floor(totalSec / 60);
    const mins     = totalMin % 60;
    const totalHrs = Math.floor(totalMin / 60);
    const hrs      = totalHrs % 24;
    const days     = Math.floor(totalHrs / 24);

    daysEl.textContent = pad(days, 3);
    hoursEl.textContent = pad(hrs);
    minutesEl.textContent = pad(mins);
    secondsEl.textContent = pad(secs);
  }

  updateTimer();
  setInterval(updateTimer, 1000);
})();

/* ---- SCROLL REVEAL ---- */
(function () {
  const revealItems = document.querySelectorAll('.reveal-on-scroll');
  if (!revealItems.length) return;

  if (!('IntersectionObserver' in window)) {
    revealItems.forEach(function (item) {
      item.classList.add('is-visible');
    });
    return;
  }

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.25,
    rootMargin: '0px 0px -40px 0px'
  });

  revealItems.forEach(function (item, index) {
    item.style.transitionDelay = `${Math.min(index * 120, 480)}ms`;
    observer.observe(item);
  });
})();

/* ---- VENUE TABS ---- */
(function () {
  const tabs = document.querySelectorAll('.venue-tab');
  const day1 = document.getElementById('venue-day1');
  const day2 = document.getElementById('venue-day2');

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      tabs.forEach(function (t) { t.classList.remove('active'); });
      tab.classList.add('active');

      const day = tab.getAttribute('data-day');
      if (day === '1') {
        day1.classList.remove('hidden');
        day2.classList.add('hidden');
      } else {
        day2.classList.remove('hidden');
        day1.classList.add('hidden');
      }
    });
  });
})();

/* ---- FAQ ACCORDION ---- */
(function () {
  const questions = document.querySelectorAll('.faq-question');

  questions.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      const answer   = btn.nextElementSibling;

      // Close all
      questions.forEach(function (q) {
        q.setAttribute('aria-expanded', 'false');
        q.nextElementSibling.classList.remove('open');
      });

      // Toggle clicked
      if (!expanded) {
        btn.setAttribute('aria-expanded', 'true');
        answer.classList.add('open');
      }
    });
  });
})();

/* ---- RSVP FORM (basic validation) ---- */
(function () {
  const btn = document.querySelector('.btn-rsvp');
  if (!btn) return;

  btn.addEventListener('click', function () {
    const name  = document.querySelector('.rsvp-input[placeholder="Your full name"]');
    const email = document.querySelector('.rsvp-input[placeholder="Your email"]');
    const radio = document.querySelector('input[name="attendance"]:checked');

    if (!name.value.trim() || !email.value.trim() || !radio) {
      alert('Please fill in your name, email and attendance.');
      return;
    }

    // Replace this block with your actual backend / Supabase call
    btn.textContent = '✓ RSVP Sent!';
    btn.disabled    = true;
    btn.style.opacity = '0.7';
  });
})();
