/* Pixel-art night street: a moonlit city with traffic, neon and a crescent moon.
   Drawn on a low-res canvas and upscaled with hard pixels (image-rendering: pixelated).
   startNightStreet(canvas) starts the animation and returns a cleanup function. */
export function startNightStreet(cv) {
  const ctx = cv.getContext('2d');
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- helpers ----------
  const mulberry = s => () => { s |= 0; s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  let R = mulberry(1);                                   // seeded: layout
  const rand = (a, b) => a + R() * (b - a);
  const ri = (a, b) => Math.floor(rand(a, b + 1));
  const pick = a => a[Math.floor(R() * a.length)];
  const mr_ = (a, b) => a + Math.random() * (b - a);     // unseeded: animation
  const mpick = a => a[Math.floor(Math.random() * a.length)];
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
  const bayer = (x, y) => BAYER[(y & 3) * 4 + (x & 3)] / 16;

  function rect(x, y, w, h, c) {
    if (c) ctx.fillStyle = c;
    ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
  }
  function sprite(rows, x, y, col, g = ctx) {
    g.fillStyle = col;
    rows.forEach((r, j) => { for (let i = 0; i < r.length; i++) if (r[i] === '#') g.fillRect(x + i, y + j, 1, 1); });
  }
  const offscreen = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };

  // ---------- scene state ----------
  let PX, W, H, L, M, S;

  function build() {
    const cssW = cv.clientWidth || innerWidth, cssH = cv.clientHeight || innerHeight;
    PX = cssW > 1700 ? 4 : 3;
    W = Math.ceil(cssW / PX);
    H = Math.ceil(cssH / PX);
    cv.width = W; cv.height = H;
    R = mulberry(20261003);

    L = { front: H - 8, roadBot: H - 8, roadTop: H - 30, base: H - 36 };
    L.laneMid = Math.round((L.roadTop + L.roadBot) / 2);

    // The moon: big, upper-right, generous halo
    // On narrow screens the hero text spans the width, so the moon goes smaller and tucks up under the nav
    const narrow = cssW < 900;
    const r = narrow ? clamp(Math.round(W * 0.11), 14, 24) : clamp(Math.round(Math.min(W, H) * 0.14), 16, 44);
    M = narrow ? { r, x: Math.round(W * 0.8), y: r + 24 } : { r, x: Math.round(W * 0.76), y: Math.round(Math.max(r + 16, H * 0.25)) };

    S = { stars: [], far: [], near: [], windows: [], shops: [], antennas: [], lamps: [], clouds: [],
          cars: [], walkers: [], bats: [], shooting: null,
          timers: { car0: 1, car1: 0.2, walker: 1, bats: 4, shoot: 3 } };

    buildSky();
    buildMoon();
    buildCity();
    buildClouds();

    const starCount = Math.round(W * L.base / 260);
    for (let i = 0; i < starCount; i++) {
      const s = { x: ri(0, W - 1), y: ri(0, L.base - 8), b: rand(.25, 1), p: rand(0, 6.28), sp: rand(.6, 2.6), big: R() < .05 };
      if (Math.hypot(s.x - M.x, s.y - M.y) > M.r * 1.7) S.stars.push(s);
    }
  }

  // Sky: dithered banded gradient + moonlight wash
  function buildSky() {
    const c = offscreen(W, H), g = c.getContext('2d'), img = g.createImageData(W, H), d = img.data;
    const stops = [[0, [8, 18, 58]], [.5, [20, 44, 112]], [.82, [36, 70, 150]], [1, [62, 96, 176]]];
    const sky = t => {
      for (let i = 1; i < stops.length; i++) if (t <= stops[i][0]) {
        const [t0, a] = stops[i - 1], [t1, b] = stops[i], k = (t - t0) / (t1 - t0);
        return a.map((v, j) => v + (b[j] - v) * k);
      }
      return stops[stops.length - 1][1];
    };
    const step = 9;
    for (let y = 0; y < H; y++) {
      const base = sky(clamp(y / L.base, 0, 1));
      for (let x = 0; x < W; x++) {
        const dist = Math.hypot(x - M.x - M.r * .55, y - M.y - M.r * .35);
        const wide = Math.max(0, 1 - dist / (M.r * 6)) ** 2.4;      // soft blue wash, no hard circle
                const col = [base[0] + wide * 30, base[1] + wide * 55, base[2] + wide * 90];
        const th = (bayer(x, y) - .5) * step, o = (y * W + x) * 4;
        for (let j = 0; j < 3; j++) d[o + j] = clamp(Math.round((col[j] + th) / step) * step, 0, 255);
        d[o + 3] = 255;
      }
    }
    g.putImageData(img, 0, 0);
    S.sky = c;
  }

  // Moon sprite + halo (both pre-rendered, pixel-exact)
  function buildMoon() {
    const r = M.r, size = r * 2 + 1;
    const c = offscreen(size, size), g = c.getContext('2d');
    const tones = ['#f4f9ff', '#d4e6ff', '#9dbcff', '#7aa2f5'];
    // Stylized crescent: the disk minus an offset disk; nothing is drawn in the cut-out
    const sx = -r * .5, sy = -r * .32, sr = r * .96;
    const crescentDist = (x, y) => Math.max(Math.hypot(x, y) - r, sr - Math.hypot(x - sx, y - sy));
    for (let y = -r; y <= r; y++) for (let x = -r; x <= r; x++) {
      if (crescentDist(x, y) > .4) continue;
      const depth = Math.hypot(x - sx, y - sy) - sr;              // distance from the inner edge
      const t = depth < 1.2 ? 3 : depth < 2.6 ? 2 : (Math.hypot(x, y) > r - 1.2 || depth < r * .18 ? 1 : 0);
      g.fillStyle = tones[t]; g.fillRect(x + r, y + r, 1, 1);
    }
    M.sprite = c;

    // Halo follows the crescent's shape, so the cut-out gets glow too (no dark disk)
    const HR = Math.round(r * 2.8), hs = HR * 2 + 1, span = HR - r;
    const h = offscreen(hs, hs), hg = h.getContext('2d'), img = hg.createImageData(hs, hs), d = img.data;
    for (let y = 0; y < hs; y++) for (let x = 0; x < hs; x++) {
      const dist = crescentDist(x - HR, y - HR);
      if (dist <= .4 || dist > span) continue;
      const t = dist / span;
      let a = .6 * (1 - t) ** 2.4;
      const sd = Math.hypot(x - HR - sx, y - HR - sy);
      const k = clamp((sd - sr * .6) / r, 0, 1);
      a *= .08 + .92 * k * k;                                    // glow comes off the outer curve; hollow stays dark
      a = Math.floor(a / .07 + bayer(x, y)) * .07;               // banded + dithered
      const o = (y * hs + x) * 4;
      d[o] = 150 + (1 - t) * 70; d[o + 1] = 190 + (1 - t) * 45; d[o + 2] = 255; d[o + 3] = clamp(a, 0, 1) * 255;
    }
    hg.putImageData(img, 0, 0);
    M.halo = h; M.HR = HR;
  }

  function buildCity() {
    const c = offscreen(W, H), g = c.getContext('2d');
    const fr = (x, y, w, h, col) => { g.fillStyle = col; g.fillRect(x, y, w, h); };
    const k = (cv.clientWidth || innerWidth) < 900 ? .6 : 1;      // keep the skyline below the hero text on phones

    // Far skyline
    for (let x = -4; x < W;) {
      const w = ri(8, 22), h = ri(Math.round(H * .12 * k), Math.round(H * .32 * k)), top = L.base - h;
      fr(x, top, w, h, '#0e1230');
      if (R() < .25) { const sw = Math.max(3, w - 6); fr(x + (w - sw >> 1), top - 4, sw, 4, '#0e1230'); }
      for (let wy = top + 3; wy < L.base - 4; wy += 4) for (let wx = x + 2; wx < x + w - 2; wx += 3)
        if (R() < .12) fr(wx, wy, 1, 2, R() < .7 ? 'rgba(255,205,120,.35)' : 'rgba(140,180,255,.3)');
      if (R() < .3) S.antennas.push({ x: x + (w >> 1), y: top - ri(5, 10), far: true, p: rand(0, 6) });
      // moonlit edge on the side facing the moon
      fr(x + (x + w / 2 < M.x ? w - 1 : 0), top, 1, h, 'rgba(120,140,220,.18)');
      fr(x, top, w, 1, 'rgba(150,165,235,.22)');
      x += w + ri(-2, 2);
    }

    // Near buildings
    const bodies = ['#161c38', '#1a2142', '#131a33', '#1e2547', '#1b1e3a'];
    for (let x = -3; x < W;) {
      const w = ri(16, 34), h = Math.max(16, ri(Math.round(H * .08 * k), Math.round(H * .2 * k))), top = L.base - h, col = pick(bodies);
      const b = { x, w, top, h };
      S.near.push(b);
      fr(x, top, w, h, col);
      fr(x - 1, top, w + 2, 2, '#232b52');                                  // cornice
      fr(x - 1, top, w + 2, 1, 'rgba(190,200,255,.35)');                   // moonlight on roof line
      fr(x + (x + w / 2 < M.x ? w - 1 : 0), top + 2, 1, h - 2, 'rgba(160,175,240,.16)');
      for (let wy = top + 4; wy < L.base - 9; wy += 4) for (let wx = x + 2; wx + 2 <= x + w - 2; wx += 4) {
        fr(wx, wy, 2, 2, '#0b0f22');
        S.windows.push({ x: wx, y: wy, on: R() < .35, col: pick(['#ffcf6b', '#ffe2a0', '#f2b35c', '#ffd98a', '#9fd0ff']), tv: R() < .06 });
      }
      if (R() < .5 && w >= 18) {
        const sw = w - 6;
        S.shops.push({ x: x + 3, y: L.base - 6, w: sw, col: pick(['#ffcf7a', '#ffe7b0', '#bfe8ff']),
          neon: { x: x + 4 + ri(0, Math.max(0, sw - 12)), y: L.base - 9, w: Math.min(10, sw - 2), col: pick(['#ff4fa3', '#35e0ff', '#b26bff', '#ff8a3d', '#5dff9b']) }, off: 0 });
      } else {
        fr(x + (w >> 1) - 2, L.base - 6, 4, 6, '#0a0d1d');                // doorway
      }
      if (R() < .3 && w > 18) {                                              // water tank
        const tx = x + ri(3, w - 9);
        fr(tx + 1, top - 3, 1, 3, '#0d1128'); fr(tx + 5, top - 3, 1, 3, '#0d1128');
        fr(tx, top - 9, 7, 6, '#121733'); fr(tx - 1, top - 10, 9, 1, '#1a2046'); fr(tx, top - 11, 7, 1, '#1a2046');
        fr(tx + 6, top - 9, 1, 6, 'rgba(170,185,255,.25)');
      } else if (R() < .4) {
        S.antennas.push({ x: x + ri(2, w - 3), y: top - ri(5, 9), p: rand(0, 6) });
      }
      x += w + (R() < .3 ? ri(2, 4) : 0);
    }
    for (const a of S.antennas) {
      const roof = a.far ? null : S.near.find(b => a.x >= b.x && a.x < b.x + b.w);
      const bottom = roof ? roof.top : a.y + 8;
      fr(a.x, a.y, 1, bottom - a.y, a.far ? '#0e1230' : '#141a36');
    }

    // Cat on the rooftop closest to the moon
    const cb = S.near.filter(b => b.w > 12).sort((a, b) => Math.abs(a.x + a.w / 2 - M.x) - Math.abs(b.x + b.w / 2 - M.x))[0];
    if (cb) S.cat = { x: cb.x + Math.round(cb.w * .55), y: cb.top - 5 };

    // Back sidewalk, road, front sidewalk
    fr(0, L.base, W, L.roadTop - L.base, '#1d2240');
    for (let x = 0; x < W; x += 8) fr(x, L.base, 1, L.roadTop - L.base, '#181c36');
    fr(0, L.roadTop - 1, W, 1, '#3a4170');
    fr(0, L.roadTop, W, L.roadBot - L.roadTop, '#121526');
    for (let i = 0; i < W * 2; i++) fr(ri(0, W), ri(L.roadTop + 1, L.roadBot - 1), 1, 1, R() < .5 ? '#171b30' : '#0e1120');
    for (let x = 0; x < W; x += 10) fr(x, L.laneMid, 5, 1, '#b8a55e');
    fr(0, L.roadBot, W, H - L.roadBot, '#1a1e38');
    fr(0, L.roadBot, W, 1, '#363d68');
    for (let x = 4; x < W; x += 12) fr(x, L.roadBot + 1, 1, H - L.roadBot, '#151930');

    // Street lamps
    const spacing = W < 260 ? 48 : 68;
    for (let x = 14, i = 0; x < W; x += spacing, i++) S.lamps.push({ x, flicker: i === 1 });
    S.city = c;
  }

  function buildClouds() {
    const n = Math.max(3, Math.round(W / 130));
    for (let i = 0; i < n; i++) {
      const w = ri(26, 64), h = ri(7, 13);
      const c = offscreen(w, h), g = c.getContext('2d');
      const rim = offscreen(w, h), rg = rim.getContext('2d');
      const puffs = Array.from({ length: ri(3, 5) }, () => ({ x: rand(.15, .85) * w, y: rand(.45, .8) * h, r: rand(.25, .5) * h * 1.4 }));
      const inside = (x, y) => y >= h - 2 ? x > 3 && x < w - 4 : puffs.some(p => Math.hypot((x - p.x) * .6, y - p.y) < p.r);
      for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (inside(x, y)) {
        g.fillStyle = '#1b2350'; g.fillRect(x, y, 1, 1);
        if (!inside(x, y - 1)) { rg.fillStyle = '#e4e8ff'; rg.fillRect(x, y, 1, 1); }
        else if (!inside(x, y - 2)) { rg.fillStyle = '#7d89c4'; rg.fillRect(x, y, 1, 1); }
      }
      // guarantee one cloud drifts across the moon
      const y = i === 0 ? M.y + Math.round(M.r * .3) : ri(Math.round(H * .06), Math.round(H * .42));
      const x = i === 0 ? M.x - M.r * 5 - w : rand(-w, W);
      S.clouds.push({ c, rim, x, y, w, h, sp: rand(1.4, 3.4) });
    }
  }

  // ---------- spawners ----------
  const CAR_COLS = ['#a8383f', '#3b5ba8', '#d6d6e0', '#2f7a5a', '#6b4aa0', '#2a2f48', '#c46b2d'];
  function spawnCar(lane) {
    const dir = lane === 0 ? -1 : 1;
    const roll = Math.random();
    const kind = roll < .08 ? 'bus' : roll < .25 ? 'taxi' : 'car';
    const len = kind === 'bus' ? 34 : Math.round(mr_(16, 21));
    const sp = (lane === 0 ? mr_(16, 24) : mr_(22, 32)) * (kind === 'bus' ? .8 : 1);
    const x = dir > 0 ? -len - 30 : W + 30;
    const last = S.cars.filter(c => c.lane === lane).sort((a, b) => dir > 0 ? a.x - b.x : b.x - a.x)[0];
    if (last && (dir > 0 ? last.x < len + 10 : last.x + last.len > W - 10)) return;
    S.cars.push({ lane, dir, kind, len, sp, x, by: lane === 0 ? L.laneMid - 1 : L.roadBot - 1, col: kind === 'taxi' ? '#e8b923' : kind === 'bus' ? '#2d6fa3' : mpick(CAR_COLS) });
  }
  function spawnWalker() {
    const dir = Math.random() < .5 ? 1 : -1;
    S.walkers.push({ dir, x: dir > 0 ? -6 : W + 6, sp: mr_(5, 9), coat: mpick(['#4a5590', '#7a3f6e', '#2f6b6b', '#8a5a2e', '#555b78']), skin: mpick(['#e0b48c', '#b07a52', '#7a4e33', '#f0c9a4']), dog: Math.random() < .3, t: Math.random() });
  }
  function spawnBats() {
    const dir = Math.random() < .5 ? 1 : -1, y = M.y + mr_(-M.r, M.r * .6), n = 3 + (Math.random() * 4 | 0);
    for (let i = 0; i < n; i++) S.bats.push({ dir, x: (dir > 0 ? -8 : W + 8) - dir * i * mr_(5, 10), y: y + mr_(-6, 6), sp: mr_(18, 26), p: Math.random() * 6 });
  }

  // ---------- draw pieces ----------
  function drawCar(c) {
    const { x, by, len, col, dir, kind } = c;
    if (kind === 'bus') {
      rect(x, by - 10, len, 8, col);
      for (let i = x + 2; i < x + len - 3; i += 4) rect(i, by - 9, 3, 3, '#ffe2a0');
      rect(x, by - 10, len, 1, 'rgba(220,228,255,.45)');
    } else {
      rect(x, by - 5, len, 3, col);
      rect(x + 3, by - 8, len - 7, 3, col);
      rect(x + 4, by - 7, len - 9, 2, '#26334f');
      rect(x + (len >> 1), by - 7, 1, 2, col);
      rect(x + 3, by - 8, len - 7, 1, 'rgba(225,232,255,.5)');           // moonlit roof
      rect(x, by - 5, len, 1, 'rgba(225,232,255,.18)');
      if (kind === 'taxi') rect(x + (len >> 1) - 1, by - 9, 3, 1, '#fff4c2');
    }
    rect(x + 2, by - 2, 3, 2, '#07080f'); rect(x + len - 5, by - 2, 3, 2, '#07080f');
    const fx = dir > 0 ? x + len - 1 : x, bx = dir > 0 ? x : x + len - 1, ly = kind === 'bus' ? by - 4 : by - 5;
    rect(fx, ly, 1, 1, '#fff8d6');
    rect(bx, ly, 1, 1, '#ff3b3b');
  }
  function drawCarLights(c) {
    const { x, by, len, dir, kind } = c;
    const fx = dir > 0 ? x + len : x - 1, bx = dir > 0 ? x - 1 : x + len, ly = kind === 'bus' ? by - 4 : by - 5;
    for (let i = 0; i < 30; i++) {
      const h = 1 + (i / 4 | 0), a = .2 * (1 - i / 30);
      rect(fx + dir * i, ly - (h >> 1), 1, h, `rgba(255,236,170,${a.toFixed(3)})`);
    }
    for (let i = 0; i < 22; i += 2) rect(fx + dir * i, by + 1 + (i & 2 ? 1 : 0), 2, 1, `rgba(255,236,170,${(.12 * (1 - i / 22)).toFixed(3)})`); // wet-road glint
    rect(bx - (dir > 0 ? 2 : 0), ly - 1, 3, 3, 'rgba(255,40,40,.25)');
  }
  function drawWalker(w) {
    const fy = H - 2, x = Math.round(w.x), step = Math.floor(w.t * 4) % 2;
    rect(x, fy - 9, 2, 2, w.skin);
    rect(x, fy - 7, 2, 4, w.coat);
    rect(x, fy - 7, 2, 1, 'rgba(230,236,255,.25)');
    ctx.fillStyle = '#0d0f1c';
    if (step) { rect(x - 1, fy - 3, 1, 3); rect(x + 2, fy - 3, 1, 3); }
    else { rect(x, fy - 3, 1, 3); rect(x + 1, fy - 3, 1, 3); }
    if (w.dog) {
      const dx = x - w.dir * 6;
      rect(dx, fy - 3, 4, 2, '#5b4636'); rect(dx + (w.dir > 0 ? 3 : -1), fy - 4, 2, 2, '#5b4636');
      rect(dx + (step ? 0 : 1), fy - 1, 1, 1, '#3c2e24'); rect(dx + (step ? 3 : 2), fy - 1, 1, 1, '#3c2e24');
      rect(Math.min(x, dx + 2), fy - 5, Math.abs(x - dx - 2), 1, 'rgba(200,200,220,.3)');  // leash
    }
  }

  // ---------- main loop ----------
  let last = performance.now(), acc = 0;
  function frame(now) {
    const dt = Math.min(.1, (now - last) / 1000); last = now; acc += dt;
    if (acc < 1 / 30 && !reduceMotion) { raf = requestAnimationFrame(frame); return; }  // ~30fps: retro + cheap
    const step = acc; acc = 0;
    update(step);
    draw(now / 1000);
    if (!reduceMotion && running) raf = requestAnimationFrame(frame);
  }

  function update(dt) {
    const T = S.timers;
    if ((T.car0 -= dt) < 0) { spawnCar(0); T.car0 = mr_(1.5, 5); }
    if ((T.car1 -= dt) < 0) { spawnCar(1); T.car1 = mr_(1.2, 4.5); }
    if ((T.walker -= dt) < 0) { spawnWalker(); T.walker = mr_(3, 9); }
    if ((T.bats -= dt) < 0) { spawnBats(); T.bats = mr_(12, 24); }
    if ((T.shoot -= dt) < 0) {
      S.shooting = { x: mr_(W * .05, W * .6), y: mr_(4, H * .25), vx: mr_(70, 110), vy: mr_(25, 45), life: .9 };
      T.shoot = mr_(6, 14);
    }
    for (const lane of [0, 1]) {
      const cars = S.cars.filter(c => c.lane === lane).sort((a, b) => lane ? b.x - a.x : a.x - b.x);
      for (let i = 0; i < cars.length; i++) {
        const c = cars[i], ahead = cars[i - 1];
        let sp = c.sp;
        if (ahead) { const gap = c.dir > 0 ? ahead.x - (c.x + c.len) : c.x - (ahead.x + ahead.len); if (gap < 10) sp = Math.min(sp, ahead.sp * (gap < 5 ? .7 : 1)); }
        c.x += c.dir * sp * dt;
      }
    }
    S.cars = S.cars.filter(c => c.x > -60 && c.x < W + 60);
    for (const w of S.walkers) { w.x += w.dir * w.sp * dt; w.t += dt; }
    S.walkers = S.walkers.filter(w => w.x > -20 && w.x < W + 20);
    for (const b of S.bats) b.x += b.dir * b.sp * dt;
    S.bats = S.bats.filter(b => b.x > -40 && b.x < W + 40);
    for (const c of S.clouds) { c.x += c.sp * dt; if (c.x > W + 4) { c.x = -c.w - 4; c.y = Math.round(mr_(H * .06, H * .42)); } }
    if (S.shooting) { const s = S.shooting; s.x += s.vx * dt; s.y += s.vy * dt; if ((s.life -= dt) < 0) S.shooting = null; }
    // lights in the windows come and go
    if (Math.random() < dt * 3) { const w = mpick(S.windows); if (w) w.on = !w.on; }
    for (const s of S.shops) { if (s.off > 0) s.off -= dt; else if (Math.random() < dt * .25) s.off = mr_(.05, .5); }
  }

  function draw(t) {
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
    ctx.drawImage(S.sky, 0, 0);

    // stars
    for (const s of S.stars) {
      const a = s.b * (.55 + .45 * Math.sin(t * s.sp + s.p));
      rect(s.x, s.y, 1, 1, `rgba(235,240,255,${a.toFixed(2)})`);
      if (s.big && a > .6) { ctx.fillStyle = `rgba(235,240,255,${(a * .35).toFixed(2)})`; rect(s.x - 1, s.y, 3, 1); rect(s.x, s.y - 1, 1, 3); }
    }
    if (S.shooting) {
      const s = S.shooting, n = 12;
      for (let i = 0; i < n; i++) rect(s.x - s.vx * i * .012, s.y - s.vy * i * .012, 1, 1, `rgba(255,250,230,${(Math.min(1, s.life * 2) * (1 - i / n)).toFixed(2)})`);
    }

    // the moon (halo breathes slowly)
    ctx.globalAlpha = .85 + .15 * Math.sin(t * .8);
    ctx.drawImage(M.halo, M.x - M.HR, M.y - M.HR);
    ctx.globalAlpha = 1;
    ctx.drawImage(M.sprite, M.x - M.r, M.y - M.r);

    // bats crossing the moon
    for (const b of S.bats) {
      const up = Math.sin(t * 14 + b.p) > 0, y = Math.round(b.y + Math.sin(t * 3 + b.p) * 2);
      sprite(up ? ['#...#', '.###.', '..#..'] : ['..#..', '.###.', '#...#'], Math.round(b.x), y, '#090a16');
    }

    // clouds, rim-lit by the moon
    for (const c of S.clouds) {
      const cx = c.x + c.w / 2, cy = c.y + c.h / 2;
      const prox = clamp(1 - Math.hypot(cx - M.x, cy - M.y) / (M.r * 7), .12, 1);
      ctx.globalAlpha = .88; ctx.drawImage(c.c, Math.round(c.x), c.y);
      ctx.globalAlpha = prox; ctx.drawImage(c.rim, Math.round(c.x), c.y);
    }
    ctx.globalAlpha = 1;

    ctx.drawImage(S.city, 0, 0);

    // antenna beacons
    for (const a of S.antennas) if (Math.sin(t * 2 + a.p) > .6) {
      rect(a.x, a.y - 1, 1, 1, '#ff3045');
      rect(a.x - 1, a.y - 2, 3, 3, 'rgba(255,48,69,.25)');
    }

    // windows
    for (const w of S.windows) if (w.on) {
      let col = w.col;
      if (w.tv) col = ['#7fb6ff', '#a6c8ff', '#5d8ee0', '#c4d8ff'][Math.floor(t * 6 + w.x) % 4];
      rect(w.x, w.y, 2, 2, col);
      rect(w.x, w.y + 1, 2, 1, 'rgba(0,0,0,.18)');
    }

    // cat on the roof
    if (S.cat) {
      const { x, y } = S.cat, swish = Math.floor(t * 1.5) % 3;
      sprite(['#.#..', '###..', '.###.', '.####'], x, y, '#05060e');
      sprite(swish === 0 ? ['.....#', '.....#', '....#.'] : swish === 1 ? ['......', '......', '....##'] : ['......', '.....#', '....#.'], x, y + 1, '#05060e');
      if (Math.sin(t * .7) > -.9) { rect(x, y + 1, 1, 1, '#d7ff6a'); }
    }

    ctx.globalCompositeOperation = 'lighter';

    // shopfronts + neon
    for (const s of S.shops) {
      rect(s.x, s.y, s.w, 4, s.col + '55');
      rect(s.x, s.y + 3, s.w, 1, s.col + '33');
      if (s.off <= 0) {
        const n = s.neon;
        rect(n.x, n.y, n.w, 1, n.col);
        rect(n.x - 1, n.y - 1, n.w + 2, 3, n.col + '30');
        rect(n.x - 3, n.y - 2, n.w + 6, 5, n.col + '14');
        rect(n.x, L.roadTop + 1, n.w, 1, n.col + '30');                    // reflection on the road
        rect(n.x + 1, L.roadTop + 3, n.w - 2, 1, n.col + '18');
      }
    }

    // moon reflection shimmering on the wet road
    const rw = Math.max(4, Math.round(M.r * .45));
    for (let y = L.roadTop + 1; y < L.roadBot; y++) {
      const k = (y - L.roadTop) / (L.roadBot - L.roadTop);
      if ((y + Math.floor(t * 5)) % 3 === 0) continue;
      const w = Math.round(rw * (1 - k * .5)), jx = Math.round(Math.sin(t * 2.2 + y * 1.7) * 1.5);
      rect(M.x - (w >> 1) + jx, y, w, 1, `rgba(190,215,255,${(.32 * (1 - k * .6)).toFixed(2)})`);
    }
    ctx.globalCompositeOperation = 'source-over';

    // cars: far lane first
    const ordered = [...S.cars].sort((a, b) => a.lane - b.lane);
    for (const c of ordered) drawCar(c);
    ctx.globalCompositeOperation = 'lighter';
    for (const c of ordered) drawCarLights(c);

    // street lamps: poles, then light cones on top of cars
    ctx.globalCompositeOperation = 'source-over';
    const poleTop = L.roadTop - 28;
    for (const l of S.lamps) {
      rect(l.x, poleTop, 1, L.roadTop - poleTop, '#2a3152');
      rect(l.x, poleTop, 5, 1, '#2a3152');
      rect(l.x + 3, poleTop + 1, 3, 1, '#3b436c');
    }
    ctx.globalCompositeOperation = 'lighter';
    for (const l of S.lamps) {
      const on = !l.flicker || !(Math.sin(t * 17) > .55 && Math.sin(t * 1.3) > .2);
      if (!on) continue;
      const hx = l.x + 4, hy = poleTop + 2;
      rect(hx - 1, hy - 1, 3, 1, '#ffeab0');
      for (let y = hy; y < L.roadBot + 2; y++) {
        const k = (y - hy) / (L.roadBot - hy), w = 2 + Math.round(k * 12);
        rect(hx - (w >> 1), y, w, 1, `rgba(255,190,90,${(.055 * (1 - k * .6)).toFixed(3)})`);
      }
      rect(hx - 4, hy - 3, 8, 5, 'rgba(255,220,150,.12)');
      for (let y = L.roadTop + 2; y < L.roadBot; y += 2)                    // lamp reflection streak
        rect(hx - 1 + Math.round(Math.sin(t * 3 + y) * .8), y, 2, 1, 'rgba(255,214,140,.14)');
    }
    ctx.globalCompositeOperation = 'source-over';

    for (const w of S.walkers) drawWalker(w);
  }

  let running = true, raf = 0, resizeT;
  const ro = new ResizeObserver(() => {
    clearTimeout(resizeT);
    resizeT = setTimeout(() => { build(); if (reduceMotion) { update(0); draw(0); } }, 150);
  });
  build();
  ro.observe(cv);
  if (reduceMotion) { update(0); draw(0); } else raf = requestAnimationFrame(frame);

  return () => { running = false; cancelAnimationFrame(raf); clearTimeout(resizeT); ro.disconnect(); };
}
