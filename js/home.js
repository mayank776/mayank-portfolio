// Home behaviour shared by every view: a gentle camera drift that follows
// the pointer, tidying a stack, the sealed lab, and the toast.
(() => {
  const home = document.querySelector(".home");
  const toast = document.querySelector(".toast");
  const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const activeWorld = () => home.querySelector(".view:not([hidden]) .world");

  // Camera follows the pointer a little (--tilt is inherited by every world).
  if (!calm && matchMedia("(hover: hover)").matches) {
    home.addEventListener("pointermove", (e) => {
      const x = e.clientX / innerWidth - 0.5;
      home.style.setProperty("--tilt", `${(x * 10).toFixed(2)}deg`);
    });
    home.addEventListener("pointerleave", () => home.style.setProperty("--tilt", "0deg"));
  }

  // Stacked views: double-click the ground (or press T) to square the stack up.
  const tidy = () => {
    const w = activeWorld();
    if (w?.dataset.stacked === "true") w.classList.toggle("tidy");
  };
  home.addEventListener("dblclick", (e) => {
    if (!e.target.closest(".box, .win, .switcher")) tidy();
  });
  addEventListener("keydown", (e) => {
    if (e.key.toLowerCase() === "t" && !e.metaKey && !e.ctrlKey && !e.altKey && home.dataset.view !== "keyboard") tidy();
  });

  // Toasts, from here or from views.js.
  let timer;
  function say(text) {
    toast.textContent = text;
    toast.classList.add("show");
    clearTimeout(timer);
    timer = setTimeout(() => toast.classList.remove("show"), 2600);
  }
  home.addEventListener("toast", (e) => say(e.detail));

  // The lab is sealed, in every view.
  const lines = [
    "$ npm run lab  →  still compiling… check back soon.",
    "$ git push lab  →  rejected: not ready for prod.",
    "$ open lab  →  403: sealed until the next release.",
  ];
  let n = 0;
  home.addEventListener("click", (e) => {
    const lab = e.target.closest("[data-sealed]");
    if (!lab) return;
    lab.classList.remove("shake");
    void lab.offsetWidth; // restart the animation
    lab.classList.add("shake");
    say(lines[n++ % lines.length]);
  });
})();
