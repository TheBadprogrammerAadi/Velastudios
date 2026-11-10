// Page-transition wipe between Vela pages (/ and /work/*). Concept sites,
// same-page anchors, tel:, mailto:, new tabs and modified clicks are left alone.
const html = document.documentElement;
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const LEAVE_MS = 300;

function isVelaPath(path) {
  return path === '/' || path === '/index.html' || path.startsWith('/work/');
}

// Arrival: the head script covered the page; reveal it on the next frames.
if (html.classList.contains('is-arriving')) {
  requestAnimationFrame(() => requestAnimationFrame(() => html.classList.remove('is-arriving')));
}

if (!reduce) {
  const wipe = document.createElement('div');
  wipe.className = 'page-wipe';
  wipe.setAttribute('aria-hidden', 'true');
  document.body.append(wipe);

  document.addEventListener('click', (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = e.target.closest('a[href]');
    if (!a || a.target === '_blank' || a.hasAttribute('download')) return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin || !isVelaPath(url.pathname)) return;
    if (url.pathname === location.pathname && url.hash) return; // same-page anchor
    if (url.href === location.href) return;
    e.preventDefault();
    wipe.classList.add('is-leaving');
    try { sessionStorage.setItem('vela-wipe', '1'); } catch (_) { /* storage blocked: no arrival wipe */ }
    setTimeout(() => { location.href = url.href; }, LEAVE_MS);
  });

  // Back/forward cache: never come back to a covered page.
  window.addEventListener('pageshow', (e) => { if (e.persisted) wipe.classList.remove('is-leaving'); });
}
