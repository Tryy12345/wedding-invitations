(function () {
  var intro = document.getElementById('rwIntro');
  if (!intro) return;

  function openIntro() {
    intro.classList.add('open');
    intro.removeEventListener('click', openIntro);
    window.setTimeout(function () { intro.style.display = 'none'; }, 700);
  }

  intro.addEventListener('click', openIntro);
  intro.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openIntro(); }
  });
})();

(function () {
  var revealItems = document.querySelectorAll('[data-reveal]');
  if (!revealItems.length) return;

  if (!('IntersectionObserver' in window)) {
    revealItems.forEach(function (item) { item.classList.add('is-in'); });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.18, rootMargin: '0px 0px -60px 0px' });

  revealItems.forEach(function (item) { observer.observe(item); });
})();

(function () {
  var weddingDate = new Date('2026-08-15T16:00:00');
  var d = document.getElementById('cdDays');
  var h = document.getElementById('cdHours');
  var m = document.getElementById('cdMinutes');
  var s = document.getElementById('cdSeconds');
  if (!d) return;

  function pad(v) { return String(v).padStart(2, '0'); }

  function tick() {
    var diff = weddingDate - new Date();
    if (diff <= 0) {
      d.textContent = '00'; h.textContent = '00'; m.textContent = '00'; s.textContent = '00';
      return;
    }
    var totalSeconds = Math.floor(diff / 1000);
    var seconds = totalSeconds % 60;
    var totalMinutes = Math.floor(totalSeconds / 60);
    var minutes = totalMinutes % 60;
    var totalHours = Math.floor(totalMinutes / 60);
    var hours = totalHours % 24;
    var days = Math.floor(totalHours / 24);

    d.textContent = pad(days);
    h.textContent = pad(hours);
    m.textContent = pad(minutes);
    s.textContent = pad(seconds);
  }

  tick();
  window.setInterval(tick, 1000);
})();

(function () {
  var openBtn = document.getElementById('rwRsvpOpen');
  var panel = document.getElementById('rwRsvpPanel');
  if (!openBtn || !panel) return;

  openBtn.addEventListener('click', function () {
    panel.hidden = !panel.hidden;
    openBtn.style.display = panel.hidden ? 'inline-block' : 'none';
  });

  var form = panel.querySelector('.rw-rsvp-form');
  var choices = form.querySelectorAll('.rw-choice');
  var nameInput = form.querySelector('#rsvp-name');
  var submit = form.querySelector('.rw-submit');
  var selected = null;

  choices.forEach(function (btn) {
    btn.addEventListener('click', function () {
      choices.forEach(function (b) { b.classList.remove('selected'); });
      btn.classList.add('selected');
      selected = btn.getAttribute('data-choice');
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!selected || !nameInput.value.trim()) {
      nameInput.reportValidity && nameInput.reportValidity();
      return;
    }
    submit.textContent = 'Merci !';
    submit.disabled = true;
  });
})();

(function () {
  var btn = document.getElementById('rwAudioToggle');
  var audio = document.getElementById('rwAudio');
  if (!btn || !audio) return;

  btn.addEventListener('click', function () {
    if (!audio.src) return;
    if (audio.paused) {
      audio.play().catch(function () {});
      btn.textContent = '❚❚';
    } else {
      audio.pause();
      btn.textContent = '►';
    }
  });
})();
