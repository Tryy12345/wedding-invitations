(function () {
  const body = document.body;
  const video = document.getElementById('introVideo');
  const gate = document.getElementById('startGate');
  const names = document.getElementById('heroNames');
  const scrollCue = document.querySelector('.scroll-cue');

  if (!video || !gate || !names) return;

  function unlockInvitation() {
    names.classList.add('is-visible');
    body.classList.remove('intro-locked');
    if (scrollCue) scrollCue.classList.add('is-visible');
  }

  gate.addEventListener('click', function () {
    gate.classList.add('is-hidden');
    video.play().catch(function () {
      unlockInvitation();
    });

    window.setTimeout(unlockInvitation, 6000);
  });
})();

(function () {
  const weddingDate = new Date('2027-03-23T14:00:00');
  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');

  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  function pad(value, length) {
    return String(value).padStart(length || 2, '0');
  }

  function updateCountdown() {
    const diff = weddingDate - new Date();

    if (diff <= 0) {
      daysEl.textContent = '000';
      hoursEl.textContent = '00';
      minutesEl.textContent = '00';
      secondsEl.textContent = '00';
      return;
    }

    const totalSeconds = Math.floor(diff / 1000);
    const seconds = totalSeconds % 60;
    const totalMinutes = Math.floor(totalSeconds / 60);
    const minutes = totalMinutes % 60;
    const totalHours = Math.floor(totalMinutes / 60);
    const hours = totalHours % 24;
    const days = Math.floor(totalHours / 24);

    daysEl.textContent = pad(days, 3);
    hoursEl.textContent = pad(hours);
    minutesEl.textContent = pad(minutes);
    secondsEl.textContent = pad(seconds);
  }

  updateCountdown();
  window.setInterval(updateCountdown, 1000);
})();

(function () {
  const tabs = document.querySelectorAll('.venue-tab');
  const venues = document.querySelectorAll('.venue-card');

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      const target = tab.getAttribute('data-venue');

      tabs.forEach(function (item) {
        item.classList.toggle('active', item === tab);
      });

      venues.forEach(function (venue) {
        venue.classList.toggle('hidden', venue.id !== target);
      });
    });
  });
})();

(function () {
  const revealItems = document.querySelectorAll('.reveal-on-scroll');
  const scheduleList = document.querySelector('.schedule-list');
  if (!revealItems.length) return;

  if (!('IntersectionObserver' in window)) {
    revealItems.forEach(function (item) {
      item.classList.add('is-visible');
    });
    if (scheduleList) scheduleList.classList.add('is-visible');
    return;
  }

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.18,
    rootMargin: '0px 0px -48px 0px'
  });

  revealItems.forEach(function (item, index) {
    item.style.transitionDelay = `${Math.min(index * 90, 360)}ms`;
    observer.observe(item);
  });

  if (scheduleList) {
    const plantObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        scheduleList.classList.add('is-visible');
        plantObserver.unobserve(scheduleList);
      });
    }, {
      threshold: 0.25,
      rootMargin: '0px 0px -80px 0px'
    });

    plantObserver.observe(scheduleList);
  }
})();

(function () {
  const form = document.querySelector('.rsvp-form');
  if (!form) return;

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    const button = form.querySelector('button');
    if (!button) return;

    button.textContent = 'RSVP envoyé';
    button.disabled = true;
  });
})();
