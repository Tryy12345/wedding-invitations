(function () {
  var intro = document.getElementById('cnIntro');
  if (!intro) return;

  function openIntro() {
    intro.classList.add('open-env');
    intro.removeEventListener('click', openIntro);
    window.setTimeout(function () {
      intro.style.display = 'none';
    }, 2600);
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
  var sections = document.querySelectorAll('[data-observe]');
  if (!sections.length) return;

  if (!('IntersectionObserver' in window)) {
    sections.forEach(function (s) { s.classList.add('is-in'); });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.22, rootMargin: '0px 0px -60px 0px' });

  sections.forEach(function (s) { observer.observe(s); });
})();

(function () {
  var cards = document.querySelectorAll('.cn-dcard[data-scratch]');
  var dateSection = document.querySelector('.cn-date');
  if (!cards.length) return;

  var clearedCount = 0;

  cards.forEach(function (card) {
    var canvas = card.querySelector('canvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var drawing = false;
    var cleared = false;

    function size() {
      var rect = card.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      paintCoat();
    }

    function paintCoat() {
      ctx.globalCompositeOperation = 'source-over';
      var grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      grad.addColorStop(0, '#c9d3ea');
      grad.addColorStop(1, '#8ea6d8');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(255,255,255,.5)';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Grattez ici', canvas.width / 2, canvas.height / 2);
    }

    function scratchAt(x, y) {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, 16, 0, Math.PI * 2);
      ctx.fill();
    }

    function checkCleared() {
      if (cleared) return;
      var data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      var transparent = 0;
      var total = data.length / 4;
      for (var i = 3; i < data.length; i += 4 * 8) {
        if (data[i] < 40) transparent++;
      }
      if (transparent / (total / 8) > 0.55) {
        cleared = true;
        card.classList.add('cleared');
        clearedCount++;
        if (clearedCount >= cards.length && dateSection) {
          dateSection.classList.add('cards-done');
        }
      }
    }

    function pointerPos(e) {
      var rect = canvas.getBoundingClientRect();
      var clientX = e.touches ? e.touches[0].clientX : e.clientX;
      var clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return { x: clientX - rect.left, y: clientY - rect.top };
    }

    function start(e) {
      drawing = true;
      var p = pointerPos(e);
      scratchAt(p.x, p.y);
    }
    function move(e) {
      if (!drawing) return;
      var p = pointerPos(e);
      scratchAt(p.x, p.y);
      checkCleared();
    }
    function end() {
      drawing = false;
      checkCleared();
    }

    canvas.addEventListener('pointerdown', start);
    canvas.addEventListener('pointermove', move);
    window.addEventListener('pointerup', end);
    canvas.addEventListener('touchstart', start, { passive: true });
    canvas.addEventListener('touchmove', move, { passive: true });
    window.addEventListener('touchend', end);

    window.addEventListener('resize', size);
    size();
  });
})();

(function () {
  var form = document.querySelector('.cn-rsvp-form');
  if (!form) return;

  var choices = form.querySelectorAll('.cn-choice');
  var nameInput = form.querySelector('#rsvp-name');
  var submit = form.querySelector('.cn-submit');
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
  var btn = document.getElementById('cnMusic');
  var audio = document.getElementById('cnAudio');
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
