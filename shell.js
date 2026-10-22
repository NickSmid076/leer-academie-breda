// Leer Academie Breda: app shell behaviour (theme, menus, role switch, assistant).
(function () {
  const root = document.documentElement;
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* storage blocked */ } },
  };

  // Theme: ?theme= wins, then saved choice, then the system setting.
  const params = new URLSearchParams(location.search);
  const initialTheme = params.get('theme') || store.get('lab-theme');
  if (initialTheme === 'light' || initialTheme === 'dark') root.dataset.theme = initialTheme;
  const isDark = () => root.dataset.theme
    ? root.dataset.theme === 'dark'
    : matchMedia('(prefers-color-scheme: dark)').matches;
  document.querySelectorAll('[data-theme-toggle]').forEach((el) => {
    el.checked = isDark();
    el.addEventListener('change', () => {
      root.dataset.theme = el.checked ? 'dark' : 'light';
      store.set('lab-theme', root.dataset.theme);
    });
  });

  // Menus and popovers: one open at a time, Esc and outside click close.
  let openMenu = null;
  function closeMenu(returnFocus) {
    if (!openMenu) return;
    const { trigger, panel } = openMenu;
    panel.hidden = true;
    trigger.setAttribute('aria-expanded', 'false');
    if (returnFocus) trigger.focus();
    openMenu = null;
  }
  document.querySelectorAll('[data-menu-trigger]').forEach((trigger) => {
    const panel = document.getElementById(trigger.getAttribute('aria-controls'));
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const wasOpen = openMenu && openMenu.panel === panel;
      closeMenu(false);
      if (wasOpen) return;
      panel.hidden = false;
      trigger.setAttribute('aria-expanded', 'true');
      openMenu = { trigger, panel };
      const first = panel.querySelector('input:checked, button, a, input');
      if (first) first.focus();
    });
  });
  document.addEventListener('click', (e) => {
    if (openMenu && !openMenu.panel.contains(e.target)) closeMenu(false);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { closeMenu(true); closeAssistant(true); }
  });

  // Role switch: shows the nav items each role can use.
  const roleNames = { medewerker: 'Medewerker', manager: 'Manager', lo: 'L&O' };
  function applyRole(role) {
    if (!roleNames[role]) role = 'medewerker';
    document.querySelectorAll('[data-roles]').forEach((el) => {
      el.hidden = !el.dataset.roles.split(' ').includes(role);
    });
    document.querySelectorAll('[data-role-label]').forEach((el) => { el.textContent = roleNames[role]; });
    document.querySelectorAll('input[name="role"]').forEach((el) => { el.checked = el.value === role; });
    store.set('lab-role', role);
  }
  document.querySelectorAll('input[name="role"]').forEach((el) => {
    el.addEventListener('change', () => applyRole(el.value));
  });
  applyRole(params.get('role') || store.get('lab-role') || 'medewerker');

  // Mobile search toggle
  const header = document.querySelector('.app-header');
  const searchToggle = document.querySelector('.topbar__search-toggle');
  if (searchToggle && header) {
    searchToggle.addEventListener('click', () => {
      const on = header.classList.toggle('is-searching');
      searchToggle.setAttribute('aria-expanded', String(on));
      if (on) header.querySelector('.search__input').focus();
    });
  }

  // Assistant bubble (visual only for now)
  const aBtn = document.querySelector('[data-assistant-toggle]');
  const aPanel = document.getElementById('assistant-panel');
  function closeAssistant(returnFocus) {
    if (!aPanel || aPanel.hidden) return;
    aPanel.hidden = true;
    aBtn.setAttribute('aria-expanded', 'false');
    if (returnFocus) aBtn.focus();
  }
  if (aBtn && aPanel) {
    document.querySelectorAll('[data-assistant-toggle], [data-assistant-open]').forEach((el) => {
      el.addEventListener('click', () => {
        const open = aPanel.hidden;
        aPanel.hidden = !open;
        aBtn.setAttribute('aria-expanded', String(open));
        if (open) aPanel.querySelector('button, input').focus();
      });
    });
    aPanel.querySelector('[data-assistant-close]').addEventListener('click', () => closeAssistant(true));
  }
})();
