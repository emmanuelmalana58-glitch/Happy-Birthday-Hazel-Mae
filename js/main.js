(function () {
  const C = window.CONFIG;
  const $ = (id) => document.getElementById(id);

  // text
  document.title = `Happy Birthday, ${C.name}! 🌺`;
  $('name').textContent = C.name;
  $('tagline').textContent = C.tagline;

  // twinkling stars
  const sky = $('stars');
  for (let i = 0; i < 70; i++) {
    const s = document.createElement('i');
    s.style.left = Math.random() * 100 + '%';
    s.style.top = Math.random() * 100 + '%';
    s.style.animationDelay = Math.random() * 3 + 's';
    s.style.transform = `scale(${0.6 + Math.random() * 1.4})`;
    sky.appendChild(s);
  }

  // gallery
  const gallery = $('gallery');
  C.photos.forEach((p, i) => {
    const b = document.createElement('button');
    b.className = 'polaroid';
    b.innerHTML = `<img src="${p.src}" alt="${p.caption}" loading="lazy">
      <span class="d">${p.date}</span><span class="c">${p.caption}</span>`;
    b.addEventListener('click', () => openLb(i));
    gallery.appendChild(b);
  });

  // lightbox
  let cur = 0;
  const lb = $('lightbox');
  function show() {
    const p = C.photos[cur];
    $('lbImg').src = p.src;
    $('lbImg').alt = p.caption;
    $('lbCap').textContent = `${p.caption}  ·  ${p.date}`;
  }
  function openLb(i) { cur = i; show(); lb.hidden = false; document.body.style.overflow = 'hidden'; }
  function closeLb() { lb.hidden = true; document.body.style.overflow = ''; }
  const step = (d) => { cur = (cur + d + C.photos.length) % C.photos.length; show(); };
  $('lbClose').onclick = closeLb;
  $('lbPrev').onclick = () => step(-1);
  $('lbNext').onclick = () => step(1);
  lb.addEventListener('click', (e) => { if (e.target === lb) closeLb(); });
  document.addEventListener('keydown', (e) => {
    if (lb.hidden) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'ArrowRight') step(1);
  });

  // wishes
  const box = $('wishBox');
  C.wishes.forEach((w) => {
    const b = document.createElement('button');
    b.className = 'star';
    b.textContent = '⭐';
    b.setAttribute('aria-label', 'Open a birthday wish');
    b.onclick = () => { box.textContent = w; b.classList.add('open'); confetti(40); };
    $('starRow').appendChild(b);
  });

  // countdown
  if (C.birthday) {
    const cd = $('countdown');
    const tick = () => {
      let target = new Date(C.birthday + 'T00:00:00');
      const now = new Date();
      // roll to next year if this year's birthday has passed
      while (target < now - 864e5) target.setFullYear(target.getFullYear() + 1);
      const diff = target - now;
      if (diff <= 0) { cd.hidden = true; $('tagline').textContent = `It's today! Enjoy every second, ${C.name}! 🎂`; return; }
      cd.hidden = false;
      $('cd-d').textContent = Math.floor(diff / 864e5);
      $('cd-h').textContent = Math.floor(diff / 36e5) % 24;
      $('cd-m').textContent = Math.floor(diff / 6e4) % 60;
      $('cd-s').textContent = Math.floor(diff / 1e3) % 60;
    };
    tick(); setInterval(tick, 1000);
  }

  // confetti
  const cv = $('confetti'), ctx = cv.getContext('2d');
  let bits = [], raf = null;
  const colors = ['#7cc4ff', '#2f6fd6', '#7b4fc9', '#ff6fb0', '#ffd3e8', '#ffe27a'];
  const size = () => { cv.width = innerWidth; cv.height = innerHeight; };
  addEventListener('resize', size); size();
  function confetti(n = 150) {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    for (let i = 0; i < n; i++) bits.push({
      x: Math.random() * cv.width, y: -20 - Math.random() * 200,
      vx: (Math.random() - 0.5) * 4, vy: 2 + Math.random() * 4,
      s: 6 + Math.random() * 8, r: Math.random() * 6, vr: (Math.random() - 0.5) * 0.3,
      c: colors[(Math.random() * colors.length) | 0]
    });
    if (!raf) loop();
  }
  function loop() {
    ctx.clearRect(0, 0, cv.width, cv.height);
    bits.forEach((b) => {
      b.x += b.vx; b.y += b.vy; b.r += b.vr;
      ctx.save(); ctx.translate(b.x, b.y); ctx.rotate(b.r);
      ctx.fillStyle = b.c; ctx.fillRect(-b.s / 2, -b.s / 4, b.s, b.s / 2); ctx.restore();
    });
    bits = bits.filter((b) => b.y < cv.height + 20);
    raf = bits.length ? requestAnimationFrame(loop) : null;
    if (!raf) ctx.clearRect(0, 0, cv.width, cv.height);
  }
  $('party').onclick = () => confetti(220);
  setTimeout(() => confetti(120), 600);

  // letter
  const L = C.letter;
  $('letterTitle').textContent = L.title;
  $('letterSign').textContent = L.sign;
  L.paragraphs.forEach((t) => { const p = document.createElement('p'); p.textContent = t; $('letterBody').appendChild(p); });
  const env = $('envelope'), paper = $('paper');
  env.onclick = () => {
    const opening = !env.classList.contains('open');
    env.classList.toggle('open', opening);
    env.setAttribute('aria-expanded', opening);
    paper.hidden = !opening;
    if (opening) { confetti(80); setTimeout(() => paper.scrollIntoView({ behavior: 'smooth', block: 'center' }), 150); }
  };

  // background music (browsers block autoplay, so it starts on the first tap/key/scroll)
  const bgm = $('bgm'), mbtn = $('music');
  bgm.volume = 0.5;
  let wantMusic = true;
  const paint = () => {
    const on = !bgm.paused;
    mbtn.classList.toggle('on', on);
    mbtn.classList.toggle('off', !on);
    mbtn.setAttribute('aria-pressed', on);
  };
  const start = () => { if (wantMusic && bgm.paused) bgm.play().then(paint).catch(() => {}); };
  ['pointerdown', 'keydown', 'touchstart'].forEach((ev) => addEventListener(ev, start, { once: false, passive: true }));
  mbtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (bgm.paused) { wantMusic = true; bgm.play().then(paint).catch(() => {}); }
    else { wantMusic = false; bgm.pause(); paint(); }
  });
  bgm.addEventListener('play', paint); bgm.addEventListener('pause', paint);
  bgm.play().then(paint).catch(paint);

  // welcome screen: the tap is the user gesture that lets the music autoplay
  $('wName').textContent = C.name;
  $('openBtn').onclick = () => {
    wantMusic = true;
    bgm.currentTime = 0;
    bgm.play().then(paint).catch(paint);
    $('welcome').classList.add('hide');
    document.body.classList.remove('locked');
    confetti(160);
  };
})();
