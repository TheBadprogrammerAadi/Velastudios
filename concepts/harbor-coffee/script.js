// Harbor Coffee — gentle, warm motion. Content stays visible if GSAP is missing.
(function () {
  const { gsap, ScrollTrigger } = window;
  if (!gsap || !ScrollTrigger || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  gsap.registerPlugin(ScrollTrigger);

  // Headline and hero photo move but never fade, so they paint immediately (fast LCP).
  gsap.from('.hero h1', { y: 24, duration: 1, ease: 'power3.out' });
  gsap.from('.hero-text > :not(h1)', { y: 30, opacity: 0, duration: 0.9, stagger: 0.1, delay: 0.15, ease: 'power3.out' });
  gsap.from('.hero-img img', { scale: 1.08, duration: 1.4, ease: 'power2.out' });
  gsap.from('.stamp', { scale: 0, rotate: -90, duration: 1, delay: 0.6, ease: 'back.out(1.7)' });
  gsap.to('.stamp', { rotate: 348, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

  const strip = document.querySelector('.strip');
  if (strip) {
    [...strip.children].forEach((c) => strip.append(c.cloneNode(true)));
    gsap.to(strip.children, { xPercent: -100, repeat: -1, duration: 18, ease: 'none' });
  }

  gsap.utils.toArray('.menu-list li, .gallery img, .visit > *, .order').forEach((el, i) => {
    gsap.from(el, { y: 28, opacity: 0, duration: 0.8, ease: 'power3.out', delay: (i % 3) * 0.06,
      scrollTrigger: { trigger: el, start: 'top 92%', once: true } });
  });
})();
