// Improved interactivity & animations
document.addEventListener('DOMContentLoaded', () => {
  initUI();
  animateCounters();
  setupSidebar();
  setupTheme();
  setupActivityRefresh();
  setYear();
});

/* ---------------------------
   Helper / small utilities
   --------------------------- */
function $(s) { return document.querySelector(s); }
function $all(s) { return Array.from(document.querySelectorAll(s)); }

/* ---------------------------
   Year
   --------------------------- */
function setYear() {
  const y = new Date().getFullYear();
  const el = $('#year');
  if (el) el.textContent = y;
}

/* ---------------------------
   Counter animation for stats
   --------------------------- */
function animateCounters() {
  const counters = $all('.stat-value, .stat-card .stat-value, .stat-value, .stat-value, .stat-value'); // backward safe
  // Custom: our hero uses .stat-card .stat-value with data-target
  const statNodes = $all('.stat-card .stat-value, .stat-value[data-target]');
  statNodes.forEach(node => {
    const target = parseInt(node.dataset.target || node.textContent || 0, 10) || 0;
    node.textContent = '0';
    animateNumber(node, target, 900);
  });

  // Also animate analytics mini numbers
  const smalls = ['#visitors','#projectsViewed','#resumeDownloads','#skillsViews'];
  smalls.forEach(id => {
    const el = document.querySelector(id);
    if (!el) return;
    const target = parseInt(el.textContent || 0,10);
    el.textContent = '0';
    animateNumber(el, target, 1000 + Math.random()*800);
  });
}

function animateNumber(el, end, duration = 1000) {
  const start = 0;
  const range = end - start;
  const startTime = performance.now();
  function step(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = easeOutCubic(progress);
    el.textContent = Math.floor(start + range * eased);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = end;
  }
  requestAnimationFrame(step);
}
function easeOutCubic(t){ return 1 - Math.pow(1 - t, 3); }

/* ---------------------------
   Sidebar behaviour
   --------------------------- */
function setupSidebar() {
  const sidebar = $('#sidebar');
  const collapseBtn = $('#collapseBtn');
  const menuItems = $all('.menu-item');
  const mobileMenuBtn = $('#mobileMenuBtn');

  collapseBtn?.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
  });

  menuItems.forEach(item => {
    item.addEventListener('click', () => {
      menuItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      // smooth section scroll if needed
      const sec = item.dataset.section;
      if (sec) {
        const target = document.getElementById(sec);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
    // keyboard accessible
    item.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') item.click();
    });
  });

  // Mobile toggle
  mobileMenuBtn?.addEventListener('click', () => {
    const main = document.querySelector('.main');
    if (!sidebar) return;
    // toggle a visible class for mobile
    sidebar.style.display = (getComputedStyle(sidebar).display === 'none') ? 'flex' : 'none';
    // shift main margin
    main.style.marginLeft = (sidebar.style.display === 'flex') ? '240px' : '0';
  });
}

/* ---------------------------
   Theme (persisted)
   --------------------------- */
function setupTheme() {
  const saved = localStorage.getItem('theme');
  if (saved === 'dark') document.body.classList.add('dark-theme');

  const statusPill = document.querySelector('.theme-pill');
  const icon = document.querySelector('[data-action="theme"] i') || null;
  updateThemePill();

  $('#themeToggle')?.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
    updateThemePill();
  });

  function updateThemePill(){
    const isDark = document.body.classList.contains('dark-theme');
    if (statusPill) statusPill.textContent = isDark ? 'Dark' : 'Light';
    if (icon) icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
  }
}

/* ---------------------------
   Activity refresh (UI nicety)
   --------------------------- */
function setupActivityRefresh() {
  const btn = $('#refreshActivity');
  const list = $('#activityList');
  if (!btn || !list) return;
  btn.addEventListener('click', () => {
    btn.classList.add('rotating');
    // simulate refresh: fade items and restore
    $all('.activity').forEach((it, idx) => {
      it.style.opacity = '0.45';
      setTimeout(()=> it.style.opacity = '1', 250 + idx*80);
    });
    setTimeout(()=> {
      btn.classList.remove('rotating');
      // simple visual confirmation
      btn.innerHTML = '<i class="fas fa-check"></i>';
      setTimeout(()=> btn.innerHTML = '<i class="fas fa-sync-alt"></i>', 800);
      // also bump visitor counters slightly
      bumpAnalytics();
    }, 900);
  });
}

function bumpAnalytics(){
  const visitors = $('#visitors');
  const projects = $('#projectsViewed');
  const resume = $('#resumeDownloads');
  const skills = $('#skillsViews');

  if (visitors) animateNumber(visitors, parseInt(visitors.textContent || 0,10) + Math.floor(Math.random()*3 + 1), 650);
  if (projects) animateNumber(projects, parseInt(projects.textContent || 0,10) + Math.floor(Math.random()*2 + 1), 650);
  if (resume) animateNumber(resume, parseInt(resume.textContent || 0,10) + Math.floor(Math.random()*2 + 1), 650);
  if (skills) animateNumber(skills, parseInt(skills.textContent || 0,10) + Math.floor(Math.random()*2 + 1), 650);
}

/* ---------------------------
   General UI initializations
   --------------------------- */
function initUI(){
  // rotating css for refresh
  const css = document.createElement('style');
  css.innerHTML = `
    .rotating{animation:rotate .65s linear}
    @keyframes rotate{from{transform:rotate(0)}to{transform:rotate(360deg)}}
    .icon-btn{background:transparent;border:0;cursor:pointer;padding:6px;border-radius:8px}
    .icon-btn.small{padding:6px}
  `;
  document.head.appendChild(css);

  // Accessibility helpers: close dropdown on outside click
  document.addEventListener('click', (e) => {
    const dropdowns = $all('.profile-dropdown');
    dropdowns.forEach(dd => {
      if (!dd.contains(e.target)) {
        dd.querySelector('.dropdown-menu')?.classList.remove('open');
      }
    });
  });

  // small entrance animations
  setTimeout(()=> document.querySelectorAll('.card, .hero, .featured').forEach((el, i) => {
    el.style.opacity = 0; el.style.transform = 'translateY(8px)';
    setTimeout(()=> { el.style.transition = 'all .45s ease'; el.style.opacity = 1; el.style.transform = 'translateY(0)'; }, 80 + i*80);
  }), 220);
}
