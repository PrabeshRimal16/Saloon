// Simple IntersectionObserver to add 'in-view' class to elements with data-animate
export default function initScrollAnimations() {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const el = entry.target;
      if (entry.isIntersecting) {
        el.classList.add('in-view');
        // if element has data-once, unobserve after first reveal
        if (el.dataset.once !== undefined) observer.unobserve(el);
      } else {
        if (el.dataset.once === undefined) el.classList.remove('in-view');
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));

  // helper: stagger children when parent has data-animate="stagger"
  // the CSS handles child delays; ensure children have initial hidden state
}
