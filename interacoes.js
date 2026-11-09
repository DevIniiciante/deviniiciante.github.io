"use strict";

const motion = window.matchMedia("(prefers-reduced-motion: no-preference)");
const mouse = window.matchMedia("(hover: hover) and (pointer: fine)");

if (motion.matches && "IntersectionObserver" in window) {
  const reveal = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add("revealed");
      reveal.unobserve(entry.target);
    }
  }, { threshold: 0.12 });

  document.querySelectorAll("[data-reveal]").forEach((element) => reveal.observe(element));
}

document.querySelectorAll("[data-glow]").forEach((element) => {
  let frame = 0;
  element.addEventListener("pointermove", (event) => {
    if (!motion.matches || !mouse.matches || event.pointerType !== "mouse") return;
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      const bounds = element.getBoundingClientRect();
      element.style.setProperty("--gx", (event.clientX - bounds.left) + "px");
      element.style.setProperty("--gy", (event.clientY - bounds.top) + "px");
    });
  }, { passive: true });
  element.addEventListener("pointerleave", () => {
    cancelAnimationFrame(frame);
    element.style.removeProperty("--gx");
    element.style.removeProperty("--gy");
  });
});
