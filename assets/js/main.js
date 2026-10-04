/* Keysquare website scripts */
(function () {
  'use strict';

  /* ------------------------------------------------------------------
     Contact form endpoint.
     Leave empty to show an on-page confirmation only.
     Set to a form-handling URL (your own server script, or a service
     such as Formspree / Getform / Web3Forms) to receive submissions.
     ------------------------------------------------------------------ */
  var FORM_ENDPOINT = '';

  /* ---------- mobile menu ---------- */
  var header = document.getElementById('top');
  var menuBtn = document.getElementById('menuBtn');
  if (header && menuBtn) {
    menuBtn.addEventListener('click', function () {
      var open = header.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  /* ---------- footer year ---------- */
  var yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---------- hero map ---------- */
  var cv = document.getElementById('heroMap');
  if (cv) {
    var ctx = cv.getContext('2d');
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var tok = function (n) { return getComputedStyle(document.documentElement).getPropertyValue(n).trim(); };
    var toRgb = function (c) {
      var el = document.createElement('div'); el.style.color = c; document.body.appendChild(el);
      var m = getComputedStyle(el).color.match(/\d+(\.\d+)?/g); el.remove();
      return m ? m.slice(0, 3).map(Number) : [0, 0, 0];
    };
    var blobs = [[.34, .42, .16, 1], [.62, .58, .13, .85], [.72, .28, .1, .6], [.2, .75, .12, .55], [.5, .82, .09, .4], [.86, .7, .1, .5]];
    var field = function (x, y) {
      var v = 0;
      blobs.forEach(function (b) { var dx = x - b[0], dy = y - b[1]; v += b[3] * Math.exp(-(dx * dx + dy * dy) / (2 * b[2] * b[2])); });
      return Math.min(1, v);
    };
    var t0 = performance.now(), raf = null, visible = true;

    var drawMap = function () {
      var W = cv.width, H = cv.height;
      var c0 = toRgb(tok('--heat0')), c1 = toRgb(tok('--heat1')), road = tok('--road'), bg = tok('--map'),
          sig = tok('--signal'), ink = tok('--ink'), surf = tok('--surface');
      var frame = function (now) {
        var t = (now - t0) / 1000;
        ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
        ctx.strokeStyle = road; ctx.lineCap = 'round';
        [[0, .3, 1, .18, 8], [0, .66, 1, .8, 10], [.42, 0, .5, 1, 9], [.12, 0, .3, 1, 5], [.78, 0, .68, 1, 6], [0, .92, .6, .4, 4]].forEach(function (r) {
          ctx.lineWidth = r[4]; ctx.beginPath(); ctx.moveTo(r[0] * W, r[1] * H);
          ctx.quadraticCurveTo(W * .5 + (r[2] - r[0]) * 40, H * .5 + (r[3] - r[1]) * 30, r[2] * W, r[3] * H); ctx.stroke();
        });
        var R = 22, hw = Math.sqrt(3) * R, scan = reduce ? -1 : ((t * .12) % 1.4) - .2;
        for (var row = -1; row * R * 1.5 < H + R; row++) {
          for (var col = -1; col * hw < W + hw; col++) {
            var cx = col * hw + (row % 2 ? hw / 2 : 0), cy = row * R * 1.5;
            var v = field(cx / W, cy / H);
            if (v < .12) continue;
            var boost = scan >= 0 ? Math.max(0, 1 - Math.abs(cx / W - scan) * 7) * .25 : 0;
            var a = Math.min(1, v + boost);
            var mix = c0.map(function (c, i) { return Math.round(c + (c1[i] - c) * a); });
            ctx.fillStyle = 'rgba(' + mix.join(',') + ',' + (0.35 + 0.6 * v) + ')';
            ctx.beginPath();
            for (var k = 0; k < 6; k++) {
              var ang = Math.PI / 180 * (60 * k - 30);
              var px = cx + (R - 1.5) * Math.cos(ang), py = cy + (R - 1.5) * Math.sin(ang);
              if (k) ctx.lineTo(px, py); else ctx.moveTo(px, py);
            }
            ctx.closePath(); ctx.fill();
          }
        }
        var sx = .36 * W, sy = .44 * H;
        ctx.setLineDash([8, 8]); ctx.lineWidth = 2; ctx.strokeStyle = ink; ctx.globalAlpha = .55;
        ctx.beginPath(); ctx.arc(sx, sy, 150, 0, Math.PI * 2); ctx.stroke(); ctx.globalAlpha = 1; ctx.setLineDash([]);
        ctx.fillStyle = ink;
        [[.55, .3], [.6, .62], [.22, .6], [.8, .45], [.48, .72], [.7, .8], [.15, .3], [.88, .22]].forEach(function (p) { ctx.fillRect(p[0] * W - 5, p[1] * H - 5, 10, 10); });
        [[sx, sy, 1], [.66 * W, .56 * H, 0], [.74 * W, .27 * H, 0]].forEach(function (p) {
          ctx.beginPath(); ctx.arc(p[0], p[1], p[2] ? 13 : 9, 0, Math.PI * 2); ctx.fillStyle = sig; ctx.fill();
          ctx.lineWidth = 3; ctx.strokeStyle = surf; ctx.stroke();
          if (p[2] && !reduce) {
            var pr = (t % 2) / 2; ctx.beginPath(); ctx.arc(p[0], p[1], 13 + pr * 40, 0, Math.PI * 2);
            ctx.strokeStyle = sig; ctx.globalAlpha = 1 - pr; ctx.lineWidth = 2; ctx.stroke(); ctx.globalAlpha = 1;
          }
        });
        ctx.font = '600 22px "Public Sans", sans-serif';
        var lbl = 'Site A', tw = ctx.measureText(lbl).width, lx = sx + 20, ly = sy - 50;
        ctx.fillStyle = surf; ctx.fillRect(lx, ly, tw + 20, 34);
        ctx.strokeStyle = ink; ctx.lineWidth = 1; ctx.globalAlpha = .25; ctx.strokeRect(lx + .5, ly + .5, tw + 19, 33); ctx.globalAlpha = 1;
        ctx.fillStyle = ink; ctx.fillText(lbl, lx + 10, ly + 24);
        if (!reduce && visible) raf = requestAnimationFrame(frame);
      };
      cancelAnimationFrame(raf);
      if (reduce) frame(t0 + 1000); else raf = requestAnimationFrame(frame);
    };

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (e) {
        var was = visible; visible = e[0].isIntersecting;
        if (visible && !was) drawMap();
      }).observe(cv);
    }
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', drawMap);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(drawMap); else drawMap();
  }

  /* ---------- site scorer ---------- */
  var ranks = document.getElementById('ranks');
  if (ranks) {
    var sites = [
      { n: 'Indiranagar, 100 Feet Road', p: '560038', d: 92, c: 38, a: 90, x: 85 },
      { n: 'Whitefield, ITPL Main Road', p: '560066', d: 84, c: 62, a: 78, x: 70 },
      { n: 'Electronic City, Phase 1', p: '560100', d: 76, c: 80, a: 60, x: 66 },
      { n: 'Yelahanka New Town', p: '560064', d: 64, c: 88, a: 58, x: 74 }
    ];
    var keys = ['demand', 'comp', 'afford', 'access'];
    var score = function () {
      var w = {}, sum = 0;
      keys.forEach(function (k) { w[k] = +document.getElementById('w-' + k).value; sum += w[k]; });
      keys.forEach(function (k) { document.getElementById('o-' + k).textContent = (sum ? Math.round(w[k] / sum * 100) : 0) + '%'; });
      var res = sites.map(function (s) {
        return { s: s, v: sum ? Math.round((s.d * w.demand + s.c * w.comp + s.a * w.afford + s.x * w.access) / sum) : 0 };
      }).sort(function (a, b) { return b.v - a.v; });
      ranks.innerHTML = res.map(function (r, i) {
        return '<div class="rank"><span class="n">' + String(i + 1).padStart(2, '0') + '</span><span class="nm">' + r.s.n +
          '<small>PIN ' + r.s.p + '</small></span><span class="bar"><i style="width:' + r.v + '%"></i></span><span class="s">' + r.v + '</span></div>';
      }).join('');
    };
    keys.forEach(function (k) { document.getElementById('w-' + k).addEventListener('input', score); });
    score();
  }

  /* ---------- contact form ---------- */
  var form = document.getElementById('demoForm');
  if (form) {
    var note = document.getElementById('formNote');
    var show = function (msg, isErr) { note.textContent = msg; note.classList.toggle('err', !!isErr); note.hidden = false; };
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = form.name.value.trim(), co = form.company.value.trim(), em = form.email.value.trim();
      if (!name || !co || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em)) {
        show('Please add your name, company and a valid work email.', true); return;
      }
      if (form.website && form.website.value) return; /* spam trap */
      var thanks = 'Thank you, ' + name.split(' ')[0] + '. Our team will contact you within one business day.';
      if (!FORM_ENDPOINT) { show(thanks); form.reset(); return; }
      var btn = form.querySelector('button[type=submit]'); btn.disabled = true;
      fetch(FORM_ENDPOINT, { method: 'POST', headers: { 'Accept': 'application/json' }, body: new FormData(form) })
        .then(function (r) { if (!r.ok) throw new Error(); show(thanks); form.reset(); })
        .catch(function () { show('We could not send your request. Please call us on +91 80008 00546.', true); })
        .then(function () { btn.disabled = false; });
    });
  }

  /* ---------- copy buttons ---------- */
  document.querySelectorAll('[data-copy]').forEach(function (b) {
    b.addEventListener('click', function () {
      var done = function () { b.textContent = 'Copied'; setTimeout(function () { b.textContent = 'Copy'; }, 1600); };
      var fallback = function () {
        var t = document.getElementById(b.getAttribute('data-target'));
        if (!t) return; var r = document.createRange(); r.selectNodeContents(t);
        var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
      };
      try { navigator.clipboard.writeText(b.getAttribute('data-copy')).then(done, fallback); } catch (e) { fallback(); }
    });
  });
})();
