(function () {
  var intro = document.getElementById('hmIntro');
  if (!intro) return;

  function openIntro() {
    intro.classList.add('open');
    intro.removeEventListener('click', openIntro);
    window.setTimeout(function () { intro.style.display = 'none'; }, 1600);
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
  }, { threshold: 0.2, rootMargin: '0px 0px -60px 0px' });

  revealItems.forEach(function (item) { observer.observe(item); });
})();

(function () {
  var weddingDate = new Date('2026-08-22T17:00:00');
  var d = document.getElementById('cdDays');
  var h = document.getElementById('cdHours');
  var m = document.getElementById('cdMinutes');
  if (!d) return;

  function pad(v) { return String(v).padStart(2, '0'); }

  function tick() {
    var diff = weddingDate - new Date();
    if (diff <= 0) {
      d.textContent = '00'; h.textContent = '00'; m.textContent = '00';
      return;
    }
    var totalMinutes = Math.floor(diff / 60000);
    var minutes = totalMinutes % 60;
    var totalHours = Math.floor(totalMinutes / 60);
    var hours = totalHours % 24;
    var days = Math.floor(totalHours / 24);

    d.textContent = pad(days);
    h.textContent = pad(hours);
    m.textContent = pad(minutes);
  }

  tick();
  window.setInterval(tick, 1000);
})();

(function () {
  var celebrate = document.getElementById('hmCelebrate');
  var foil = document.getElementById('hmFoil');
  var canvas = document.getElementById('hmBurst');
  if (!celebrate || !foil || !canvas) return;

  var ctx = canvas.getContext('2d');
  var particles = [];
  var raf = null;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  function spawn(originX, originY) {
    var colors = ['#c6a667', '#1c50a3', '#3a6bc0', '#ead9a6'];
    for (var i = 0; i < 30; i++) {
      var angle = Math.random() * Math.PI * 2;
      var speed = 2 + Math.random() * 4;
      particles.push({
        x: originX, y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3,
        size: 5 + Math.random() * 6,
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.3,
        life: 1,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
    if (!raf) raf = requestAnimationFrame(step);
  }

  function step() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(function (p) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.1;
      p.rot += p.vr;
      p.life -= 0.014;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = Math.max(p.life, 0);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      ctx.restore();
    });
    particles = particles.filter(function (p) { return p.life > 0; });
    if (particles.length) {
      raf = requestAnimationFrame(step);
    } else {
      raf = null;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  foil.addEventListener('click', function () {
    celebrate.classList.add('opened');
    var rect = foil.getBoundingClientRect();
    spawn(rect.left + rect.width / 2, rect.top + rect.height / 2);
  });
})();

(function () {
  var form = document.querySelector('.hm-rsvp-form');
  if (!form) return;

  var choices = form.querySelectorAll('.hm-choice');
  var nameInput = form.querySelector('#rsvp-name');
  var submit = form.querySelector('.hm-submit');
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
  var btn = document.getElementById('hmMusic');
  var audio = document.getElementById('hmAudio');
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
