// Lift: press a box and drag upward, and it hinges up at its back edge
// together with every box resting on it, like lifting the front of a book
// to look underneath. Its underside turns towards you (there's something
// written there). Let go and its weight brings it back down, cushioned at
// the last moment. A tap still opens the box; a lift never does.
// Sideways drags belong to js/twist.js; a press is one or the other.
(() => {
  const worlds = [...document.querySelectorAll(".world[data-lift]")];
  if (!worlds.length) return;
  const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const boxes = worlds.flatMap((w) => [...w.querySelectorAll(":scope > .box")]);
  const SLOP = 6;      // same as twist.js
  const MOST = 82;     // degrees it never opens past
  const FALL = { weight: 1450, air: 2.8, cushionFrom: 16, cushion: 9 };

  // Notes on the undersides.
  const notes = {
    "b-projects": "git log --oneline | wc -l → a lot",
    "b-work": "references available on request",
    "b-toolkit": "node_modules not included",
    "b-lab": "experimental — results may vary",
    "b-contact": "you looked underneath. say hi →",
  };
  for (const box of boxes) {
    const bottom = box.querySelector(".f-bottom");
    const note = box.dataset.note ?? notes[box.classList[1]];
    if (bottom && note) bottom.innerHTML = `<span class="note">${note}</span>`;
  }

  // Free at first, then stiffer over the last stretch towards MOST.
  const STRETCH = 20, FREE = MOST - STRETCH;
  const give = (a) => (a <= FREE ? Math.max(0, a) : FREE + STRETCH * (1 - Math.exp(-(a - FREE) / STRETCH)));
  const ungive = (a) => (a <= FREE ? a : FREE - STRETCH * Math.log(1 - Math.min(a - FREE, STRETCH * 0.999) / STRETCH));
  const above = (box) => {
    const w = box.parentElement;
    if (w.dataset.stacked !== "true") return []; // spread out: nothing rests on it
    const all = [...w.querySelectorAll(":scope > .box")];
    return all.slice(0, all.indexOf(box)).reverse();
  };

  let grip = null;     // a press that may become a lift
  let lift = null;     // the lifted boxes, from the first lift until they land
  let dragged = false; // swallow the click that ends a lift
  let frame = 0, last = 0;

  const show = () => {
    for (const el of lift.members) el.style.setProperty("--lift", `${lift.angle.toFixed(3)}deg`);
  };
  const run = () => { frame ||= requestAnimationFrame(fall); };

  addEventListener("pointerdown", (e) => {
    dragged = false;
    if (lift?.held) letGo(e.timeStamp);
    const box = e.target.closest(".world[data-lift] > .box");
    if (!box || !e.isPrimary || e.button > 0) return;
    // On touch an upward drag stays a scroll (the boxes allow pan-y).
    if (e.pointerType === "touch") return;
    grip = { box, id: e.pointerId, x: e.clientX, y: e.clientY };
  });

  addEventListener("pointermove", (e) => {
    if (!grip || e.pointerId !== grip.id) return;
    if (!lift?.held) {
      if (grip.idle) return;
      const dx = e.clientX - grip.x, dy = e.clientY - grip.y;
      const vertical = Math.abs(dy) > SLOP && Math.abs(dy) >= Math.abs(dx);
      if (!vertical) { if (Math.abs(dx) > SLOP) grip = null; return; } // a turn
      if (dy > 0 || (lift && lift.base !== grip.box)) { grip.idle = true; return; } // down does nothing
      hold(grip.box, e);
    }
    lift.angle = give(lift.from + ((lift.y - e.clientY) / lift.depth) * (180 / Math.PI));
    lift.trail.push([e.timeStamp, lift.angle]);
    while (e.timeStamp - lift.trail[0][0] > 100) lift.trail.shift();
    show();
  });

  function hold(base, e) {
    if (!lift) {
      const members = [base, ...above(base)];
      const css = getComputedStyle(base);
      const spin = parseFloat(base.querySelector(".spinner")?.style.getPropertyValue("--spin")) || 0;
      const onEnd = Math.abs(Math.round(spin / 90)) % 2 === 1; // turned on its end: front-to-back is its width
      const depthPx = (onEnd ? base.querySelector(".f-front") : base.querySelector(".f-left")).offsetWidth;
      for (const el of members) {
        el.style.setProperty("--hx", css.getPropertyValue("--x").trim() || "0");
        el.style.setProperty("--hz", css.getPropertyValue("--z").trim() || "0");
        el.style.setProperty("--hy", `calc(${-parseFloat(css.getPropertyValue("--y"))} * var(--u))`);
        el.style.setProperty("--hturn", css.getPropertyValue("--turn").trim() || "0deg");
        el.style.setProperty("--hdepth", onEnd ? "var(--w)" : "var(--d)");
        el.classList.add("lifting");
      }
      lift = { base, members, angle: 0, vel: 0, depth: depthPx };
    }
    lift.held = true;
    lift.id = e.pointerId;
    lift.y = e.clientY;
    lift.from = ungive(lift.angle); // catch it mid-fall without a jump
    lift.vel = 0;
    lift.trail = [[e.timeStamp, lift.angle]];
    try { base.setPointerCapture(e.pointerId); } catch {}
    base.classList.add("held");
  }

  function release(e) {
    if (grip && e.pointerId === grip.id) grip = null;
    if (!lift?.held || e.pointerId !== lift.id) return;
    if (e.type === "pointerup") dragged = true;
    letGo(e.timeStamp);
  }
  function letGo(now) {
    lift.held = false;
    lift.base.classList.remove("held");
    const [t0, a0] = lift.trail[0], [t1, a1] = lift.trail.at(-1);
    // A flick upward carries on a little before its weight wins.
    lift.vel = !calm && t1 > t0 && now - t1 < 80 ? Math.min(600, ((a1 - a0) / (t1 - t0)) * 1000) : 0;
    last = 0;
    run();
  }
  addEventListener("pointerup", release);
  addEventListener("pointercancel", release);

  addEventListener("click", (e) => {
    if (dragged && e.target.closest(".world")) { e.preventDefault(); e.stopImmediatePropagation(); }
    dragged = false;
  }, true);

  function fall(now) {
    frame = 0;
    if (!lift || lift.held) return;
    const dt = Math.min(0.032, last ? (now - last) / 1000 : 1 / 60);
    last = now;
    if (calm) { lift.angle = 0; }
    else {
      lift.vel -= FALL.weight * dt;
      lift.vel -= FALL.air * lift.vel * dt;
      if (lift.angle < FALL.cushionFrom && lift.vel < 0) lift.vel -= FALL.cushion * lift.vel * dt * (1 - lift.angle / FALL.cushionFrom);
      lift.angle = Math.min(MOST, lift.angle + lift.vel * dt);
    }
    if (lift.angle <= 0) {
      const speed = -lift.vel;
      lift.angle = 0;
      show();
      land(speed);
      return;
    }
    show();
    run();
  }

  // Touch down: a small thud through the stack, heavier for a harder landing.
  function land(speed) {
    const stage = lift.base.closest(".stage");
    for (const el of lift.members) {
      el.classList.remove("lifting");
      for (const p of ["--lift", "--hx", "--hz", "--hy", "--hturn", "--hdepth"]) el.style.removeProperty(p);
    }
    lift = null;
    last = 0;
    if (calm || speed < 40) return;
    const jolt = Math.min(1, speed / 400) * 3;
    stage.animate(
      [{ translate: "0 0" }, { translate: `0 ${jolt}px` }, { translate: `0 ${-jolt * 0.3}px` }, { translate: "0 0" }],
      { duration: 220, easing: "ease-out" }
    );
  }
})();
