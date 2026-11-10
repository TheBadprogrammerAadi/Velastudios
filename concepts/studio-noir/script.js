// Studio Noir — slow, cinematic motion. Booking toggle works without GSAP.
(function () {
  const form = document.querySelector('#booking form[data-demo]');
  document.querySelectorAll('[data-book]').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (!form) return;
      form.hidden = false;
      document.querySelector('#booking').scrollIntoView({ behavior: 'smooth', block: 'start' });
      const first = form.querySelector('select, input');
      if (first) first.focus({ preventScroll: true });
    });
  });

  const { gsap, ScrollTrigger } = window;
  if (!gsap || !ScrollTrigger || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  gsap.registerPlugin(ScrollTrigger);

  gsap.fromTo('.hero-bg', { scale: 1.25 }, { scale: 1, duration: 2.6, ease: 'power2.out' });
  gsap.from('.hero-text > *', { y: 40, opacity: 0, duration: 1.4, stagger: 0.15, ease: 'expo.out', delay: 0.3 });
  gsap.to('.hero-bg', { yPercent: 18, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

  gsap.utils.toArray('.svc-cols > div, .team-grid figure').forEach((el, i) => {
    gsap.from(el, { y: 50, opacity: 0, duration: 1.2, delay: (i % 3) * 0.12, ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
  });

  // Horizontal gallery drifts with scroll on desktop.
  gsap.matchMedia().add('(min-width: 768px)', () => {
    const track = document.querySelector('.gallery-track');
    if (!track) return;
    gsap.to(track, {
      x: () => -(track.scrollWidth - window.innerWidth * 0.8), ease: 'none',
      scrollTrigger: { trigger: '.gallery', start: 'top 80%', end: 'bottom 20%', scrub: 1, invalidateOnRefresh: true },
    });
  });
})();
