/* ============================================================
 * AlgoHub 主应用逻辑
 * 功能：页面切换 / 渲染 / 错题本 CRUD / 学习进度 /
 *       搜索过滤 / 主题切换 / 数据持久化 / 导出
 * ============================================================ */

(function () {
  'use strict';

  /* ---------- 存储工具 ---------- */
  const Store = {
    get(key, fallback) {
      try {
        const v = localStorage.getItem(key);
        return v ? JSON.parse(v) : fallback;
      } catch (e) { return fallback; }
    },
    set(key, val) {
      localStorage.setItem(key, JSON.stringify(val));
    }
  };

  /* ---------- 状态 ---------- */
  const state = {
    wrongList: Store.get('ah_wrong', []),
    progress: Object.assign({}, DEFAULT_PROGRESS, Store.get('ah_progress', {})),
    checkin: Store.get('ah_checkin', []),        // 打卡日期数组 ['2026-10-26', ...]
    theme: Store.get('ah_theme', 'dark'),
    customPlatforms: Store.get('ah_platforms', []), // 用户自定义平台
    customLearning: Store.get('ah_learning', []),
    customVideos: Store.get('ah_videos', []),
    editingWrongId: null,
    filters: { platform: '', learning: '', video: '', wrong: '' }
  };

  /* ---------- 工具函数 ---------- */
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);
  const escapeHtml = (s) => (s || '').replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
  const todayStr = () => new Date().toISOString().slice(0, 10);
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

  /* ---------- Toast ---------- */
  function toast(msg, type = 'info') {
    const icons = { success: '✓', error: '✕', info: 'ℹ' };
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.innerHTML = `<span>${icons[type] || 'ℹ'}</span><span>${escapeHtml(msg)}</span>`;
    $('#toastContainer').appendChild(el);
    setTimeout(() => {
      el.style.animation = 'toastIn 0.3s ease reverse';
      setTimeout(() => el.remove(), 300);
    }, 2600);
  }

  /* ---------- 主题 ---------- */
  function applyTheme() {
    document.body.classList.toggle('light-theme', state.theme === 'light');
    $('#themeToggle').textContent = state.theme === 'light' ? '☀️' : '🌙';
  }

  /* ---------- 页面切换 ---------- */
  function switchPage(page) {
    $$('.page-section').forEach(s => s.classList.remove('active'));
    $$('.nav-link').forEach(l => l.classList.remove('active'));
    const section = $('#page-' + page);
    if (section) section.classList.add('active');
    const link = document.querySelector(`.nav-link[data-page="${page}"]`);
    if (link) link.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // 按页面渲染
    if (page === 'home') renderHome();
    if (page === 'platforms') renderPlatforms();
    if (page === 'learning') renderLearning();
    if (page === 'videos') renderVideos();
    if (page === 'wrongbook') renderWrongbook();
    if (page === 'progress') renderProgress();
  }

  /* ---------- 渲染：卡片通用 ---------- */
  function tagHtml(tag, cls = '') {
    return `<span class="card-tag ${cls}">${escapeHtml(tag)}</span>`;
  }

  function platformCard(p) {
    const tags = p.tags.map((t, i) => tagHtml(t, ['', 'purple', 'green', 'orange'][i % 4])).join(' ');
    return `
      <div class="card">
        <div class="card-header">
          <div class="card-icon">${p.icon || '🔗'}</div>
          ${p.featured ? tagHtml('推荐', 'pink') : ''}
        </div>
        <h3 class="card-title">${escapeHtml(p.name)}</h3>
        <p class="card-desc">${escapeHtml(p.desc)}</p>
        <div style="margin-bottom:10px">${tags}</div>
        <div class="card-footer">
          <span class="card-tag blue">${escapeHtml(p.difficulty || '综合')}</span>
          <a class="btn-link" href="${escapeHtml(p.url)}" target="_blank" rel="noopener">前往 →</a>
        </div>
      </div>`;
  }

  function learningCard(l) {
    const tags = l.tags.map((t, i) => tagHtml(t, ['', 'green', 'purple', 'orange'][i % 4])).join(' ');
    return `
      <div class="card">
        <div class="card-header">
          <div class="card-icon">${l.icon || '📖'}</div>
          ${l.featured ? tagHtml('精选', 'green') : ''}
        </div>
        <h3 class="card-title">${escapeHtml(l.name)}</h3>
        <p class="card-desc">${escapeHtml(l.desc)}</p>
        <div style="margin-bottom:10px">${tags}</div>
        <div class="card-footer">
          <span class="card-tag purple">${escapeHtml(l.type || '资源')}</span>
          <a class="btn-link" href="${escapeHtml(l.url)}" target="_blank" rel="noopener">打开 →</a>
        </div>
      </div>`;
  }

  function videoCard(v) {
    const tags = v.tags.map((t, i) => tagHtml(t, ['', 'orange', 'green', 'purple'][i % 4])).join(' ');
    return `
      <div class="card video-card" data-video="${v.id}">
        <div class="video-thumb" style="background:${v.color || 'var(--gradient-primary)'}">
          <span class="video-duration">${escapeHtml(v.duration || '')}</span>
        </div>
        <h3 class="card-title">${escapeHtml(v.title)}</h3>
        <p class="card-desc">${escapeHtml(v.desc)}</p>
        <div style="margin-bottom:10px">${tags}</div>
        <div class="card-footer">
          <span class="card-tag orange">👤 ${escapeHtml(v.author || '')}</span>
          <span class="card-tag blue">${escapeHtml(v.category || '')}</span>
        </div>
      </div>`;
  }

  /* ---------- 首页 ---------- */
  function renderHome() {
    const platforms = DEFAULT_DATA.platforms;
    const learning = DEFAULT_DATA.learning;
    const videos = DEFAULT_DATA.videos;

    $('#statPlatforms').textContent = platforms.length;
    $('#statVideos').textContent = videos.length;
    $('#statWrong').textContent = state.wrongList.length;
    $('#statCheckin').textContent = computeStreak();

    // 算法导航
    $('#algoNav').innerHTML = DEFAULT_DATA.categories.map(c => {
      const count = state.wrongList.filter(w => w.category === mapCategoryToWrong(c.key)).length;
      return `
        <div class="algo-nav-item" data-cat="${c.key}">
          <div class="algo-nav-icon">${c.icon}</div>
          <div class="algo-nav-name">${escapeHtml(c.name)}</div>
          <div class="algo-nav-count">错题 ${count}</div>
        </div>`;
    }).join('');
    $$('#algoNav .algo-nav-item').forEach(el => {
      el.addEventListener('click', () => {
        const key = el.dataset.cat;
        // 跳转到错题本并按分类筛选
        state.filters.wrong = mapCategoryToWrong(key);
        switchPage('wrongbook');
        // 选中对应 chip
        setTimeout(() => {
          $$('#wrongFilters .chip').forEach(c => {
            c.classList.toggle('active', c.dataset.val === state.filters.wrong);
          });
        }, 50);
      });
    });

    // 统计面板
    const totalProgress = Object.values(state.progress).reduce((a, b) => a + b, 0);
    const avgProgress = Math.round(totalProgress / Object.keys(state.progress).length);
    $('#statsGrid').innerHTML = `
      <div class="stat-box">
        <div class="stat-value">${avgProgress}%</div>
        <div class="stat-label">平均掌握度</div>
      </div>
      <div class="stat-box">
        <div class="stat-value">${state.checkin.length}</div>
        <div class="stat-label">累计打卡</div>
      </div>
      <div class="stat-box">
        <div class="stat-value">${computeStreak()}</div>
        <div class="stat-label">连续打卡</div>
      </div>
      <div class="stat-box">
        <div class="stat-value">${state.wrongList.length}</div>
        <div class="stat-label">错题总数</div>
      </div>
    `;

    // 快捷入口
    const quick = [
      { icon: '🏆', name: 'LeetCode', url: 'https://leetcode.cn', desc: '面试刷题首选', tag: '刷题' },
      { icon: '📚', name: 'OI Wiki', url: 'https://oi-wiki.org', desc: '算法知识整合', tag: '文档' },
      { icon: '🎯', name: 'VisuAlgo', url: 'https://visualgo.net/zh', desc: '算法可视化', tag: '工具' },
      { icon: '📝', name: '我的错题本', url: 'javascript:void(0)', desc: `${state.wrongList.length} 道错题`, tag: '本地', action: 'wrongbook' }
    ];
    $('#quickAccess').innerHTML = quick.map(q => `
      <div class="card" ${q.action ? `data-action="${q.action}"` : ''} ${!q.action ? `onclick="window.open('${q.url}','_blank')"` : ''} style="cursor:pointer">
        <div class="card-header">
          <div class="card-icon">${q.icon}</div>
          ${tagHtml(q.tag, 'green')}
        </div>
        <h3 class="card-title">${escapeHtml(q.name)}</h3>
        <p class="card-desc">${escapeHtml(q.desc)}</p>
      </div>
    `).join('');
    $$('#quickAccess .card[data-action]').forEach(el => {
      el.addEventListener('click', () => switchPage(el.dataset.action));
    });
  }

  function mapCategoryToWrong(key) {
    const map = {
      array: '数组', list: '链表', stack: '栈与队列', tree: '树',
      graph: '图', hash: '哈希表', binary: '二分查找', sort: '排序',
      dp: '动态规划', greedy: '贪心', backtrack: '回溯', bit: '位运算'
    };
    return map[key] || '其他';
  }

  /* ---------- 刷题平台 ---------- */
  function renderPlatforms() {
    const all = DEFAULT_DATA.platforms.concat(state.customPlatforms);
    const q = ($('#platformSearch').value || '').toLowerCase();
    const filtered = all.filter(p =>
      !q || p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q)
    ).filter(p => !state.filters.platform || p.tags.includes(state.filters.platform));

    // 过滤标签
    const allTags = [...new Set(all.flatMap(p => p.tags))];
    $('#platformFilters').innerHTML = `<button class="chip ${!state.filters.platform ? 'active' : ''}" data-val="">全部</button>` +
      allTags.map(t => `<button class="chip ${state.filters.platform === t ? 'active' : ''}" data-val="${escapeHtml(t)}">${escapeHtml(t)}</button>`).join('');
    $$('#platformFilters .chip').forEach(c => c.addEventListener('click', () => {
      state.filters.platform = c.dataset.val;
      renderPlatforms();
    }));

    $('#platformGrid').innerHTML = filtered.length ? filtered.map(platformCard).join('') :
      `<div class="empty-state" style="grid-column:1/-1"><div class="empty-state-icon">🔍</div><div class="empty-state-text">未找到匹配的平台</div></div>`;
  }

  /* ---------- 学习资源 ---------- */
  function renderLearning() {
    const all = DEFAULT_DATA.learning.concat(state.customLearning);
    const q = ($('#learningSearch').value || '').toLowerCase();
    const filtered = all.filter(l =>
      !q || l.name.toLowerCase().includes(q) || l.desc.toLowerCase().includes(q)
    ).filter(l => !state.filters.learning || l.type === state.filters.learning);

    const types = [...new Set(all.map(l => l.type))];
    $('#learningFilters').innerHTML = `<button class="chip ${!state.filters.learning ? 'active' : ''}" data-val="">全部</button>` +
      types.map(t => `<button class="chip ${state.filters.learning === t ? 'active' : ''}" data-val="${escapeHtml(t)}">${escapeHtml(t)}</button>`).join('');
    $$('#learningFilters .chip').forEach(c => c.addEventListener('click', () => {
      state.filters.learning = c.dataset.val;
      renderLearning();
    }));

    $('#learningGrid').innerHTML = filtered.length ? filtered.map(learningCard).join('') :
      `<div class="empty-state" style="grid-column:1/-1"><div class="empty-state-icon">🔍</div><div class="empty-state-text">未找到匹配的资源</div></div>`;
  }

  /* ---------- 视频教程 ---------- */
  function renderVideos() {
    const all = DEFAULT_DATA.videos.concat(state.customVideos);
    const q = ($('#videoSearch').value || '').toLowerCase();
    const filtered = all.filter(v =>
      !q || v.title.toLowerCase().includes(q) || (v.author || '').toLowerCase().includes(q) || v.desc.toLowerCase().includes(q)
    ).filter(v => !state.filters.video || v.category === state.filters.video);

    const cats = [...new Set(all.map(v => v.category))];
    $('#videoFilters').innerHTML = `<button class="chip ${!state.filters.video ? 'active' : ''}" data-val="">全部</button>` +
      cats.map(t => `<button class="chip ${state.filters.video === t ? 'active' : ''}" data-val="${escapeHtml(t)}">${escapeHtml(t)}</button>`).join('');
    $$('#videoFilters .chip').forEach(c => c.addEventListener('click', () => {
      state.filters.video = c.dataset.val;
      renderVideos();
    }));

    $('#videoGrid').innerHTML = filtered.length ? filtered.map(videoCard).join('') :
      `<div class="empty-state" style="grid-column:1/-1"><div class="empty-state-icon">🔍</div><div class="empty-state-text">未找到匹配的视频</div></div>`;

    $$('#videoGrid .video-card').forEach(el => {
      el.addEventListener('click', () => {
        const v = all.find(x => x.id === el.dataset.video);
        if (v) openVideoModal(v);
      });
    });
  }

  function openVideoModal(v) {
    $('#videoModalTitle').textContent = v.title;
    // 判断是否 bilibili，提供跳转
    const isBili = /bilibili\.com/.test(v.url);
    $('#videoModalBody').innerHTML = `
      <div style="margin-bottom:16px;color:var(--text-secondary);line-height:1.7">
        <p style="margin-bottom:10px">${escapeHtml(v.desc)}</p>
        <p style="font-size:13px">👤 讲师：${escapeHtml(v.author || '未知')}　⏱ 时长：${escapeHtml(v.duration || '未知')}</p>
      </div>
      <div style="text-align:center;padding:40px 20px;background:rgba(0,0,0,0.3);border-radius:12px;margin-bottom:16px">
        <div style="font-size:56px;margin-bottom:12px">${isBili ? '📺' : '🎬'}</div>
        <p style="color:var(--text-secondary);margin-bottom:16px">点击下方按钮在新标签页打开视频</p>
        <a class="btn btn-primary" href="${escapeHtml(v.url)}" target="_blank" rel="noopener" style="display:inline-flex">
          ▶ 打开视频
        </a>
      </div>
    `;
    $('#videoModal').classList.add('active');
  }

  /* ---------- 错题本 ---------- */
  function renderWrongbook() {
    const q = ($('#wrongSearch').value || '').toLowerCase();
    const cats = [...new Set(state.wrongList.map(w => w.category).filter(Boolean))];
    $('#wrongFilters').innerHTML = `<button class="chip ${!state.filters.wrong ? 'active' : ''}" data-val="">全部</button>` +
      cats.map(t => `<button class="chip ${state.filters.wrong === t ? 'active' : ''}" data-val="${escapeHtml(t)}">${escapeHtml(t)}</button>`).join('');
    $$('#wrongFilters .chip').forEach(c => c.addEventListener('click', () => {
      state.filters.wrong = c.dataset.val;
      renderWrongbook();
    }));

    const filtered = state.wrongList.filter(w =>
      !q || w.title.toLowerCase().includes(q) || (w.note || '').toLowerCase().includes(q) || (w.category || '').toLowerCase().includes(q)
    ).filter(w => !state.filters.wrong || w.category === state.filters.wrong)
     .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

    if (!filtered.length) {
      $('#wrongList').innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">📝</div>
          <div class="empty-state-text">${state.wrongList.length ? '该分类下暂无错题' : '错题本还是空的'}</div>
          <div class="empty-state-hint">${state.wrongList.length ? '试试切换其他分类' : '点击右上角"添加错题"开始记录'}</div>
        </div>`;
      return;
    }

    $('#wrongList').innerHTML = filtered.map(w => wrongItemHtml(w)).join('');
    $$('#wrongList .wrong-edit').forEach(b => b.addEventListener('click', () => openWrongModal(b.dataset.id)));
    $$('#wrongList .wrong-delete').forEach(b => b.addEventListener('click', () => deleteWrong(b.dataset.id)));
    $$('#wrongList .wrong-toggle').forEach(b => b.addEventListener('click', () => toggleWrongBody(b.dataset.id)));
  }

  function wrongItemHtml(w) {
    const diffCls = { '简单': 'green', '中等': 'orange', '困难': 'pink' }[w.difficulty] || 'blue';
    return `
      <div class="wrong-item" data-id="${w.id}">
        <div class="wrong-item-header">
          <div>
            <h3 class="wrong-item-title">${escapeHtml(w.title)}</h3>
            <div class="wrong-item-meta">
              ${w.platform ? tagHtml(w.platform, 'blue') : ''}
              ${w.difficulty ? tagHtml(w.difficulty, diffCls) : ''}
              ${w.category ? tagHtml(w.category, 'purple') : ''}
              <span class="card-tag">${formatDate(w.createdAt)}</span>
            </div>
          </div>
          <div class="wrong-actions">
            <button class="btn-ghost btn wrong-toggle" data-id="${w.id}">展开/收起</button>
            <button class="btn-ghost btn wrong-edit" data-id="${w.id}">✏ 编辑</button>
            <button class="btn-ghost btn wrong-delete" data-id="${w.id}" style="color:var(--accent-pink)">🗑 删除</button>
          </div>
        </div>
        <div class="wrong-reason">
          <span class="wrong-reason-label">⚠ 错题原因</span>
          ${escapeHtml(w.reason)}
        </div>
        <div class="wrong-item-body" style="display:none" data-body="${w.id}">
          ${w.myCode ? codeBlockHtml('我的代码', w.myCode, '#ff2e88') : '<div></div>'}
          ${w.optimalCode ? codeBlockHtml('最优解法', w.optimalCode, '#00ff9d') : '<div></div>'}
          ${w.note ? `<div style="grid-column:1/-1;font-size:13px;color:var(--text-secondary);padding:8px 0">💬 ${escapeHtml(w.note)}</div>` : ''}
          <div style="grid-column:1/-1">
            <a class="btn-link" href="${escapeHtml(w.link)}" target="_blank" rel="noopener">🔗 查看原题</a>
          </div>
        </div>
      </div>`;
  }

  function codeBlockHtml(label, code, dotColor) {
    return `
      <div class="code-block">
        <div class="code-block-header">
          <span class="code-label"><span class="dot" style="background:${dotColor}"></span>${escapeHtml(label)}</span>
          <button class="btn-ghost" onclick="navigator.clipboard.writeText(this.closest('.code-block').querySelector('.code-content').innerText).then(()=>window.__ahToast('已复制','success'))" style="font-size:11px;padding:2px 8px">复制</button>
        </div>
        <pre class="code-content">${escapeHtml(code)}</pre>
      </div>`;
  }

  function toggleWrongBody(id) {
    const body = document.querySelector(`[data-body="${id}"]`);
    if (body) body.style.display = body.style.display === 'none' ? 'grid' : 'none';
  }

  function openWrongModal(id) {
    state.editingWrongId = id || null;
    const w = id ? state.wrongList.find(x => x.id === id) : {};
    $('#wrongModalTitle').textContent = id ? '编辑错题' : '添加错题';
    $('#wrongTitle').value = w.title || '';
    $('#wrongLink').value = w.link || '';
    $('#wrongPlatform').value = w.platform || '';
    $('#wrongDifficulty').value = w.difficulty || '中等';
    $('#wrongCategory').value = w.category || '数组';
    $('#wrongReason').value = w.reason || '';
    $('#wrongMyCode').value = w.myCode || '';
    $('#wrongOptimalCode').value = w.optimalCode || '';
    $('#wrongNote').value = w.note || '';
    $('#wrongModal').classList.add('active');
  }

  function closeWrongModal() {
    $('#wrongModal').classList.remove('active');
    state.editingWrongId = null;
  }

  function saveWrong() {
    const title = $('#wrongTitle').value.trim();
    const link = $('#wrongLink').value.trim();
    const reason = $('#wrongReason').value.trim();
    if (!title) { toast('请填写题目标题', 'error'); return; }
    if (!link) { toast('请填写题目链接', 'error'); return; }
    if (!reason) { toast('请填写错题原因', 'error'); return; }

    const data = {
      title, link, reason,
      platform: $('#wrongPlatform').value,
      difficulty: $('#wrongDifficulty').value,
      category: $('#wrongCategory').value,
      myCode: $('#wrongMyCode').value,
      optimalCode: $('#wrongOptimalCode').value,
      note: $('#wrongNote').value.trim()
    };

    if (state.editingWrongId) {
      const idx = state.wrongList.findIndex(x => x.id === state.editingWrongId);
      if (idx > -1) state.wrongList[idx] = Object.assign({}, state.wrongList[idx], data);
      toast('错题已更新', 'success');
    } else {
      state.wrongList.push(Object.assign({ id: uid(), createdAt: Date.now() }, data));
      toast('错题已添加', 'success');
    }
    Store.set('ah_wrong', state.wrongList);
    closeWrongModal();
    renderWrongbook();
  }

  function deleteWrong(id) {
    if (!confirm('确定删除这道错题吗？')) return;
    state.wrongList = state.wrongList.filter(x => x.id !== id);
    Store.set('ah_wrong', state.wrongList);
    toast('错题已删除', 'success');
    renderWrongbook();
  }

  /* ---------- 学习进度 ---------- */
  function renderProgress() {
    const cats = DEFAULT_DATA.categories;
    $('#progressOverview').innerHTML = cats.map(c => {
      const val = state.progress[c.key] || 0;
      return `
        <div class="progress-card">
          <div class="progress-card-title">
            <span>${c.icon} ${escapeHtml(c.name)}</span>
            <span style="color:var(--accent-cyan);font-weight:700">${val}%</span>
          </div>
          <div class="progress-bar"><div class="progress-fill" style="width:${val}%"></div></div>
          <div class="progress-info">
            <span>${val >= 80 ? '已掌握' : val >= 40 ? '学习中' : '未开始'}</span>
            <button class="btn-ghost" data-progress-key="${c.key}" style="font-size:11px;padding:2px 8px">调整</button>
          </div>
        </div>`;
    }).join('');

    $$('[data-progress-key]').forEach(b => b.addEventListener('click', () => {
      const key = b.dataset.progressKey;
      const cur = state.progress[key] || 0;
      let next = cur + 20;
      if (next > 100) next = 0;
      state.progress[key] = next;
      Store.set('ah_progress', state.progress);
      renderProgress();
      toast(`${DEFAULT_DATA.categories.find(c => c.key === key).name}：${next}%`, 'info');
    }));

    // 打卡日历（近 28 天）
    const today = todayStr();
    const days = [];
    for (let i = 27; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(d.toISOString().slice(0, 10));
    }
    $('#checkinCalendar').innerHTML = days.map(d => {
      const checked = state.checkin.includes(d);
      const isToday = d === today;
      const dayNum = new Date(d).getDate();
      return `<div class="calendar-cell ${checked ? 'checked' : ''} ${isToday ? 'today' : ''}" title="${d}">${dayNum}</div>`;
    }).join('');
  }

  function computeStreak() {
    if (!state.checkin.length) return 0;
    const set = new Set(state.checkin);
    let streak = 0;
    const d = new Date();
    // 如果今天没打卡，从昨天开始算
    if (!set.has(d.toISOString().slice(0, 10))) {
      d.setDate(d.getDate() - 1);
    }
    while (set.has(d.toISOString().slice(0, 10))) {
      streak++;
      d.setDate(d.getDate() - 1);
    }
    return streak;
  }

  function doCheckin() {
    const today = todayStr();
    if (state.checkin.includes(today)) {
      toast('今天已经打卡啦', 'info');
      return;
    }
    state.checkin.push(today);
    Store.set('ah_checkin', state.checkin);
    toast(`打卡成功！连续 ${computeStreak()} 天`, 'success');
    renderProgress();
  }

  function resetProgress() {
    if (!confirm('确定重置所有学习进度与打卡记录吗？此操作不可恢复。')) return;
    state.progress = Object.assign({}, DEFAULT_PROGRESS);
    state.checkin = [];
    Store.set('ah_progress', state.progress);
    Store.set('ah_checkin', state.checkin);
    toast('进度已重置', 'success');
    renderProgress();
  }

  /* ---------- 导出数据 ---------- */
  function exportData() {
    const data = {
      wrongList: state.wrongList,
      progress: state.progress,
      checkin: state.checkin,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `algohub-backup-${todayStr()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast('数据已导出', 'success');
  }

  /* ---------- 工具 ---------- */
  function formatDate(ts) {
    if (!ts) return '';
    const d = new Date(ts);
    return `${d.getMonth() + 1}月${d.getDate()}日`;
  }

  /* ---------- 事件绑定 ---------- */
  function bindEvents() {
    // 导航
    $$('.nav-link').forEach(l => l.addEventListener('click', () => switchPage(l.dataset.page)));

    // 主题
    $('#themeToggle').addEventListener('click', () => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      Store.set('ah_theme', state.theme);
      applyTheme();
    });

    // 导出
    $('#exportBtn').addEventListener('click', exportData);

    // 搜索
    $('#platformSearch').addEventListener('input', renderPlatforms);
    $('#learningSearch').addEventListener('input', renderLearning);
    $('#videoSearch').addEventListener('input', renderVideos);
    $('#wrongSearch').addEventListener('input', renderWrongbook);

    // 错题本
    $('#addWrongBtn').addEventListener('click', () => openWrongModal(null));
    $('#wrongModalClose').addEventListener('click', closeWrongModal);
    $('#wrongCancelBtn').addEventListener('click', closeWrongModal);
    $('#wrongSaveBtn').addEventListener('click', saveWrong);
    $('#wrongModal').addEventListener('click', (e) => {
      if (e.target.id === 'wrongModal') closeWrongModal();
    });

    // 视频模态框
    $('#videoModalClose').addEventListener('click', () => $('#videoModal').classList.remove('active'));
    $('#videoModal').addEventListener('click', (e) => {
      if (e.target.id === 'videoModal') $('#videoModal').classList.remove('active');
    });

    // 进度
    $('#checkinBtn').addEventListener('click', doCheckin);
    $('#resetProgressBtn').addEventListener('click', resetProgress);

    // ESC 关闭模态框
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        $('#wrongModal').classList.remove('active');
        $('#videoModal').classList.remove('active');
      }
    });
  }

  /* ---------- 暴露给内联调用 ---------- */
  window.__ahToast = toast;

  /* ---------- 初始化 ---------- */
  function init() {
    applyTheme();
    bindEvents();
    switchPage('home');
  }

  document.addEventListener('DOMContentLoaded', init);
})();
