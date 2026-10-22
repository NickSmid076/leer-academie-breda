// Leerhapje: bite-sized mini-player docked bottom-right.
// Runs on its own (outside the app's render loop), so it keeps its state and
// focus while the rest of the page re-renders. Data comes from leerhapjes.js.
//
// States: 'bubble' (button with count), 'compact' (360x480 panel, or a
// floating window via Document Picture-in-Picture), 'full' (inside the app's
// player page, through window.LeerhapjeHost).
(function () {
  'use strict';
  const DATA = window.LEERHAPJES || [];
  const KEY = 'lab-lh-v1';
  const SKILL = { sec: 'Veilig werken', ai: 'AI & Copilot', sch: 'Schrijven (B1)', ov: 'OV-beleid', data: 'Data' };
  const SNOOZE = [['15 minuten', 15 * 60e3], ['1 uur', 60 * 60e3], ['Morgen', 'tomorrow']];
  const BASE = new URL('.', (document.currentScript && document.currentScript.src) || location.href);
  const H = () => window.LeerhapjeHost || {};
  const mobile = () => matchMedia('(max-width: 767px)').matches;
  const canPip = 'documentPictureInPicture' in window && window.isSecureContext;

  // Fluent UI System Icons (regular)
  const P = {
    bulb: '<path d="M12 2c4 0 7.25 3.25 7.25 7.25q-.01 3.15-2.66 5.74a1 1 0 0 0-.18.27l-.03.1-1.13 4.9a2.25 2.25 0 0 1-2.02 1.73l-.17.01h-2.12c-.99 0-1.85-.65-2.14-1.58l-.05-.16-1.13-4.9a1 1 0 0 0-.2-.37q-2.53-2.47-2.66-5.44l-.01-.3v-.24a7.25 7.25 0 0 1 7.25-7m2.12 16.5H9.88l.33 1.42c.07.3.33.53.63.57l.1.01h2.12c.31 0 .59-.2.7-.48l.03-.1zM12 3.5a5.75 5.75 0 0 0-5.75 5.53v.5q.1 2.340 2.21 4.39.4.4.57.93l.05.17.46 1.98h4.92l.46-1.98q.12-.54.5-.97l.12-.13q2.1-2.05 2.2-4.4l.01-.27v-.22A5.75 5.75 0 0 0 12 3.5"/>',
    min: '<path d="M3.75 12.5h16.5a.75.75 0 0 0 0-1.5H3.75a.75.75 0 0 0 0 1.5"/>',
    max: '<path d="M19.25 4c.41 0 .75.34.75.75v7.5a.75.75 0 0 1-1.5 0V6.56L6.560 18.5h5.69a.75.75 0 0 1 0 1.5h-7.5a.75.75 0 0 1-.75-.75v-7.5a.75.75 0 0 1 1.5 0v5.69L17.44 5.5h-5.69a.75.75 0 0 1 0-1.5z"/>',
    shrink: '<path d="M10.25 13c.41 0 .75.34.75.75v7.5a.75.75 0 0 1-1.5 0v-5.69l-6.22 6.22a.75.75 0 1 1-1.06-1.06l6.22-6.22H2.75a.75.75 0 0 1 0-1.5zM20.72 2.22a.75.75 0 1 1 1.06 1.06L15.56 9.5h5.690a.75.75 0 0 1 0 1.5h-7.5a.75.75 0 0 1-.75-.75v-7.5a.75.75 0 0 1 1.5 0v5.69z"/>',
    close: '<path d="m4.4 4.55.07-.08a.75.75 0 0 1 .98-.07l.08.07L12 10.94l6.47-6.47a.75.75 0 1 1 1.06 1.06L13.06 12l6.47 6.47c.27.27.3.68.07.98l-.07.08a.75.75 0 0 1-.98.07l-.08-.07L12 13.06l-6.47 6.47a.75.75 0 0 1-1.06-1.06L10.94 12 4.47 5.530a.75.75 0 0 1-.07-.98l.07-.08z"/>',
    clock: '<path d="M3.5 12a8.5 8.5 0 1 1 17 0 8.5 8.5 0 0 1-17 0M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20m0 4.65a.75.75 0 0 0-1.5.1v6.1c.06.37.37.65.75.65h4.1a.75.75 0 0 0-.1-1.5H12V6.65"/>',
    pip: '<path d="M2 6.25C2 4.45 3.46 3 5.25 3h13.5C20.55 3 22 4.46 22 6.25V12h-1.5V6.25c0-.97-.78-1.75-1.75-1.75H5.25c-.97 0-1.75.78-1.75 1.750v9.5c0 .97.78 1.75 1.75 1.75H11V19H5.25A3.25 3.25 0 0 1 2 15.75zM14 13a2 2 0 0 0-2 2v5c0 1.1.9 2 2 2h7a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2zM5.22 6.22c.3-.3.77-.3 1.06 0L9.5 9.44V7.75a.75.75 0 0 1 1.5 0v3.5c0 .41-.34.75-.75.75h-3.5a.75.75 0 0 1 0-1.5h1.69L5.22 7.28a.75.75 0 0 1 0-1.06"/>',
    ok: '<path d="M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20m0 1.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17m-1.25 9.94 4.47-4.47a.75.75 0 0 1 1.13.98l-.07.08-5 5a.75.75 0 0 1-.98.07l-.08-.07-2.5-2.5a.75.75 0 0 1 .98-1.13l.08.07z"/>',
    no: '<path d="M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20m0 1.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17m3.45 4.9.08.07c.27.27.3.68.07.98l-.07.08L13.06 12l2.47 2.47c.27.27.3.68.07.98l-.07.08a.75.75 0 0 1-.98.07l-.08-.07L12 13.06l-2.47 2.47a.75.75 0 0 1-.98.07l-.08-.07a.75.75 0 0 1-.07-.98l.07-.08L10.94 12 8.47 9.53a.75.75 0 0 1-.07-.98l.07-.08a.75.75 0 0 1 .98-.07l.08.07L12 10.94l2.47-2.47a.75.75 0 0 1 .98-.07"/>',
    info: '<path d="M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20m0 1.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17m0 7c.41 0 .75.34.75.75v5a.75.75 0 0 1-1.5 0v-5c0-.41.34-.75.75-.75M12 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2"/>',
    star: '<path d="M10.79 3.1c.5-1 1.92-1 2.42 0l2.36 4.78 5.27.77c1.1.16 1.55 1.52.75 2.3l-3.82 3.72.9 5.25a1.35 1.35 0 0 1-1.96 1.42L12 18.86l-4.72 2.48a1.35 1.35 0 0 1-1.96-1.42l.9-5.25-3.81-3.72c-.8-.78-.36-2.14.75-2.3l5.27-.77zm1.2.94L9.75 8.6c-.2.4-.58.68-1.02.74l-5.05.74 3.66 3.56c.32.3.46.76.39 1.2l-.87 5.02 4.52-2.37c.4-.2.86-.2 1.26 0l4.51 2.37-.86-5.03c-.07-.43.07-.88.39-1.2l3.65-3.55-5.05-.74a1.4 1.4 0 0 1-1.01-.74z"/>',
    arrow: '<path d="M13.27 4.2a.75.75 0 0 0-1.04 1.1l6.25 5.95H3.75a.75.75 0 0 0 0 1.5h14.73l-6.25 5.95a.75.75 0 0 0 1.04 1.1l7.42-7.08a1 1 0 0 0 0-1.44z"/>',
  };
  const ic = (n, s) => `<svg class="lh-i${s ? ' lh-i--' + s : ''}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${P[n]}</svg>`;
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const get = (id) => DATA.find((x) => x.id === id);

  // ---------- State (stored locally, survives navigation and reloads) ----------
  const fresh = () => ({ inbox: [], active: null, mode: 'bubble', prog: {}, snoozeUntil: 0 });
  let st;
  try { st = JSON.parse(localStorage.getItem(KEY)) || fresh(); } catch (e) { st = fresh(); }
  if (!st.prog || !Array.isArray(st.inbox)) st = fresh();
  if (st.mode === 'pip') st.mode = 'compact';
  function save() { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) { /* storage blocked */ } }
  function prog(id) { return st.prog[id] || (st.prog[id] = { step: 0, ans: {}, found: {}, last: {}, rev: {}, done: false }); }
  const snoozed = () => Date.now() < (st.snoozeUntil || 0);
  const waiting = () => st.inbox.filter((id) => get(id) && !prog(id).done);

  // ---------- DOM ----------
  let bubble, panel, live, menuOpen = false, pip = null, afterPip = null, returnFocus = null;
  function build() {
    bubble = document.createElement('button');
    bubble.type = 'button';
    bubble.className = 'lh-bubble';
    bubble.setAttribute('aria-controls', 'lh-panel');
    bubble.hidden = true;
    bubble.dataset.lh = 'bubble';
    document.body.appendChild(bubble);

    panel = document.createElement('section');
    panel.className = 'lh-panel';
    panel.id = 'lh-panel';
    panel.setAttribute('role', 'region');
    panel.setAttribute('aria-labelledby', 'lh-title');
    panel.hidden = true;
    panel.innerHTML = '<div class="lh-inner" style="display:contents"></div><div class="lh-live" aria-live="polite"></div>';
    document.body.appendChild(panel);

    live = document.createElement('div');
    live.className = 'lh-live';
    live.setAttribute('aria-live', 'polite');
    document.body.appendChild(live);

    panel.addEventListener('focusin', (e) => {
      if (e.relatedTarget && !panel.contains(e.relatedTarget) && e.relatedTarget !== bubble) returnFocus = e.relatedTarget;
    });
    bindSwipe();
  }

  function announce(msg) {
    // One live region at a time, so nothing is read twice.
    const full = document.querySelector('.lh-full > .lh-live');
    const t = !panel.hidden ? panel.querySelector('.lh-live') : full || live;
    t.textContent = '';
    setTimeout(() => { t.textContent = msg; }, 30);
  }

  // ---------- Rendering ----------
  function stepHTML(h, i, full) {
    const s = h.steps[i];
    const p = prog(h.id);
    if (s.type === 'context') return contextHTML(s);
    if (s.type === 'hotspot') return hotspotHTML(s, i, p);
    if (s.type === 'choice') return choiceHTML(s, i, p);
    if (s.type === 'result') return resultHTML(h, s, full);
    return '';
  }

  function mailShell(head, subject, body) {
    return `<div class="lh-mail"><dl class="lh-mail-head">${head}</dl>${subject}<div class="lh-mail-body">${body}</div></div>`;
  }
  function contextHTML(s) {
    let scene = '';
    if (s.kind === 'mail') {
      scene = mailShell(
        `<div><dt>Van</dt><dd>${esc(s.from)}</dd></div><div><dt>Aan</dt><dd>${esc(s.to)}</dd></div>`,
        `<div class="lh-mail-subject">${esc(s.subject)}</div>`,
        s.body.map((t) => `<p>${esc(t)}</p>`).join('') + (s.link ? `<span class="lh-fake-link">${esc(s.link)}</span>` : '') + (s.sign ? `<p>${esc(s.sign)}</p>` : '')
      );
    } else if (s.kind === 'teams') {
      const ini = s.who.split(' ').map((w) => w[0]).slice(0, 2).join('');
      scene = `<div class="lh-teams"><span class="lh-av" aria-hidden="true">${esc(ini)}</span><div class="lh-msg"><b>${esc(s.who)}</b>${esc(s.text)}</div></div>`;
    } else {
      scene = `<blockquote class="lh-letter">${esc(s.text)}</blockquote>`;
    }
    return `<p class="lh-intro" tabindex="-1" data-focus>${esc(s.intro)}</p>${scene}`;
  }

  function spotHTML(part, i, p) {
    const found = (p.found[i] || []).includes(part.id);
    const shown = found || (p.rev[i] && part.flag);
    const cls = shown ? (part.flag ? ' is-flag' : ' is-miss') : '';
    const inner = part.id === 'link' ? `<span class="lh-fake-link">${esc(part.text)}</span>` : esc(part.text);
    return `<button type="button" class="lh-spot${cls}" data-lh="spot" data-v="${esc(part.id)}" data-k="spot-${esc(part.id)}" aria-pressed="${found}">${shown && part.flag ? `<span class="lh-mark">${ic('ok', 16)}</span>` : ''}${inner}</button>`;
  }
  function hotspotHTML(s, i, p) {
    const need = s.parts.filter((x) => x.flag).length;
    const got = s.parts.filter((x) => x.flag && (p.found[i] || []).includes(x.id)).length;
    let scene;
    if (s.kind === 'mail') {
      const head = s.parts.filter((x) => x.label).map((x) => `<div><dt>${esc(x.label)}</dt><dd>${spotHTML(x, i, p)}</dd></div>`).join('');
      const body = s.parts.filter((x) => !x.label).map((x) => spotHTML(x, i, p)).join('');
      scene = mailShell(head, '', body);
    } else {
      scene = `<p class="lh-text-spots">${s.parts.map((x) => spotHTML(x, i, p)).join(' ')}.</p>`;
    }
    const last = s.parts.find((x) => x.id === p.last[i]);
    let fb = '';
    if (p.rev[i] && got < need) {
      fb = `<div class="lh-fb" tabindex="-1">${ic('info')}<p>De groen gemarkeerde stukjes had je nog niet gevonden. Bekijk ze even en ga dan verder.</p></div>`;
    } else if (last) {
      const done = got === need ? ' Je hebt ze alle drie gevonden.' : '';
      fb = `<div class="lh-fb${last.flag ? ' is-good' : ''}" tabindex="-1">${ic(last.flag ? 'ok' : 'info')}<p>${esc(last.feedback)}${done}</p></div>`;
    }
    return `<p class="lh-prompt" tabindex="-1" data-focus>${esc(s.prompt)}</p>
      <p class="lh-spots-count" aria-hidden="true">${got} van ${need} gevonden</p>${scene}${fb}`;
  }

  function choiceHTML(s, i, p) {
    const a = p.ans[i];
    const answered = a != null;
    const best = s.options.findIndex((o) => o.correct);
    const opts = s.options.map((o, k) => {
      let cls = '';
      if (answered) cls = k === a ? (o.correct ? ' is-right' : ' is-wrong') : (k === best ? ' is-right' : ' is-dim');
      const mark = answered && (k === a || k === best) ? ic(o.correct ? 'ok' : 'no', 16) : String.fromCharCode(65 + k);
      return `<li><button type="button" class="lh-opt${cls}" data-lh="opt" data-v="${k}" data-k="opt-${k}"${answered ? ' aria-disabled="true"' : ''}${answered && k === a ? ' aria-describedby="lh-fb"' : ''}><span class="lh-key" aria-hidden="true">${mark}</span><span>${esc(o.label)}</span></button></li>`;
    }).join('');
    let fb = '';
    if (answered) {
      const o = s.options[a];
      const lead = o.correct ? 'Goed gezien.' : 'Bijna.';
      fb = `<div class="lh-fb ${o.correct ? 'is-good' : 'is-try'}" id="lh-fb" tabindex="-1">${ic(o.correct ? 'ok' : 'info')}<p><b>${lead}</b> ${esc(o.feedback)}${o.correct ? '' : ` <button type="button" class="lh-link" data-lh="retry" data-k="retry">Nog een keer</button>`}</p></div>`;
    }
    return `${s.situation ? `<p class="lh-situation">${esc(s.situation)}</p>` : ''}<p class="lh-prompt" tabindex="-1" data-focus>${esc(s.prompt)}</p><ul class="lh-opts">${opts}</ul>${fb}`;
  }

  function resultHTML(h, s) {
    const course = h.course ? `<p><button type="button" class="lh-link" data-lh="course" data-k="course">Naar de volledige cursus ${ic('arrow', 16)}</button></p>` : '';
    return `<p><span class="lh-points">${ic('star', 16)} +${s.points} leerpunten</span></p>
      <h3 class="lh-result-h" tabindex="-1" data-focus>Klaar, goed gedaan</h3>
      <p>${esc(s.well)}</p>
      <div class="lh-tipbox">${ic('bulb')}<div><b>Tip</b><p>${esc(s.tip)}</p></div></div>${course}`;
  }

  function progHTML(h) {
    const p = prog(h.id);
    const n = h.steps.length;
    return `<div class="lh-prog"><span>Stap ${p.step + 1} van ${n}</span><span class="lh-bar" role="progressbar" aria-label="Voortgang" aria-valuemin="1" aria-valuemax="${n}" aria-valuenow="${p.step + 1}"><i style="width:${Math.round(((p.step + 1) / n) * 100)}%"></i></span></div>`;
  }

  function nextLabel(h) {
    const p = prog(h.id);
    const s = h.steps[p.step];
    if (s.type === 'result') return 'Afronden';
    if (s.type === 'choice' && p.ans[p.step] == null) return null; // pick first
    return 'Volgende';
  }

  function footHTML(h, full) {
    const label = nextLabel(h);
    const p = prog(h.id);
    const later = full ? '' : `<button type="button" class="lh-btn lh-btn--ghost" data-lh="later" data-k="later" aria-expanded="${menuOpen}" aria-controls="lh-menu">${ic('clock', 16)} Later</button>
      <div class="lh-menu" id="lh-menu" ${menuOpen ? '' : 'hidden'}><p>Herinner me over</p>${SNOOZE.map(([t], k) => `<button type="button" data-lh="snooze" data-v="${k}" data-k="snooze-${k}">${t}</button>`).join('')}</div>`;
    const back = full && p.step > 0 ? '<button type="button" class="lh-btn" data-lh="prev" data-k="prev">Vorige</button>' : '';
    const shrink = full ? `<button type="button" class="lh-btn lh-btn--ghost" data-lh="collapse" data-k="collapse">${ic('shrink', 16)} Verkleinen</button>` : '';
    return `<div class="lh-foot">${later}${back}${shrink}<span class="lh-spacer"></span>${label ? `<button type="button" class="lh-btn lh-btn--primary" data-lh="next" data-k="next">${label}</button>` : ''}</div>`;
  }

  function panelHTML(h) {
    const tools = [
      canPip && !pip && !mobile() ? ['pip', 'pip', 'Zet naast je werk (zwevend venster)'] : null,
      H().expand ? ['expand', 'max', 'Groot openen'] : null,
      ['close', 'close', 'Sluiten'],
    ].filter(Boolean).map(([a, i, l]) => `<button type="button" class="lh-icon-btn" data-lh="${a}" data-k="tool-${a}" aria-label="${l}" title="${l}">${ic(i)}</button>`).join('');
    const minBtn = `<button type="button" class="lh-min-btn" data-lh="min" data-k="tool-min" aria-label="Minimaliseren" title="Minimaliseren">${ic('min')}<span>Minimaliseren</span></button>`;
    return `<button type="button" class="lh-grab" data-lh="min" tabindex="-1" aria-hidden="true"></button>
      <div class="lh-head"><div class="lh-titles"><div class="lh-eyebrow">${ic('bulb', 16)} Leerhapje · ${h.minutes} min</div><h2 class="lh-title" id="lh-title" tabindex="-1">${esc(h.title)}</h2></div><div class="lh-tools">${minBtn}${tools}</div></div>
      ${progHTML(h)}<div class="lh-body">${stepHTML(h, prog(h.id).step, false)}</div>${footHTML(h, false)}`;
  }

  function bubbleState() {
    const n = waiting().length;
    const h = get(st.active);
    if (pip) return { show: true, n: 0, label: 'Leerhapje staat in een zwevend venster. Haal het terug.' };
    const show = !snoozed() && st.mode === 'bubble' && (n > 0 || (h && !prog(h.id).done));
    const label = h && !prog(h.id).done && prog(h.id).step > 0
      ? `Leerhapje: ${h.title}, ga verder`
      : `${n} leerhapje${n === 1 ? '' : 's'} klaar`;
    return { show, n, label };
  }

  function paint(focus) {
    const b = bubbleState();
    bubble.hidden = !b.show;
    bubble.setAttribute('aria-label', b.label);
    bubble.setAttribute('aria-expanded', String(st.mode === 'compact'));
    bubble.innerHTML = `${ic('bulb', 24)}${b.n ? `<span class="lh-count" aria-hidden="true">${b.n}</span>` : ''}<span class="lh-tip" aria-hidden="true">${esc(b.label)}</span>`;

    const h = get(st.active);
    const open = st.mode === 'compact' && h && (pip || !snoozed());
    panel.hidden = !open;
    document.documentElement.classList.toggle('lh-sheet-open', !!open && !pip && mobile());
    document.documentElement.classList.toggle('lh-panel-open', !!open && !pip);
    if (open) {
      const prevK = focusKey(panel);
      panel.querySelector('.lh-inner').innerHTML = panelHTML(h);
      panel.style.translate = '';
      restoreFocus(panel, focus, prevK);
    }
    paintFull(focus);
  }

  function paintFull(focus) {
    const box = document.getElementById('lh-full');
    if (!box) return;
    const h = get(box.dataset.id);
    if (!h) { box.innerHTML = ''; return; }
    const prevK = focusKey(box);
    const n = h.steps.length;
    box.innerHTML = `<section class="lh-stage" aria-labelledby="lh-full-title"><h2 class="lh-live" id="lh-full-title">${esc(h.title)}</h2>${progHTML(h)}<div class="lh-body">${stepHTML(h, prog(h.id).step, true)}</div>${footHTML(h, true)}</section>
      <aside class="lh-aside"><h2>Over dit leerhapje</h2><dl><dt>Duur</dt><dd>${h.minutes} minuten</dd><dt>Vakgebied</dt><dd>${esc(SKILL[h.skill] || h.skill)}</dd><dt>Stappen</dt><dd>${n}</dd></dl><p>Je voortgang is dezelfde als in het kleine venster. Met Verkleinen ga je verder in de hoek van je scherm.</p></aside>
      <div class="lh-live" aria-live="polite"></div>`;
    restoreFocus(box, focus, prevK);
  }

  function focusKey(root) {
    const doc = root.ownerDocument;
    const a = doc.activeElement;
    return a && root.contains(a) ? (a.dataset.k || 'title') : null;
  }
  function restoreFocus(root, focus, prevK) {
    let el = null;
    if (focus === 'step') el = root.querySelector('[data-focus]');
    else if (focus === 'title') el = root.querySelector('#lh-title, [data-focus]');
    else if (prevK) el = root.querySelector(`[data-k="${prevK}"]`) || root.querySelector('[data-focus]');
    if (el) el.focus({ preventScroll: root === panel });
  }

  // ---------- Actions ----------
  function open(id, opts = {}) {
    if (id) st.active = id;
    if (!st.active) st.active = waiting()[0] || null;
    if (!st.active) return;
    if (!opts.keepFocusTarget) {
      const a = document.activeElement;
      returnFocus = a && a !== document.body && a !== bubble ? a : bubble;
    }
    st.snoozeUntil = 0;
    st.mode = 'compact';
    menuOpen = false;
    if (H().closeOthers) H().closeOthers();
    save();
    paint('title');
  }

  function minimise(opts = {}) {
    menuOpen = false;
    if (pip) { afterPip = null; pip.close(); return; }
    st.mode = 'bubble';
    save();
    paint();
    if (opts.restore !== false) giveFocusBack();
  }
  function giveFocusBack() {
    const t = returnFocus && returnFocus.isConnected ? returnFocus : (bubble.hidden ? null : bubble);
    if (t) t.focus({ preventScroll: true });
    returnFocus = null;
  }

  function close() {
    const h = get(st.active);
    st.inbox = st.inbox.filter((x) => x !== st.active);
    st.active = null;
    menuOpen = false;
    if (pip) { afterPip = null; pip.close(); }
    st.mode = 'bubble';
    save();
    paint();
    if (h) announce(`${h.title} gesloten. Je vindt het terug op Home onder Leerhapjes.`);
    giveFocusBack();
    if (H().changed) H().changed();
  }

  function snooze(k) {
    const v = SNOOZE[k][1];
    let until;
    if (v === 'tomorrow') { const d = new Date(); d.setDate(d.getDate() + 1); d.setHours(9, 0, 0, 0); until = d.getTime(); }
    else until = Date.now() + v;
    st.snoozeUntil = until;
    menuOpen = false;
    const when = new Date(until).toLocaleString('nl-NL', v === 'tomorrow' ? { weekday: 'long', hour: '2-digit', minute: '2-digit' } : { hour: '2-digit', minute: '2-digit' });
    if (pip) { afterPip = null; pip.close(); }
    st.mode = 'bubble';
    save();
    paint();
    announce(`Prima. Je leerhapje komt terug om ${when}.`);
    giveFocusBack();
  }

  function expand() {
    const h = get(st.active);
    if (!h || !H().expand) return;
    const go = () => { st.mode = 'full'; menuOpen = false; save(); paint(); H().expand(h.id); };
    if (pip) { afterPip = go; pip.close(); } else go();
  }

  function collapse() {
    if (!H().collapse) return;
    st.mode = 'compact';
    save();
    H().collapse();
    paint('title');
  }

  function next(root) {
    const h = get(st.active) || get(root && root.dataset && root.dataset.id);
    if (!h) return;
    const p = prog(h.id);
    const s = h.steps[p.step];
    if (s.type === 'hotspot') {
      const need = s.parts.filter((x) => x.flag).map((x) => x.id);
      const got = (p.found[p.step] || []).filter((id) => need.includes(id));
      if (got.length < need.length && !p.rev[p.step]) {
        p.rev[p.step] = true;
        save();
        paint('keep');
        announce('De stukjes die je nog niet had, zijn nu groen gemarkeerd. Druk nog een keer op Volgende om verder te gaan.');
        return;
      }
    }
    if (s.type === 'result') return finish(h);
    p.step = Math.min(h.steps.length - 1, p.step + 1);
    const ns = h.steps[p.step];
    if (ns.type === 'result' && !p.awarded) {
      p.awarded = true;
      if (H().addPoints) H().addPoints(h.skill, ns.points, `Leerhapje “${h.title}” afgerond`);
    }
    save();
    paint('step');
    announce(`Stap ${p.step + 1} van ${h.steps.length}`);
  }

  function prev() {
    const h = get(st.active);
    if (!h) return;
    const p = prog(h.id);
    p.step = Math.max(0, p.step - 1);
    save();
    paint('step');
  }

  function finish(h) {
    const p = prog(h.id);
    p.done = true;
    st.inbox = st.inbox.filter((x) => x !== h.id);
    st.active = null;
    const wasFull = st.mode === 'full';
    if (pip) { afterPip = null; pip.close(); }
    st.mode = 'bubble';
    save();
    announce(`${h.title} afgerond. Goed gedaan.`);
    if (wasFull && H().collapse) H().collapse();
    paint();
    if (!wasFull) giveFocusBack();
    if (H().changed) H().changed();
  }

  function start(id) {
    const h = get(id);
    if (!h) return;
    const p = prog(id);
    if (p.done) st.prog[id] = { step: 0, ans: {}, found: {}, last: {}, rev: {}, done: false };
    if (!st.inbox.includes(id)) st.inbox.push(id);
    open(id);
    if (H().changed) H().changed();
  }

  function spot(id) {
    const h = get(st.active);
    if (!h) return;
    const p = prog(h.id);
    const s = h.steps[p.step];
    const part = s.parts.find((x) => x.id === id);
    if (!part) return;
    const list = p.found[p.step] || (p.found[p.step] = []);
    if (!list.includes(id)) list.push(id);
    p.last[p.step] = id;
    save();
    paint('keep');
    const need = s.parts.filter((x) => x.flag).length;
    const got = s.parts.filter((x) => x.flag && list.includes(x.id)).length;
    announce(`${part.feedback} ${got} van ${need} gevonden.`);
  }

  function choose(k) {
    const h = get(st.active);
    if (!h) return;
    const p = prog(h.id);
    if (p.ans[p.step] != null) return;
    p.ans[p.step] = k;
    save();
    paint('keep');
    const o = h.steps[p.step].options[k];
    announce(`${o.correct ? 'Goed gezien.' : 'Bijna.'} ${o.feedback}`);
  }

  function retry() {
    const h = get(st.active);
    if (!h) return;
    const p = prog(h.id);
    delete p.ans[p.step];
    save();
    paint('step');
  }

  function course() {
    const h = get(st.active);
    if (!h) return;
    if (pip) { afterPip = null; pip.close(); }
    if (H().openCourse) H().openCourse(h.course);
    else location.assign(new URL('index.html', BASE));
  }

  // ---------- Floating window (Document Picture-in-Picture) ----------
  async function toPip() {
    if (!canPip || pip) return;
    let w;
    try { w = await window.documentPictureInPicture.requestWindow({ width: 380, height: 540 }); } catch (e) { return; }
    const d = w.document;
    d.documentElement.lang = document.documentElement.lang || 'nl';
    if (document.documentElement.dataset.theme) d.documentElement.dataset.theme = document.documentElement.dataset.theme;
    d.title = 'Leerhapje';
    document.querySelectorAll('link[rel="stylesheet"]').forEach((l) => {
      if (!/tokens|app|leerhapje|components/.test(l.href)) return;
      const n = d.createElement('link'); n.rel = 'stylesheet'; n.href = l.href; d.head.appendChild(n);
    });
    d.body.className = 'lh-pip-body';
    d.body.appendChild(panel);
    pip = w;
    bind(d);
    w.addEventListener('pagehide', () => {
      document.body.appendChild(panel);
      pip = null;
      const then = afterPip; afterPip = null;
      if (then) { then(); return; }
      if (st.mode === 'compact') st.mode = 'bubble';
      save();
      paint();
    });
    menuOpen = false;
    paint('title');
    announce('Het leerhapje staat nu in een zwevend venster naast je werk.');
  }
  // Keep the theme in sync with the page.
  new MutationObserver(() => {
    if (pip) {
      const t = document.documentElement.dataset.theme;
      if (t) pip.document.documentElement.dataset.theme = t; else delete pip.document.documentElement.dataset.theme;
    }
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  // ---------- Events (bound to the page and to the floating window) ----------
  function onClick(e) {
    const t = e.target.closest('[data-lh]');
    if (!t) {
      if (menuOpen && !e.target.closest('.lh-menu')) { menuOpen = false; paint('keep'); }
      return;
    }
    const a = t.dataset.lh;
    const v = t.dataset.v;
    if (a !== 'later' && a !== 'snooze') menuOpen = false;
    switch (a) {
      case 'bubble':
        if (pip) { afterPip = () => { st.mode = 'compact'; save(); paint('title'); }; pip.close(); }
        else open();
        break;
      case 'start': start(v); break;
      case 'min': minimise(); break;
      case 'close': close(); break;
      case 'expand': expand(); break;
      case 'collapse': collapse(); break;
      case 'pip': toPip(); break;
      case 'later': menuOpen = !menuOpen; paint('keep'); if (menuOpen) (pip ? pip.document : document).querySelector('[data-k="snooze-0"]')?.focus(); break;
      case 'snooze': snooze(+v); break;
      case 'next': next(); break;
      case 'prev': prev(); break;
      case 'spot': spot(v); break;
      case 'opt': choose(+v); break;
      case 'retry': retry(); break;
      case 'course': course(); break;
      default: return;
    }
  }
  function onKey(e) {
    if (e.key !== 'Escape') return;
    const doc = e.target.ownerDocument || document;
    const inPanel = panel.contains(doc.activeElement) || (pip && doc === pip.document);
    if (!inPanel || panel.hidden) return;
    e.preventDefault();
    e.stopPropagation();
    if (menuOpen) { menuOpen = false; paint(); doc.querySelector('[data-k="later"]')?.focus(); return; }
    minimise();
  }
  function bind(doc) {
    doc.addEventListener('click', onClick);
    doc.addEventListener('keydown', onKey, true);
  }

  // The assistant and the leerhapje share the corner: one open at a time.
  document.addEventListener('click', (e) => {
    if (st.mode === 'compact' && !pip && e.target.closest('#help-fab, [data-assistant-toggle]')) minimise({ restore: false });
  }, true);

  // Mobile: swipe the sheet down to go back to the bubble.
  function bindSwipe() {
    let y0 = null, dy = 0;
    panel.addEventListener('pointerdown', (e) => {
      if (!mobile() || pip || !e.target.closest('.lh-grab, .lh-head') || e.target.closest('.lh-icon-btn')) return;
      y0 = e.clientY; dy = 0;
      try { panel.setPointerCapture(e.pointerId); } catch (err) { /* synthetic pointer */ }
    });
    panel.addEventListener('pointermove', (e) => {
      if (y0 == null) return;
      dy = Math.max(0, e.clientY - y0);
      panel.style.translate = `0 ${dy}px`;
    });
    const end = () => {
      if (y0 == null) return;
      y0 = null;
      if (dy > 80) minimise(); else panel.style.translate = '';
    };
    panel.addEventListener('pointerup', end);
    panel.addEventListener('pointercancel', end);
  }

  // ---------- Public API ----------
  /* Delivery hook.
     Today a leerhapje arrives from the demo button on /styleguide or the
     Home list. Later, call Leerhapje.deliver(id, reason) when the person is
     idle or between meetings, for example from a Microsoft Graph free/busy
     check or the Idle Detection API (with consent).
     deliver() only shows the bubble with a count. It never opens the panel,
     so it can't interrupt typing. */
  function deliver(id, reason) {
    const h = get(id);
    if (!h) return false;
    if (prog(id).done) st.prog[id] = { step: 0, ans: {}, found: {}, last: {}, rev: {}, done: false };
    if (!st.inbox.includes(id)) st.inbox.push(id);
    if (!st.active || prog(st.active).done) st.active = id;
    st.snoozeUntil = 0;
    save();
    paint();
    announce(`Nieuw leerhapje klaar: ${h.title}. Open het wanneer het jou uitkomt.`);
    if (H().changed) H().changed();
    return reason || true;
  }

  function listHTML() {
    return `<ul class="lh-list">${DATA.map((h) => {
      const p = st.prog[h.id];
      const status = p && p.done ? 'Afgerond' : p && p.step > 0 ? `Bezig · stap ${p.step + 1} van ${h.steps.length}` : '';
      const label = p && p.done ? 'Opnieuw' : p && p.step > 0 ? 'Verder' : 'Start';
      return `<li><span class="lh-li-ico" aria-hidden="true">${ic('bulb')}</span><div class="lh-li-main"><b>${esc(h.title)}</b><span class="lh-meta">${h.minutes} min · ${esc(SKILL[h.skill] || h.skill)}${status ? ' · ' + status : ''}</span></div><button type="button" class="lh-btn" data-lh="start" data-v="${h.id}" aria-label="${label}: ${esc(h.title)}">${label}</button></li>`;
    }).join('')}</ul>`;
  }

  // Called by the app after each render (full view and list live in the app).
  function afterRender() {
    const box = document.getElementById('lh-full');
    if (box) {
      if (st.active !== box.dataset.id) { st.active = box.dataset.id; }
      if (st.mode !== 'full') { st.mode = 'full'; if (pip) { afterPip = () => {}; pip.close(); } }
      save();
    } else if (st.mode === 'full') {
      st.mode = 'bubble'; // navigated away from the big player
      save();
    }
    paint();
  }

  function reset() {
    if (pip) { afterPip = () => {}; pip.close(); }
    st = fresh(); save(); paint();
    if (H().changed) H().changed();
  }

  build();
  bind(document);
  setInterval(() => { if (st.snoozeUntil && !snoozed()) { st.snoozeUntil = 0; save(); paint(); } }, 30e3);
  matchMedia('(max-width: 767px)').addEventListener('change', () => paint());
  paint();

  window.Leerhapje = { deliver, start, open, listHTML, afterRender, reset, get, all: () => DATA.slice(), supportsPip: canPip };
})();
