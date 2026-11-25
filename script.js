// 1. Scroll reveal: elements with class "reveal" fade in when visible
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll(".reveal").forEach((el, i) => {
  el.style.transitionDelay = (i % 3) * 0.12 + "s";
  observer.observe(el);
});

// 2. Glass shine follows the pointer (mouse or finger)
document.querySelectorAll(".glass").forEach((el) => {
  const move = (e) => {
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", e.clientX - r.left + "px");
    el.style.setProperty("--my", e.clientY - r.top + "px");
    el.classList.add("lit");
  };
  el.addEventListener("pointermove", move);
  el.addEventListener("pointerdown", move);
  el.addEventListener("pointerleave", () => el.classList.remove("lit"));
});

// 3. Slider controls the glow of the whole page
const slider = document.getElementById("level");
const text = document.getElementById("levelText");

slider.addEventListener("input", () => {
  document.documentElement.style.setProperty("--glow", slider.value / 100);
  text.textContent = "Brightness: " + slider.value + "%";
});

// 4. Orb tilts slightly as you scroll
const orb = document.getElementById("orb");
window.addEventListener("scroll", () => {
  const y = Math.min(window.scrollY, 600);
  orb.style.opacity = 1 - y / 700;
}, { passive: true });
