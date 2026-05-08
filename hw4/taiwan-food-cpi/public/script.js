const drinkInfo = {
    '珍珠奶茶': { emoji: '🧋', bg: '#FDF3E7', color: '#92400E', label: 'Pearl Milk Tea' },
    '梅子綠茶': { emoji: '🍵', bg: '#ECFDF5', color: '#065F46', label: 'Plum Green Tea' },
    '優多綠茶': { emoji: '🍶', bg: '#F0FDF4', color: '#166534', label: 'Yogurt Green Tea' },
    '原鄉四季': { emoji: '🍃', bg: '#F0FDFA', color: '#115E59', label: 'Four Seasons Tea' },
    '冰淇淋紅茶': { emoji: '🍦', bg: '#FFF7ED', color: '#9A3412', label: 'Ice Cream Black Tea' },
};

function getDrinkInfo(name) {
    return drinkInfo[name] || { emoji: '🥤', bg: '#E8F5EE', color: '#00873C', label: name };
}

// ── Floating boba bubbles in hero ───────────
function createHeroBubbles() {
    const container = document.querySelector('.bubbles-container');
    if (!container) return;
    for (let i = 0; i < 22; i++) {
        const b = document.createElement('span');
        b.className = 'bubble';
        const size = Math.random() * 24 + 6;
        b.style.cssText = `left:${Math.random()*100}%;width:${size}px;height:${size}px;` +
            `animation-delay:${Math.random()*12}s;animation-duration:${Math.random()*7+8}s;`;
        container.appendChild(b);
    }
}

// ── Animated stat counter ───────────────────
function animateCounter(el, target) {
    const from = parseInt(el.textContent) || 0;
    if (from === target) return;
    const t0 = performance.now();
    const dur = 900;
    el.classList.remove('stat-pop');
    void el.offsetWidth;
    el.classList.add('stat-pop');
    (function tick(now) {
        const p = Math.min((now - t0) / dur, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(from + (target - from) * ease);
        if (p < 1) requestAnimationFrame(tick);
    })(t0);
}

// ── 3D tilt on drink cards ──────────────────
function add3DTilt() {
    if ('ontouchstart' in window) return;
    document.querySelectorAll('.drink-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const r  = card.getBoundingClientRect();
            const rx = ((e.clientY - r.top  - r.height/2) / (r.height/2)) * 13;
            const ry = ((r.width/2  - (e.clientX - r.left)) / (r.width/2)) * 13;
            card.style.transform = `perspective(600px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-10px) scale(1.06)`;
            card.style.transition = 'transform 0.05s, box-shadow 0.05s';
            card.style.boxShadow  = `${-ry*1.5}px ${rx*1.2}px 28px rgba(0,135,60,0.22)`;
            card.style.zIndex     = '2';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform  = '';
            card.style.transition = 'transform 0.45s ease, box-shadow 0.45s ease';
            card.style.boxShadow  = '';
            card.style.zIndex     = '';
        });
    });
}

// ── Confetti burst on success ───────────────
function launchConfetti() {
    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9998;';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    const palette = ['#00873C','#43C678','#FFD700','#FF6B6B','#4ECDC4','#A78BFA','#FFFFFF'];
    const parts = Array.from({ length: 100 }, () => ({
        x:  Math.random() * canvas.width,
        y: -20,
        vx: (Math.random() - 0.5) * 6,
        vy: Math.random() * 4 + 2,
        rot: Math.random() * 360,
        rs:  (Math.random() - 0.5) * 14,
        size: Math.random() * 9 + 4,
        color: palette[Math.floor(Math.random() * palette.length)],
        circle: Math.random() > 0.5,
    }));
    let frame = 0;
    (function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        parts.forEach(p => {
            p.x += p.vx; p.y += p.vy; p.vy += 0.09; p.rot += p.rs;
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rot * Math.PI / 180);
            ctx.globalAlpha = Math.max(0, 1 - frame / 110);
            ctx.fillStyle = p.color;
            if (p.circle) {
                ctx.beginPath(); ctx.arc(0, 0, p.size/2, 0, Math.PI*2); ctx.fill();
            } else {
                ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size * 0.55);
            }
            ctx.restore();
        });
        if (++frame < 130) requestAnimationFrame(draw);
        else canvas.remove();
    })();
}

// ── Ripple on button click ──────────────────
function addRipple(btn) {
    btn.addEventListener('click', function(e) {
        const r  = this.getBoundingClientRect();
        const el = document.createElement('span');
        el.className  = 'ripple-effect';
        el.style.left = `${e.clientX - r.left}px`;
        el.style.top  = `${e.clientY - r.top}px`;
        this.appendChild(el);
        setTimeout(() => el.remove(), 700);
    });
}

// ── Typewriter effect ───────────────────────
function typeWriter(el, speed = 38) {
    const text = el.textContent;
    el.textContent = '';
    el.classList.add('typing');
    let i = 0;
    const timer = setInterval(() => {
        el.textContent += text[i++];
        if (i >= text.length) { clearInterval(timer); el.classList.remove('typing'); }
    }, speed);
}

document.addEventListener("DOMContentLoaded", () => {
    const form        = document.getElementById("price-form");
    const tableBody   = document.getElementById("table-body");
    const searchInput = document.getElementById("searchInput");
    const spinner     = document.getElementById("loading-spinner");
    const tableContainer = document.getElementById("table-container");
    const statCount   = document.getElementById("stat-count");
    const statItems   = document.getElementById("stat-items");
    const toast       = document.getElementById("toast");

    createHeroBubbles();
    addRipple(form.querySelector('.btn-submit'));
    const heroP = document.querySelector('.hero p');
    if (heroP) typeWriter(heroP);

    const datePicker = flatpickr("#date", {
        locale: "zh_tw",
        defaultDate: new Date(),
        dateFormat: "Y-m-d",
        disableMobile: true,
    });

    // ── Loading state ──────────────────────────
    function setLoading(on) {
        spinner.style.display      = on ? "flex"  : "none";
        tableContainer.style.display = on ? "none" : "block";
    }

    // ── Toast notification ─────────────────────
    let toastTimer;
    function showToast(text, type = "success") {
        clearTimeout(toastTimer);
        toast.textContent = text;
        toast.className = `toast toast-${type} show`;
        toastTimer = setTimeout(() => {
            toast.classList.add("hide");
            setTimeout(() => { toast.className = "toast"; }, 380);
        }, 3000);
    }

    // ── Escape HTML (XSS prevention) ───────────
    function esc(str) {
        return String(str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    }

    // ── Fetch prices ───────────────────────────
    async function fetchPrices(keyword = "", highlightNew = false) {
        setLoading(true);
        try {
            const url = keyword
                ? `/api/prices?q=${encodeURIComponent(keyword)}`
                : "/api/prices";
            const res  = await fetch(url);
            const data = await res.json();
            renderTable(data, highlightNew);
            if (!keyword) renderDrinksShowcase(data);

            animateCounter(statCount, data.length);
            animateCounter(statItems, new Set(data.map(d => d.item_name)).size);
        } catch (err) {
            console.error("Fetch error:", err);
            showToast("❌ Failed to load data!", "error");
            setLoading(false);
        }
    }

    // ── Render drinks showcase ─────────────────
    function renderDrinksShowcase(data) {
        const grid = document.getElementById('drinks-grid');
        if (!grid) return;

        const latest   = new Map();
        const earliest = new Map();
        data.forEach(item => {
            const ex = latest.get(item.item_name);
            if (!ex || item.date > ex.date) latest.set(item.item_name, item);
            const en = earliest.get(item.item_name);
            if (!en || item.date < en.date) earliest.set(item.item_name, item);
        });

        const order = ['珍珠奶茶', '梅子綠茶', '優多綠茶', '原鄉四季', '冰淇淋紅茶'];
        const sorted = [...latest.values()].sort((a, b) => {
            const ai = order.indexOf(a.item_name);
            const bi = order.indexOf(b.item_name);
            return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
        });

        grid.innerHTML = '';
        sorted.forEach(item => {
            const info  = getDrinkInfo(item.item_name);
            const first = earliest.get(item.item_name);
            let trendHtml = '';
            if (first && first.id !== item.id && first.price !== item.price) {
                const diff = item.price - first.price;
                const pct  = Math.abs(((diff / first.price) * 100)).toFixed(0);
                const up   = diff > 0;
                trendHtml  = `<div class="drink-trend ${up ? 'trend-up' : 'trend-down'}">${up ? '↑' : '↓'} ${up ? '+' : '-'}${pct}%</div>`;
            }
            const card = document.createElement('div');
            card.className = 'drink-card';
            card.innerHTML = `
                <div class="drink-img" style="background:${info.bg}">${info.emoji}</div>
                <div class="drink-card-name">${esc(item.item_name)}</div>
                <div class="drink-card-label">${esc(info.label)}</div>
                <div class="drink-card-price">NT$ ${item.price}</div>
                ${trendHtml}
            `;
            grid.appendChild(card);
        });

        add3DTilt();
    }

    // ── Render table ───────────────────────────
    function renderTable(data, highlightNew = false) {
        setLoading(false);
        tableBody.innerHTML = "";

        if (data.length === 0) {
            tableBody.innerHTML = `
                <tr><td colspan="4">
                    <div class="empty-state">
                        <div class="empty-icon">🔍</div>
                        <p>No records found &nbsp;查無資料</p>
                    </div>
                </td></tr>`;
            return;
        }

        data.forEach((item, i) => {
            const tr = document.createElement("tr");
            tr.dataset.id = item.id;
            if (highlightNew && i === 0) tr.classList.add("row-new");
            const info = getDrinkInfo(item.item_name);
            tr.innerHTML = `
                <td>${esc(item.date)}</td>
                <td>
                    <div class="drink-cell">
                        <span class="drink-thumb" style="background:${info.bg}">${info.emoji}</span>
                        ${esc(item.item_name)}
                    </div>
                </td>
                <td class="price-tag">NT$ ${item.price}</td>
                <td><button class="btn-delete" onclick="deletePrice(${item.id})">Delete 刪除</button></td>
            `;
            tableBody.appendChild(tr);
        });
    }

    // ── Submit form ────────────────────────────
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const date      = document.getElementById("date").value;
        const item_name = document.getElementById("item_name").value;
        const price     = document.getElementById("price").value;

        const btn     = form.querySelector(".btn-submit");
        const btnText = btn.querySelector(".btn-text");
        btn.disabled  = true;
        btnText.textContent = "Submitting... 送出中";

        try {
            const res = await fetch("/api/insert", {
                method:  "POST",
                headers: { "Content-Type": "application/json" },
                body:    JSON.stringify({ date, item_name, price })
            });
            const msg = await res.text();

            if (res.ok) {
                showToast("✅ " + msg, "success");
                launchConfetti();
                form.reset();
                datePicker.setDate(new Date());
                fetchPrices(searchInput.value.trim(), true);
            } else {
                showToast("❌ " + msg, "error");
            }
        } catch {
            showToast("❌ Connection error!", "error");
        } finally {
            btn.disabled = false;
            btnText.textContent = "Submit 送出";
        }
    });

    // ── Delete ─────────────────────────────────
    window.deletePrice = async function(id) {
        if (!confirm("確定要刪除這筆紀錄嗎？\nAre you sure you want to delete this record?")) return;

        const row = tableBody.querySelector(`tr[data-id="${id}"]`);
        if (row) {
            row.classList.add("row-deleting");
            await new Promise(r => setTimeout(r, 300));
        }

        try {
            const res = await fetch("/api/prices/" + id, { method: "DELETE" });
            const msg = await res.text();
            showToast("🗑️ " + msg, "success");
            fetchPrices(searchInput.value.trim());
        } catch {
            showToast("❌ Delete failed!", "error");
        }
    };

    // ── Search (debounced) ─────────────────────
    let searchTimer;
    searchInput.addEventListener("input", (e) => {
        clearTimeout(searchTimer);
        searchTimer = setTimeout(() => fetchPrices(e.target.value.trim()), 300);
    });

    // ── Initial load ───────────────────────────
    fetchPrices();
});
