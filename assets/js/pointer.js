// Desktop-only pointer flourishes: custom cursor with labels, magnetic buttons.
const FINE = window.matchMedia('(hover: hover) and (pointer: fine)');
const REDUCE = window.matchMedia('(prefers-reduced-motion: reduce)');

function setupCursor(gsap) {
  if (document.querySelector('.cursor')) return;
  const cursor = document.createElement('div');
  cursor.className = 'cursor';
  cursor.setAttribute('aria-hidden', 'true');
  cursor.innerHTML = '<span class="cursor-label"></span>';
  document.body.append(cursor);
  document.documentElement.classList.add('has-cursor');
  const label = cursor.firstElementChild;

  const x = gsap.quickTo(cursor, 'x', { duration: 0.35, ease: 'power3.out' });
  const y = gsap.quickTo(cursor, 'y', { duration: 0.35, ease: 'power3.out' });
  window.addEventListener('pointermove', (e) => { x(e.clientX); y(e.clientY); cursor.classList.add('is-visible'); });
  document.addEventListener('pointerleave', () => cursor.classList.remove('is-visible'));

  document.addEventListener('pointerover', (e) => {
    const labelled = e.target.closest('[data-cursor]');
    const link = e.target.closest('a, button, input, textarea, label');
    cursor.classList.toggle('is-label', !!labelled);
    cursor.classList.toggle('is-link', !labelled && !!link);
    label.textContent = labelled ? labelled.dataset.cursor : '';
  });
}

function setupMagnetic(gsap, root) {
  root.querySelectorAll('[data-magnetic]').forEach((el) => {
    const strength = 0.35;
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      gsap.to(el, {
        x: (e.clientX - (r.left + r.width / 2)) * strength,
        y: (e.clientY - (r.top + r.height / 2)) * strength,
        duration: 0.4, ease: 'power3.out',
      });
    });
    el.addEventListener('pointerleave', () => gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' }));
  });
}

export function initPointer(root = document) {
  const { gsap } = window;
  if (!gsap || !FINE.matches || REDUCE.matches) return;
  setupCursor(gsap);
  setupMagnetic(gsap, root);
}

initPointer();
