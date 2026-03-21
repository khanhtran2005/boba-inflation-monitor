  const fillEl    = document.getElementById('energyFill');
  const pctEl     = document.getElementById('energyPct');
  const statusEl  = document.getElementById('energyStatus');
  const h1El      = document.querySelector('.empathy-header h1');

  const CYCLE_MS  = 45000;
  let startTime   = Date.now();
  let cycleCount  = 0;

  const statusMsgs = [
    '🔧 工程師正在搶修中...',
    '⚙️ 正在重新啟動伺服器...',
    '📡 正在重新連接資料庫...',
    '🔍 正在檢查系統狀態...',
    '🛠️ 正在修復影片串流服務...',
    '💾 正在同步伺服器資料...',
    '🔄 正在重新部署服務...',
  ];

  function tickEnergy() {
    const elapsed = Date.now() - startTime;
    const progress = elapsed / CYCLE_MS;

    if (progress >= 1) {
      cycleCount++;
      startTime = Date.now();

      pctEl.textContent = '100%';
      pctEl.style.color = '#3ecf6a';
      fillEl.style.width = '100%';
      fillEl.classList.remove('danger');
      statusEl.textContent = cycleCount === 1
        ? '✅ 第一階段完成！繼續修復中...'
        : `✅ 第 ${cycleCount} 階段完成！繼續修復中...`;
      statusEl.style.color = '#3ecf6a';

      setTimeout(() => {
        pctEl.style.color = '';
        statusEl.style.color = '';
      }, 1800);

      setTimeout(tickEnergy, 100);
      return;
    }

    const remaining = Math.max(0, 1 - progress);
    const pct = Math.round(remaining * 100);
    const w   = remaining * 100;

    fillEl.style.width = w + '%';
    pctEl.textContent  = pct + '%';

    if (pct <= 25) {
      fillEl.classList.add('danger');
      pctEl.style.color = '#ff8080';
    } else {
      fillEl.classList.remove('danger');
      pctEl.style.color  = '';
    }

    const msgIdx = Math.floor(progress * statusMsgs.length) % statusMsgs.length;
    if (statusEl.dataset.idx !== String(msgIdx)) {
      statusEl.dataset.idx = msgIdx;
      statusEl.textContent = statusMsgs[msgIdx];
    }

    requestAnimationFrame(tickEnergy);
  }
  tickEnergy();

  let retrying = false;
  function handleRetry() {
    if (retrying) return;
    retrying = true;
    showToast('🔄 正在嘗試重新連線...');
    setTimeout(() => {
      showToast('❌ 伺服器尚未恢復，請繼續等待！');
      retrying = false;
    }, 2200);
  }


  const tvBtn      = document.getElementById('stressReliefBtn');
  const tvScreen   = document.getElementById('tvScreen');
  const tvPlay     = document.getElementById('tvPlay');
  const hintEl     = document.getElementById('hintMessage');
  const clickBadge = document.getElementById('clickBadge');
  const toastEl    = document.getElementById('toast');

  const emojis = ['🍿','💥','🔧','🔥','⚙️','🐒','☕','🍌','❤️','⭐','🎉','💫','🌟','😤'];
  const hints = [
    '💡 提示：點擊上方電視來發洩心中的不滿吧！',
    '✨ 加油！小猴子感受到你的念力了！',
    '🔥 很好，這就是發洩的力量！再點幾下！',
    '🍌 哦？點這麼快，是要請工程師吃香蕉嗎？',
    '❤️ 謝謝您的耐心，工程師正在全力搶修！',
    '😂 你是認真的嗎？已經點了這麼多下了！',
    '🎉 破紀錄了！您是最有耐心的用戶！',
  ];
  const playEmojis = ['▶','💥','🔧','🐒','⚙️','🔥','⭐'];

  let clickCount = 0, toastShown = false, shakeTimer = null;

  tvBtn.addEventListener('click', (e) => {
    clickCount++;
    clickBadge.textContent = clickCount;
    clickBadge.classList.add('visible');

    tvScreen.classList.remove('flash');
    void tvScreen.offsetWidth;
    tvScreen.classList.add('flash');

    tvBtn.classList.remove('shake');
    void tvBtn.offsetWidth;
    tvBtn.classList.add('shake');
    clearTimeout(shakeTimer);
    shakeTimer = setTimeout(() => tvBtn.classList.remove('shake'), 400);

    tvPlay.textContent = playEmojis[Math.min(Math.floor(clickCount/5), playEmojis.length-1)];

    if (clickCount % 5 === 0) {
      let next;
      do { next = Math.floor(Math.random() * hints.length); }
      while (hints[next] === hintEl.textContent);
      hintEl.textContent = hints[next];
      hintEl.classList.add('flash-blue');
      setTimeout(() => hintEl.classList.remove('flash-blue'), 350);
    }

    if (clickCount === 10 && !toastShown) {
      toastShown = true;
      showToast('✨ 謝謝您的耐心！工程師們感謝您！🙏');
    }

    spawnEmoji(e.clientX, e.clientY);
  });

  function spawnEmoji(cx, cy) {
    const p = document.createElement('span');
    p.className = 'emoji-fly';
    p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    p.style.left = cx + 'px';
    p.style.top  = cy + 'px';
    p.style.setProperty('--dx', ((Math.random()-.5)*220)+'px');
    p.style.setProperty('--rot', ((Math.random()-.5)*120)+'deg');
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 950);
  }


  let tt;
  function showToast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(tt);
    tt = setTimeout(() => toastEl.classList.remove('show'), 3500);
  }