(function () {
  var intro = document.getElementById('blIntro');
  if (!intro) return;

  function openIntro() {
    intro.classList.add('open');
    intro.removeEventListener('click', openIntro);
    window.setTimeout(function () {
      intro.style.display = 'none';
    }, 1600);
  }

  intro.addEventListener('click', openIntro);
  intro.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openIntro();
    }
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
  }, { threshold: 0.2, rootMargin: '0px 0px -60px 0px' });

  revealItems.forEach(function (item) { observer.observe(item); });
})();

(function () {
  var weddingDate = new Date('2026-07-24T19:00:00');
  var daysEl = document.getElementById('cDays');
  var hoursEl = document.getElementById('cHours');
  var minutesEl = document.getElementById('cMinutes');
  var secondsEl = document.getElementById('cSeconds');
  if (!daysEl) return;

  function pad(v) { return String(v).padStart(2, '0'); }

  function tick() {
    var diff = weddingDate - new Date();
    if (diff <= 0) {
      daysEl.textContent = '00'; hoursEl.textContent = '00';
      minutesEl.textContent = '00'; secondsEl.textContent = '00';
      return;
    }
    var totalSeconds = Math.floor(diff / 1000);
    var seconds = totalSeconds % 60;
    var totalMinutes = Math.floor(totalSeconds / 60);
    var minutes = totalMinutes % 60;
    var totalHours = Math.floor(totalMinutes / 60);
    var hours = totalHours % 24;
    var days = Math.floor(totalHours / 24);

    daysEl.textContent = pad(days);
    hoursEl.textContent = pad(hours);
    minutesEl.textContent = pad(minutes);
    secondsEl.textContent = pad(seconds);
  }

  tick();
  window.setInterval(tick, 1000);
})();

(function () {
  var celebrate = document.getElementById('blCelebrate');
  var foil = document.getElementById('blFoil');
  var canvas = document.getElementById('blHearts');
  if (!celebrate || !foil || !canvas) return;

  var ctx = canvas.getContext('2d');
  var hearts = [];
  var raf = null;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  function spawnHearts(originX, originY) {
    for (var i = 0; i < 26; i++) {
      var angle = Math.random() * Math.PI * 2;
      var speed = 2 + Math.random() * 4;
      hearts.push({
        x: originX, y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3,
        size: 10 + Math.random() * 14,
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.2,
        life: 1,
        color: Math.random() > 0.5 ? '#e8909c' : '#f4c2cd'
      });
    }
    if (!raf) raf = requestAnimationFrame(step);
  }

  function drawHeart(h) {
    ctx.save();
    ctx.translate(h.x, h.y);
    ctx.rotate(h.rot);
    ctx.globalAlpha = Math.max(h.life, 0);
    ctx.fillStyle = h.color;
    var s = h.size;
    ctx.beginPath();
    ctx.moveTo(0, s * 0.3);
    ctx.bezierCurveTo(-s, -s * 0.6, -s * 1.6, s * 0.5, 0, s * 1.2);
    ctx.bezierCurveTo(s * 1.6, s * 0.5, s, -s * 0.6, 0, s * 0.3);
    ctx.fill();
    ctx.restore();
  }

  function step() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    hearts.forEach(function (h) {
      h.x += h.vx;
      h.y += h.vy;
      h.vy += 0.08;
      h.rot += h.vr;
      h.life -= 0.012;
      drawHeart(h);
    });
    hearts = hearts.filter(function (h) { return h.life > 0; });
    if (hearts.length) {
      raf = requestAnimationFrame(step);
    } else {
      raf = null;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  foil.addEventListener('click', function () {
    celebrate.classList.add('opened');
    var rect = foil.getBoundingClientRect();
    spawnHearts(rect.left + rect.width / 2, rect.top + rect.height / 2);
  });
})();

(function () {
  var form = document.querySelector('.bl-rsvp-form');
  if (!form) return;

  var choices = form.querySelectorAll('.bl-choice');
  var nameInput = form.querySelector('#rsvp-name');
  var submit = form.querySelector('.bl-submit');
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
    submit.querySelector('span').textContent = 'Merci !';
    submit.disabled = true;
  });
})();

(function () {
  var btn = document.getElementById('blMusic');
  var audio = document.getElementById('blAudio');
  if (!btn || !audio) return;

  btn.addEventListener('click', function () {
    if (audio.paused) {
      audio.play().catch(function () {});
      btn.classList.add('playing');
      btn.setAttribute('aria-pressed', 'true');
    } else {
      audio.pause();
      btn.classList.remove('playing');
      btn.setAttribute('aria-pressed', 'false');
    }
  });
})();
