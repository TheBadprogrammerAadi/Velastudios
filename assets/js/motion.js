// Vela motion engine — implements the data-* motion contract.
// Content is visible by default; motion only takes over when GSAP loaded and
// the visitor hasn't asked for reduced motion.
const html = document.documentElement;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = '(hover: hover) and (pointer: fine)';
window.velaLenis = null;
// Set by the head script when the 2.5s safety timeout un-hid content before GSAP arrived.
const shownLate = !!window.__velaShown;

function splitText(el) {
  if (el.dataset.splitDone) return;
  el.dataset.splitDone = '1';
  el.setAttribute('aria-label', el.textContent.replace(/\s+/g, ' ').trim());
  const walk = (node) => {
    [...node.childNodes].forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment();
        child.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.append(' '); return; }
          const word = document.createElement('span');
          word.className = 'word';
          word.setAttribute('aria-hidden', 'true');
          [...part].forEach((c) => {
            const ch = document.createElement('span');
            ch.className = 'char';
            ch.textContent = c;
            word.append(ch);
          });
          frag.append(word);
        });
        child.replaceWith(frag);
      } else if (child.nodeType === Node.ELEMENT_NODE && !child.hasAttribute('data-rotate')) {
        walk(child);
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        child.setAttribute('aria-hidden', 'true');
      }
    });
  };
  walk(el);
}

function setupLenis(gsap, ScrollTrigger) {
  if (!window.Lenis || window.velaLenis) return;
  const lenis = new window.Lenis({ lerp: 0.1, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  window.velaLenis = lenis;

  // Same-page anchor links glide via Lenis.
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href*="#"]');
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey) return;
    const url = new URL(a.href, location.href);
    if (url.pathname !== location.pathname || !url.hash) return;
    const target = document.querySelector(url.hash);
    if (!target) return;
    e.preventDefault();
    lenis.scrollTo(target, { offset: -72, duration: 1.2 });
    history.pushState(null, '', url.hash);
    // Move keyboard focus with the scroll so Tab continues from the target.
    if (!target.matches('a, button, input, select, textarea, [tabindex]')) target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  });
}

function setupNav(gsap, ScrollTrigger) {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  // Prime GSAP's transform cache now: its first read of a position:fixed element
  // briefly re-parents it, which would steal keyboard focus if done on focusin.
  gsap.set(nav, { yPercent: 0 });
  ScrollTrigger.create({
    start: 120,
    onUpdate: (self) => {
      const hide = self.direction === 1 && !nav.contains(document.activeElement);
      gsap.to(nav, { yPercent: hide ? -110 : 0, duration: 0.45, ease: 'power3.out', overwrite: true });
    },
    onLeaveBack: () => gsap.to(nav, { yPercent: 0, duration: 0.3, overwrite: true }),
  });
  // Keyboard users tabbing into a hidden nav should see it.
  nav.addEventListener('focusin', () => gsap.to(nav, { yPercent: 0, duration: 0.3, overwrite: true }));
}

function animateSplit(gsap, root) {
  root.querySelectorAll('[data-split]').forEach((el) => {
    splitText(el);
    const chars = el.querySelectorAll('.char');
    const rot = el.querySelector('[data-rotate]');
    const inHero = el.getBoundingClientRect().top < window.innerHeight;
    if (inHero && shownLate) return; // already visible after a slow load: don't hide it again
    const tl = gsap.timeline({
      delay: inHero ? 0.1 : 0,
      scrollTrigger: inHero ? undefined : { trigger: el, start: 'top 85%', once: true },
    });
    tl.from(chars, { yPercent: 110, rotate: 6, opacity: 0, duration: 0.6, ease: 'power3.out', stagger: 0.015 });
    if (rot) tl.from(rot, { yPercent: 100, opacity: 0, duration: 0.6, ease: 'power3.out' }, '-=0.45');
  });
}

function animateRotate(gsap, root) {
  root.querySelectorAll('[data-rotate]').forEach((el) => {
    const kids = [...el.children];
    if (kids.length < 2) return;
    el.append(kids[0].cloneNode(true));
    const all = [...el.children];
    const tl = gsap.timeline({ repeat: -1, delay: 1.2 });
    kids.forEach((_, i) => {
      tl.to(all, { yPercent: -100 * (i + 1), duration: 0.7, ease: 'power3.inOut' }, '+=1.5');
    });
    tl.set(all, { yPercent: 0 });
  });
}

function animateReveal(gsap, root) {
  root.querySelectorAll('[data-reveal]').forEach((el) => {
    if (shownLate && el.getBoundingClientRect().top < window.innerHeight) return;
    gsap.from(el, {
      y: 24, opacity: 0, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
    });
  });
}

function animateWipe(gsap, root) {
  root.querySelectorAll('[data-wipe]').forEach((el) => {
    if (shownLate && el.getBoundingClientRect().top < window.innerHeight) return;
    const img = el.querySelector('img');
    const siblings = el.parentElement ? [...el.parentElement.querySelectorAll(':scope > [data-wipe]')] : [el];
    const delay = el.closest('.hero') ? 0.35 + siblings.indexOf(el) * 0.12 : 0;
    const st = el.closest('.hero') ? undefined : { trigger: el, start: 'top 88%', once: true };
    gsap.fromTo(el, { clipPath: 'inset(100% 0% 0% 0%)' },
      { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.1, ease: 'power4.inOut', delay, scrollTrigger: st });
    if (img) {
      const end = el.hasAttribute('data-parallax') ? 1.18 : 1;
      gsap.fromTo(img, { scale: 1.3 }, { scale: end, duration: 1.8, ease: 'power3.out', delay, scrollTrigger: st });
    }
  });
}

function animateParallax(gsap, root) {
  gsap.matchMedia().add(finePointer, () => {
    root.querySelectorAll('[data-parallax]').forEach((el) => {
      const img = el.querySelector('img');
      const f = parseFloat(el.dataset.parallax) || 0.15;
      if (!img) return;
      gsap.fromTo(img, { yPercent: -f * 50 }, {
        yPercent: f * 50, ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
      });
    });
  });
}

function animateMarquee(gsap, ScrollTrigger, root) {
  root.querySelectorAll('[data-marquee]').forEach((el) => {
    const track = el.firstElementChild;
    if (!track || track.dataset.cloned) return;
    track.dataset.cloned = '1';
    [...track.children].forEach((c) => track.append(c.cloneNode(true)));
    const tl = gsap.to(track, { xPercent: -50, repeat: -1, ease: 'none', duration: 28 });
    // Scrolling gives the marquee a burst of speed (backwards when scrolling up),
    // then it always eases back to its normal forward pace.
    ScrollTrigger.create({
      trigger: el, start: 'top bottom', end: 'bottom top',
      onUpdate: (self) => {
        const boost = 1 + Math.min(4, Math.abs(self.getVelocity()) / 400);
        gsap.timeline({ overwrite: true })
          .to(tl, { timeScale: boost * self.direction, duration: 0.2 })
          .to(tl, { timeScale: 1, duration: 1.2, ease: 'power2.out' });
      },
    });
  });
}

export function initMotion(root = document) {
  const { gsap, ScrollTrigger } = window;
  if (!gsap || !ScrollTrigger || reduceMotion) {
    html.classList.remove('motion-pending');
    return;
  }
  gsap.registerPlugin(ScrollTrigger);
  html.classList.add('motion-ready');
  setupLenis(gsap, ScrollTrigger);
  setupNav(gsap, ScrollTrigger);
  animateSplit(gsap, root);
  animateRotate(gsap, root);
  animateReveal(gsap, root);
  animateWipe(gsap, root);
  animateParallax(gsap, root);
  animateMarquee(gsap, ScrollTrigger, root);
  html.classList.remove('motion-pending');
  if (document.fonts) document.fonts.ready.then(() => ScrollTrigger.refresh());
}

initMotion();
