// ===== STATE =====
let totalStars = 0;
let currentScreen = 'welcome';

// ===== NAVIGATION =====
function goTo(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const el = document.getElementById('screen-' + screenId);
  if (el) {
    el.classList.add('active');
    currentScreen = screenId;

    // Load game khi vào màn
    if (screenId === 'demso') startDemSo();
    if (screenId === 'congtru') startCongTru();
    if (screenId === 'hinhhoc') startHinhHoc();
    if (screenId === 'dongho') startDongHo();
  }
  updateStarsUI();
}

function updateStarsUI() {
  document.getElementById('total-stars').textContent = totalStars;
  document.querySelectorAll('.stars-here').forEach(el => {
    el.textContent = totalStars;
  });
}

// ===== SOUND (Web Audio - không cần file) =====
function playCorrect() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g);
    g.connect(ctx.destination);
    o.type = 'sine';
    o.frequency.setValueAtTime(523, ctx.currentTime);
    o.frequency.setValueAtTime(659, ctx.currentTime + 0.1);
    o.frequency.setValueAtTime(784, ctx.currentTime + 0.2);
    g.gain.setValueAtTime(0.25, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
    o.start();
    o.stop(ctx.currentTime + 0.4);
  } catch (e) {}
}

function playWrong() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g);
    g.connect(ctx.destination);
    o.type = 'triangle';
    o.frequency.setValueAtTime(200, ctx.currentTime);
    o.frequency.linearRampToValueAtTime(120, ctx.currentTime + 0.25);
    g.gain.setValueAtTime(0.2, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    o.start();
    o.stop(ctx.currentTime + 0.3);
  } catch (e) {}
}

// ===== POPUP =====
function showCorrectPopup() {
  const popup = document.getElementById('popup-correct');
  popup.classList.add('show');
  setTimeout(() => popup.classList.remove('show'), 900);
}

// ===== ĐẾM SỐ =====
const fruits = ['🍎', '🍊', '🍌', '🍇', '🍓', '🍉', '🍑', '🥝'];
let demSoAnswer = 0;

function startDemSo() {
  const count = Math.floor(Math.random() * 8) + 2; // 2-9
  demSoAnswer = count;
  const fruit = fruits[Math.floor(Math.random() * fruits.length)];

  document.getElementById('demso-question').textContent =
    `Có bao nhiêu ${fruit.includes('🍌') ? 'quả chuối' :
      fruit.includes('🍎') ? 'quả táo' :
      fruit.includes('🍊') ? 'quả cam' :
      fruit.includes('🍇') ? 'chùm nho' :
      fruit.includes('🍓') ? 'quả dâu' :
      fruit.includes('🍉') ? 'quả dưa' :
      fruit.includes('🍑') ? 'quả đào' : 'quả kiwi'}?`;

  const itemsEl = document.getElementById('demso-items');
  itemsEl.innerHTML = '';
  for (let i = 0; i < count; i++) {
    const span = document.createElement('span');
    span.className = 'item-emoji';
    span.textContent = fruit;
    span.style.animationDelay = (i * 0.06) + 's';
    itemsEl.appendChild(span);
  }

  // Options
  const opts = new Set([count]);
  while (opts.size < 4) {
    opts.add(Math.max(1, count + Math.floor(Math.random() * 5) - 2));
  }
  const arr = [...opts].sort(() => Math.random() - 0.5);

  const optsEl = document.getElementById('demso-options');
  optsEl.innerHTML = '';
  document.getElementById('demso-feedback').textContent = '';
  arr.forEach(n => {
    const btn = document.createElement('button');
    btn.className = 'opt-btn';
    btn.textContent = n;
    btn.onclick = () => checkDemSo(n, btn);
    optsEl.appendChild(btn);
  });
}

function checkDemSo(chosen, btn) {
  document.querySelectorAll('#demso-options .opt-btn').forEach(b => b.onclick = null);
  if (chosen === demSoAnswer) {
    btn.classList.add('correct');
    document.getElementById('demso-feedback').textContent = 'Đúng rồi! Giỏi quá! 🌟';
    document.getElementById('demso-feedback').className = 'feedback good';
    totalStars++;
    playCorrect();
    showCorrectPopup();
    updateStarsUI();
    setTimeout(startDemSo, 1400);
  } else {
    btn.classList.add('wrong');
    document.getElementById('demso-feedback').textContent = 'Chưa đúng, thử lại nhé!';
    document.getElementById('demso-feedback').className = 'feedback bad';
    playWrong();
    setTimeout(() => {
      btn.classList.remove('wrong');
      document.querySelectorAll('#demso-options .opt-btn').forEach(b => {
        b.onclick = () => checkDemSo(+b.textContent, b);
      });
    }, 800);
  }
}

// ===== CỘNG TRỪ =====
let congTruAnswer = 0;

function startCongTru() {
  const a = Math.floor(Math.random() * 6) + 1; // 1-6
  const b = Math.floor(Math.random() * 5) + 1; // 1-5
  const isAdd = Math.random() > 0.4;
  congTruAnswer = isAdd ? a + b : Math.max(a, b) - Math.min(a, b);

  const bigger = Math.max(a, b);
  const smaller = Math.min(a, b);

  document.getElementById('congtru-question').textContent =
    isAdd ? `${a} + ${b} = ?` : `${bigger} − ${smaller} = ?`;

  // Visual
  const vis = document.getElementById('congtru-visual');
  vis.innerHTML = '';
  const emoji = isAdd ? '🔵' : '🔴';

  if (isAdd) {
    const g1 = document.createElement('div');
    g1.className = 'math-group';
    for (let i = 0; i < a; i++) g1.innerHTML += `<span style="font-size:28px">${emoji}</span>`;
    const op = document.createElement('span');
    op.className = 'math-op';
    op.textContent = '+';
    const g2 = document.createElement('div');
    g2.className = 'math-group';
    for (let i = 0; i < b; i++) g2.innerHTML += `<span style="font-size:28px">${emoji}</span>`;
    vis.append(g1, op, g2);
  } else {
    const g1 = document.createElement('div');
    g1.className = 'math-group';
    for (let i = 0; i < bigger; i++) g1.innerHTML += `<span style="font-size:28px">${emoji}</span>`;
    const op = document.createElement('span');
    op.className = 'math-op';
    op.textContent = '−';
    const g2 = document.createElement('div');
    g2.className = 'math-group';
    for (let i = 0; i < smaller; i++) g2.innerHTML += `<span style="font-size:28px">⚪</span>`;
    vis.append(g1, op, g2);
  }

  // Options
  const opts = new Set([congTruAnswer]);
  while (opts.size < 4) {
    opts.add(Math.max(0, congTruAnswer + Math.floor(Math.random() * 5) - 2));
  }
  const arr = [...opts].sort(() => Math.random() - 0.5);

  const optsEl = document.getElementById('congtru-options');
  optsEl.innerHTML = '';
  document.getElementById('congtru-feedback').textContent = '';
  arr.forEach(n => {
    const btn = document.createElement('button');
    btn.className = 'opt-btn';
    btn.textContent = n;
    btn.onclick = () => checkCongTru(n, btn);
    optsEl.appendChild(btn);
  });
}

function checkCongTru(chosen, btn) {
  document.querySelectorAll('#congtru-options .opt-btn').forEach(b => b.onclick = null);
  if (chosen === congTruAnswer) {
    btn.classList.add('correct');
    document.getElementById('congtru-feedback').textContent = 'Tuyệt vời! 🎉';
    document.getElementById('congtru-feedback').className = 'feedback good';
    totalStars++;
    playCorrect();
    showCorrectPopup();
    updateStarsUI();
    setTimeout(startCongTru, 1400);
  } else {
    btn.classList.add('wrong');
    document.getElementById('congtru-feedback').textContent = 'Sai rồi, nghĩ lại nào!';
    document.getElementById('congtru-feedback').className = 'feedback bad';
    playWrong();
    setTimeout(() => {
      btn.classList.remove('wrong');
      document.querySelectorAll('#congtru-options .opt-btn').forEach(b => {
        b.onclick = () => checkCongTru(+b.textContent, b);
      });
    }, 800);
  }
}

// ===== HÌNH HỌC =====
const shapes = [
  { name: 'Hình tròn', cls: 'circle' },
  { name: 'Hình vuông', cls: 'square' },
  { name: 'Hình tam giác', cls: 'triangle' },
  { name: 'Hình chữ nhật', cls: 'rect' }
];
let hinhAnswer = '';

function startHinhHoc() {
  const s = shapes[Math.floor(Math.random() * shapes.length)];
  hinhAnswer = s.name;

  document.getElementById('hinh-question').textContent = 'Đây là hình gì?';
  const disp = document.getElementById('hinh-display');
  disp.innerHTML = `<div class="shape ${s.cls}"></div>`;

  // Options
  const opts = [...shapes].sort(() => Math.random() - 0.5);
  const optsEl = document.getElementById('hinh-options');
  optsEl.innerHTML = '';
  document.getElementById('hinh-feedback').textContent = '';
  opts.forEach(o => {
    const btn = document.createElement('button');
    btn.className = 'opt-btn';
    btn.style.width = 'auto';
    btn.style.padding = '12px 18px';
    btn.style.fontSize = '16px';
    btn.style.minWidth = '120px';
    btn.textContent = o.name;
    btn.onclick = () => checkHinh(o.name, btn);
    optsEl.appendChild(btn);
  });
}

function checkHinh(chosen, btn) {
  document.querySelectorAll('#hinh-options .opt-btn').forEach(b => b.onclick = null);
  if (chosen === hinhAnswer) {
    btn.classList.add('correct');
    document.getElementById('hinh-feedback').textContent = 'Chuẩn luôn! 👍';
    document.getElementById('hinh-feedback').className = 'feedback good';
    totalStars++;
    playCorrect();
    showCorrectPopup();
    updateStarsUI();
    setTimeout(startHinhHoc, 1400);
  } else {
    btn.classList.add('wrong');
    document.getElementById('hinh-feedback').textContent = 'Chưa đúng đâu!';
    document.getElementById('hinh-feedback').className = 'feedback bad';
    playWrong();
    setTimeout(() => {
      btn.classList.remove('wrong');
      document.querySelectorAll('#hinh-options .opt-btn').forEach(b => {
        b.onclick = () => checkHinh(b.textContent, b);
      });
    }, 800);
  }
}

// ===== ĐỒNG HỒ =====
let dongHoAnswer = 0; // giờ đúng

function drawClock(hour) {
  const canvas = document.getElementById('clock-canvas');
  const ctx = canvas.getContext('2d');
  const cx = 110, cy = 110, r = 95;

  ctx.clearRect(0, 0, 220, 220);

  // Mặt đồng hồ
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = '#fffef5';
  ctx.fill();
  ctx.strokeStyle = '#2d3436';
  ctx.lineWidth = 6;
  ctx.stroke();

  // Số
  ctx.fillStyle = '#2d3436';
  ctx.font = 'bold 20px Nunito';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  for (let i = 1; i <= 12; i++) {
    const ang = (i * 30 - 90) * Math.PI / 180;
    const x = cx + Math.cos(ang) * (r - 22);
    const y = cy + Math.sin(ang) * (r - 22);
    ctx.fillText(i, x, y);
  }

  // Kim giờ
  const hourAng = ((hour % 12) * 30 - 90) * Math.PI / 180;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + Math.cos(hourAng) * 50, cy + Math.sin(hourAng) * 50);
  ctx.strokeStyle = '#e85d04';
  ctx.lineWidth = 8;
  ctx.lineCap = 'round';
  ctx.stroke();

  // Kim phút (luôn 12)
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx, cy - 70);
  ctx.strokeStyle = '#2d3436';
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.stroke();

  // Chấm giữa
  ctx.beginPath();
  ctx.arc(cx, cy, 8, 0, Math.PI * 2);
  ctx.fillStyle = '#e85d04';
  ctx.fill();
}

function startDongHo() {
  const hour = Math.floor(Math.random() * 12) + 1; // 1-12
  dongHoAnswer = hour;
  drawClock(hour);

  document.getElementById('dongho-question').textContent = 'Bây giờ là mấy giờ?';

  const opts = new Set([hour]);
  while (opts.size < 4) {
    opts.add(Math.floor(Math.random() * 12) + 1);
  }
  const arr = [...opts].sort(() => Math.random() - 0.5);

  const optsEl = document.getElementById('dongho-options');
  optsEl.innerHTML = '';
  document.getElementById('dongho-feedback').textContent = '';
  arr.forEach(n => {
    const btn = document.createElement('button');
    btn.className = 'opt-btn';
    btn.style.width = 'auto';
    btn.style.padding = '12px 20px';
    btn.style.fontSize = '20px';
    btn.textContent = n + ' giờ';
    btn.onclick = () => checkDongHo(n, btn);
    optsEl.appendChild(btn);
  });
}

function checkDongHo(chosen, btn) {
  document.querySelectorAll('#dongho-options .opt-btn').forEach(b => b.onclick = null);
  if (chosen === dongHoAnswer) {
    btn.classList.add('correct');
    document.getElementById('dongho-feedback').textContent = 'Đúng giờ rồi! ⏰';
    document.getElementById('dongho-feedback').className = 'feedback good';
    totalStars++;
    playCorrect();
    showCorrectPopup();
    updateStarsUI();
    setTimeout(startDongHo, 1400);
  } else {
    btn.classList.add('wrong');
    document.getElementById('dongho-feedback').textContent = 'Xem lại kim giờ nhé!';
    document.getElementById('dongho-feedback').className = 'feedback bad';
    playWrong();
    setTimeout(() => {
      btn.classList.remove('wrong');
      document.querySelectorAll('#dongho-options .opt-btn').forEach(b => {
        b.onclick = () => checkDongHo(parseInt(b.textContent), b);
      });
    }, 800);
  }
}

// Khởi tạo
updateStarsUI();
