// --- ДАННЫЕ КЕЙСОВ ---
const CASES = [
    { name: "БОМЖ КЕЙС", price: 50, img: "img/case1.png", color: "#8c8c8c", drop: [
        { n: "P250 | Sand", p: 10, img: "img/i1.png", weight: 95 },
        { n: "AWP | Phobos", p: 350, img: "img/i2.png", weight: 5 } 
    ]},
    { name: "ХАЙП КЕЙС", price: 500, img: "img/case2.png", color: "#eb4b4b", drop: [
        { n: "AK-47 | Slate", p: 400, img: "img/i3.png", weight: 80 },
        { n: "KNIFE | Waves", p: 25000, img: "img/i4.png", weight: 2 }
    ]},
        { name: "Ножевой", price: 25000, img: "Fototovar/Kepsi/unnamed.webp", color: "#ffcc00", drop: [
        { n: "★ Navaja Knife | Safari Mesh", p: 7500, img: "Fotoskins/Knife/navaja-safari.jpg", weight: 100 },
        { n: "★ Shadow Daggers | Boreal Forest", p: 10500, img: "Fotoskins/Knife/daggers-boreal.png", weight: 90 },
        { n: "★ Gut Knife | Rust Coat", p: 12800, img: "Fotoskins/Knife/gut-rust.webp", weight: 85 },
        { n: "★ Falchion Knife | Urban Masked", p: 14200, img: "Fotoskins/Knife/falchion-urban.webp", weight: 80 },
        { n: "★ Bowie Knife | Scorched", p: 16500, img: "Fotoskins/Knife/bowie-scorched.webp", weight: 75 },
        { n: "★ Huntsman Knife | Night", p: 18900, img: "Fotoskins/Knife/huntsman-night.webp", weight: 70 },
        { n: "★ Ursus Knife | Ultraviolet", p: 22400, img: "Fototovar/knife/ursus-ultra.webp", weight: 50 },
        { n: "★ Flip Knife | Freehand", p: 26700, img: "Fototovar/knife/flip-free.webp", weight: 45 },
        { n: "★ Gut Knife | Doppler", p: 29500, img: "Fototovar/knife/gut-doppler.webp", weight: 40 },
        { n: "★ Stiletto Knife | Stained", p: 33100, img: "Fototovar/knife/stiletto-stained.webp", weight: 5 },
        { n: "★ Survival Knife | Crimson Web", p: 37800, img: "Fototovar/knife/survival-crimson.webp", weight: 4 },
        { n: "★ Paracord Knife | Case Hardened", p: 42000, img: "Fototovar/knife/paracord-case.webp", weight: 4 },
        { n: "★ Talon Knife | Rust Coat", p: 46500, img: "Fototovar/knife/talon-rust.webp", weight: 4 },
        { n: "★ Nomad Knife | Slaughter", p: 52000, img: "Fototovar/knife/nomad-slaughter.webp", weight: 3 },
        { n: "★ Skeleton Knife | Night Stripe", p: 58400, img: "Fototovar/knife/skeleton-night.webp", weight: 3 },
        { n: "★ M9 Bayonet | Boreal Forest", p: 63000, img: "Fototovar/knife/m9-boreal.webp", weight: 3 },
        { n: "★ Bayonet | Autotronic", p: 69500, img: "Fototovar/knife/bayonet-auto.webp", weight: 3 },
        { n: "★ Karambit | Ultraviolet", p: 74000, img: "Fototovar/knife/karam-ultra.webp", weight: 2 },
        { n: "★ Classic Knife | Fade", p: 78900, img: "Fototovar/knife/classic-fade.webp", weight: 2 },
        { n: "★ Butterfly Knife | Rust Coat", p: 82500, img: "Fototovar/knife/bfk-rust.webp", weight: 2 },
        { n: "★ M9 Bayonet | Doppler", p: 88000, img: "Fototovar/knife/m9-doppler.webp", weight: 1 },
        { n: "★ Skeleton Knife | Case Hardened", p: 91200, img: "Fototovar/knife/skeleton-case.webp", weight: 1 },
        { n: "★ Karambit | Black Laminate", p: 94600, img: "Fototovar/knife/karam-black.webp", weight: 1 },
        { n: "★ Talon Knife | Tiger Tooth", p: 97800, img: "Fototovar/knife/talon-tiger.webp", weight: 1 },
        { n: "★ Butterfly Knife | Blue Steel", p: 100000, img: "Fototovar/knife/bfk-blue.webp", weight: 1 }
    ]}
];

// --- СОСТОЯНИЕ ---
let balance = localStorage.getItem('bal') !== null ? Number(localStorage.getItem('bal')) : 5000;
let inv = JSON.parse(localStorage.getItem('inv')) || [];
let upId = null, conIds = [], isSpinning = false, isTurbo = false;

window.onload = () => {
    save();
    renderCases();
};

function save() {
    localStorage.setItem('bal', balance);
    localStorage.setItem('inv', JSON.stringify(inv));
    const balEl = document.getElementById('balance');
    if (balEl) balEl.innerText = Math.floor(balance).toLocaleString();
    render();
}

function router(pageId) {
    if (isSpinning) return;
    document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
    const target = document.getElementById('sec-' + pageId);
    if (target) target.style.display = 'block';
    
    upId = null; conIds = []; 
    const failText = document.getElementById('fail-text');
    if (failText) failText.remove();
    
    if (pageId === 'cases') renderCases();
    render();
}

function renderCases() {
    const grid = document.getElementById('casesGrid');
    if (grid) {
        grid.innerHTML = CASES.map((c, idx) => `
            <div class="card" onclick="goToCase(${idx})">
                <img src="${c.img}">
                <h3>${c.name}</h3>
                <p>${c.price} ₽</p>
            </div>
        `).join('');
    }
}

function render() {
    const activePage = document.querySelector('.page:not([style*="display: none"])');
    if (!activePage) return;
    const pageId = activePage.id;

    // Генерируем HTML инвентаря
    const html = inv.map(i => {
        const isSelected = (String(upId) === String(i.id)) || conIds.includes(String(i.id));
        let extra = (pageId === 'sec-inventory') ? `<button onclick="sell('${i.id}'); event.stopPropagation()" class="action-btn sell-btn" style="padding:5px; margin-top:10px; font-size:12px;">Продать</button>` : '';
        return `
            <div class="card ${isSelected ? 'selected' : ''}" onclick="handleItemClick('${i.id}')">
                <img src="${i.img}">
                <h4>${i.n}</h4>
                <p>${i.p} ₽</p>
                ${extra}
            </div>`;
    }).join('');

    // Отрисовываем в нужную сетку
    const grids = ['inventoryGrid', 'upInvGrid', 'conInvGrid'];
    grids.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = html;
    });

    // Обновление специфичных элементов страниц
    if (pageId === 'sec-upgrade') updateWheel();
    
    if (pageId === 'sec-contract') {
        const conList = document.getElementById('conSelectedList');
        if (conList) {
            conList.innerHTML = conIds.map(id => {
                const item = inv.find(x => String(x.id) === id);
                return item ? `<div class="card selected"><img src="${item.img}"><p>${item.p} ₽</p></div>` : '';
            }).join('');
        }
        if (document.getElementById('conCount')) document.getElementById('conCount').innerText = conIds.length;
        const sum = conIds.reduce((s, cid) => s + (inv.find(x => String(x.id) === cid)?.p || 0), 0);
        if (document.getElementById('conSum')) document.getElementById('conSum').innerText = sum;
    }
}

function handleItemClick(id) {
    const activePage = document.querySelector('.page:not([style*="display: none"])');
    if (!activePage) return;
    const pageId = activePage.id;
    const itemId = String(id);

    if (pageId === 'sec-upgrade') {
        upId = (upId === itemId) ? null : itemId;
        const item = inv.find(x => String(x.id) === upId);
        const box = document.getElementById('up-item-box');
        if (box) box.innerHTML = item ? `<b>${item.n}</b><br>${item.p} ₽` : "Выберите скин";
        const btn = document.getElementById('runUpBtn');
        if (btn) btn.disabled = !item;
    }

    if (pageId === 'sec-contract') {
        if (conIds.includes(itemId)) {
            conIds = conIds.filter(x => x !== itemId);
        } else if (conIds.length < 10) {
            conIds.push(itemId);
        }
        const btn = document.getElementById('conBtn');
        if (btn) btn.disabled = (conIds.length < 3);
    }
    render();
}

function updateWheel() {
    const chInput = document.getElementById('upChance');
    if (!chInput) return;
    const ch = chInput.value;
    const label = document.getElementById('upLabel');
    if (label) label.innerText = ch;
    
    const item = inv.find(x => String(x.id) === upId);
    const winText = document.getElementById('upWin');
    if (item && winText) winText.innerText = Math.floor(item.p * (100 / ch));
    
    const circle = document.getElementById('progressCircle');
    if (circle) circle.style.strokeDashoffset = 283 - (283 * ch / 100);
}

function toggleTurbo() {
    isTurbo = !isTurbo;
    const btn = document.getElementById('turbo-btn');
    if (btn) btn.classList.toggle('active', isTurbo);
}

function runUpgrade() {
    const idx = inv.findIndex(x => String(x.id) === upId);
    if (idx === -1) return;

    const visualCh = Number(document.getElementById('upChance').value);
    const realCh = visualCh / 1.5; 
    
    const wheel = document.getElementById('wheel');
    const runBtn = document.getElementById('runUpBtn');
    if (runBtn) runBtn.disabled = true;

    const oldFail = document.getElementById('fail-text');
    if (oldFail) oldFail.remove();

    const isWin = (Math.random() * 100) <= realCh;
    let finalAngle = isWin ? Math.random() * (visualCh * 3.6) : (visualCh * 3.6 + 5) + Math.random() * (350 - visualCh * 3.6);

    const totalRotation = 1800 + (360 - finalAngle);
    wheel.style.transition = isTurbo ? '1.2s cubic-bezier(0.15, 0, 0.15, 1)' : '4s cubic-bezier(0.15, 0, 0.15, 1)';
    wheel.style.transform = `rotate(${totalRotation - 90}deg)`;

    setTimeout(() => {
        if (isWin) {
            const newItem = { n: inv[idx].n + " +", p: Math.floor(inv[idx].p * (100 / visualCh)), img: inv[idx].img, id: "it" + Date.now() };
            inv.splice(idx, 1);
            inv.push(newItem);
            showModal(newItem);
        } else {
            inv.splice(idx, 1);
            const fail = document.createElement('div');
            fail.id = 'fail-text';
            fail.innerHTML = "УВЫ";
            fail.style = "position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); color:var(--gold); font-size:45px; font-weight:900; animation: failAnim 0.5s ease-out; z-index:15; pointer-events:none;";
            document.querySelector('.upgrade-visual').appendChild(fail);
        }
        setTimeout(() => {
            wheel.style.transition = 'none';
            wheel.style.transform = 'rotate(-90deg)';
            upId = null; save();
        }, 800);
    }, isTurbo ? 1300 : 4100);
}

function runContract() {
    if (conIds.length < 3) return;
    const sum = conIds.reduce((s, id) => s + (inv.find(x => String(x.id) === id)?.p || 0), 0);
    inv = inv.filter(x => !conIds.includes(String(x.id)));
    const contractWin = { n: "Из контракта", p: Math.floor(sum * (0.8 + Math.random() * 0.7)), img: "img/i4.png", id: "it" + Date.now() };
    inv.push(contractWin);
    conIds = []; save();
    showModal(contractWin);
}

// --- КЕЙСЫ ---
function goToCase(idx) {
    router('open-case');
    const c = CASES[idx];
    document.getElementById('case-info-header').innerHTML = `<h2 style="color:${c.color}">${c.name}</h2>`;
    document.getElementById('btnFast').onclick = () => openCase(idx, true);
    document.getElementById('btnSlow').onclick = () => openCase(idx, false);
    document.getElementById('case-items-inner').innerHTML = c.drop.map(i => `<div class="card"><img src="${i.img}"><h4>${i.n}</h4><p>${i.p} ₽</p></div>`).join('');
}

function openCase(idx, fast) {
    if (isSpinning || balance < CASES[idx].price) return;
    const total = CASES[idx].drop.reduce((s, i) => s + i.weight, 0);
    let r = Math.random() * total, winItem;
    for (let i of CASES[idx].drop) { if (r < i.weight) { winItem = i; break; } r -= i.weight; }
    
    const win = {...winItem, id: "it" + Date.now()};
    balance -= CASES[idx].price;
    if (fast) { inv.push(win); showModal(win); save(); } 
    else { isSpinning = true; spinAnim(idx, win); }
}

function spinAnim(idx, win) {
    const track = document.getElementById('rouletteTrack');
    const itemW = 184, winPos = 40;
    let h = "";
    for(let i=0; i<55; i++) {
        const item = (i === winPos) ? win : CASES[idx].drop[Math.floor(Math.random() * CASES[idx].drop.length)];
        h += `<div class="roulette-item"><img src="${item.img}"></div>`;
    }
    track.innerHTML = h;
    track.style.transition = "none";
    track.style.transform = "translateX(0)";
    setTimeout(() => {
        track.style.transition = "transform 4s cubic-bezier(0.15, 0, 0.15, 1)";
        const offset = -(winPos * itemW) + (track.parentElement.offsetWidth / 2) - (itemW / 2);
        track.style.transform = `translateX(${offset}px)`;
    }, 50);
    setTimeout(() => { isSpinning = false; inv.push(win); showModal(win); save(); }, 4500);
}

// --- МОДАЛКА И ПРОДАЖА ---
function showModal(item) {
    const modal = document.getElementById('drop-modal');
    document.getElementById('m-img').src = item.img;
    document.getElementById('m-name').innerText = item.n;
    document.getElementById('m-price').innerText = item.p + " ₽";
    document.getElementById('m-sell').onclick = () => {
        const idx = inv.findIndex(x => x.id === item.id);
        if (idx !== -1) { balance += inv[idx].p; inv.splice(idx, 1); save(); }
        closeModal();
    };
    modal.style.display = 'flex';
}

function closeModal() { document.getElementById('drop-modal').style.display = 'none'; }

function sell(id) {
    const idx = inv.findIndex(x => String(x.id) === String(id));
    if (idx !== -1) { balance += inv[idx].p; inv.splice(idx, 1); save(); }
}

function sellAll() { inv.forEach(i => balance += i.p); inv = []; save(); }

function getTgBonus() { balance += 1000; save(); alert("Бонус за подписку 1000 ₽ зачислен!"); }
