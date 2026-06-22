/* ============================================================================
   VELA — script.js  ·  THE BEHAVIOUR
   ============================================================================

   JavaScript makes the page DO things: update the clock, react to scrolling,
   follow the mouse. The pattern is almost always:

       1. FIND an element on the page   (document.querySelector)
       2. LISTEN for something          (addEventListener: scroll, mousemove...)
       3. CHANGE something in response   (element.style / element.classList ...)

   We've split the work into four small functions, then run them all at the
   bottom once the page has finished loading.
   ============================================================================ */


/* ----------------------------------------------------------------------------
   1. LIVE CLOCK
   Updates every element marked data-clock once per second.
   ---------------------------------------------------------------------------- */
function setupClock() {
  // querySelectorAll finds ALL matching elements (there are two clocks: nav + footer)
  const clocks = document.querySelectorAll('[data-clock]');

  // This inner function reads the current time and writes it into each clock.
  function tick() {
    const time = new Date().toLocaleTimeString('en-GB', {
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
    // forEach = "do this for each one in the list"
    clocks.forEach(function (el) {
      el.textContent = time + ' GMT';   // textContent = the text inside the element
    });
  }

  tick();                 // run once immediately so it isn't blank for a second
  setInterval(tick, 1000); // then re-run every 1000ms (= 1 second), forever
}


/* ----------------------------------------------------------------------------
   2. SCROLL-REVEAL
   Fades elements in as they scroll into view, using IntersectionObserver — a
   built-in browser tool that tells us when an element enters the screen.
   ---------------------------------------------------------------------------- */
function setupReveals() {
  const items = document.querySelectorAll('.reveal');

  // The observer calls this function whenever a watched element's visibility changes.
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {                 // is it now on screen?
        entry.target.classList.add('visible');    // add the class -> CSS fades it in
        observer.unobserve(entry.target);         // stop watching (only reveal once)
      }
    });
  }, {
    threshold: 0.12,                  // fire when ~12% of the element is visible
    rootMargin: '0px 0px -8% 0px'     // trigger slightly BEFORE it's fully in view
  });

  // Start watching every .reveal element.
  items.forEach(function (el) { observer.observe(el); });
}


/* ----------------------------------------------------------------------------
   3. NAV BACKGROUND ON SCROLL
   The nav starts transparent over the hero, then gets a frosted background
   once you scroll down. We do it by adding/removing one CSS class.
   ---------------------------------------------------------------------------- */
function setupNavScroll() {
  const nav = document.getElementById('nav');   // getElementById finds one element by its id

  function onScroll() {
    // window.scrollY = how many pixels we've scrolled from the top.
    if (window.scrollY > 8) {
      nav.classList.add('scrolled');     // past 8px -> show the frosted bar
    } else {
      nav.classList.remove('scrolled');  // back at the top -> transparent again
    }
  }

  // { passive: true } is a small performance hint for scroll listeners.
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();   // run once on load in case the page opens already scrolled
}


/* ----------------------------------------------------------------------------
   4. START EVERYTHING
   'DOMContentLoaded' fires when the HTML is fully parsed. We wait for it so the
   functions above can find the elements they need.
   ---------------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', function () {
  setupClock();
  setupReveals();
  setupNavScroll();
});
