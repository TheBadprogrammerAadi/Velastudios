// Ridgeline — quick, punchy motion. Content stays visible if GSAP is missing.
(function () {
  const { gsap, ScrollTrigger } = window;
  if (!gsap || !ScrollTrigger || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  gsap.registerPlugin(ScrollTrigger);

  gsap.from('.hero-text > *', { x: -40, opacity: 0, duration: 0.6, stagger: 0.08, ease: 'power4.out' });
  gsap.fromTo('.hero-img', { clipPath: 'inset(0 0 0 100%)' }, { clipPath: 'inset(0 0 0 0%)', duration: 0.9, ease: 'power4.inOut', delay: 0.2 });

  gsap.utils.toArray('.service-grid li').forEach((el, i) => {
    gsap.from(el, { y: 40, opacity: 0, duration: 0.5, delay: (i % 3) * 0.08, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 92%', once: true } });
  });
  gsap.utils.toArray('.towns li').forEach((el, i) => {
    gsap.from(el, { y: 16, opacity: 0, duration: 0.4, delay: i * 0.04, ease: 'power2.out',
      scrollTrigger: { trigger: '.towns', start: 'top 85%', once: true } });
  });
  gsap.utils.toArray('.photos img, .review-row blockquote, .quote form').forEach((el) => {
    gsap.from(el, { y: 30, opacity: 0, duration: 0.6, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 92%', once: true } });
  });
})();
