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

// 5. Email form -> Supabase (backend)
const SUPA_URL = "https://lpprmmbnwnqjyiedccrf.supabase.co";
const SUPA_KEY = "sb_publishable_iaGS-n0-HiW7-Aok1DqNTw_I_94PMS_"; // publishable / anon key only

const form = document.getElementById("notify");
const statusEl = document.getElementById("status");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();
  const button = form.querySelector("button");

  button.disabled = true;
  statusEl.textContent = "Saving...";

  try {
    const res = await fetch(SUPA_URL + "/rest/v1/subscribers", {
      method: "POST",
      headers: {
        "apikey": SUPA_KEY,
        "Authorization": "Bearer " + SUPA_KEY,
        "Content-Type": "application/json",
        "Prefer": "return=minimal"
      },
      body: JSON.stringify({ email: email })
    });

    if (res.ok) {
      statusEl.textContent = "Thanks! We'll email you.";
      form.reset();
    } else {
      statusEl.textContent = "Could not save (error " + res.status + "). Check the key.";
    }
  } catch (err) {
    statusEl.textContent = "No connection. Try again.";
  }
  button.disabled = false;
});
